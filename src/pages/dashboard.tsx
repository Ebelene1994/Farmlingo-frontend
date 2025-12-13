import useUserStore from "@/store/userStore";

export default function Dashboard() {
    const user = useUserStore((state) => state.user);
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome back, {user?.firstName} {user?.lastName}!</p>
        </div>
    )
}
