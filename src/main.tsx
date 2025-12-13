import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";



const Clerk_Key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// Remove fallback to avoid timeouts if CDN is blocked/slow. 
// Let Clerk SDK handle loading from its default location if env var is missing.

if (!Clerk_Key) throw new Error("Clerk Key Required");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={Clerk_Key}
      signInUrl="/auth/log-in"
      signUpUrl="/auth/sign-up"
      afterSignInUrl="/home"
      afterSignUpUrl="/auth/log-in"
      afterSignOutUrl="/"
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
