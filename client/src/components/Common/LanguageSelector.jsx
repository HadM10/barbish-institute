import React, { useState, useEffect } from 'react';
import { FaLanguage } from 'react-icons/fa';

const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Initialize Google Translate only once
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ar',
        autoDisplay: false
      }, 'google_translate_element');
    };
  }, []);

  const translatePage = () => {
    if (isTranslating) return; // Prevent multiple clicks while translating
    setIsTranslating(true);

    const newLang = currentLang === 'en' ? 'ar' : 'en';
    
    // Find the Google Translate select element
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      // Set the new language
      selectElement.value = newLang;
      // Trigger the change event
      selectElement.dispatchEvent(new Event('change'));
      
      // Update state after a short delay to ensure translation is complete
      setTimeout(() => {
        setCurrentLang(newLang);
        setIsTranslating(false);
      }, 1000);
    } else {
      setIsTranslating(false);
    }
  };

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }} />
      
      {/* Language Selector in Navbar */}
      <div className="relative inline-block">
        <button
          onClick={translatePage}
          disabled={isTranslating}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium 
                    text-white hover:text-highlight transition-colors duration-300
                    ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaLanguage className="text-xl" />
          <span>
            {isTranslating ? 'Translating...' : currentLang === 'en' ? 'العربية' : 'English'}
          </span>
        </button>
      </div>
    </>
  );
};

export default LanguageSelector; 