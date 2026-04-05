// Navbar.jsx
import React from 'react';
import { FaBars } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

function Navbar({ isSidebarVisible, toggleSidebar }) {
  const location = useLocation();

  // Page name extraction and formatting
  let pageName = location.pathname.split('/').filter(Boolean).pop();
  if (pageName === 'dashboard') pageName = "home";
  if (pageName === 'tpo') pageName = "TPO";
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <div className={`h-16 sticky top-0 z-10 backdrop-blur-md bg-white/70 flex justify-start items-center border-b border-gray-100/50 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] text-slate-600 transition-all duration-300 ${isSidebarVisible ? 'ml-60 px-4' : 'ml-0'}`}>
      <button className="ml-4" onClick={toggleSidebar}>
        <FaBars size={24} />
      </button>
      <span className="ml-8 text-xl font-semibold tracking-tight text-slate-800">
        {pageName}
      </span>
    </div>
  );
}

export default Navbar;
