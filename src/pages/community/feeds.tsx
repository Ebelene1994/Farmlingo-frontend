import useUserStore from "@/store/userStore";

const Feeds = () => {
  const user = useUserStore((state) => state.user);

  return <div>Welcome, {user?.firstName}!</div>;
};

export default Feeds;





