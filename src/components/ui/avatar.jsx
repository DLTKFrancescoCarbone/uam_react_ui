import React from 'react';

const Avatar = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden avatar-container ${className}`}
    {...props}
  />
));

const AvatarImage = React.forwardRef(({ className = '', alt = '', ...props }, ref) => (
  <img
    ref={ref}
    className={`aspect-square h-full w-full ${className}`}
    alt={alt}
    {...props}
  />
));

const AvatarFallback = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`flex h-full w-full items-center justify-center avatar-fallback ${className}`}
    {...props}
  />
));

Avatar.displayName = 'Avatar';
AvatarImage.displayName = 'AvatarImage';
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
