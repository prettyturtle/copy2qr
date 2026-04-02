import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => (
  <div
    className={[
      'bg-[#30302e]',
      'border border-[#30302e]',
      'rounded-xl',
      'p-6',
      'shadow-[0_2px_8px_rgba(0,0,0,0.20)]',
      'transition-[transform,box-shadow] duration-200 ease-out',
      'hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.20)]',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </div>
);

export default Card;
