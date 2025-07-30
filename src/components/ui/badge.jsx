import React from 'react';
import { cn } from "../../utils/cn";

const badgeVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "text-foreground",
  info: "bg-[oklch(0.74_0.16_232.661)] text-[oklch(0.29_0.066_243.157)] hover:bg-[oklch(0.68_0.16_232.661)]",
  success: "bg-[oklch(0.76_0.177_163.223)] text-[oklch(0.37_0.077_168.94)] hover:bg-[oklch(0.70_0.177_163.223)]",
  warning: "bg-[oklch(0.82_0.189_84.429)] text-[oklch(0.41_0.112_45.904)] hover:bg-[oklch(0.76_0.189_84.429)]",
  error: "bg-[oklch(0.71_0.194_13.428)] text-[oklch(0.27_0.105_12.094)] hover:bg-[oklch(0.65_0.194_13.428)]",
};

const Badge = ({ className = '', variant = 'default', ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
};

export { Badge, badgeVariants };
