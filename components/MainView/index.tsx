import useTypedSbClient from "@/utils/useTypedSbClient";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import Chat from "../Chat";
import RoomList from "../RoomList";
import styles from "./MainView.module.css";

export default function MainView() {
  const router = useRouter();
  const user = useUser();
  const supabaseClient = useTypedSbClient();

  const handleCreateNewRoom = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const { name } = Object.fromEntries(new FormData(e.currentTarget));

      if (typeof name !== "string") return;

      const { data: createdRoom, error } = await supabaseClient
        .rpc("create_room", { name })
        .select("id")
        .single();

      if (error) throw Error(error.message);

      router.push(`room/${createdRoom.id}`);
    } catch {}
  };

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    router.push("/login");
  };
  return (
    <main className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.profile}>
          <small>{user?.user_metadata.username}</small>
          <button
            className="secondary outline"
            onClick={handleSignOut}
            type="button"
          >
            <small>Log out</small>
          </button>
        </div>
        <Link href="/" role="button" className="secondary">
          Public Room
        </Link>
        <RoomList />
        <form className={styles["new-room"]} onSubmit={handleCreateNewRoom}>
          <input placeholder="New room name" name="name" autoComplete="off" />
          <button>+</button>
        </form>
      </div>
      <Chat />
    </main>
  );
}
