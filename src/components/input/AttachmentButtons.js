// AttachmentButtons.js
import React from "react";
import Attach from "../../img/attach.png";
import Img from "../../img/img.png";

export default function AttachmentButtons({ onImageSelect, uploading }) {
  if (uploading) {
    // Simple spinner
    return (
      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    );
  }

  return (
    <>
      <label htmlFor="file" className="cursor-pointer">
        <img src={Attach} alt="Attach" className="w-5 h-5" />
      </label>
      <input
        type="file"
        id="file"
        style={{ display: "none" }}
        onChange={(e) => onImageSelect(e.target.files[0])}
      />

      <label htmlFor="imgFile" className="cursor-pointer">
        <img src={Img} alt="Upload" className="w-5 h-5" />
      </label>
      <input
        type="file"
        id="imgFile"
        style={{ display: "none" }}
        onChange={(e) => onImageSelect(e.target.files[0])}
      />
    </>
  );
}
