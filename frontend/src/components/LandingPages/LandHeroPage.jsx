import React, { useState } from 'react';
import HeroImg from '../../assets/heroImg.jpg';
import { useNavigate } from 'react-router-dom';

function LandingHeroPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleCreateAccount = () => {
    if (email.trim()) {
      navigate('/student/signup', {
        state: { prefillEmail: email }
      });
    } else {
      navigate('/student/signup');
    }
  }

  const handleScrollAbout = () => document.getElementById('about').scrollIntoView();

  return (
    <section
      id="home"
      className="relative h-[90vh] w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      {/* Dark glass overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-20 max-w-5xl text-center px-4">
        <h1 className="text-white text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
          Empower Your Career with <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            CPMS Portal
          </span>
        </h1>

        <p className="mt-6 text-slate-200 text-lg sm:text-xl font-medium max-w-2xl mx-auto drop-shadow">
          Discover opportunities, track progress, and connect with your TPO — all in one unified platform.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="email"
            className="px-6 py-4 w-80 sm:w-96 rounded-xl shadow-lg border border-white/20 bg-white/10 backdrop-blur-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-300 transition duration-300"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 px-8 py-4 rounded-xl text-white font-semibold shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:-translate-y-0.5"
            onClick={handleCreateAccount}
          >
            Get Started
          </button>
        </div>

        {/* Call-to-action */}
        <div className="mt-8">
          <p
            className="inline-block cursor-pointer mt-4 text-sm text-white opacity-70 hover:opacity-100 transition duration-300 underline underline-offset-4"
            onClick={handleScrollAbout}
          >
            Learn more about CPMS
          </p>
        </div>
      </div>
    </section>
  );
}

export default LandingHeroPage;
