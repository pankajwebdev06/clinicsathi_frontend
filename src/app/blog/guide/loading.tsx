// Loading state for guide page - optimized for 3G/low-end devices
export default function GuideLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="h-16 bg-slate-100 animate-pulse" />
      
      {/* Hero skeleton */}
      <div className="h-64 bg-blue-100 animate-pulse" />
      
      {/* Content skeleton */}
      <div className="max-w-4xl mx-auto px-5 py-12 space-y-8">
        {/* Section skeletons */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" />
            <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
