// Login.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png'; // Update this path to your actual logo location

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Logo" className="w-10 h-10 mr-3" />
          <h2 className="text-3xl font-extrabold text-gray-800">Welcome Back</h2>
        </div>
        <form>
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-primary rounded-lg hover:bg-primary-dark transition duration-300 font-semibold"
          >
            Login
          </button>
        </form>
        <div className="flex justify-between mt-6 text-sm text-gray-600">
          <Link to="/forgot-password" className="text-highlight font-medium hover:underline">
            Forgot Password?
          </Link>
          <Link to="/register" className="text-highlight font-medium hover:underline">
            Don't have an account?Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
