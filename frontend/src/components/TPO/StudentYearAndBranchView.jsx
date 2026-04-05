import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import AccordionPlaceholder from '../AccordionPlaceholder';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function StudentYearAndBranchView() {
  document.title = 'CPMS | All Students';

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  
  // Filter states
  const [yearFilter, setYearFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');

  // Authentication role for linking
  const [currentUserRole, setCurrentUserRole] = useState('');

  const fetchStudentsData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get current user role
      const userRes = await axios.get(`${BASE_URL}/user/detail`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCurrentUserRole(userRes.data.role);

      // Get students
      const response = await axios.get(`${BASE_URL}/student/all-students-data-year-and-branch`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.log("Error fetching students ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentsData();
  }, []);

  // Filter Logic
  const filteredStudents = students.filter(student => {
    const sYear = String(student?.studentProfile?.year || '');
    const sBranch = student?.studentProfile?.department || '';
    
    const matchYear = yearFilter === 'All' || sYear === yearFilter;
    const matchBranch = branchFilter === 'All' || sBranch === branchFilter;
    
    return matchYear && matchBranch;
  }).sort((a, b) => {
    const rollA = parseInt(a?.studentProfile?.rollNumber || 0);
    const rollB = parseInt(b?.studentProfile?.rollNumber || 0);
    return rollA - rollB;
  });

  return (
    <>
      {loading ? (
        <AccordionPlaceholder />
      ) : (
        <div className="my-6 max-md:p-2 md:p-6 overflow-auto">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            
            {/* Header and Filters */}
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Student Directory</h2>
                <p className="text-gray-500 text-sm mt-1">Showing {filteredStudents.length} students</p>
              </div>
              
              <div className="flex gap-4">
                <select 
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  <option value="All">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>

                <select 
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                >
                  <option value="All">All Branches</option>
                  <option value="Computer">Computer</option>
                  <option value="Civil">Civil</option>
                  <option value="ECS">ECS</option>
                  <option value="AIDS">AIDS</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <Table striped borderless hover className="w-full mb-0">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-gray-600">Roll No.</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Full Name</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Year</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Branch</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">UIN</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Email</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 text-center">Resume</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 text-center">Internships</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 text-center">Applied Jobs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <tr key={index} className="hover:bg-indigo-50/50 transition-colors">
                        <td className="py-3 px-4 text-gray-700">{student?.studentProfile?.rollNumber || '-'}</td>
                        <td className="py-3 px-4 font-medium">
                          {(currentUserRole === 'tpo_admin' || currentUserRole === 'management_admin') ? (
                            <Link 
                              to={`/${currentUserRole === 'tpo_admin' ? 'tpo' : 'management'}/user/${student?._id}`} 
                              className='no-underline text-indigo-600 hover:text-indigo-800'
                            >
                              {student?.first_name} {student?.middle_name} {student?.last_name}
                            </Link>
                          ) : (
                            <span className="text-gray-800">{student?.first_name} {student?.last_name}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{student?.studentProfile?.year || '-'}</td>
                        <td className="py-3 px-4 text-gray-600">{student?.studentProfile?.department || '-'}</td>
                        <td className="py-3 px-4 text-gray-500 text-sm">{student?.studentProfile?.UIN || '-'}</td>
                        <td className="py-3 px-4">
                          <a href={`mailto:${student?.email}`} className='text-blue-500 hover:underline'>
                            {student?.email}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {student?.studentProfile?.resume ? (
                            <a
                              href={student?.studentProfile?.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className='text-emerald-600 hover:text-emerald-800 font-medium no-underline'
                            >
                              <i className="fa-solid fa-file-pdf mr-1"></i> View
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-gray-700">
                          {student?.studentProfile?.internships?.length || 0}
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-gray-700">
                          {student?.studentProfile?.appliedJobs?.length || 0}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-gray-500">
                        No students found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}

export default StudentYearAndBranchView
