import React, { useState } from 'react';
import { FaLanguage } from 'react-icons/fa';

const TranslateButton = () => {
  const [currentLang, setCurrentLang] = useState('en');

  const loadGoogleTranslate = () => {
    const googleTranslateScript = document.createElement('script');
    googleTranslateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(googleTranslateScript);
  };

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    
    // If Google Translate hasn't been loaded yet, load it
    if (!window.google?.translate) {
      window.googleTranslateElementInit = function() {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,ar',
          autoDisplay: false
        }, 'google_translate_element');
      };
      loadGoogleTranslate();
    }

    // Wait for Google Translate to initialize
    const checkForGoogle = setInterval(() => {
      if (window.google?.translate) {
        clearInterval(checkForGoogle);
        
        // Find the select element
        const elements = document.getElementsByClassName('goog-te-combo');
        if (elements.length > 0) {
          const selectElement = elements[0];
          selectElement.value = newLang;
          selectElement.dispatchEvent(new Event('change'));
          setCurrentLang(newLang);
        }
      }
    }, 100);

    // Clear interval after 5 seconds if Google Translate hasn't loaded
    setTimeout(() => clearInterval(checkForGoogle), 5000);
  };

  return (
    <>
      <div id="google_translate_element" style={{ 
        position: 'absolute',
        top: '-9999px',
        left: '-9999px'
      }} />
      <button
        onClick={toggleLanguage}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 
                 bg-highlight hover:bg-highlight/90 text-white rounded-full 
                 shadow-lg transition-all duration-300"
      >
        <FaLanguage className="text-xl" />
        <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
      </button>
    </>
  );
};

export default TranslateButton; 