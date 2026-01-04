import React from "react";

function Navbar({ sidebarOpen }) {
  return (
    <nav
      className="bg-stone-100 shadow-md border-b border-gray-400 fixed top-0 left-0 z-10 transition-all duration-300 flex justify-end items-center h-16 px-4"
      style={{
        width: sidebarOpen ? "calc(100% - 16rem)" : "calc(100% - 4rem)",
        left: sidebarOpen ? "16rem" : "4rem",
      }}
    >
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-semibold">Profil</span>
        <img src="profil.jpg" alt="Compte" className="w-11 h-11 rounded-full" />
      </div>
    </nav>
  );
}

export default Navbar;
