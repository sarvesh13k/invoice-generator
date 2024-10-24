import React, { useState } from 'react';
import axios from 'axios';
import login from '../assets/login.png'
import navb from '../assets/navbar.png'
import '../App.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      // Handle successful login and redirect
      console.log(res.data);
      if (res.data.token) {
        // Redirect to add products page
        navigate('/AddProductPage'); // Replace with the correct path to your add products page
    }
    } catch (err) {
      setError('Login failed, please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#04081f] via-[#020212] to-[#000000]">
      <nav className="bg-[#1F1F1F] sticky top-0 z-50 p-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="text-white font-bold text-xl"><img src={navb} alt="" /></div>
      <ul className="flex space-x-4">
        <span className='border-yellow-100 border-r-2 text-yellow-100'>Connecting People With Technology</span>
      </ul>
    </div>
  </nav>
    <div className='px-10 flex justify-center items-center min-h-screen'>
      <div className='mr-40'>
        <img src={login} alt="" className='w-full max-w-xs rounded-lg shadow-lg' />        
      </div>
      <form onSubmit={handleLogin} className="p-8 ">
        <h2 className="text-3xl mb-20 text-yellow-200 text-center font-bold">Let The Journey Begin!</h2>
        
        <label className="block text-yellow-50 text-lg font-semibold mb-2" htmlFor="email">Email Address
    </label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-10 w-full"
        />
        <label className="block text-yellow-50 text-lg font-semibold mb-2" htmlFor="password">Current Password
    </label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <br />
        <button type="submit" className="bg-blue-500 text-white p-2 hover:bg-sky-700 mr-5">
          Login
        </button>
        <span><a href="/RegisterPage" className='text-yellow-50'>Don't Have an Account? Register Here</a></span>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
    </div>
  );
};

export default LoginPage;
