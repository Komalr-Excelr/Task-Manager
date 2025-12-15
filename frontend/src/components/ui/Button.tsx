import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
  full?: boolean;
};

export function Button({ variant = 'primary', full, className = '', ...props }: Props) {
  const base = 'btn ' + (variant === 'primary' ? 'btn-primary' : variant === 'danger' ? 'btn-danger' : 'btn-ghost');
  const width = full ? ' w-full' : '';
  return <button className={base + width + (className ? ' ' + className : '')} {...props} />;
}