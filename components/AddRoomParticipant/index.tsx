import useTypedSbClient from "@/utils/useTypedSbClient";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import styles from "./AddRoomParticipant.module.css";

export default function AddRoomParticipant() {
  const router = useRouter();
  const { roomId } = router.query;
  const supabaseClient = useTypedSbClient();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const form = e.currentTarget;
      const { username } = Object.fromEntries(new FormData(form));

      if (typeof roomId !== "string" || typeof username !== "string")
        throw Error("Form error");

      const { data, error } = await supabaseClient
        .from("profiles")
        .select("id")
        .match({ username })
        .limit(1)
        .single();

      if (error) throw Error("Error while fetching user ID");

      await supabaseClient
        .from("room_participants")
        .insert({ room_id: roomId, profile_id: data.id });
      form.reset();
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input name="username" placeholder="Add user to room" />
      <button type="submit" aria-busy={loading}>
        {!loading && "+"}
      </button>
    </form>
  );
}
