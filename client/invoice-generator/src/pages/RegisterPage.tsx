import React, { useState } from 'react';
import axios from 'axios';
import navb from '../assets/navbar.png'
import '../App.css';
import login from '../assets/login.png'
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      // Redirect to login after successful registration
      console.log(res.data);
      navigate('/LoginPage')
    } catch (err) {
      setError('Registration failed, please try again.');
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
      <form onSubmit={handleRegister} className="p-8">
        <h2 className="text-3xl mb-20 text-yellow-200 text-center font-bold">Sign up to Begin Journey</h2>
        <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="name">
            Enter Your Name
          </label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 mb-6 w-full rounded-lg"
          />

          <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 mb-6 w-full rounded-lg"
          />

          <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="password">
            Enter Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 mb-6 w-full rounded-lg"
          />

          <button type="submit" className="bg-blue-500 mr-5 text-white p-3 w-100 rounded-lg hover:bg-sky-700 transition-colors">
            Register
          </button>
          <span><a href="/LoginPage" className='text-yellow-50'>Already Have an Account? Login Here</a></span>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </form>
    </div>
    </div>
  );
};

export default RegisterPage;
