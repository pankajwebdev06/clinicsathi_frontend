import React from 'react';

// ------------------------------------------
// Full Page Loading Spinner
// ------------------------------------------
interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-spin opacity-50" style={{ animationDuration: '1.5s' }} />
      </div>
      <p className="mt-4 text-slate-500 font-medium">{message}</p>
    </div>
  );
}

// ------------------------------------------
// Inline Loading Spinner
// ------------------------------------------
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-slate-200 border-t-blue-600 rounded-full animate-spin ${className}`}
    />
  );
}

// ------------------------------------------
// Button Loading State
// ------------------------------------------
interface ButtonLoadingProps {
  children: React.ReactNode;
  isLoading: boolean;
  loadingText?: string;
}

export function ButtonContent({ 
  children, 
  isLoading, 
  loadingText = 'Loading...' 
}: ButtonLoadingProps) {
  if (isLoading) {
    return (
      <>
        <Spinner size="sm" className="mr-2" />
        {loadingText}
      </>
    );
  }
  return <>{children}</>;
}

// ------------------------------------------
// Skeleton Components
// ------------------------------------------
interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded ${className}`}
      style={style}
    />
  );
}

// ------------------------------------------
// Card Skeleton
// ------------------------------------------
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

// ------------------------------------------
// List Skeleton
// ------------------------------------------
interface ListSkeletonProps {
  count?: number;
}

export function ListSkeleton({ count = 5 }: ListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-100">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// ------------------------------------------
// Table Skeleton
// ------------------------------------------
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-slate-50 rounded-t-lg border-b border-slate-200">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={`row-${rowIndex}`} 
          className="flex gap-4 p-4 border-b border-slate-100 last:border-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={`cell-${rowIndex}-${colIndex}`} 
              className="h-4 flex-1" 
              style={{ width: `${Math.random() * 40 + 60}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ------------------------------------------
// Form Skeleton
// ------------------------------------------
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4 max-w-lg">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-12 w-32 rounded-lg mt-6" />
    </div>
  );
}

// ------------------------------------------
// Dashboard Stats Skeleton
// ------------------------------------------
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

// ------------------------------------------
// Queue Item Skeleton
// ------------------------------------------
export function QueueItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  );
}

// ------------------------------------------
// Patient Card Skeleton
// ------------------------------------------
export function PatientCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

// ------------------------------------------
// Loading Overlay
// ------------------------------------------
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
}
