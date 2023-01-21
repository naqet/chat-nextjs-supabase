import { Database } from "@/types/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useTypedSbClient from "./useTypedSbClient";

type Message = Database["public"]["Tables"]["messages"]["Row"];

export default function useMessages() {
  const router = useRouter();
  const { roomId } = router.query;
  const queryClient = useQueryClient();
  const supabaseClient = useTypedSbClient();

  useEffect(() => {
    const channel = supabaseClient
      .channel("messages")
      .on<Message>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        ({ new: newMessage }) => {
          queryClient.setQueryData<Message[]>(["messages"], (oldData) => {
            if (typeof oldData === "undefined") return [newMessage];

            return [...oldData, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  return useQuery({
    queryKey: ["messages"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const query = supabaseClient
        .from("messages")
        .select("*, profile: profiles(username)");
      const { error, data } = roomId
        ? await query.match({ room_id: roomId })
        : await query;

      if (error) throw Error(error.message);

      return data;
    },
  });
}
