import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'sage';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-lg gap-2',
    lg: 'text-base px-6 py-3.5 rounded-lg gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#174B3A] hover:bg-[#10372D] active:bg-[#0c2b22] text-[#FFFEFA] shadow-xs focus-visible:outline-[#174B3A]',
    secondary:
      'bg-[#FFFEFA] hover:bg-[#F6F4EC] text-[#242923] border border-[#E5E2D9] hover:border-[#D9D5C9] shadow-xs focus-visible:outline-[#174B3A]',
    outline:
      'bg-transparent hover:bg-[#EBF2ED] text-[#174B3A] border border-[#174B3A] focus-visible:outline-[#174B3A]',
    ghost:
      'bg-transparent hover:bg-[#F2EFE7] text-[#242923] focus-visible:outline-[#174B3A]',
    sage:
      'bg-[#DCE7D8] hover:bg-[#cfdccb] text-[#10372D] border border-[#cfdccb] focus-visible:outline-[#10372D]',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
