"use client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/5 rounded-3xl relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 translate-x-[-100%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}

/**
 * COMPONENT: ProductCardSkeleton
 * Matches the layout of your hardware catalog cards.
 */
export function ProductCardSkeleton() {
  return (
    <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] flex flex-col gap-6">
      <Skeleton className="h-48 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-12 w-full mt-6" />
      </div>
    </div>
  );
}
