import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext);

  // Fetch all users on mount or when search is cleared
  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      const usersList = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.uid !== currentUser.uid); // exclude self
      setUsers(usersList);
      setErr(false);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setErr(true);
    }
  };

  // Search specific user(s) by displayName
  const handleSearch = async () => {
    if (!username) {
      fetchUsers(); // reset to all users
      return;
    }

    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      const foundUsers = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.uid !== currentUser.uid);
      setUsers(foundUsers);
      setErr(foundUsers.length === 0);
    } catch (error) {
      console.error("Search failed:", error);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async (user) => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Failed to create/select chat:", err);
    }

    setUsername("");
    fetchUsers(); // refresh list
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Search Alex to test"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          style={{ width: "100%" }}
        />
      </div>
      {err && <span>User not found!</span>}
      {users.map((user) => (
        <div key={user.uid} className="userChat" onClick={() => handleSelect(user)}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Search;
