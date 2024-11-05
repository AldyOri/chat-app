import { useAuth } from "@/hooks/use-user";
import { Navigate, Outlet } from "react-router-dom";

function AuthRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AuthRoute;
