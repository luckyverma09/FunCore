import { Loader } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const SpinnerVariant = cva('text-muted-forground animete-spin', {
  variants: {
    size: {
      default: 'w-4 h-4',
      sm: 'w-2 h-2',
      lg: 'w-6 h-6',
      icon: 'w-10 h-10',
    },
    defaultVariant: {
      size: 'default',
    },
  },
});

interface SpinnerProps extends VariantProps<typeof SpinnerVariant> {}

export const Spinner = ({ size }: SpinnerProps) => {
  return <Loader className={cn(SpinnerVariant({ size }))} />;
};
