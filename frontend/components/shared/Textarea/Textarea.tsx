'use client';

import { forwardRef } from 'react';
import styles from './Textarea.module.scss';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'error';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(styles.textarea, styles[variant], className)}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;





