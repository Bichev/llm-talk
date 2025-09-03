import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  resize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className,
    containerClassName,
    label,
    error,
    helperText,
    resize = true,
    id,
    ...props 
  }, ref) => {
    const textareaId = id || React.useId();
    const hasError = Boolean(error);

    return (
      <div className={cn('space-y-1', containerClassName)}>
        {label && (
          <label 
            htmlFor={textareaId}
            className="label-text"
          >
            {label}
          </label>
        )}
        
        <textarea
          id={textareaId}
          className={cn(
            'input-field min-h-[80px]',
            !resize && 'resize-none',
            hasError && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
