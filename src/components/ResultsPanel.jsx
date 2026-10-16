/* eslint-disable react/prop-types -- This project uses JavaScript without runtime prop-type declarations. */
import { IconCalendar, IconUser } from '@tabler/icons-react';
import { GENDER_LABELS } from '../data/faceLabels';

export default function ResultsPanel({ age, gender }) {
	return (
		<section className="rounded-3xl border border-teal-300/15 bg-slate-900/80 p-5 shadow-xl shadow-black/10 sm:p-6">
			<div className="mb-5 flex items-center justify-between">
				<div><h2 className="text-lg font-semibold text-white">Resultados</h2><p className="mt-1 text-sm text-slate-400">Estimaciones de la lectura actual</p></div>
				<div className="flex items-center gap-2">
					<span className="rounded-full border border-teal-300/15 bg-teal-300/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-teal-200">En vivo</span>
				</div>
			</div>
			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="min-h-36 rounded-2xl border border-sky-300/15 bg-gradient-to-br from-sky-400/[0.09] to-white/[0.02] p-4 sm:p-5"><div className="mb-4 grid size-11 place-items-center rounded-xl bg-sky-400/15 text-sky-300"><IconCalendar aria-hidden="true" size={23} stroke={1.7} /></div><p className="text-sm font-medium text-slate-400">Edad estimada</p><p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{age !== null ? <>{age}<span className="ml-1.5 text-sm font-medium text-slate-400">años</span></> : <span className="text-slate-600">—</span>}</p></div>
					<div className="min-h-36 rounded-2xl border border-amber-300/15 bg-gradient-to-br from-amber-400/[0.09] to-white/[0.02] p-4 sm:p-5"><div className="mb-4 grid size-11 place-items-center rounded-xl bg-amber-400/15 text-amber-300"><IconUser aria-hidden="true" size={23} stroke={1.7} /></div><p className="text-sm font-medium text-slate-400">Género estimado</p><p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{gender ? GENDER_LABELS[gender] ?? gender : <span className="text-slate-600">—</span>}</p></div>
				</div>
			</div>
		</section>
	);
}
