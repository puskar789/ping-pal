import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sound/notification.mp3";
import { useAuthContext } from "../context/AuthContext";
import useGetConversations from "./useGetConversations";

const useListenMessagse = () => {
  const { socket } = useSocketContext();
  const { selectedConversation, messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      if (newMessage.senderId === selectedConversation._id) {
        newMessage.shouldShake = true;
        const sound = new Audio(notificationSound);
        sound.play();
        setMessages([...messages, newMessage]);
      }
    });

    // to prevent the notification sound from playing on multiple times
    return () => socket?.off("newMessage");
  }, [messages, setMessages, socket]);
};

export default useListenMessagse;
