import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [allUsers, setAllUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext); // get current chat user

  useEffect(() => {
    const fetchUsers = async () => {
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

    if (currentUser?.uid) {
      fetchUsers();
    }
  }, [currentUser?.uid]);

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
      console.error("Failed to handle user select:", err);
    }
  };

  return (
    <div className="overflow-y-auto px-4 py-2">
      {allUsers.map((user) => {
        const isActive = data?.user?.uid === user.uid;

        return (
          <div
            key={user.uid}
            onClick={() => handleSelect(user)}
            className={`flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-gray-100 
              ${isActive ? "border-2 border-blue-500 bg-blue-50" : ""}`}
          >
            <img
              src={user.photoURL}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <span className="font-medium">{user.displayName}</span>
              {/* Optionally: <p className="text-sm text-gray-500">...</p> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chats;
