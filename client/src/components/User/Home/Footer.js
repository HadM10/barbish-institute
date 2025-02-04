// components/User/Home/Footer.js
import React from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              About Barbish Institution
            </h3>
            <p className="text-sky">
              Leading the way in professional education and technical training.
              Our commitment to excellence has helped thousands of students
              achieve their career goals.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <p className="text-sky">Email: info@barbish-institution.com</p>
            <p className="text-sky">Phone: +96171020724</p>
            <p className="text-sky">Location: Sarafand, main road</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Our Programs</h3>
            <ul className="text-sky space-y-2">
              <li>Professional Development</li>
              <li>Technical Training</li>
              <li>Certification Programs</li>
              <li>Online Learning</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <a
              href="https://www.facebook.com/share/1E52XQRvDX/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="text-white text-2xl hover:text-blue-500 transition-colors" />
            </a>
            <a
              href="https://www.instagram.com/barbish_institution?igsh=MXI1aTJ6cHl1aWNvaw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-white text-2xl hover:text-pink-500 transition-colors" />
            </a>
            <a
              href="https://www.tiktok.com/@barbishinstitutio?_t=ZS-8tMyKLQXXpn&_r=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="text-white text-2xl hover:text-black transition-colors" />
            </a>
            <a
              href="https://wa.link/nbj130"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="text-white text-2xl hover:text-green-500 transition-colors" />
            </a>
          </div>
          <p className="text-sky">
            © {new Date().getFullYear()} Barbish Institution. All rights
            reserved.
          </p>
          <p className="text-sky text-sm mt-2">
            Powered by{" "}
            <a
              href="https://topcoders.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 transition-colors"
            >
              TopCoders
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
