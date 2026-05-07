'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

// ------------------------------------------
// Error Boundary Props & State
// ------------------------------------------
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// ------------------------------------------
// Error Boundary Component
// ------------------------------------------
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

// ------------------------------------------
// Error Fallback UI
// ------------------------------------------
interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Something went wrong
        </h2>

        <p className="text-slate-500 mb-6">
          We apologize for the inconvenience. Please try again or return home.
        </p>

        {error && (
          <div className="bg-slate-100 rounded-lg p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
              Error Details
            </p>
            <p className="text-sm text-slate-700 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------
// Dashboard Error Boundary (smaller, for sections)
// ------------------------------------------
interface DashboardErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function DashboardError({ 
  title = 'Error loading data', 
  message = 'Something went wrong while loading this section.',
  onRetry 
}: DashboardErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-red-900">{title}</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm font-medium text-red-700 hover:text-red-800 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
