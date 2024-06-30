import React from "react";
import Conversation from "./Conversation";
import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import useListenConversations from "../../hooks/useListenConversations";
import useConversation from "../../zustand/useConversation";

const Conversations = () => {
  const { loading } = useGetConversations();
  const { conversations } = useConversation();
  // console.log(conversations);
  useListenConversations();
  // console.log("Conversations", conversations);

  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations.map((conversation, idx) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={idx === conversations.length - 1}
        />
      ))}
      {loading ? <span className="loading loading-spinner"></span> : null}
    </div>
  );
};

export default Conversations;
