// useAutoSizeTextArea.js
import { useCallback } from "react";

export const useAutoSizeTextArea = (textAreaRef, value, minHeight = 24) => {
  return useCallback(() => {
    if (!textAreaRef.current) return;

    // Reset the height to auto so we can correctly read its scrollHeight
    textAreaRef.current.style.height = "auto";

    // If the user hasn't typed anything, enforce a minimal height
    if (!value.trim()) {
      textAreaRef.current.style.height = `${minHeight}px`;
    } else {
      // Otherwise, size it to fit the text
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [textAreaRef, value, minHeight]);
};
