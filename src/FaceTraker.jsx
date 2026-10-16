import { useCallback, useEffect, useRef, useState } from 'react';
import { IconMoodSmile } from '@tabler/icons-react';
import CameraPanel from './components/CameraPanel';
import MoodHelpDialog from './components/MoodHelpDialog';
import ResultsPanel from './components/ResultsPanel';
import ShortcutsPanel from './components/ShortcutsPanel';
import { useFaceScanner } from './hooks/useFaceScanner';

const FaceTracker = () => {
	const webcamRef = useRef(null);
	const [cameraFacingMode, setCameraFacingMode] = useState('user');
	const [showMoodHelp, setShowMoodHelp] = useState(false);
	const scanner = useFaceScanner(webcamRef);
	const isAnyScannerActive = scanner.isScanning || scanner.isMoodScanning;
	const { toggleMoodScanning, toggleLandmarkTracking } = scanner;
	const toggleCamera = useCallback(() => setCameraFacingMode((mode) => mode === 'user' ? 'environment' : 'user'), []);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
			if (showMoodHelp) {
				if (event.key === 'Escape') setShowMoodHelp(false);
				return;
			}

			const target = event.target;
			if (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

			switch (event.key.toLowerCase()) {
				case 'e':
				event.preventDefault();
				toggleMoodScanning();
				break;
				case 'n':
				event.preventDefault();
				toggleLandmarkTracking();
				break;
				case 'c':
				event.preventDefault();
				toggleCamera();
				break;
				case '?':
				event.preventDefault();
				setShowMoodHelp(true);
				break;
				default:
				break;
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [toggleMoodScanning, toggleLandmarkTracking, toggleCamera, showMoodHelp]);

	return (
		<main className="min-h-screen overflow-hidden bg-[#080d16] text-slate-100">
			<div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(20,184,166,0.15),transparent_55%)]" />
			<div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-3 sm:px-8 sm:py-4">
				<header className="mb-3 flex items-center justify-between sm:mb-4">
					<div className="flex items-center gap-3">
						<div className="grid size-9 place-items-center rounded-xl border border-teal-300/20 bg-teal-300/10 text-teal-200">
							<IconMoodSmile aria-hidden="true" size={21} stroke={1.6} />
						</div>
						<p className="text-sm font-semibold tracking-wide text-white">Rostro</p>
					</div>
					<div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-300">
						<span className={`size-2 rounded-full ${isAnyScannerActive ? 'animate-pulse bg-emerald-400' : 'bg-slate-600'}`} />
						{scanner.isScanning && scanner.isMoodScanning ? 'Escáner y emoción activos' : scanner.isScanning ? 'Escáner activo' : scanner.isMoodScanning ? 'Emoción activa' : 'En espera'}
					</div>
				</header>

				<div className="grid flex-1 gap-5 lg:grid-cols-[1.45fr_0.85fr] lg:gap-6">
					<CameraPanel
						webcamRef={webcamRef}
						modelsLoaded={scanner.modelsLoaded}
						isScanning={scanner.isScanning}
						cameraFacingMode={cameraFacingMode}
						onToggleCamera={toggleCamera}
						missingFaceSeconds={scanner.missingFaceSeconds}
						sampleCount={scanner.sampleCount}
						expression={scanner.expression}
						landmarkPositions={scanner.landmarkPositions}
						showLandmarks={scanner.isLandmarkTracking}
						onToggleLandmarks={scanner.toggleLandmarkTracking}
						isMoodScanning={scanner.isMoodScanning}
						onToggleMoodScanning={scanner.toggleMoodScanning}
						canClearData={scanner.isScanning || scanner.sampleCount > 0 || scanner.age !== null || scanner.gender !== null}
						onStart={scanner.startScanning}
						onClear={scanner.clearData}
					/>

					<aside className="flex flex-col gap-5">
						<ResultsPanel
							age={scanner.age}
							gender={scanner.gender}
						/>
						<ShortcutsPanel onShowMoodHelp={() => setShowMoodHelp(true)} />
					</aside>
				</div>

				<footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.07] pt-5 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
					<span>El análisis se procesa en este dispositivo.</span>
					<span>Las estimaciones son aproximadas.</span>
				</footer>
			</div>
			{showMoodHelp && <MoodHelpDialog onClose={() => setShowMoodHelp(false)} />}
		</main>
	);
};

export default FaceTracker;
