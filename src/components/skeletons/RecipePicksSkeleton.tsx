import React from 'react';

const RecipePicksSkeleton: React.FC = () => (
  <section className="bg-white rounded-3xl shadow-lg p-7 mt-8" dir="rtl">
    <div className="skeleton h-7 w-32 mb-4" />
    <div className="flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-pastelYellow/10">
          <div className="skeleton w-16 h-16 rounded-xl shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default RecipePicksSkeleton;
