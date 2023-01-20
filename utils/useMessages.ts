import { Database } from "@/types/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import useTypedSbClient from "./useTypedSbClient";

type Message = Database["public"]["Tables"]["messages"]["Row"];

export default function useMessages() {
  const queryClient = useQueryClient();
  const supabaseClient = useTypedSbClient();

  useEffect(() => {
    const channel = supabaseClient
      .channel("messages")
      .on<Message>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
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
      const { error, data } = await supabaseClient
        .from("messages")
        .select("*, profile: profiles(username)");

      if (error) throw Error(error.message);

      return data;
    },
  });
}
