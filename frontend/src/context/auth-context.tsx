import { me } from "@/helper/auth";
import { getRooms } from "@/helper/room";
import { Room } from "@/types/room";
import { User } from "@/types/user";
import { createContext, ReactNode, useState, useEffect } from "react";

interface AuthContext {
  user: User | null;
  refreshAuth: () => Promise<void>;
  isAuthenticated: boolean;
  rooms: Room[] | null;
  refreshRooms: () => Promise<void>;
}

export const AuthContext = createContext<AuthContext | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[] | null>(null);
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

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data.data);
    } catch (error) {
      setRooms(null);
      throw new Error(`message: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRooms = async () => {
    setIsLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
    fetchRooms();
  }, []);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, refreshAuth, isAuthenticated, rooms, refreshRooms }}
    >
      {children}
    </AuthContext.Provider>
  );
}
