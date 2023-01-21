import useMessages from "@/utils/useMessages";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useRef } from "react";
import styles from "./MessagesList.module.css";

export default function MessagesList() {
  const user = useUser();
  const messagesListRef = useRef<HTMLUListElement>(null);
  const { data: messages, isError, isLoading } = useMessages();

  useEffect(() => {
    // Scrolling to the bottom after new message comes
    if (messagesListRef.current)
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
  }, [messages?.length]);

  if (isError) return <div className={styles["info-block"]}>Error</div>;

  if (isLoading)
    return <div className={styles["info-block"]}>Loading messages</div>;

  if (!messages.length)
    return <div className={styles["info-block"]}>No messages</div>;

  return (
    <ul className={styles.list} ref={messagesListRef}>
      {messages.map((message) => (
        <li
          key={message.id}
          data-auth-user-message={user?.id === message.profile_id}
          className={styles.message}
        >
          {message.content}
        </li>
      ))}
    </ul>
  );
}
