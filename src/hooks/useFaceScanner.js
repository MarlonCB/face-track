import { useCallback, useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { FACE_LOSS_GRACE_SECONDS, SAMPLE_COUNT } from '../data/faceLabels';

export function useFaceScanner(webcamRef) {
	const [modelsLoaded, setModelsLoaded] = useState(false);
	const [isScanning, setIsScanning] = useState(false);
	const [isMoodScanning, setIsMoodScanning] = useState(false);
	const [isLandmarkTracking, setIsLandmarkTracking] = useState(true);
	const [expression, setExpression] = useState(null);
	const [age, setAge] = useState(null);
	const [gender, setGender] = useState(null);
	const [sampleCount, setSampleCount] = useState(0);
	const [missingFaceSeconds, setMissingFaceSeconds] = useState(0);
	const [landmarkPositions, setLandmarkPositions] = useState([]);
	const demographicSamples = useRef([]);
	const detectionInProgress = useRef(false);
	const sessionRef = useRef(0);
	const missingFaceSecondsRef = useRef(0);

	useEffect(() => {
		let isMounted = true;
		const loadModels = async () => {
			const modelUrl = '/models';
			await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
			await faceapi.nets.faceExpressionNet.loadFromUri(modelUrl);
			await faceapi.nets.ageGenderNet.loadFromUri(modelUrl);
			await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
			if (isMounted) setModelsLoaded(true);
		};

		loadModels();
		return () => { isMounted = false; };
	}, []);

	useEffect(() => {
		if (!modelsLoaded || (!isScanning && !isMoodScanning && !isLandmarkTracking)) return undefined;

		const intervalId = window.setInterval(async () => {
			const video = webcamRef.current?.video;
			if (!video || video.readyState !== 4 || detectionInProgress.current) return;

			const session = sessionRef.current;
			detectionInProgress.current = true;
			try {
				let detectionTask = faceapi
					.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
					.withFaceLandmarks();
				if (isMoodScanning) detectionTask = detectionTask.withFaceExpressions();
				if (isScanning) detectionTask = detectionTask.withAgeAndGender();
				const detections = await detectionTask;
				if (session !== sessionRef.current) return;

				if (detections.length > 0) {
					const detection = detections[0];
					if (isScanning || isLandmarkTracking) {
						missingFaceSecondsRef.current = 0;
						setMissingFaceSeconds(0);
						setLandmarkPositions(isLandmarkTracking ? detection.landmarks.positions.map(({ x, y }) => ({ x, y })) : []);
					}
					if (isScanning) {
						if (demographicSamples.current.length < SAMPLE_COUNT) {
							demographicSamples.current.push({ age: detection.age, gender: detection.gender });
							setSampleCount(demographicSamples.current.length);
							if (demographicSamples.current.length === SAMPLE_COUNT) {
								const samples = demographicSamples.current;
								const averageAge = samples.reduce((sum, sample) => sum + sample.age, 0) / samples.length;
								const genderCounts = samples.reduce((counts, sample) => {
									counts[sample.gender] = (counts[sample.gender] || 0) + 1;
									return counts;
								}, {});
								const [majorityGender] = Object.entries(genderCounts).reduce(
									(best, current) => current[1] > best[1] ? current : best
								);
								setAge(Math.round(averageAge));
								setGender(majorityGender);
								setIsScanning(false);
							}
						}
					}
					if (isMoodScanning) {
						const [dominantExpression] = Object.entries(detection.expressions).reduce(
							(previous, current) => current[1] > previous[1] ? current : previous
						);
						setExpression(dominantExpression);
					}
				} else {
					if (isScanning || isLandmarkTracking) setLandmarkPositions([]);
					if (isScanning) {
						if (demographicSamples.current.length < SAMPLE_COUNT) {
							const missingSeconds = missingFaceSecondsRef.current + 1;
							missingFaceSecondsRef.current = missingSeconds;
							setMissingFaceSeconds(missingSeconds);
							if (missingSeconds >= FACE_LOSS_GRACE_SECONDS) {
							missingFaceSecondsRef.current = 0;
							setMissingFaceSeconds(0);
							demographicSamples.current = [];
							setSampleCount(0);
							setAge(null);
							setGender(null);
							sessionRef.current += 1;
							setIsScanning(false);
							}
						} else {
							missingFaceSecondsRef.current = 0;
							setMissingFaceSeconds(0);
						}
					}
					if (isMoodScanning) setExpression(null);
				}
			} finally {
				detectionInProgress.current = false;
			}
		}, 1000);

		return () => window.clearInterval(intervalId);
	}, [modelsLoaded, isScanning, isMoodScanning, isLandmarkTracking, webcamRef]);

	const startScanning = useCallback(() => {
		sessionRef.current += 1;
		missingFaceSecondsRef.current = 0;
		setMissingFaceSeconds(0);
		demographicSamples.current = [];
		setSampleCount(0);
		if (!isMoodScanning) setExpression(null);
		setLandmarkPositions([]);
		setAge(null);
		setGender(null);
		setIsScanning(true);
	}, [isMoodScanning]);

	const clearData = useCallback(() => {
		sessionRef.current += 1;
		missingFaceSecondsRef.current = 0;
		setMissingFaceSeconds(0);
		demographicSamples.current = [];
		setSampleCount(0);
		setAge(null);
		setGender(null);
		setLandmarkPositions([]);
		setIsScanning(false);
	}, []);

	const toggleMoodScanning = useCallback(() => {
		sessionRef.current += 1;
		setIsMoodScanning((isActive) => {
			if (isActive) setExpression(null);
			return !isActive;
		});
	}, []);

	const toggleLandmarkTracking = useCallback(() => {
		sessionRef.current += 1;
		if (isLandmarkTracking) setLandmarkPositions([]);
		setIsLandmarkTracking(!isLandmarkTracking);
	}, [isLandmarkTracking]);

	return {
		age,
		expression,
		gender,
		isMoodScanning,
		isLandmarkTracking,
		isScanning,
		landmarkPositions,
		missingFaceSeconds,
		modelsLoaded,
		sampleCount,
		startScanning,
		clearData,
		toggleMoodScanning,
		toggleLandmarkTracking,
	};
}
