import React from "react";

export default function Footer() {
  return (
    <footer className="bg-blue-200 text-black text-center py-4 ">
      <p>© 2025 Ride Booking. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a href="#" className="text-yellow-400 hover:underline">
          About
        </a>
        <a href="#" className="text-yellow-400 hover:underline">
          Contact
        </a>
        <a href="#" className="text-yellow-400 hover:underline">
          Help
        </a>
      </div>
    </footer>
  );
}
