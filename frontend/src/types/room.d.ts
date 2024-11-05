import { User } from "./user";

export type Room = {
  id: number;
  name: string;
  created_at: Date;
  users: User[] | null;
};
