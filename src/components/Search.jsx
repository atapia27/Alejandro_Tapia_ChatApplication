import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [allUsers, setAllUsers] = useState([]); // store all fetched users
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs
          .map((doc) => doc.data())
          .filter((user) => user.uid !== currentUser.uid);

        setAllUsers(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchAllUsers();
  }, [currentUser]);

  useEffect(() => {
    const term = username.trim().toLowerCase();

    if (!term) {
      setFilteredUsers([]);
      setErr(false);
      return;
    }

    const matched = allUsers.filter((user) =>
      user.displayName.toLowerCase().includes(term),
    );

    setFilteredUsers(matched);
    setErr(matched.length === 0);
  }, [username, allUsers]);

  const handleSelect = async (user) => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        const currentUserData = {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        const otherUserData = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        };

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [`${combinedId}.userInfo`]: currentUserData,
          [`${combinedId}.date`]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [`${combinedId}.userInfo`]: otherUserData,
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }

      dispatch({ type: "CHANGE_USER", payload: user });
    } catch (err) {
      console.error("Failed to create/select chat:", err);
    }

    setUsername("");
    setFilteredUsers([]);
    setErr(false);
  };

  return (
    <div className="px-4 py-2 border-b-2 ">
      <input
        type="text"
        placeholder="Search users..."
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {err && <p className="text-sm text-red-500 mt-2">User not found</p>}

      <div className="mt-4 max-h-64 overflow-y-auto pr-1 space-y-2">
        {username.trim() ? (
          filteredUsers.map((user) => (
            <div
              key={user.uid}
              className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded"
              onClick={() => handleSelect(user)}
            >
              <img
                src={user.photoURL}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{user.displayName}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">
            Searched users will appear here
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;
