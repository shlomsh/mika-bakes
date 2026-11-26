import React from 'react';
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { Lock, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AuthComponent = () => {
  const { isAdmin, loading } = useAuth();

  return (
    <>
      <SignedIn>
        <div className="flex items-center gap-2">
          {!loading && !isAdmin && (
            <span
              role="status"
              title="החשבון הזה מחובר, אבל אין לו הרשאה להוסיף או לערוך מתכונים"
              className="inline-flex items-center gap-1.5 rounded-full bg-pastelYellow/60 px-3 py-1 text-xs font-body text-choco"
            >
              <Lock className="h-3 w-3" aria-hidden="true" />
              ללא הרשאת ניהול
            </span>
          )}
          <SignOutButton>
            <Button variant="ghost" size="icon" className="sm:w-auto sm:px-4">
              <LogOut />
              <span className="hidden sm:inline">התנתק</span>
            </Button>
          </SignOutButton>
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="ghost"
            size="sm"
            className="text-choco/60 hover:text-choco hover:bg-choco/5 active:text-choco active:bg-choco/10 text-xs font-normal"
          >
            <User className="h-3 w-3 ml-1" />
            התחבר
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};

export default AuthComponent;
