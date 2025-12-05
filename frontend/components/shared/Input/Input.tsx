'use client';

import { forwardRef } from 'react';
import styles from './Input.module.scss';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(styles.input, styles[variant], className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;





