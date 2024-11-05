import { UserContext } from "@/context/user-context";
import { useContext } from "react";

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
