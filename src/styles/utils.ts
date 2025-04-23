// Utility functions for styling
export const createClassName = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const getGradient = (direction: 'br' | 'tr' | 'r' = 'br') => {
  return `bg-gradient-to-${direction}`;
};

export const getSpacing = (size: 'sm' | 'md' | 'lg') => {
  const sizes = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
  };
  return sizes[size];
};

export const getFontSize = (size: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };
  return sizes[size];
};