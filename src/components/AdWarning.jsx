// src/components/AdWarning.jsx
import React, { useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function AdWarning() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 text-white border-b border-yellow-600/40 backdrop-blur-md py-3 px-4 flex items-center justify-between text-sm sm:text-base z-50">
      <div className="flex items-center gap-3 mt-20">
        <FiAlertTriangle className="text-yellow-400 text-lg flex-shrink-0" />
        <p className="max-w-3xl">
          <strong className="text-yellow-400">Notice:</strong> Some video
          sources may display ads. We recommend using an{" "}
          <span className="font-semibold text-blue-400">
            ad-blocker extension
          </span>{" "}
          (like <strong>uBlock Origin</strong> or <strong>AdGuard</strong>) on
          desktop, or an{" "}
          <span className="font-semibold text-blue-400">
            ad-blocking browser
          </span>{" "}
          such as <strong>Brave</strong> or <strong>Firefox Focus</strong> on
          mobile.
        </p>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="ml-4 text-gray-400 hover:text-white transition"
        aria-label="Close"
      >
        <FiX />
      </button>
    </div>
  );
}
