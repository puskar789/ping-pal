import React, { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useGetConversations from "./useGetConversations";
import useConversation from "../zustand/useConversation";

const useListenConversations = () => {
  const { socket } = useSocketContext();
  // const { conversations, setConversations } = useGetConversations();
  const { conversations, setConversations } = useConversation();
  // console.log(conversations);

  useEffect(() => {
    console.log("useListenConversations");
    socket?.on("newUserSign", (newUser) => {
      setConversations([...conversations, newUser]);
    });

    return () => socket?.off("newUser");
  }, [conversations, setConversations, socket]);
};

export default useListenConversations;
