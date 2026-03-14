'use client';

export function SkeletonCard() {
  return (
    <div className="glass-panel p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary" />
          <div className="h-3 w-20 bg-secondary rounded" />
        </div>
        <div className="h-6 w-16 bg-secondary rounded-full" />
      </div>

      {/* Title & Location */}
      <div className="h-6 w-3/4 bg-secondary rounded mb-2" />
      <div className="h-4 w-1/2 bg-secondary rounded mb-4" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-secondary/50 rounded-lg p-3">
            <div className="h-3 w-12 bg-secondary rounded mb-2" />
            <div className="h-5 w-16 bg-secondary rounded" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <div className="h-3 w-16 bg-secondary rounded mb-1" />
          <div className="h-6 w-20 bg-secondary rounded" />
        </div>
        <div className="h-4 w-24 bg-secondary rounded" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
