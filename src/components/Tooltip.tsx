import { useRef, useState } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";

export const FloatingCreateButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className="fixed bottom-4 lg:right-40 right-4 z-50">
      {/* Tooltip */}
      <div
        className={`
          absolute bottom-full mb-4 left-1/2 -translate-x-1/2
          transition-all duration-300 ease-out
          ${showTooltip ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"}
        `}
      >
        <div className="relative bg-[#1E293B] text-white text-sm px-4 py-2 rounded-xl shadow-xl border border-white/10 whitespace-nowrap animate-bounce">
          Create Post
          {/* Arrow */}
          <div
            className="absolute left-1/2 -bottom-2 -translate-x-1/2 
                          w-4 h-4 bg-[#1E293B] 
                          border-r border-b border-white/10 
                          rotate-45"
          />
        </div>
      </div>

      {/* Button */}
      <Link
        to="/create"
        aria-label="Create Post"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip((prev) => !prev)}
        className="flex justify-center items-center
                   p-4
                   bg-gradient-to-r from-purple-600 to-blue-500
                   text-3xl rounded-full
                   shadow-lg shadow-purple-500/30
                   hover:scale-110 active:scale-95
                   transition-transform duration-200"
      >
        <Plus />
      </Link>
    </div>
  );
};
