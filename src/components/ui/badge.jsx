import React from 'react';
import { cn } from "../../utils/cn";

const badgeVariants = {
  default: "bg-[oklch(0.76_0.177_163.223)] text-[oklch(0.37_0.077_168.94)] border-transparent",
  secondary: "bg-secondary text-secondary-foreground border-transparent",
  destructive: "bg-destructive text-destructive-foreground border-transparent",
  outline: "text-foreground border-border",
  info: "bg-[oklch(0.74_0.16_232.661)] text-[oklch(0.29_0.066_243.157)] border-transparent",
  success: "bg-[oklch(0.76_0.177_163.223)] text-[oklch(0.37_0.077_168.94)] border-transparent",
  warning: "bg-[oklch(0.82_0.189_84.429)] text-[oklch(0.41_0.112_45.904)] border-transparent",
  error: "bg-[oklch(0.71_0.194_13.428)] text-[oklch(0.27_0.105_12.094)] border-transparent",
  // Additional colors for groups and roles
  purple: "bg-[oklch(0.75_0.15_308)] text-[oklch(0.35_0.09_308)] border-transparent",
  teal: "bg-[oklch(0.75_0.12_200)] text-[oklch(0.35_0.08_200)] border-transparent",
  indigo: "bg-[oklch(0.72_0.18_260)] text-[oklch(0.32_0.12_260)] border-transparent",
  pink: "bg-[oklch(0.78_0.14_350)] text-[oklch(0.38_0.10_350)] border-transparent",
  cyan: "bg-[oklch(0.77_0.11_210)] text-[oklch(0.37_0.08_210)] border-transparent",
  orange: "bg-[oklch(0.79_0.16_50)] text-[oklch(0.39_0.11_50)] border-transparent",
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
