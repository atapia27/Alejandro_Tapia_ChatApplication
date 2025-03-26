// AutoResizingTextarea.js
import React, { useRef, useEffect } from "react";
import { useAutoSizeTextArea } from "./useAutoSizeTextArea";

export default function AutoResizingTextarea({
  value,
  onChange,
  placeholder,
  minHeight = 24,
}) {
  const textAreaRef = useRef(null);
  const autoSizeTextArea = useAutoSizeTextArea(textAreaRef, value, minHeight);

  useEffect(() => {
    autoSizeTextArea();
  }, [value, autoSizeTextArea]);

  return (
    <textarea
      ref={textAreaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="resize-none overflow-hidden w-full focus:outline-none bg-white"
      style={{ minHeight: `${minHeight}px` }}
    />
  );
}
