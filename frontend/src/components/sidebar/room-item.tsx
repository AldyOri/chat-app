import { Room } from "@/types/room";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-user";
import { joinRoom, leaveRoom } from "@/helper/room";

function RoomItem({ id, name, created_at, users }: Room) {
  const { setActiveRoom, refreshRooms, refreshAuth } = useAuth();

  const createdAtDate = new Date(created_at);

  const handleJoin = async () => {
    await joinRoom({ id: id });
    await refreshAuth();
    await refreshRooms();
    window.location.reload()
  };

  const handleLeave = async () => {
    await leaveRoom({ id: id });
    await refreshAuth();
    await refreshRooms();
    window.location.reload()
  };

  return (
    <a
      onClick={() =>
        setActiveRoom({
          id: id,
          name: name,
          created_at: created_at,
          users: users,
        })
      }
      key={id}
      className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <div className="flex w-full items-center gap-2">
        <span>{name}</span>{" "}
        <span className="ml-auto text-xs">
          {createdAtDate.toLocaleDateString([], {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
      <span className="font-medium">
        {users !== null ? "This is your room" : "This is a public room"}
      </span>
      <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
        {users !== null ? "Connect to room" : "Connect to public room"}
      </span>
      <div className="flex w-full justify-end">
        {users !== null ? (
          <Button
            onClick={handleLeave}
            className="z-10 w-14"
            size={"sm"}
            variant={"outline"}
          >
            leave
          </Button>
        ) : (
          <Button onClick={handleJoin} className="z-10 w-14" size={"sm"}>
            join
          </Button>
        )}
      </div>
    </a>
  );
}

export default RoomItem;
