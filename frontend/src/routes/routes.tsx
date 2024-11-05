import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";
import Root from "./root";
import AuthRoute from "./auth-route";
import ProtectedRoute from "./protected-route";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Chat from "@/pages/chat";
import Testing from "@/pages/testing";

const RouterComponent = () => {
  const routes: RouteObject[] = [
    {
      element: <Root className="" />,
      children: [
        {
          element: <AuthRoute />,
          children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
          ],
        },
        {
          element: <ProtectedRoute />,
          children: [
            { path: "/", element: <Chat /> },
            { path: "/testing", element: <Testing /> },
          ],
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};

export default RouterComponent;
