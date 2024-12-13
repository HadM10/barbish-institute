import React, { useState } from "react";
import logo from "../../../assets/images/logo.png"; // Update the path to your actual logo file

const Navbar = () => {
  const [language, setLanguage] = useState("English"); // Default language is English

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "English" ? "Arabic" : "English"));
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

          {/* Right Section: Action Buttons */}
          <div className="flex items-center space-x-4">
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
      </nav>

      {/* Center Section: Menu */}
      <section className="bg-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <ul className="flex space-x-6 text-gray-700 font-medium">
            <li className="hover:text-gray-900 cursor-pointer">Home</li>
            <li className="hover:text-gray-900 cursor-pointer">Courses</li>
            <li className="hover:text-gray-900 cursor-pointer">About Us</li>
            <li className="hover:text-gray-900 cursor-pointer">Contact</li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Navbar;
