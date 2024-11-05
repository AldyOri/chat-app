import { me } from "@/helper/auth";
import { User } from "@/types/user";
import { createContext, ReactNode, useState, useEffect } from "react";

interface UserContextType {
  user: User | null;
  // setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshAuth: () => Promise<void>;
  isAuthenticated: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await me();
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw new Error(`message: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    setIsLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <UserContext.Provider value={{ user, refreshAuth, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}
