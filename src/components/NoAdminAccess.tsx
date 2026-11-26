import React from 'react';
import { Link } from 'react-router-dom';
import { SignOutButton } from '@clerk/clerk-react';
import { Lock, LogOut, ArrowRight } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

/** Shown to signed-in users who are not admins when they reach an admin-only screen. */
const NoAdminAccess: React.FC = () => {
  const { user } = useAuth();
  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-mesh" style={{ direction: 'rtl' }}>
      <AppHeader />
      <main className="flex flex-col items-center justify-center flex-1 px-6 py-16 relative z-10">
        <div className="w-full max-w-md text-center bg-white/70 rounded-[2rem] ring-1 ring-white/80 shadow-sm px-8 py-10 animate-scale-in">
          <span className="inline-flex p-4 rounded-full bg-pastelYellow/60 mb-5" aria-hidden="true">
            <Lock className="h-8 w-8 text-choco" />
          </span>
          <h1 className="font-fredoka text-3xl text-choco mb-3">אין לך הרשאת ניהול</h1>
          <p className="text-choco/70 mb-2">
            רק מנהלי האתר יכולים להוסיף, לערוך או למחוק מתכונים.
          </p>
          {email && (
            <p className="text-choco/60 text-sm mb-6" dir="ltr">
              {email}
            </p>
          )}
          <p className="text-choco/70 text-sm mb-8">
            אם נכנסת עם החשבון הלא נכון, אפשר להתנתק ולהיכנס שוב.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <SignOutButton redirectUrl="/">
              <Button className="font-fredoka">
                <LogOut className="ml-2 h-4 w-4" />
                התנתק
              </Button>
            </SignOutButton>
            <Button asChild variant="outline" className="font-fredoka">
              <Link to="/">
                <ArrowRight className="ml-2 h-4 w-4" />
                חזרה לדף הבית
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NoAdminAccess;
