'use client';

interface StatusCardProps {
  title: string;
  value: string | number;
  description?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'emerald' | 'sky';
  icon?: React.ReactNode;
}

export default function StatusCard({ title, value, description, color = 'sky', icon }: StatusCardProps) {
  const colorClasses = {
    sky: {
      gradient: 'from-sky-500 to-sky-600',
      bg: 'bg-sky-950/30',
      border: 'border-sky-800/50',
      text: 'text-sky-400',
      icon: 'bg-gradient-to-br from-sky-500 to-sky-600'
    },
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-950/30',
      border: 'border-blue-800/50',
      text: 'text-blue-400',
      icon: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    green: {
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-800/50',
      text: 'text-emerald-400',
      icon: 'bg-gradient-to-br from-emerald-500 to-emerald-600'
    },
    emerald: {
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-800/50',
      text: 'text-emerald-400',
      icon: 'bg-gradient-to-br from-emerald-500 to-emerald-600'
    },
    yellow: {
      gradient: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-950/30',
      border: 'border-amber-800/50',
      text: 'text-amber-400',
      icon: 'bg-gradient-to-br from-amber-500 to-amber-600'
    },
    red: {
      gradient: 'from-rose-500 to-rose-600',
      bg: 'bg-rose-950/30',
      border: 'border-rose-800/50',
      text: 'text-rose-400',
      icon: 'bg-gradient-to-br from-rose-500 to-rose-600'
    },
    gray: {
      gradient: 'from-zinc-600 to-zinc-700',
      bg: 'bg-zinc-950/30',
      border: 'border-zinc-800/50',
      text: 'text-zinc-400',
      icon: 'bg-gradient-to-br from-zinc-600 to-zinc-700'
    },
  };

  const colors = colorClasses[color];

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl ${colors.bg} border ${colors.border} p-4 transition-all duration-300 hover:scale-102 hover:shadow-lg group`}
    >
      {/* Decorative gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient}`} />
      
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-zinc-400 font-medium uppercase tracking-wide mb-1">{title}</div>
          <div className={`text-2xl md:text-3xl font-bold ${colors.text} tracking-tight`}>{value}</div>
          {description && <div className="mt-2 text-xs text-zinc-500">{description}</div>}
        </div>
        {icon && (
          <div className={`shrink-0 ml-3 p-3 rounded-xl ${colors.icon} shadow-lg group-hover:scale-110 transition-transform`}>
            <div className="text-white">{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
}