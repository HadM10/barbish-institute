// components/User/Home/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Barbish Institution</h3>
            <p className="text-sky">
              Leading the way in professional education and technical training.
              Our commitment to excellence has helped thousands of students
              achieve their career goals.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <p className="text-sky">Email: info@barbish.edu</p>
            <p className="text-sky">Phone: +1 234 567 890</p>
            <p className="text-sky">Location: Dubai, UAE</p>
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
          <p className="text-sky">
            © {new Date().getFullYear()} Barbish Institution. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;