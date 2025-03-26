// FullSizePreview.js
import React, { useEffect } from "react";

export default function FullSizePreview({ previewURL, show, onClose }) {
  // Close when pressing ESC
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!show || !previewURL) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl overflow-hidden shadow-lg p-2"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
      >
        <img
          src={previewURL}
          alt="Magnified preview"
          className="rounded-xl max-w-[60vw] max-h-[60vh] object-contain"
        />
      </div>
    </div>
  );
}
