import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function NavBar({ items, className, children }) {
  const [activeTab, setActiveTab] = useState(items[0]?.name || "");
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      className={cn(
        "fixed top-4 left-[25%] z-[100] flex items-center gap-6",
        "transform-gpu", // Hardware acceleration for better performance
        className,
      )}
      style={{
        willChange: 'transform', // Optimize for animations
        backfaceVisibility: 'hidden', // Prevent flickering
        transform: 'translateZ(0)', // Force hardware acceleration
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Navigation */}
      <div className="relative flex items-center gap-2 backdrop-blur-lg py-2 px-2 rounded-full shadow-lg overflow-hidden"
           style={{
             background: 'rgba(0,0,0,0.6)',
             border: '1px solid rgba(255,255,255,0.18)'
           }}>
        {/* Background wave effect - shows on hover */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300/10 via-yellow-400/15 to-yellow-300/10 pointer-events-none"
          animate={{
            opacity: isHovering ? 1 : 0.3,
            scale: isHovering ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <div key={item.name} className="relative">
              <motion.button
                type="button"
                onClick={() => {
                  setActiveTab(item.name);
                  if (item.onClick) item.onClick();
                }}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5",
                  "text-white hover:text-yellow-300",
                  isActive && "bg-white/20 text-yellow-300",
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={14} strokeWidth={2} className="opacity-70" />
                <span className="hidden md:inline">{item.name}</span>
              </motion.button>

              {/* Individual wave effect for active item */}
              {isActive && (
                <motion.div
                  layoutId="navbar-wave"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {/* Main wave */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300/20 via-yellow-400/30 to-yellow-300/20 animate-pulse"></div>

                  {/* Wave particles */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-yellow-300 rounded-t-full shadow-lg shadow-yellow-300/50">
                    <div className="absolute w-12 h-6 bg-yellow-300/30 rounded-full blur-md -top-2 -left-2 animate-pulse"></div>
                    <div className="absolute w-8 h-6 bg-yellow-400/25 rounded-full blur-md -top-1 animate-pulse"></div>
                    <div className="absolute w-4 h-4 bg-yellow-300/40 rounded-full blur-sm top-0 left-2 animate-pulse"></div>
                  </div>

                  {/* Side waves */}
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-yellow-300/20 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-yellow-300/20 rounded-full blur-sm animate-pulse"></div>

                  {/* Bottom glow */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-yellow-300/15 rounded-b-full blur-sm"></div>
                </motion.div>
              )}
            </div>
          );
        })}

        {/* Ambient lighting that responds to hover */}
        <motion.div
          className="absolute inset-0 rounded-full bg-yellow-300/5 pointer-events-none"
          animate={{
            opacity: isHovering ? 0.8 : 0.3,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Additional children (like notifications) */}
      {children}
    </motion.div>
  );
}
