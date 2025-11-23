import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{ width, height }}
      role="status"
      aria-label="Loading..."
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card">
      <Skeleton height="24px" className="mb-4" />
      <Skeleton height="16px" className="mb-2" />
      <Skeleton height="16px" className="mb-2" />
      <Skeleton height="16px" width="60%" />
    </div>
  );
}
