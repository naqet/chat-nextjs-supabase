import useTypedSbClient from "@/utils/useTypedSbClient";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import styles from "./RoomList.module.css";

export default function RoomList() {
  const supabaseClient = useTypedSbClient();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["rooms"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { error, data } = await supabaseClient
        .from("rooms")
        .select("id, name");

      if (error) throw Error(error.message);

      return data;
    },
  });

  if (isError) return <div className={styles["info-block"]}>Error</div>;

  if (isLoading)
    return <div aria-busy="true" className={styles["info-block"]} />;

  return (
    <aside className={styles.container}>
      <nav className={styles["rooms-nav"]}>
        <ul className={styles.list}>
          {data.map((room) => (
            <li key={room.id}>
              <Link href={`/room/${room.id}`}>{room.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
