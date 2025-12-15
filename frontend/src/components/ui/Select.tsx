import { SelectHTMLAttributes, forwardRef } from 'react';

type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string };

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, className = '', children, ...props },
  ref
) {
  return (
    <label className="block space-y-1">
      {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
      <select ref={ref} className={'select ' + className} {...props}>{children}</select>
    </label>
  );
});