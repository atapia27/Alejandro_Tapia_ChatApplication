import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
      <span className="font-bold">Chat Users</span>
      <div className="flex items-center gap-2">
        <img
          src={currentUser.photoURL}
          alt=""
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="hidden sm:inline">{currentUser.displayName}</span>
        <button
          onClick={() => signOut(auth)}
          className="text-sm bg-white text-blue-600 px-2 py-1 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
