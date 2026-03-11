import React, { useState } from "react";

const ZALO_PHONE = "0767925665";

const ZaloChat = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`https://zalo.me/${ZALO_PHONE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat Zalo"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
    >
      {/* Tooltip */}
      <span
        className={`bg-white text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full shadow-md border border-gray-100 whitespace-nowrap transition-all duration-200 ${
          hovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        Chat Zalo ngay!
      </span>

      {/* Button */}
      <div className="relative w-14 h-14 flex items-center justify-center rounded-full shadow-lg bg-[#0068FF] hover:bg-[#005fe0] transition-colors duration-200">
        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-full bg-[#0068FF] opacity-40 animate-ping" />
        {/* Zalo official logo SVG */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/960px-Icon_of_Zalo.svg.png"
          alt=""
        />
      </div>
    </a>
  );
};

export default ZaloChat;
