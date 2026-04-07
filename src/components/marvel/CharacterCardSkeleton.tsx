'use client';

import { motion } from 'framer-motion';

export function CharacterCardSkeleton() {
  return (
    <div className="character-card pointer-events-none" style={{ aspectRatio: '3/4' }}>
      {/* Main image placeholder */}
      <div className="skeleton w-full h-full rounded-xl" />
      
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[1] rounded-xl"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
        }}
      />
      
      {/* Bottom content skeleton */}
      <div className="absolute bottom-0 left-0 right-0 z-[2] p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="skeleton h-4 w-24 mb-1.5" />
            <div className="skeleton h-3 w-16" />
          </div>
          <div className="skeleton h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-6">
      <div className="skeleton h-6 w-32 mb-3" />
      <div className="skeleton h-3 w-full mb-2" />
      <div className="skeleton h-3 w-3/4 mb-4" />
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton w-8 h-8 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function TimelineEntrySkeleton() {
  return (
    <div className="relative pl-10">
      <div className="skeleton absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full" />
      <div className="bg-[#141414] rounded-lg border border-[rgba(255,255,255,0.06)] p-4">
        <div className="skeleton h-4 w-32 mb-2" />
        <div className="skeleton h-3 w-full mb-1" />
        <div className="skeleton h-3 w-5/6" />
      </div>
    </div>
  );
}
