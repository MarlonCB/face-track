/* eslint-disable react/prop-types -- This project uses JavaScript without runtime prop-type declarations. */
import { IconX } from '@tabler/icons-react';
import { EXPRESSION_DESCRIPTIONS, EXPRESSION_LABELS } from '../data/faceLabels';

export default function MoodHelpDialog({ onClose }) {
	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
			<section role="dialog" aria-modal="true" aria-labelledby="mood-help-title" className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-black/50 sm:p-7">
				<div className="mb-5 flex items-start justify-between gap-4">
					<div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">Guía rápida</p><h2 id="mood-help-title" className="text-xl font-semibold text-white">Estados de ánimo</h2><p className="mt-2 text-sm leading-5 text-slate-400">El modelo clasifica señales visibles en el rostro. Es una estimación y no confirma cómo se siente realmente una persona.</p></div>
					<button type="button" onClick={onClose} aria-label="Cerrar explicación" className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white"><IconX aria-hidden="true" size={18} /></button>
				</div>
				<div className="space-y-2">
					{Object.entries(EXPRESSION_DESCRIPTIONS).map(([key, description]) => <div key={key} className="flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3.5"><span className="mt-0.5 text-xl">{EXPRESSION_LABELS[key].emoji}</span><div><p className="text-sm font-semibold text-white">{EXPRESSION_LABELS[key].label}</p><p className="mt-1 text-xs leading-5 text-slate-400">{description}</p></div></div>)}
				</div>
			</section>
		</div>
	);
}
