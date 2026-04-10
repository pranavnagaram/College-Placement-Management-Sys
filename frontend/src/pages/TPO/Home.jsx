import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NoticeBox from '../../components/NoticeBox';
import NotificationBox from '../../components/NotificationBox';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Home() {
  document.title = 'CPMS | TPO Dashboard';
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalJobs: 0,
    totalPlacementJobs: 0,
    totalInternshipJobs: 0,
    totalStudents: 0,
    totalApplications: 0,
    placementApps: 0,
    internshipApps: 0,
    totalHired: 0,
    placementsHired: 0,
    internshipsHired: 0,
    departmentStats: [],
    placementDepartmentStats: [],
    internshipDepartmentStats: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Placement');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tpo/dashboard-stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const displayJobs = activeTab === 'Placement' ? stats.totalPlacementJobs : stats.totalInternshipJobs;
  const displayApplications = activeTab === 'Placement' ? stats.placementApps : stats.internshipApps;
  const displayHired = activeTab === 'Placement' ? stats.placementsHired : stats.internshipsHired;
  const displayDepartmentStats = activeTab === 'Placement' ? stats.placementDepartmentStats : stats.internshipDepartmentStats;

  const placementRate = stats.totalStudents > 0 
    ? ((displayHired / stats.totalStudents) * 100).toFixed(1) 
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center h-72 items-center">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 shadow-lg text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="opacity-90">Monitor placement activities, student registrations, and company interactions in real-time.</p>
        </div>
        {/* Toggle Switch */}
        <div className="bg-white/20 p-1 rounded-full flex shadow-inner border border-white/30 backdrop-blur-sm shrink-0">
          <button 
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${activeTab === 'Placement' ? 'bg-white text-indigo-700 shadow' : 'text-white hover:bg-white/10'}`}
            onClick={() => setActiveTab('Placement')}
          >
            Placements
          </button>
          <button 
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${activeTab === 'Internship' ? 'bg-emerald-500 text-white shadow' : 'text-white hover:bg-white/10'}`}
            onClick={() => setActiveTab('Internship')}
          >
            Internships
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Companies */}
        <div className="bg-white rounded-xl shadow p-5 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <i className="fa-solid fa-building text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Companies</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalCompanies}</h3>
          </div>
        </div>

        {/* Card 2: Jobs */}
        <div className="bg-white rounded-xl shadow p-5 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-orange-100 p-4 rounded-full text-orange-600">
            <i className="fa-solid fa-briefcase text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{activeTab === 'Internship' ? 'Internships' : 'Job Postings'}</p>
            <h3 className="text-2xl font-bold text-gray-800">{displayJobs}</h3>
          </div>
        </div>

        {/* Card 3: Students */}
        <div className="bg-white rounded-xl shadow p-5 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-green-100 p-4 rounded-full text-green-600">
            <i className="fa-solid fa-user-graduate text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Students</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalStudents}</h3>
          </div>
        </div>

        {/* Card 4: Placements */}
        <div className="bg-white rounded-xl shadow p-5 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-purple-100 p-4 rounded-full text-purple-600">
            <i className="fa-solid fa-award text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Students {activeTab === 'Internship' ? 'Interned' : 'Hired'}</p>
            <h3 className="text-2xl font-bold text-gray-800">{displayHired}</h3>
          </div>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placement Rate Progress */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-indigo-500" /> Placement Rate
          </h3>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-gray-600">Hired vs Registered</span>
            <span className="text-2xl font-bold text-indigo-600">{placementRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${placementRate}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-right">{displayHired} of {stats.totalStudents} students placed</p>
        </div>

        {/* Application Volume */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-file-signature text-emerald-500" /> Application Volume
          </h3>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <p className="text-3xl font-bold text-emerald-600 mb-1">{displayApplications}</p>
              <p className="text-sm text-gray-500 font-medium">Total Applications Submitted</p>
            </div>
            <div className="flex-1 border-l-2 border-gray-100 pl-6">
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {displayJobs > 0 ? (displayApplications / displayJobs).toFixed(1) : 0}
              </p>
              <p className="text-sm text-gray-500 font-medium">Avg. Apps per Job</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placements by Department Donut Chart */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-purple-500" /> {activeTab}s by Department
          </h3>
          <div className="flex-1 min-h-[300px]">
            {displayDepartmentStats && displayDepartmentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayDepartmentStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {displayDepartmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => [`${value} Students`, 'Placed']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No department data available yet</div>
            )}
          </div>
        </div>

        {/* Placement Funnel Bar Chart */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-bar text-emerald-500" /> {activeTab} Funnel Overview
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Total Students', count: stats.totalStudents },
                  { name: 'Applications', count: displayApplications },
                  { name: 'Hired', count: displayHired },
                ]}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <RechartsTooltip 
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill={activeTab === 'Placement' ? '#4F46E5' : '#10B981'} 
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                >
                  {
                    [
                      { name: 'Total Students', count: stats.totalStudents },
                      { name: 'Applications', count: displayApplications },
                      { name: 'Hired', count: displayHired },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#64748B' : (activeTab === 'Placement' ? '#4F46E5' : '#10B981')} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Existing Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <NotificationBox />
        <NoticeBox />
      </div>
    </div>
  )
}

export default Home;
