// Input.js
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import AutoResizingTextarea from "./input/AutoResizingTextarea";
import AttachmentButtons from "./input/AttachmentButtons";
import ImagePreview from "./input/ImagePreview";
import FullSizePreview from "./input/FullSizePreview";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showFullSizePreview, setShowFullSizePreview] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleImageSelect = (file) => {
    if (file) {
      setImg(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const removePreview = () => {
    setImg(null);
    setPreviewURL(null);
  };

  const handleSend = async () => {
    // Prevent sending empty messages
    if (!text.trim() && !img) return;

    setUploading(true);

    try {
      if (img) {
        // If there's an image to upload
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Upload error:", error);
            setUploading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Update chat document with image
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });

            // Update last messages for both users
            const lastMessage = text || "📷 Photo";
            await updateDoc(doc(db, "userChats", currentUser.uid), {
              [data.chatId + ".lastMessage"]: { text: lastMessage },
              [data.chatId + ".date"]: serverTimestamp(),
            });
            await updateDoc(doc(db, "userChats", data.user.uid), {
              [data.chatId + ".lastMessage"]: { text: lastMessage },
              [data.chatId + ".date"]: serverTimestamp(),
            });

            // Reset states
            setUploading(false);
            setText("");
            removePreview();
          }
        );
      } else {
        // Text-only message
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]: { text },
          [data.chatId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]: { text },
          [data.chatId + ".date"]: serverTimestamp(),
        });

       // Make sure we turn off uploading for text-only
       setUploading(false);

        // Reset text/preview
        setText("");
        setPreviewURL(null);
      }
    } catch (error) {
      console.error("Sending message error:", error);
      setUploading(false);
    }
  };

  return (
    <div className="flex items-end px-4 py-3 border-t bg-white">
      {/* Main input area */}
      <div className="flex w-full border rounded-xl overflow-hidden max-h-[40vh]">
        {/* Left: text area and any image preview */}
        <div className="px-3 py-2 flex flex-wrap items-start gap-3 w-full overflow-auto">
          <AutoResizingTextarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
          />

          {previewURL && (
            <ImagePreview
              previewURL={previewURL}
              removePreview={removePreview}
              onZoom={() => setShowFullSizePreview(true)}
            />
          )}
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-300 my-1" />

        {/* Right: attach / upload buttons or spinner */}
        <div className="flex items-end gap-3 px-3 py-2">
          <AttachmentButtons
            uploading={uploading}
            onImageSelect={handleImageSelect}
          />
        </div>
      </div>

      {/* Send button */}
      <button
        onClick={handleSend}
        className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition self-end"
        disabled={uploading}
      >
        Send
      </button>

      {/* Full-size preview overlay */}
      <FullSizePreview
        show={showFullSizePreview}
        previewURL={previewURL}
        onClose={() => setShowFullSizePreview(false)}
      />
    </div>
  );
};

export default Input;
