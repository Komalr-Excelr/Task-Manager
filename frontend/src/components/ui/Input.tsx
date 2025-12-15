import { InputHTMLAttributes, forwardRef } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string };

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, className = '', ...props },
  ref
) {
  return (
    <label className="block space-y-1">
      {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
      <input ref={ref} className={'input ' + className} {...props} />
    </label>
  );
});