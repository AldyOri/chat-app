import { UserProvider } from "@/context/user-context";
import { Outlet } from "react-router-dom";

type RootProps = {
  className?: string;
};

function Root({ className }: RootProps) {
  return (
    <div className={className}>
      <UserProvider>
        <Outlet />
      </UserProvider>
    </div>
  );
}

export default Root;
