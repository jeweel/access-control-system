/**
 * Base Card component
 */

import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, header, footer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('bg-white rounded-lg shadow-md overflow-hidden', className)}
        {...props}
      >
        {header && <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">{header}</div>}
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">{footer}</div>}
      </div>
    );
  }
);

Card.displayName = 'Card';
