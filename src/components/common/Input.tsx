import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, leftIcon, rightIcon, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold tracking-wide text-[#242923] uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#72766F]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-[#FFFFFF] border rounded-lg px-3.5 py-2.5 text-sm text-[#242923] placeholder-[#9CA099] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#174B3A]/20 focus:border-[#174B3A] ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error ? 'border-[#C62828] focus:border-[#C62828]' : 'border-[#E5E2D9]'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-[#72766F]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#C62828]">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#72766F]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
