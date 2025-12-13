import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

function AuthRoute({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <SignedIn>
        <Navigate to='/home' replace />
      </SignedIn>
      <SignedOut>
        {children ? children : <Outlet />}
      </SignedOut>
    </>
  );
}

export default AuthRoute;