import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";  // Import AuthContext

const Login = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // For displaying error messages

  const { login } = useContext(AuthContext);  // Access login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset previous errors

    try {
      // Call the login function from AuthContext and pass form data
      const loginResponse = await login(formData);
      console.log(loginResponse)
      
      if (loginResponse.status === "success") {
        setError(<span style={{ color: '#7CFC00' }}>Login successful!</span>);
      


        // Wait for a short duration before closing the form
        setTimeout(() => {
          onClose();
          setFormData({ username: "", password: "" });
          setError(null); // Close the login popup on successful login
        }, 1000); // Adjust the timeout duration as needed
      } else {
        setError(loginResponse.message || "Login failed. Please try again.");
      }
    } catch (error) {
      // If an error occurs, display it
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 shadow-xl">
              {/* Close Button */}
              <div className="flex">
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors duration-300 ml-auto"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Login
                </h2>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-center mb-4">{error}</div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
          
        </>
      )}
    </AnimatePresence>
  );
};

export default Login;
