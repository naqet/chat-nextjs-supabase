import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import Chat from "../Chat";
import styles from "./MainView.module.css";

export default function MainView() {
  const user = useUser();
  return (
    <main className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.profile}>{user?.user_metadata.username}</div>
        <Link href="/" role="button" className="secondary">
          Public Room
        </Link>
      </div>
      <Chat />
    </main>
  );
}
