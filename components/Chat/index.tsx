import useTypedSbClient from "@/utils/useTypedSbClient";
import { FormEvent } from "react";
import MessagesList from "../MessagesList";
import styles from "./Chat.module.css";

export default function Chat() {
  const supabaseClient = useTypedSbClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;
      const { message } = Object.fromEntries(new FormData(form));

      if (typeof message !== "string" || !message.trim().length) return;

      form.reset();

      const { error } = await supabaseClient
        .from("messages")
        .insert({ content: message });

      if (error) throw Error(error.message);
    } catch {}
  };

  return (
    <div className={styles.chat}>
      <MessagesList />
      <form onSubmit={handleSubmit} className={styles["message-input"]}>
        <input name="message" autoComplete="off" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
