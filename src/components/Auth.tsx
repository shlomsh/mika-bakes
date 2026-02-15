import React from 'react';
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';

const AuthComponent = () => {
  return (
    <>
      <SignedIn>
        <div className="flex items-center gap-2">
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
            className="text-choco/60 hover:text-choco hover:bg-choco/5 text-xs font-normal"
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
