import React, { useEffect, useRef, useState } from 'react';
import Logo from '../../assets/CPMS.png';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function LandingNavbar() {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [buttonSize, setButtonSize] = useState('lg');
  const [logoText, setLogoText] = useState('College Placement Management System');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 600) {
        setButtonSize('sm');
        setLogoText('CPMS');
      } else if (width <= 768) {
        setButtonSize('md');
        setLogoText('College Placement Management System');
      } else {
        setButtonSize('lg');
        setLogoText('College Placement Management System');
      }
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const staffLinks = [
    { label: 'Login as TPO', path: '/tpo/login', color: 'text-orange-600' },
    { label: 'Login as Recruiter', path: '/recruiter/login', color: 'text-indigo-600' },
  ];

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'backdrop-blur-md bg-white/60 shadow-md sticky top-0' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center py-3 px-4">
        {/* Logo Section */}
        <div
          className="flex items-center max-md:gap-2 md:gap-4 cursor-pointer transition-transform hover:scale-105 duration-150"
          onClick={() => navigate('/')}
        >
          <img
            src={Logo}
            alt="CPMS Logo"
            className="rounded-xl border border-gray-300 w-16 h-16 md:w-20 md:h-20 shadow-sm"
          />
          <h1 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            {logoText}
          </h1>
        </div>

        {/* Button Section */}
        <div className="flex max-md:gap-2 md:gap-4 items-center">
          {/* Student Login */}
          <button
            className="text-slate-600 font-medium hover:text-slate-900 transition-colors px-3 py-2 text-sm md:text-base"
            onClick={() => navigate('/student/login')}
          >
            Login
          </button>

          {/* Student Sign Up */}
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-sm hover:shadow-md px-4 py-2 rounded-lg text-sm md:text-base"
            onClick={() => navigate('/student/signup')}
          >
            Sign Up
          </button>

          {/* Staff Login Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-all shadow-sm px-4 py-2 rounded-lg text-sm md:text-base flex items-center gap-2"
              onClick={() => setDropdownOpen((prev) => !prev)}
              id="staffLoginBtn"
            >
              Staff Login
              <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                {staffLinks.map(({ label, path, color }) => (
                  <button
                    key={path}
                    className={`w-full text-left px-4 py-3 text-sm font-medium ${color} hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-none`}
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(path);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default LandingNavbar;

