import React from 'react';

const RecipePageSkeleton: React.FC = () => (
  <div
    className="min-h-screen w-full flex flex-col items-center p-4 md:p-8 bg-gradient-mesh"
    style={{ direction: 'rtl' }}
  >
    {/* Top nav buttons */}
    <div className="w-full max-w-5xl flex justify-end gap-2 mb-6">
      <div className="skeleton h-10 w-28 rounded-lg" />
    </div>

    {/* Title + category */}
    <div className="w-full max-w-5xl mb-8">
      <div className="skeleton h-9 w-56 rounded mb-3" />
      <div className="skeleton h-5 w-28 rounded" />
    </div>

    {/* Hero image */}
    <div className="skeleton w-full max-w-5xl h-72 md:h-96 rounded-3xl mb-8" />

    {/* Ingredient + instruction blocks */}
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex flex-col gap-3">
        <div className="skeleton h-6 w-24 rounded mb-1" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-5 rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="skeleton h-6 w-24 rounded mb-1" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

export default RecipePageSkeleton;
