import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

const Home = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-6xl h-[90vh] shadow-lg rounded-lg overflow-hidden bg-white">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Home;
