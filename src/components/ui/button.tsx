import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 uppercase tracking-wider font-bold border-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-[3px_3px_0_hsl(var(--border))] hover:shadow-[1px_1px_0_hsl(var(--border))] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
        destructive: "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground shadow-[3px_3px_0_hsl(var(--border))] hover:shadow-[1px_1px_0_hsl(var(--border))] hover:translate-x-[2px] hover:translate-y-[2px]",
        secondary: "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground border-transparent",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
        cyber: "bg-primary text-primary-foreground border-primary cyber-glow hover:bg-primary/80 shadow-[3px_3px_0_hsl(var(--border))] hover:shadow-[1px_1px_0_hsl(var(--border))] hover:translate-x-[2px] hover:translate-y-[2px]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
