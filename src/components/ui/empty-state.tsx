import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/20 px-6 py-12 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
        <Icon className="size-7 text-cyan-200" aria-hidden="true" />
      </span>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {description && <p className="text-sm text-slate-400">{description}</p>}
        </div>
    );
}