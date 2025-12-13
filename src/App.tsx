import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'sonner';
import { useEffect, Suspense, lazy } from "react";
import VirtualFarm from "./pages/virtual-farm";
import ProtectedRoutes from "./routes/protected-route";
import AppLayout from "./layouts/app-layout";
import Home from "./pages/home";

const LogIn = lazy(() => import("./pages/auth/log-in"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const CoursesPages = lazy(() => import("./pages/learn/courses"));
const QuizPages = lazy(() => import("./pages/learn/quiz"));
const MaterialsPages = lazy(() => import("./pages/learn/learning-materials"));
const Feeds = lazy(() => import("./pages/community/feeds"));
const Chatrooms = lazy(() => import("./pages/community/chatrooms"));
const SignUp = lazy(() => import("./pages/auth/sign-up"));
const AuthRoute = lazy(() => import("./routes/auth-route"));
const AuthLayout = lazy(() => import("./layouts/auth-layout"));
const ForgotPassword = lazy(() => import("./pages/auth/forgot-password"));
const ChatsPage = lazy(() => import("./pages/community/chats"));
const CourseDetailsPage = lazy(() => import("./pages/learn/course-details"));
const CourseLessonsPage = lazy(() => import("./pages/learn/course-lesson"));
import { useUser, useAuth } from "@clerk/clerk-react";
import useUserStore from "@/store/userStore";
import { configureApiClient } from "@/lib/api-client";

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { setAuth, syncUser, logoutUser } = useUserStore();

  // Configure API client with getToken once on mount/change
  useEffect(() => {
    configureApiClient(getToken);
  }, [getToken]);

  useEffect(() => {
    if (isLoaded) {
      // Update auth state in store
      setAuth(!!isSignedIn, isLoaded);

      if (isSignedIn && user) {
        // Fire sync in background without blocking navigation
        syncUser(user).catch((error) => {
          console.error('Background sync failed:', error);
          // Error is already handled in userStore with toast notifications
        });
      } else {
        logoutUser();
      }
    }
  }, [isLoaded, isSignedIn, user, setAuth, syncUser, logoutUser]);

  // Only gate on initial Clerk load; allow ProtectedRoutes to handle sync-specific gating
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <AuthLayout />
              </AuthRoute>
            }
          >
            <Route index element={<Navigate to="log-in" replace />} />
            <Route path="log-in" element={<LogIn />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoutes>
                <AppLayout />
              </ProtectedRoutes>
            }
          >
            <Route path='/home' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path="/virtual-farm" element={<VirtualFarm />} />

            <Route path="/learn">
              <Route index element={<Navigate to="courses" replace />} />
              <Route path="courses" element={<CoursesPages />} />
              <Route path="courses/:id" element={<CourseDetailsPage />} />
              <Route path="courses/:id/lessons" element={<CourseLessonsPage />} />
              <Route path="quiz" element={<QuizPages />} />
              <Route path="materials" element={<MaterialsPages />} />
            </Route>

            <Route path="/community">
              <Route index element={<Navigate to="feeds" replace />} />
              <Route path="feeds" element={<Feeds />} />
              <Route path="chatrooms" element={<Chatrooms />} />

              <Route path="chats" element={<ChatsPage />} />
              <Route path="chats/:userId" element={<ChatsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/virtual-farm" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
