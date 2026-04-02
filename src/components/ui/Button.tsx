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
    'bg-[#c96442] text-[#faf9f5]',
    'border-transparent',
    'shadow-[#c96442_0_0_0_0,#c96442_0_0_0_1px]',
    'hover:brightness-110',
    'active:brightness-90',
  ].join(' '),
  secondary: [
    'bg-[#141413] text-[#b0aea5]',
    'border border-[#30302e]',
    'hover:border-[#4d4c48]',
    'active:brightness-90',
  ].join(' '),
  ghost: [
    'bg-transparent text-[#87867f]',
    'border-transparent',
    'hover:bg-[#30302e]/50',
    'active:bg-[#30302e]',
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
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141413]',
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
