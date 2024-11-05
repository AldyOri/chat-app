import { Room } from "./room";

export type User = {
  id: number;
  username: string;
  email: string;
  rooms: Room[] | null;
  created_at: Date;
  updated_at: Date;
};
