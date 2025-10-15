'use client';

interface StatusPillProps {
  status: 'Normal' | 'Warning' | 'Danger' | 'Offline';
  size?: 'sm' | 'md';
}

export default function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Normal':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Danger':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Offline':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${getStatusStyles()} border`}
    >
      {status}
    </span>
  );
}