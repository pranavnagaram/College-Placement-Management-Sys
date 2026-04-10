import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function RecruiterHome() {
  document.title = 'CPMS | Recruiter Dashboard';
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get(`${BASE_URL}/recruiter/my-company`, { headers }),
      axios.get(`${BASE_URL}/recruiter/jobs`, { headers }),
    ])
      .then(([companyRes, jobsRes]) => {
        setCompany(companyRes.data.company);
        setJobs(jobsRes.data.jobs || []);
      })
      .catch((err) => console.log('RecruiterHome fetch error =>', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center h-72 items-center">
        <i className="fa-solid fa-spinner fa-spin text-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        {/* Company Card */}
        <div className="backdrop-blur-md bg-white/50 border border-white/20 rounded-lg shadow p-5">
          <h2 className="text-lg font-bold mb-2 text-indigo-700">My Company</h2>
          {company ? (
            <div className="flex flex-col gap-1 text-sm">
              <p><span className="font-semibold">Name:</span> {company.companyName}</p>
              <p><span className="font-semibold">Location:</span> {company.companyLocation || '—'}</p>
              <p><span className="font-semibold">Website:</span>{' '}
                {company.companyWebsite
                  ? <a href={company.companyWebsite} target="_blank" rel="noreferrer" className="text-blue-600 underline">{company.companyWebsite}</a>
                  : '—'}
              </p>
              <p><span className="font-semibold">Difficulty:</span> {company.companyDifficulty || '—'}</p>
              <button
                className="mt-3 text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition w-fit"
                onClick={() => navigate('/recruiter/my-company')}
              >
                Edit Company
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-gray-500 text-sm">No company set up yet.</p>
              <button
                className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition w-fit"
                onClick={() => navigate('/recruiter/my-company')}
              >
                Add Company Info
              </button>
            </div>
          )}
        </div>

        {/* Jobs Summary Card */}
        <div className="backdrop-blur-md bg-white/50 border border-white/20 rounded-lg shadow p-5">
          <h2 className="text-lg font-bold mb-2 text-indigo-700">Job Postings</h2>
          <p className="text-4xl font-bold text-indigo-500">{jobs.length}</p>
          <p className="text-gray-500 text-sm mt-1">{jobs.length === 1 ? 'job posted' : 'jobs posted'}</p>
          <div className="flex gap-2 mt-3">
            <button
              className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
              onClick={() => navigate('/recruiter/job-listings')}
            >
              View All Jobs
            </button>
            <button
              className="text-sm border border-indigo-600 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-50 transition"
              onClick={() => navigate('/recruiter/post-job')}
            >
              Post New Job
            </button>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      {jobs.length > 0 && (
        <div className="backdrop-blur-md bg-white/50 border border-white/20 rounded-lg shadow p-5">
          <h2 className="text-lg font-bold mb-3 text-indigo-700">Recent Job Postings</h2>
          <div className="flex flex-col gap-2">
            {jobs.slice(0, 5).map((job) => (
              <div key={job._id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                <div>
                  <p className="font-semibold text-sm">{job.jobTitle}</p>
                  <p className="text-xs text-gray-500">
                    Posted: {new Date(job.postedAt).toLocaleDateString()}
                    {job.applicationDeadline && ` · Deadline: ${new Date(job.applicationDeadline).toLocaleDateString()}`}
                  </p>
                </div>
                <button
                  className="text-xs text-indigo-600 hover:underline"
                  onClick={() => navigate(`/recruiter/post-job/${job._id}`)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruiterHome;
