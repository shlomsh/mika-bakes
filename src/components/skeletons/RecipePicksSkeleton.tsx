import React from 'react';

const RecipePicksSkeleton: React.FC = () => (
  <section dir="rtl" className="animate-fade-up delay-200">
    <div className="skeleton h-7 w-48 mb-5 rounded" />
    {/* featured */}
    <div className="skeleton w-full h-60 md:h-80 rounded-2xl mb-4" />
    {/* 2-col grid */}
    <div className="grid grid-cols-2 gap-3">
      {[0, 1].map((i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-off-white">
          <div className="skeleton w-full h-32" />
          <div className="p-3">
            <div className="skeleton h-5 w-3/4 rounded" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default RecipePicksSkeleton;
