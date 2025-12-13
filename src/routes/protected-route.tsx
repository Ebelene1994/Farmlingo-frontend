import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { Outlet } from 'react-router-dom';

function ProtectedRoutes({ children }: { children?: React.ReactNode }) {
  const { isLoaded } = useUser();

  // Only wait for Clerk authentication to load
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  // Allow immediate access to protected pages once Clerk confirms authentication
  // Backend sync happens in background and doesn't block page rendering
  return (
    <>
      <SignedIn>
        {children ? children : <Outlet />}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default ProtectedRoutes;
