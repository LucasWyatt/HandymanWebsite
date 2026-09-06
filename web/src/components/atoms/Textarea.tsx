import React, {
  forwardRef,
  TextareaHTMLAttributes,
  useId,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      rows = 4,
      value,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const [isFocused, setIsFocused] = useState(false);

    const hasValue = value !== undefined && value !== null && value !== '';
    const shouldFloatLabel = isFocused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="relative">
        <textarea
          id={textareaId}
          rows={rows}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'peer block w-full px-3 pt-6 pb-2 border border-neutral-300 rounded-md shadow-sm bg-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cta-500 focus:border-cta-500 sm:text-sm resize-vertical transition-all duration-200',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            className
          )}
          placeholder={label || ''}
          ref={ref}
          {...props}
        />
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'absolute left-3 transition-all duration-200 pointer-events-none text-neutral-500',
              shouldFloatLabel
                ? 'top-1 text-xs font-medium text-neutral-600'
                : 'top-4 text-sm'
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
