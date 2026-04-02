import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: [
    'bg-gradient-to-r from-[var(--color-accent-violet)] to-[var(--color-accent-blue)]',
    'text-white',
    'border-transparent',
    'shadow-[0_0_16px_rgba(124,90,240,0.35)]',
    'hover:brightness-110 hover:shadow-[0_0_28px_rgba(124,90,240,0.6)]',
    'active:brightness-90 active:shadow-[0_0_12px_rgba(124,90,240,0.25)]',
  ].join(' '),
  secondary: [
    'bg-transparent',
    'text-[var(--color-text-primary)]',
    'border border-[var(--color-border-glass)]',
    'hover:bg-white/5 hover:border-white/20',
    'active:bg-white/10',
  ].join(' '),
  ghost: [
    'bg-transparent',
    'text-[var(--color-text-secondary)]',
    'border-transparent',
    'hover:text-[var(--color-text-primary)]',
    'hover:bg-white/5',
    'active:bg-white/10',
  ].join(' '),
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  className = '',
  ...rest
}: ButtonProps) => {
  const base = [
    'inline-flex items-center justify-center font-medium',
    'transition-all duration-150',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-violet)]',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
    'cursor-pointer select-none',
  ].join(' ');

  return (
    <button
      disabled={disabled}
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
