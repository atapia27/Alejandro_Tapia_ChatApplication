import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isOwner = message.senderId === currentUser.uid;

  return (
    <div
      ref={ref}
      className={`flex gap-4 mb-4 ${isOwner ? "flex-row-reverse" : ""}`}
    >
      <div className="flex flex-col items-center">
        <img
          src={isOwner ? currentUser.photoURL : data.user.photoURL}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-xs text-gray-400 mt-1">just now</span>
      </div>

      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isOwner
            ? "bg-blue-500 text-white"
            : "bg-white text-gray-900"
        }`}
      >
        {message.text && <p>{message.text}</p>}
        {message.img && (
          <img
            src={message.img}
            alt=""
            className="mt-2 max-w-full rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default Message;
