import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = () => {
  return (
    <div className="w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col">
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
