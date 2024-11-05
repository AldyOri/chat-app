import { UserProvider } from "@/context/auth-context";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

type RootProps = {
  className?: string;
};

function Root({ className }: RootProps) {
  return (
    <div className={className}>
      <UserProvider>
        <Outlet />
        <Toaster />
      </UserProvider>
    </div>
  );
}

export default Root;
