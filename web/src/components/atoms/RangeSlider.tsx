import React, { forwardRef, InputHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/utils';

interface RangeSliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  formatValue?: (value: number) => string;
  showValue?: boolean;
}

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      formatValue = val => val.toString(),
      showValue = true,
      id,
      value,
      min = 0,
      max = 100,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const sliderId = id || generatedId;
    const numValue =
      typeof value === 'string' ? parseInt(value, 10) : (value as number) || 0;

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          {label && (
            <label
              htmlFor={sliderId}
              className="block text-sm font-medium text-neutral-700"
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-medium text-brand-600">
              {formatValue(numValue)}
            </span>
          )}
        </div>

        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          value={value}
          className={cn(
            'w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer',
            'slider:bg-brand-600 slider:rounded-lg',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-brand-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-brand-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
            error && 'focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />

        <div className="flex justify-between text-xs text-neutral-500">
          <span>{formatValue(Number(min))}</span>
          <span>{formatValue(Number(max))}</span>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

RangeSlider.displayName = 'RangeSlider';
