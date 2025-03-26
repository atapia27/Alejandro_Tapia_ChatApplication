import React, { useContext } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="w-2/3 flex flex-col">
      {/* Aligned Header */}
      <div className="flex items-center justify-between p-4 bg-blue-500 text-white h-16">
        <span className="font-semibold text-lg">
          {data.user?.displayName || "No Chat Selected"}
        </span>

        <div className="flex gap-4">
          <img src={Cam} alt="Video" className="w-5 cursor-pointer" />
          <img src={Add} alt="Add" className="w-5 cursor-pointer" />
          <img src={More} alt="More" className="w-5 cursor-pointer" />
        </div>
      </div>

      {/* Optional: Move "Try saying hi!" to below header if needed */}
      {data.user?.uid && (
        <div className="px-4 py-1 text-xs text-gray-500 italic bg-blue-50 border-b border-blue-200">
          Try saying hi!
        </div>
      )}

      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
