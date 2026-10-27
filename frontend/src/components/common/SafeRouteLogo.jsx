import React from "react";

export function SafeRouteIcon({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="shieldGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="routeGrad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Shield Backing */}
      <path
        d="M24 4L7 11V23.5C7 34.2 14.3 43.1 24 45C33.7 43.1 41 34.2 41 23.5V11L24 4Z"
        fill="url(#shieldGrad)"
        fillOpacity="0.15"
        stroke="url(#shieldGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Accent Shield */}
      <path
        d="M24 8.5L11.5 13.8V23C11.5 31.4 16.8 38.3 24 40.5C31.2 38.3 36.5 31.4 36.5 23V13.8L24 8.5Z"
        fill="url(#shieldGrad)"
        fillOpacity="0.25"
      />

      {/* AI Safe Route Navigation Path */}
      <path
        d="M17 31C18.5 25.5 22 24.5 24 20C25.5 16.5 27.5 15 31 14"
        stroke="url(#routeGrad)"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeDasharray="1 0"
        filter="url(#glow)"
      />

      {/* Route Waypoint Nodes */}
      <circle cx="17" cy="31" r="3" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="24" cy="20" r="2.5" fill="#60a5fa" stroke="#ffffff" strokeWidth="1.2" />
      <circle cx="31" cy="14" r="3.2" fill="#22d3ee" stroke="#ffffff" strokeWidth="1.5" />

      {/* Radar pulse ring at destination */}
      <circle cx="31" cy="14" r="5.5" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2 2" />
    </svg>
  );
}

export default function SafeRouteLogo({
  size = "md",
  showText = true,
  className = "",
  onClick,
}) {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 52,
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const currentIconSize = iconSizes[size] || 32;
  const currentTextSize = textSizes[size] || "text-xl";

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none transition-transform duration-200 active:scale-95 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div className="relative flex items-center justify-center p-1 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-sm backdrop-blur-md">
        <SafeRouteIcon size={currentIconSize} />
      </div>

      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight text-white ${currentTextSize}`}>
            SafeRoute
          </span>
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-black text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded-md shadow-sm border border-cyan-400/30">
            AI
          </span>
        </div>
      )}
    </div>
  );
}
