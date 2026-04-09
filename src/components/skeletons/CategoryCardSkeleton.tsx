import React from 'react';

const CategoryCardSkeleton: React.FC = () => (
  <div className="rounded-2xl shadow-lg p-4 flex items-center gap-4 bg-white/60">
    <div className="skeleton w-10 h-10 shrink-0" style={{ borderRadius: '50%' }} />
    <div className="flex-grow flex flex-col gap-2">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
    </div>
  </div>
);

export default CategoryCardSkeleton;
