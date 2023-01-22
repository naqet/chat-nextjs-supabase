import { Database } from "@/types/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useTypedSbClient from "./useTypedSbClient";

type Message = Database["public"]["Tables"]["messages"]["Row"] & {
  profiles: { username: string };
};

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
          ...(roomId && { filter: `room_id=eq.${roomId}` }),
        },
        ({ new: newMessage }) => {
          queryClient.setQueryData<Message[]>(
            ["messages", roomId],
            (oldData) => {
              // TODO: Add profiles cache and nickname fetching on receive channel update
              if (typeof oldData === "undefined") return [newMessage];

              return [...oldData, newMessage];
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [roomId]);

  return useQuery({
    queryKey: ["messages", roomId],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const query = supabaseClient
        .from("messages")
        .select("*, profile: profiles(username)");
      const { error, data } =
        typeof roomId === "string"
          ? await query.match({ room_id: roomId })
          : await query.filter("room_id", "is", null);

      if (error) throw Error(error.message);

      return data;
    },
  });
}
