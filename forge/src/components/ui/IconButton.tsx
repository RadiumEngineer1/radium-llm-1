import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tooltip?: string;
}

export default function IconButton({ children, tooltip, className = '', ...props }: IconButtonProps) {
  return (
    <button
      title={tooltip}
      className={`p-1.5 rounded hover:bg-surface3 text-muted hover:text-[rgb(var(--color-text))] transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
