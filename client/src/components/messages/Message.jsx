import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  const isFromMe = message.senderId === authUser._id;
  const chatClassName = isFromMe ? "chat-end" : "chat-start";
  const profilePic = isFromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;
  const bubbleBgColor = isFromMe ? "bg-blue-500" : "";
  const shakeClass = message.shouldShake ? "shake" : "";

  const formattedTime = extractTime(message.createdAt);

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={profilePic} alt="user avatar" />
        </div>
      </div>
      {!message.message.includes("firebase") ? (
        <div
          className={`chat-bubble pb-2 text-white ${bubbleBgColor} ${shakeClass}`}
        >
          {message.message}
        </div>
      ) : (
        <div
          className={`chat-bubble pb-2 text-white ${bubbleBgColor} ${shakeClass}`}
        >
          <img src={message.message} alt="image" className="w-20 h-20" />
        </div>
      )}
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  );
};

export default Message;
