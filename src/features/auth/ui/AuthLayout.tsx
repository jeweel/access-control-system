/**
 * Authentication layout
 */

import React from 'react';
import clsx from 'clsx';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Access Control</h1>
            {title && <h2 className="text-xl font-semibold text-gray-700 mt-4">{title}</h2>}
            {subtitle && <p className="text-gray-600 text-sm mt-2">{subtitle}</p>}
          </div>
          {children}
        </div>
        <div className="mt-6 text-center text-white text-sm">
          <p>&copy; 2026 Secure Access Control System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
