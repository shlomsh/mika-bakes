
import React from "react";

const MikaHero: React.FC = () => (
  <section
    className="relative bg-pastelYellow rounded-3xl shadow-lg p-8 flex flex-col lg:flex-row-reverse items-center w-full h-full min-h-[380px] justify-between overflow-hidden gap-8 texture-noise animate-scale-in"
    dir="rtl"
  >
    {/* Floating decorative elements */}
    <span className="absolute top-4 left-6 text-3xl opacity-40 animate-float pointer-events-none select-none" aria-hidden="true">🧁</span>
    <span className="absolute bottom-6 left-16 text-2xl opacity-30 animate-float-reverse pointer-events-none select-none" aria-hidden="true">🍪</span>
    <span className="absolute top-10 right-8 text-2xl opacity-25 animate-float pointer-events-none select-none hidden lg:block" aria-hidden="true">✨</span>
    <span className="absolute bottom-4 right-6 text-xl opacity-30 animate-float-reverse pointer-events-none select-none" aria-hidden="true">🎂</span>

    {/* Image section */}
    <div className="flex-1 flex justify-center items-center mb-6 lg:mb-0 animate-slide-in-left delay-200">
      <img
        src="/uploads/bf32f2f4-c8ee-4e85-9887-739052ac4f30.png"
        alt="עוגיות קאפקייקס צבעוניות"
        className="w-64 h-64 object-cover border-4 border-white shadow-lg rounded-3xl"
        style={{
          maxWidth: "350px",
          maxHeight: "350px",
          transform: "rotate(-2deg)",
        }}
      />
    </div>

    {/* Text section */}
    <div className="flex-1 flex flex-col items-start justify-center text-right">
      <span className="bg-white/80 text-choco font-fredoka text-xl px-4 py-1 rounded-full shadow mb-2 font-bold animate-fade-up delay-100">
        הכירו את מיקה!
      </span>
      <span
        className="text-choco text-[2.7rem] font-fredoka font-extrabold leading-tight mb-6 animate-fade-up delay-200"
        style={{ textShadow: '0 2px 0 #fff9ea' }}
      >
        מיקה - שפית <span className="text-orange-500">צעירה</span> בת 14
      </span>
      <p className="mt-2 text-lg text-choco max-w-lg font-inter animate-fade-up delay-300">
        מיקה היא בת ה-14 של המשפחה וכבר אלופה גדולה במטבח! האהבה הכי גדולה שלה היא{' '}
        <span className="font-bold text-orange-500">קונדיטוריה</span> ו-
        <span className="font-bold text-orange-500">מאפים</span>. כאן תמצאו את כל המתכונים הכי שווים שלה – מתוקים, מלוחים וביתיים.
      </p>
    </div>
  </section>
);

export default MikaHero;
