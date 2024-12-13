import React, { useState } from "react";
 // Update with the actual path to your logo file

const Navbar = () => {
  const [language, setLanguage] = useState("English"); // Default language is English
  const [menuOpen, setMenuOpen] = useState(false); // State for burger menu toggle

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "English" ? "Arabic" : "English"));
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-gray-100 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Left Section: Logo and Name */}
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <img
              src={logo}
              alt="Barbish Institution Logo"
              className="h-10 w-10 object-contain"
            />
            {/* Name */}
            <div className="text-xl font-bold text-white bg-primary px-3 py-1 rounded-lg">
              Barbish Institution
            </div>
          </div>

          {/* Burger Menu for Small Screens */}
          <button
            className="lg:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>

          {/* Right Section: Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Multi-option Language Switch */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">{language}</span>
              <label
                htmlFor="language-toggle"
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="language-toggle"
                  className="sr-only peer"
                  onChange={toggleLanguage}
                  checked={language === "Arabic"}
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-primary"></div>
                <div className="absolute w-5 h-5 bg-white rounded-full transform transition peer-checked:translate-x-5"></div>
              </label>
            </div>

            {/* Register and Login Buttons */}
            <button className="bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary active:scale-95 transition duration-150">
              Register
            </button>
            <button className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white shadow-md active:scale-95 transition duration-150">
              Login
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-14 right-4 bg-gray-100 shadow-lg rounded-lg w-48 py-2">
            <div className="flex flex-col items-start space-y-2 px-4">
              {/* Register Button */}
              <button className="bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary active:scale-95 transition duration-150 w-full">
                Register
              </button>

              {/* Login Button */}
              <button className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white shadow-md active:scale-95 transition duration-150 w-full">
                Login
              </button>

              {/* Language Switcher */}
              <div className="flex items-center justify-between w-full">
                <span className="text-gray-700 font-medium">{language}</span>
                <label
                  htmlFor="language-toggle-mobile"
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="language-toggle-mobile"
                    className="sr-only peer"
                    onChange={toggleLanguage}
                    checked={language === "Arabic"}
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-primary"></div>
                  <div className="absolute w-5 h-5 bg-white rounded-full transform transition peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Center Section */}
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Barbish Institution</h1>
          <p className="mt-4 text-gray-600">
            Your gateway to a brighter future. Explore our programs and enroll today!
          </p>
        </div>
      </section>
    </>
  );
};

export default Navbar;
