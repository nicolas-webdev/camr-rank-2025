'use client';

import { ErrorBoundary } from '../ErrorBoundary';

interface ComponentErrorBoundaryProps {
  name: string;
  children: React.ReactNode;
}

export const ComponentErrorBoundary = ({ name, children }: ComponentErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-medium">Error in {name}</h3>
          <p className="text-red-600 text-sm mt-1">
            This component failed to render. Please try refreshing the page.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}; 