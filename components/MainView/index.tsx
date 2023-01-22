import useTypedSbClient from "@/utils/useTypedSbClient";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useRef } from "react";
import Chat from "../Chat";
import RoomList from "../RoomList";
import styles from "./MainView.module.css";

export default function MainView() {
  const router = useRouter();
  const user = useUser();
  const menuRef = useRef<HTMLDivElement>(null);
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

  const handleToggleMenu = () => {
    if (!menuRef.current) return;

    menuRef.current.style.display =
      menuRef.current.style.display === "grid" ? "none" : "grid";
  };

  return (
    <main className={styles.container}>
      <button className={styles.toggle} onClick={handleToggleMenu}>
        Toggle menu
      </button>
      <div className={styles.sidebar} ref={menuRef}>
        <small>Username: {user?.user_metadata.username}</small>
        <Link href="/" role="button" className="secondary">
          Public Room
        </Link>
        <RoomList />
        <form className={styles["new-room"]} onSubmit={handleCreateNewRoom}>
          <input placeholder="New room name" name="name" autoComplete="off" />
          <button>+</button>
        </form>
        <button
          className={`secondary outline ${styles.logout}`}
          onClick={handleSignOut}
          type="button"
        >
          <small>Log out</small>
        </button>
      </div>
      <Chat />
    </main>
  );
}
