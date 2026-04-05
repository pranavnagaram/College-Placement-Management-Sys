import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import axios from 'axios';
import Logo from '../assets/CPMS.png';
import SubMenu from './Submenu';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Sidebar = ({ isSidebarVisible }) => {
  const [sidebar, setSidebar] = useState(isSidebarVisible);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebar(isSidebarVisible);
  }, [isSidebarVisible]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (loadData.role === 'student') navigate('../student/login');
    else if (loadData.role === 'tpo_admin') navigate('../tpo/login');
    else if (loadData.role === 'management_admin') navigate('../management/login');
    else if (loadData.role === 'superuser') navigate('../admin');
    else if (loadData.role === 'recruiter') navigate('../recruiter/login');
  };

  const [loadData, setLoadData] = useState({
    name: 'Not Found',
    email: 'Not Found',
    profile: 'Profile Img',
    role: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setLoadData({
          name: [res.data?.first_name, res.data?.middle_name, res.data?.last_name]
            .filter(Boolean)
            .join(' '),
          email: res.data.email,
          profile: res.data.profile,
          role: res.data.role,
        });
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          const dataToPass = {
            showToastPass: true,
            toastMessagePass: err.response.data.msg,
          };
          navigate('../', { state: dataToPass });
        }
      });
  }, [navigate]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [SidebarData, setSidebarData] = useState([]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }

  const fetchSidebarData = async () => {
    if (loadData.role === 'superuser') {
      const { SidebarData } = await import('./SuperUser/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'management_admin') {
      const { SidebarData } = await import('./Management/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'tpo_admin') {
      const { SidebarData } = await import('./TPO/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'student') {
      const { SidebarData } = await import('./Students/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'recruiter') {
      const { SidebarData } = await import('./Recruiter/SidebarData');
      setSidebarData(SidebarData);
    }
  };

  useEffect(() => {
    if (loadData.role) {
      fetchSidebarData();
    }
  }, [loadData.role]);


  return (
    <>
      <nav className={`bg-white w-[240px] min-h-screen h-full z-20 flex flex-col fixed top-0 transition-transform duration-300 ${sidebar ? 'translate-x-0' : '-translate-x-full'} shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-gray-100 navbar-container lg:w-[260px]`}>
        {/* Main Sidebar Logo and Name */}
        <div className="flex items-center px-6 py-6 gap-3 border-b border-gray-50">
          <img className="rounded-xl shadow-sm" src={Logo} alt="Logo Image" width="48" height="48" />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {loadData.role === 'superuser' && <Link to="/admin/dashboard" className="no-underline text-slate-800">CPMS</Link>}
            {loadData.role === 'management_admin' && <Link to="/management/dashboard" className="no-underline text-slate-800">CPMS</Link>}
            {loadData.role === 'tpo_admin' && <Link to="/tpo/dashboard" className="no-underline text-slate-800">CPMS</Link>}
            {loadData.role === 'student' && <Link to="/student/dashboard" className="no-underline text-slate-800">CPMS</Link>}
            {loadData.role === 'recruiter' && <Link to="/recruiter/dashboard" className="no-underline text-slate-800">CPMS</Link>}
          </h1>
        </div>

        {/* Main body */}
        <div className="flex-grow overflow-y-auto sidebar-content pb-24">
          <div className="flex flex-col justify-center w-full">
            {SidebarData.length > 0 ? (
              SidebarData.map((item, index) => (
                <SubMenu item={item} key={index} currentPath={location.pathname} />
              ))
            ) : (
              <p className="text-center text-gray-600">Loading...</p>
            )}
          </div>
        </div>

        {/* Bottom Menu */}
        <div className="bottom-0 absolute w-full transition-all duration-300 border-t border-gray-100 bg-white">
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className={`w-full bg-white border-t border-gray-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] ${dropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              {/* Conditional rendering based on role */}
              {loadData.role === 'student' && (
                <Link to={`../student/account`} className="flex items-center no-underline text-slate-700 p-3 hover:bg-slate-50 transition-colors">
                  <FaCog className="mr-3 text-slate-400" /> <span className="font-medium text-sm">Account Settings</span>
                </Link>
              )}
              {loadData.role === 'tpo_admin' && (
                <Link to={`../tpo/account`} className="flex items-center no-underline text-slate-700 p-3 hover:bg-slate-50 transition-colors">
                  <FaCog className="mr-3 text-slate-400" /> <span className="font-medium text-sm">Account Settings</span>
                </Link>
              )}
              {loadData.role === 'management_admin' && (
                <Link to={`../management/account`} className="flex items-center no-underline text-slate-700 p-3 hover:bg-slate-50 transition-colors">
                  <FaCog className="mr-3 text-slate-400" /> <span className="font-medium text-sm">Account Settings</span>
                </Link>
              )}
              {loadData.role === 'recruiter' && (
                <Link to={`../recruiter/account`} className="flex items-center no-underline text-slate-700 p-3 hover:bg-slate-50 transition-colors">
                  <FaCog className="mr-3 text-slate-400" /> <span className="font-medium text-sm">Account Settings</span>
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center w-full p-3 text-rose-600 hover:bg-rose-50 transition-colors">
                <FaSignOutAlt className="mr-3" /> <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          )}

          {/* User Profile */}
          <div className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors" onClick={toggleDropdown}>
            <div className="flex items-center gap-3 overflow-hidden">
              <img src={loadData.profile} alt="Profile Img" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
              <div className="flex flex-col justify-center overflow-hidden">
                <h2 className="text-sm font-semibold text-slate-800 truncate">{loadData.name}</h2>
                <p className="text-xs text-slate-500 truncate">{loadData.email}</p>
              </div>
            </div>
            <div className="text-slate-400">
              <IoIosArrowDropdownCircle size={20} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
