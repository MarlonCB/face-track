/* eslint-disable react/prop-types -- This project uses JavaScript without runtime prop-type declarations. */
import { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { IconBlobDashed, IconCameraRotate, IconEraser, IconMoodSmile, IconPlayerPlayFilled } from '@tabler/icons-react';
import { FACE_LOSS_GRACE_SECONDS, SAMPLE_COUNT } from '../data/faceLabels';
import { EXPRESSION_LABELS } from '../data/faceLabels';

export default function CameraPanel({
	webcamRef,
	modelsLoaded,
	isScanning,
	cameraFacingMode,
	onToggleCamera,
	missingFaceSeconds,
	sampleCount,
	expression,
	landmarkPositions,
	showLandmarks,
	onToggleLandmarks,
	isMoodScanning,
	onToggleMoodScanning,
	canClearData,
	onStart,
	onClear,
}) {
	const landmarkCanvasRef = useRef(null);

	useEffect(() => {
		const canvas = landmarkCanvasRef.current;
		const video = webcamRef.current?.video;
		if (!canvas || !video) return;

		const context = canvas.getContext('2d');
		canvas.width = video.videoWidth || 640;
		canvas.height = video.videoHeight || 480;
		context.clearRect(0, 0, canvas.width, canvas.height);
		if (!showLandmarks || landmarkPositions.length === 0) return;

		landmarkPositions.forEach(({ x, y }) => {
			context.beginPath();
			context.arc(x, y, Math.max(2, canvas.width / 240), 0, Math.PI * 2);
			context.fillStyle = '#5eead4';
			context.shadowColor = '#2dd4bf';
			context.shadowBlur = 8;
			context.fill();
		});
	}, [webcamRef, isScanning, landmarkPositions, showLandmarks, cameraFacingMode]);

	return (
		<section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20">
			<div className="p-2 sm:p-3">
				<div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#05080e]">
					{modelsLoaded ? (
						<>
							<Webcam
								key={cameraFacingMode}
								audio={false}
								ref={webcamRef}
								width={640}
								height={480}
								mirrored={cameraFacingMode === 'user'}
								videoConstraints={{ facingMode: cameraFacingMode }}
								className="h-full w-full object-cover"
							/>
							<canvas ref={landmarkCanvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${cameraFacingMode === 'user' ? '-scale-x-100' : ''}`} />
							<div className="absolute right-3 top-3 z-10 flex flex-col gap-2 sm:right-4 sm:top-4">
								<button type="button" onClick={onToggleCamera} aria-label={cameraFacingMode === 'user' ? 'Cambiar a cámara trasera' : 'Cambiar a cámara frontal'} className="group relative inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-slate-950/55 text-white shadow-lg shadow-black/20 backdrop-blur-md transition hover:scale-105 hover:bg-slate-900/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300">
									<IconCameraRotate aria-hidden="true" size={20} stroke={1.7} />
									<span aria-hidden="true" className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/20 bg-slate-950/55 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg shadow-black/20 backdrop-blur-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Cambiar cámara</span>
								</button>
								<button type="button" onClick={onToggleLandmarks} aria-pressed={showLandmarks} aria-label={showLandmarks ? 'Ocultar puntos del rostro' : 'Mostrar puntos del rostro'} className={`group relative inline-flex size-11 items-center justify-center rounded-full border text-white shadow-lg shadow-black/20 backdrop-blur-md transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 ${showLandmarks ? 'border-teal-200/50 bg-teal-500/60 text-white' : 'border-white/20 bg-slate-950/55 hover:bg-slate-900/80'}`}>
									<IconBlobDashed aria-hidden="true" size={20} stroke={1.7} />
									<span aria-hidden="true" className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/20 bg-slate-950/55 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg shadow-black/20 backdrop-blur-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{showLandmarks ? 'Ocultar puntos del rostro' : 'Mostrar puntos del rostro'}</span>
								</button>
								<button type="button" onClick={onToggleMoodScanning} aria-pressed={isMoodScanning} aria-label={isMoodScanning ? 'Detener análisis de emoción' : 'Iniciar análisis de emoción'} className={`group relative inline-flex size-11 items-center justify-center rounded-full border text-white shadow-lg shadow-black/20 backdrop-blur-md transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${isMoodScanning ? 'border-violet-200/50 bg-violet-500/60 text-white' : 'border-white/20 bg-slate-950/55 hover:bg-slate-900/80'}`}>
									<IconMoodSmile aria-hidden="true" size={20} stroke={1.7} />
									<span aria-hidden="true" className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/20 bg-slate-950/55 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg shadow-black/20 backdrop-blur-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{isMoodScanning ? 'Detener análisis de emoción' : 'Iniciar análisis de emoción'}</span>
								</button>
							</div>
							{isMoodScanning && (
								<div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-3 text-white shadow-lg shadow-black/20 backdrop-blur-md sm:bottom-4 sm:left-4">
									<span className="text-3xl">{expression ? EXPRESSION_LABELS[expression]?.emoji ?? '😐' : '◌'}</span>
									<div><p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Estado de ánimo</p><p className="mt-0.5 text-sm font-semibold">{expression ? EXPRESSION_LABELS[expression]?.label ?? expression : missingFaceSeconds > 0 ? 'Sin rostro' : 'Buscando…'}</p></div>
								</div>
							)}
							{isScanning && missingFaceSeconds > 0 && (
								<div className="absolute inset-0 grid place-items-center bg-slate-950/35">
									<div className="rounded-full border border-amber-300/20 bg-slate-950/80 px-4 py-2.5 text-center text-xs font-medium text-amber-100 backdrop-blur">
										Rostro no detectado · pausa en{' '}
										<span className="font-bold tabular-nums">{FACE_LOSS_GRACE_SECONDS - missingFaceSeconds}s</span>
									</div>
								</div>
							)}
						</>
					) : (
						<div className="absolute inset-0 grid place-items-center">
							<div className="text-center">
								<div className="mx-auto mb-3 size-8 animate-spin rounded-full border-2 border-teal-300/20 border-t-teal-300" />
								<p className="text-sm text-slate-300">Preparando el escáner…</p>
								<p className="mt-1 text-xs text-slate-500">Cargando modelos de análisis</p>
							</div>
						</div>
					)}
				</div>
				<div className="mt-4 flex flex-col gap-3 sm:flex-row">
					<button type="button" onClick={onStart} disabled={!modelsLoaded || isScanning} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">
						<IconPlayerPlayFilled aria-hidden="true" size={16} />
						Iniciar escáner
					</button>
					<button type="button" onClick={onClear} disabled={!canClearData} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30 disabled:cursor-not-allowed disabled:opacity-40">
						<IconEraser aria-hidden="true" size={17} stroke={1.7} />
						Limpiar datos
					</button>
				</div>
				{sampleCount > 0 && sampleCount < SAMPLE_COUNT && (
					<div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
						<div className="mb-2 flex justify-between text-xs">
							<span className="text-slate-400">Calculando edad y género</span>
							<span className="text-teal-300">{sampleCount}/{SAMPLE_COUNT}</span>
						</div>
						<div className="h-1.5 overflow-hidden rounded-full bg-white/10">
							<div className="h-full rounded-full bg-teal-300 transition-all duration-500" style={{ width: `${sampleCount / SAMPLE_COUNT * 100}%` }} />
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
