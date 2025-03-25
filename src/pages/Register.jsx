import React, { useState } from "react";
import DefaultAvatar from "../img/avatar.png"; // Local image used as default
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const defaultAvatarURL = DefaultAvatar; // fallback avatar for all users

      await updateProfile(res.user, {
        displayName,
        photoURL: defaultAvatarURL,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL: defaultAvatarURL,
      });

      await setDoc(doc(db, "userChats", res.user.uid), {});
      navigate("/");
    } catch (err) {
      console.error(err);
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Alex's Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <div className="avatarPreview">
          </div>
          <button disabled={loading}>Sign up</button>
          {loading && "Creating your account..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Account already exists? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
