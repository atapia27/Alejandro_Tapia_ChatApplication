// ImagePreview.js
import React from "react";

export default function ImagePreview({ previewURL, removePreview, onZoom }) {
  return (
    <div className="relative inline-block group max-h-40">
      {/* The previewed image */}
      <img
        src={previewURL}
        alt="preview"
        className="max-h-40 rounded object-cover border w-auto h-auto"
      />

      {/* Dim overlay on hover */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-25 transition-opacity pointer-events-none" />

      {/* Full preview trigger */}
      <button
        type="button"
        onClick={onZoom}
        title="Preview Image"
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
      >
        <span className="text-white text-4xl opacity-50">🔍</span>
      </button>

      {/* Remove preview (X) button */}
      <button
        type="button"
        onClick={removePreview}
        className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center z-20"
        title="Remove Image"
      >
        ✕
      </button>
    </div>
  );
}
