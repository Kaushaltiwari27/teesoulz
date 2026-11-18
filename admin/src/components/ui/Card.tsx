import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-zinc-200/90 shadow-soft overflow-hidden transition-all duration-200 ${className}`}
    >
      {(title || action) && (
        <div className="px-6 py-4.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            {title && (
              <h3 className="text-sm font-bold text-zinc-950 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0 ml-4">{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
