import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const loaderVariants = cva(
  'animate-spin',
  {
    variants: {
      variant: {
        default: 'text-primary',
        muted: 'text-muted-foreground',
        accent: 'text-accent-foreground',
        white: 'text-white',
      },
      size: {
        default: 'h-6 w-6',
        sm: 'h-4 w-4',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface LoaderProps
  extends VariantProps<typeof loaderVariants> {
  className?: string;
}

const Loader = React.forwardRef<SVGSVGElement, LoaderProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        className={cn(loaderVariants({ variant, size, className }))}
        data-testid="loader"
        {...props}
      />
    );
  }
);
Loader.displayName = 'Loader';

export { Loader, loaderVariants };