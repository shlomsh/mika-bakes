import React from 'react';

const RecipeCardSkeleton: React.FC = () => (
  <div className="bg-off-white rounded-2xl overflow-hidden flex flex-col">
    <div className="skeleton w-full h-48 rounded-none" />
    <div className="p-5 flex flex-col gap-2">
      <div className="skeleton h-6 w-3/4 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
    </div>
  </div>
);

export default RecipeCardSkeleton;
