import React from "react";

const MikaHero: React.FC = () => (
  <section
    dir="rtl"
    className="w-full flex flex-col sm:flex-row items-center gap-8 pt-10 pb-4 animate-fade-in"
  >
    {/* Photo — first in DOM = top on mobile, right side on desktop (RTL flex-row start) */}
    <div className="flex justify-center sm:flex-1 animate-scale-in">
      <img
        src="/uploads/bf32f2f4-c8ee-4e85-9887-739052ac4f30.png"
        alt="עוגיות קאפקייקס צבעוניות של מיקה"
        className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 object-cover rounded-3xl border-4 border-white shadow-xl"
        style={{ transform: "rotate(-2deg)" }}
      />
    </div>

    {/* Text */}
    <div className="sm:flex-1 flex flex-col items-end text-right animate-fade-up delay-100">
      <span className="font-frankRuhl text-sm text-choco/50 tracking-widest mb-3">
        הכירו את מיקה 🧁
      </span>
      <h1
        className="font-fredoka text-choco leading-none mb-4"
        style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)" }}
      >
        ספר המתכונים
        <br />
        <span className="text-coral">של מיקה</span>
      </h1>
      <p className="font-frankRuhl text-lg text-choco/70 leading-relaxed max-w-xs">
        מיקה היא הנערה של המשפחה וכבר אלופה גדולה במטבח. כאן תמצאו את כל המתכונים שלה:{" "}
        <span className="font-bold text-choco">קונדיטוריה, מאפים וביתי</span>.
      </p>
    </div>
  </section>
);

export default MikaHero;
