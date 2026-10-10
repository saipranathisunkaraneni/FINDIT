import React from 'react';

export type BadgeVariant = 'found' | 'lost' | 'pending' | 'campus' | 'category' | 'match';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'category',
  children,
  icon,
  className = '',
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-tight';

  const variantStyles: Record<BadgeVariant, string> = {
    found: 'bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]',
    lost: 'bg-[#FBE9E7] text-[#C62828] border border-[#FFCCBC]',
    pending: 'bg-[#FFF8E1] text-[#9E6B02] border border-[#FFE082]',
    campus: 'bg-[#FFFEFA] text-[#174B3A] border border-[#E5E2D9] shadow-xs',
    category: 'bg-[#F2EFE7] text-[#474B43] border border-[#E5E2D9]',
    match: 'bg-[#DCE7D8] text-[#10372D] border border-[#cfdccb] font-semibold',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
