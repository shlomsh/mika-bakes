import React from 'react';

const RecipeCardSkeleton: React.FC = () => (
  <div className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg">
    <div className="skeleton w-full h-48" style={{ borderRadius: '1.25rem 1.25rem 0 0' }} />
    <div className="p-4 flex flex-col gap-3">
      <div className="skeleton h-6 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-10 w-full mt-1" style={{ borderRadius: '0.375rem' }} />
    </div>
  </div>
);

export default RecipeCardSkeleton;
