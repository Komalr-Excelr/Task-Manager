import { TextareaHTMLAttributes, forwardRef } from 'react';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string };

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { label, className = '', ...props },
  ref
) {
  return (
    <label className="block space-y-1">
      {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
      <textarea ref={ref} className={'textarea ' + className} {...props} />
    </label>
  );
});