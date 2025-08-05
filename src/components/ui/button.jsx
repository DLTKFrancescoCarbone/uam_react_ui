import React from 'react';

const Button = React.forwardRef(({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
const variants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input hover:bg-accent hover:text-accent-foreground text-body',
  'outline-header': 'border border-[#043852] text-[#043852] hover:bg-[#043852]/10',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground text-body',
  link: 'underline-offset-4 hover:underline text-primary',
  'primary-header': 'primary-header',
};

  const sizes = {
    default: 'h-10 py-2 px-4 tablet:h-11 tablet:py-3 tablet:px-6',
    sm: 'h-9 px-3 rounded-md tablet:h-11 tablet:px-4',
    lg: 'h-11 px-8 rounded-md tablet:h-12 tablet:px-10',
    icon: 'h-8 w-8 p-0 tablet:h-11 tablet:w-11',
    touch: 'h-11 w-11 p-0 min-h-[44px] min-w-[44px]',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} ref={ref} {...props}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
