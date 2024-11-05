import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createRoom } from "@/helper/room";
import { useAuth } from "@/hooks/use-user";
import { DialogTitle } from "@radix-ui/react-dialog";

function CreateRoom() {
  const { toast } = useToast();
  const { refreshRooms } = useAuth();
  const [roomName, setRoomName] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createRoom({ name: roomName });
      toast({
        title: "Room created",
        description: "Successfully creating room",
        variant: "default",
      });
      setRoomName("");
      refreshRooms();
    } catch (error) {
      toast({
        title: "Failed to create room",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="size-7">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="flex w-full justify-center font-bold">
          Create room
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <Label className="flex flex-col gap-y-3">
            <span>Room name:</span>
            <Input
              type="text"
              value={roomName}
              required
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Button className="font-bold">Create room</Button>
          </Label>
        </form>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default CreateRoom;
