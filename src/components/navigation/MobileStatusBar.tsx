import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export const MobileStatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hidden sm:flex shrink-0 w-full h-8 px-6 items-center justify-between text-[#242923] bg-[#F7F5EF] text-[11px] font-semibold select-none z-50 pt-1"
      aria-hidden="true"
    >
      {/* Left: Time */}
      <span className="font-mono tracking-tight text-xs">{timeStr}</span>

      {/* Center: Dynamic Island Pill */}
      <div className="w-24 h-4.5 bg-[#121613] rounded-full flex items-center justify-between px-2.5 shadow-xs">
        <div className="w-2 h-2 rounded-full bg-[#1e2520] border border-[#2b352e]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#174B3A]/80 animate-pulse" />
      </div>

      {/* Right: Signal, Wi-Fi, Battery */}
      <div className="flex items-center gap-1.5 text-[#242923]">
        <Signal className="w-3.5 h-3.5 stroke-[2.2]" />
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        <div className="flex items-center gap-0.5">
          <Battery className="w-4 h-4 stroke-[2.2]" />
        </div>
      </div>
    </div>
  );
};
