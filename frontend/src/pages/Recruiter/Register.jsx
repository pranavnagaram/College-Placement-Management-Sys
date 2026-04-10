import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/CPMS.png';
import Toast from '../../components/Toast';
import isAuthenticated from '../../utility/auth.utility';
import { Button } from 'react-bootstrap';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function RegisterRecruiter() {
  document.title = 'CPMS | Recruiter Register';
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [isEyeOpen, setEyeOpen] = useState(false);
  const [error, setError] = useState({});

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    designation: '',
  });

  useEffect(() => {
    if (isAuthenticated()) navigate('/recruiter/dashboard');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required!';
    if (!formData.email) newErrors.email = 'Email is required!';
    if (!formData.password) newErrors.password = 'Password is required!';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters!';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return setError(validationErrors);

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/recruiter/register`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('/recruiter/dashboard');
    } catch (err) {
      const msg = err.response?.data?.msg || 'Registration failed!';
      setToastMessage(msg);
      setShowToast(true);
      console.log('Error in Recruiter Register.jsx => ', err);
      setLoading(false);
    }
  };

  return (
    <>
      <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} delay={3000} position="bottom-end" />

      <div className="flex justify-center items-center min-h-screen py-8 bg-gradient-to-r from-indigo-500 from-10% via-purple-500 via-40% to-pink-500 to-100%">
        <form
          className="form-signin flex justify-center items-center flex-col gap-3 backdrop-blur-md bg-white/30 border border-white/20 rounded-lg p-8 shadow shadow-indigo-400 w-1/3 max-lg:w-2/3 max-md:w-3/4 max-[400px]:w-4/5"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center items-center flex-col">
            <img className="mb-4 rounded-xl shadow w-30 h-28 lg:w-40 lg:h-40" src={Logo} alt="Logo Image" />
            <h1 className="h3 mb-1 font-weight-normal">Recruiter Register</h1>
            <p className="text-sm text-gray-600 text-center mb-2">Create your recruiter account to post jobs</p>
          </div>

          {/* First Name */}
          <div className="w-full">
            <input
              type="text"
              id="recruiterFirstName"
              className="form-control"
              placeholder="First Name *"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <div className="text-red-500 ml-2 text-left text-sm">{error?.first_name}</div>
          </div>

          {/* Last Name */}
          <div className="w-full">
            <input
              type="text"
              id="recruiterLastName"
              className="form-control"
              placeholder="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>

          {/* Designation */}
          <div className="w-full">
            <input
              type="text"
              id="recruiterDesignation"
              className="form-control"
              placeholder="Designation (e.g. HR Manager)"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="w-full">
            <input
              type="email"
              id="recruiterRegEmail"
              className="form-control"
              placeholder="Email address *"
              autoComplete="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <div className="text-red-500 ml-2 text-left text-sm">{error?.email}</div>
          </div>

          {/* Password */}
          <div className="w-full">
            <div className="flex justify-center items-center w-full">
              <input
                type={isEyeOpen ? 'text' : 'password'}
                id="recruiterRegPassword"
                className="form-control"
                placeholder="Password * (min 6 chars)"
                autoComplete="new-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <i
                className={`${isEyeOpen ? 'fa-solid fa-eye' : 'fa-regular fa-eye-slash'} -ml-6 cursor-pointer`}
                onClick={() => setEyeOpen(!isEyeOpen)}
              />
            </div>
            <div className="text-red-500 ml-2 text-left text-sm">{error?.password}</div>
          </div>

          <div className="flex justify-center items-center flex-col gap-2 w-full">
            <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
              {isLoading ? 'Registering...' : 'Create Account'}
            </Button>
          </div>

          <span className="text-center">
            Already have an account?{' '}
            <span className="text-blue-600 font-bold cursor-pointer px-1" onClick={() => navigate('/recruiter/login')}>
              Log In
            </span>
          </span>
          <p className="text-muted text-center text-gray-400">© College Placement Management System</p>
        </form>
      </div>
    </>
  );
}

export default RegisterRecruiter;
