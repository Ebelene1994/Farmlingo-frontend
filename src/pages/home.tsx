import { Link } from "react-router-dom";
import useUserStore from "@/store/userStore";

export default function Home() {
  const user = useUserStore((s) => s.user);
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome{user?.firstName ? `, ${user.firstName}` : ""} 👋</h1>
        <p className="text-muted-foreground">
          You’re signed in. Choose where to go next.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/virtual-farm"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Go to VR Farm
          </Link>
          <Link
            to="/learn/courses"
            className="px-4 py-2 rounded border hover:bg-muted"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
