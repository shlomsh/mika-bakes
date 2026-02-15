import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-off-white p-8" dir="rtl">
      <div className="text-center animate-scale-in max-w-md">
        {/* Burnt cookie illustration */}
        <div className="text-8xl mb-6 animate-float">🍪</div>

        <h1 className="font-fredoka text-6xl text-choco mb-3 animate-fade-up delay-100">
          404
        </h1>
        <p className="font-fredoka text-2xl text-choco mb-2 animate-fade-up delay-200">
          אופס, המתכון נשרף!
        </p>
        <p className="text-choco/70 text-lg mb-8 animate-fade-up delay-300">
          לא הצלחנו למצוא את העמוד שחיפשת. אולי הוא נאכל?
        </p>
        <div className="animate-fade-up delay-400">
          <Button asChild size="lg" className="font-fredoka text-lg">
            <Link to="/">
              <ArrowRight className="ml-2 h-5 w-5" />
              חזרה לדף הבית
            </Link>
          </Button>
        </div>
      </div>

      {/* Floating decorative crumbs */}
      <span className="fixed top-20 left-[15%] text-2xl opacity-20 animate-float pointer-events-none select-none" aria-hidden="true">🧁</span>
      <span className="fixed bottom-32 right-[20%] text-xl opacity-15 animate-float-reverse pointer-events-none select-none" aria-hidden="true">🎂</span>
      <span className="fixed top-40 right-[10%] text-lg opacity-20 animate-float pointer-events-none select-none" aria-hidden="true">✨</span>
    </div>
  );
};

export default NotFound;
