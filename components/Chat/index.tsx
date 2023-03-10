import useTypedSbClient from "@/utils/useTypedSbClient";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import AddRoomParticipant from "../AddRoomParticipant";
import MessagesList from "../MessagesList";
import styles from "./Chat.module.css";

export default function Chat() {
  const router = useRouter();
  const { roomId } = router.query;
  const supabaseClient = useTypedSbClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;
      const { message } = Object.fromEntries(new FormData(form));

      if (typeof message !== "string" || !message.trim().length) return;

      form.reset();

      const { error } = await supabaseClient.from("messages").insert({
        content: message,
        room_id: typeof roomId === "string" ? roomId : null,
      });

      if (error) throw Error(error.message);
    } catch {}
  };

  return (
    <div className={styles.chat}>
      {roomId && <AddRoomParticipant />}
      <MessagesList />
      <form onSubmit={handleSubmit} className={styles["message-input"]}>
        <input name="message" autoComplete="off" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
