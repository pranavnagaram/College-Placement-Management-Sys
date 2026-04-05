import React from 'react';
import { useNavigate } from 'react-router-dom';
import Student from '../../assets/student.jpg';
import TPO from '../../assets/tpo.jpg';
import RecruiterImg from '../../assets/recruiter.png';
import Management from '../../assets/management.jpg';
import Admin from '../../assets/admin.jpg';

function LandAbout() {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Student",
      image: Student,
      description:
        "Students can register, explore job opportunities, apply for jobs, and track application status with a personalized dashboard.",
      loginPath: '/student/login',
      loginLabel: 'Student Login',
      btnColor: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: "TPO (Training & Placement Officer)",
      image: TPO,
      description:
        "TPOs manage company data, job postings, application reviews, and generate insightful reports for placement tracking.",
      loginPath: '/tpo/login',
      loginLabel: 'Login as TPO',
      btnColor: 'bg-orange-500 hover:bg-orange-600',
    },

    {
      title: "Recruiter",
      image: RecruiterImg,
      description:
        "Recruiters can register, set up their company profile, and post job roles directly to reach eligible students through the placement portal.",
      loginPath: '/recruiter/login',
      loginLabel: 'Login as Recruiter',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700',
    },
  ];

  return (
    <div
      id="about"
      className="bg-gradient-to-tr from-pink-100 via-purple-100 to-pink-100 py-10 scroll-mt-24"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-3 playfair">About CPMS</h2>
        <p className="text-md md:text-lg max-w-3xl mx-auto text-gray-700 px-3">
          Developed by pre final students of IITISM Dhanbad, CPMS (College Placement Management System) is a powerful web-based platform to streamline and manage campus placements efficiently.
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-stretch gap-10 px-4 pb-10">
        {roles.map((role, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 shadow-lg rounded-xl w-80 max-md:py-3 max-md:px-2 md:p-5 flex flex-col items-center transform hover:scale-105 transition duration-300"
          >
            <img
              src={role.image}
              alt={role.title}
              className="w-48 h-48 object-cover rounded-full border-4 border-green-300 shadow-md"
            />
            <h3 className="text-xl md:text-2xl font-semibold mt-4 mb-2 text-green-700 text-center">{role.title}</h3>
            <p className="text-gray-600 text-sm text-center flex-grow">{role.description}</p>

            {/* Login Button */}
            {role.loginPath && (
              <div className="mt-4 flex flex-col items-center gap-2 w-full">
                <button
                  className={`w-full py-2 px-4 rounded-lg text-white text-sm font-semibold transition-all duration-200 shadow ${role.btnColor}`}
                  onClick={() => navigate(role.loginPath)}
                >
                  {role.loginLabel}
                </button>
                {/* Extra Register link for Recruiter */}
                {role.title === 'Recruiter' && (
                  <button
                    className="text-xs text-indigo-600 underline hover:text-indigo-800 transition"
                    onClick={() => navigate('/recruiter/register')}
                  >
                    New here? Register as Recruiter
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandAbout;
