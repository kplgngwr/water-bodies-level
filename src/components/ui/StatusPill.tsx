'use client';

interface StatusPillProps {
  status: 'Normal' | 'Warning' | 'Danger' | 'Offline';
  size?: 'sm' | 'md';
}

const STATUS_STYLES: Record<StatusPillProps['status'], { wrapper: string; dot: string }> = {
  Normal: {
    wrapper: 'bg-emerald-500/15 border border-emerald-500/50 text-emerald-200',
    dot: 'bg-emerald-400',
  },
  Warning: {
    wrapper: 'bg-amber-500/15 border border-amber-500/40 text-amber-200',
    dot: 'bg-amber-400',
  },
  Danger: {
    wrapper: 'bg-rose-500/15 border border-rose-500/40 text-rose-200',
    dot: 'bg-rose-400',
  },
  Offline: {
    wrapper: 'bg-slate-500/15 border border-slate-500/40 text-slate-200',
    dot: 'bg-slate-400',
  },
};

const BASE_CLASSES = 'inline-flex items-center gap-2 rounded-full uppercase tracking-wide font-semibold';

const SIZE_CLASSES: Record<NonNullable<StatusPillProps['size']>, string> = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-3 py-1',
};

export default function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const styles = STATUS_STYLES[status];

  const dot = (
    <span className={`inline-flex h-1.5 w-1.5 rounded-full ${styles.dot}`} />
  );

  return (
    <span className={`${BASE_CLASSES} ${SIZE_CLASSES[size]} ${styles.wrapper}`}>
      {dot}
      {status}
    </span>
  );
}
