import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => (
  <div
    className={[
      'bg-white/5',
      'backdrop-blur-xl',
      'border border-white/10',
      'rounded-2xl',
      'p-6',
      'shadow-[0_4px_24px_rgba(0,0,0,0.3)]',
      'transition-[transform,box-shadow] duration-200 ease-out',
      'hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </div>
);

export default Card;
