import React from 'react';

const CategoryCardSkeleton: React.FC = () => (
  <div className="rounded-2xl h-32 flex flex-col items-center justify-center gap-2.5 bg-white/50 p-5">
    <div className="skeleton w-9 h-9 rounded-full" />
    <div className="skeleton h-5 w-16 rounded" />
  </div>
);

export default CategoryCardSkeleton;
