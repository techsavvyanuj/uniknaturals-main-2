"use client";

import { useState, useEffect } from 'react';

// Announcement messages (similar to ABSO Essentials)
const announcements = [
  "💥10% discount for first order -CODE 'NEW10'💥",
  "🎊extra 5% off on all prepaid orders🎊",
  "🛒Free shipping on orders over ₹349🛒",
  "🥳 Buy 2 Get 3rd Free! 🥳"
];

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-sage text-white py-2 text-center overflow-hidden fixed top-0 left-0 right-0 z-50">
      <div className="marquee">
        <div className="marquee-content">
          {announcements.map((message, index) => (
            <span key={index} className="px-7 font-medium text-sm">
              {message}
              {index < announcements.length - 1 && <span className="mx-12"></span>}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        
        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 15s linear infinite;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
} 