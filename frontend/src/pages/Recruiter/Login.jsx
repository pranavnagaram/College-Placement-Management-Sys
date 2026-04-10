import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/CPMS.png';
import Toast from '../../components/Toast';
import isAuthenticated from '../../utility/auth.utility';
import { Button } from 'react-bootstrap';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function LoginRecruiter() {
  document.title = 'CPMS | Recruiter Login';
  const navigate = useNavigate();

  const [error, setError] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isEyeOpen, setEyeOpen] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  useEffect(() => {
    if (isAuthenticated()) navigate('/recruiter/dashboard');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') setError({ ...error, email: '' });
    if (e.target.name === 'password') setError({ ...error, password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.email && !formData?.password)
      return setError({ email: 'Email Required!', password: 'Password Required!' });
    if (!formData?.email) return setError({ email: 'Email Required!' });
    if (!formData?.password) return setError({ password: 'Password Required!' });

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/recruiter/login`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('/recruiter/dashboard');
    } catch (error) {
      if (error.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      console.log('Error in Recruiter Login.jsx => ', error);
      setLoading(false);
    }
  };

  return (
    <>
      <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} delay={3000} position="bottom-end" />

      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 from-10% via-purple-500 via-40% to-pink-500 to-100%">
        <form
          className="form-signin flex justify-center items-center flex-col gap-3 backdrop-blur-md bg-white/30 border border-white/20 rounded-lg p-8 shadow shadow-indigo-400 w-1/3 max-lg:w-2/3 max-md:w-3/4 max-[400px]:w-4/5"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center items-center flex-col">
            <img className="mb-4 rounded-xl shadow w-30 h-28 lg:w-40 lg:h-40" src={Logo} alt="Logo Image" />
            <h1 className="h3 mb-3 font-weight-normal">Recruiter Log In</h1>
          </div>

          <div className="w-full">
            <label htmlFor="recruiterEmail" className="sr-only">Email address</label>
            <input
              type="email"
              id="recruiterEmail"
              className="form-control ml-1"
              placeholder="Email address"
              autoFocus
              autoComplete="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
            <div className="text-red-500 ml-2 text-left">{error?.email}</div>
          </div>

          <div className="w-full">
            <div className="flex justify-center items-center w-full">
              <label htmlFor="recruiterPassword" className="sr-only">Password</label>
              <input
                type={isEyeOpen ? 'text' : 'password'}
                id="recruiterPassword"
                className="form-control"
                placeholder="Password"
                autoComplete="current-password"
                name="password"
                value={password}
                onChange={handleChange}
              />
              <i
                className={`${isEyeOpen ? 'fa-solid fa-eye' : 'fa-regular fa-eye-slash'} -ml-6 cursor-pointer`}
                onClick={() => setEyeOpen(!isEyeOpen)}
              />
            </div>
            <div className="text-red-500 ml-2 text-left">{error?.password}</div>
          </div>

          <div className="flex justify-center items-center flex-col gap-2">
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Log In'}
            </Button>
          </div>

          <span className="text-center">
            New Recruiter?{' '}
            <span className="text-blue-600 font-bold cursor-pointer px-1" onClick={() => navigate('/recruiter/register')}>
              Register Here
            </span>
          </span>
          <span className="text-center">
            Log In as TPO?{' '}
            <span className="text-blue-500 font-bold cursor-pointer px-1" onClick={() => navigate('/tpo/login')}>
              Click Here
            </span>
          </span>
          <p className="text-muted text-center text-gray-400">© College Placement Management System</p>
        </form>
      </div>
    </>
  );
}

export default LoginRecruiter;
