import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({
  label = 'Loading data...',
  size = 'md',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-500">
      <Loader2 className={`${sizeClasses} animate-spin text-zinc-900 mb-3`} />
      <span className="text-xs font-mono tracking-wider uppercase text-zinc-500">
        {label}
      </span>
    </div>
  );
}
