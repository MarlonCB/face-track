/* eslint-disable react/prop-types -- This project uses JavaScript without runtime prop-type declarations. */
import { IconInfoCircle } from '@tabler/icons-react';

const SHORTCUTS = [
	{ key: 'E', action: 'Activar o detener emoción' },
	{ key: 'N', action: 'Mostrar u ocultar nodos' },
	{ key: 'C', action: 'Cambiar cámara' },
	{ key: '?', action: 'Abrir ayuda de emociones' },
];

export default function ShortcutsPanel({ onShowMoodHelp }) {
	return (
		<section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
			<div className="mb-4 flex items-start justify-between gap-3">
				<div><h2 className="text-sm font-semibold text-white">Atajos e instrucciones</h2><p className="mt-1 text-xs text-slate-500">Controla el escáner desde el teclado</p></div>
				<button type="button" onClick={onShowMoodHelp} aria-label="Abrir guía de emociones" className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-violet-300/30 hover:bg-violet-300/10 hover:text-violet-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"><IconInfoCircle aria-hidden="true" size={19} stroke={1.7} /></button>
			</div>
			<div className="space-y-2">
				{SHORTCUTS.map(({ key, action }) => <div key={key} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2"><span className="text-xs text-slate-300">{action}</span><kbd className="min-w-7 rounded-md border border-white/10 bg-slate-900/80 px-2 py-1 text-center text-[11px] font-semibold text-teal-200 shadow-sm">{key}</kbd></div>)}
			</div>
			<p className="mt-4 text-[11px] leading-4 text-slate-500">Los atajos no se activan mientras escribes en un campo de texto.</p>
		</section>
	);
}
