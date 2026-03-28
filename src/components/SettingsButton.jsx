import React, { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';

const SettingsButton = ({ onClick, darkMode }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ top: 80, left: 20 });

  const handleClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const calculatedPosition = {
        top: rect.bottom + 8, // 8px gap below button
        left: rect.left
      };
      onClick(calculatedPosition);
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="absolute top-4 left-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm p-2.5 rounded-full z-20 hover:bg-black/70 dark:hover:bg-black/80 transition-all hover:scale-110 active:scale-95"
    >
      <Settings size={20} className={`transition-colors ${darkMode ? 'text-white' : 'text-white'}`} />
    </button>
  );
};

export default SettingsButton;
