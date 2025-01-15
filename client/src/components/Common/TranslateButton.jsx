import React, { useState, useEffect } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';

const TranslateButton = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add notranslate class to the button on mount
    const button = document.getElementById('lang-switch-button');
    if (button) {
      button.classList.add('notranslate');
    }
  }, []);

  const loadGoogleTranslate = () => {
    const googleTranslateScript = document.createElement('script');
    googleTranslateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(googleTranslateScript);
  };

  const toggleLanguage = () => {
    setIsLoading(true);
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    
    if (!window.google?.translate) {
      window.googleTranslateElementInit = function() {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,ar',
          autoDisplay: false,
          multilanguagePage: true
        }, 'google_translate_element');
      };
      loadGoogleTranslate();
    }

    const checkForGoogle = setInterval(() => {
      if (window.google?.translate) {
        clearInterval(checkForGoogle);
        const elements = document.getElementsByClassName('goog-te-combo');
        if (elements.length > 0) {
          const selectElement = elements[0];
          selectElement.value = newLang;
          selectElement.dispatchEvent(new Event('change'));
          setCurrentLang(newLang);
          setIsLoading(false);
        }
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkForGoogle);
      setIsLoading(false);
    }, 5000);
  };

  return (
    <>
      <div id="google_translate_element" className="hidden" />
      <button
        id="lang-switch-button"
        onClick={toggleLanguage}
        disabled={isLoading}
        className="flex items-center gap-4 px-6 py-3 
                 bg-gradient-to-r from-highlight to-highlight/90 text-white rounded-full 
                 shadow-lg hover:shadow-xl transition-all duration-300 
                 hover:scale-105 disabled:opacity-75 disabled:scale-100"
      >
        <span className={`font-medium ${currentLang === 'en' ? 'opacity-100' : 'opacity-50'}`}>
          EN
        </span>
        <div className={`relative ${isLoading ? 'animate-spin' : ''}`}>
          <FaExchangeAlt className="text-lg" />
        </div>
        <span className={`font-medium ${currentLang === 'ar' ? 'opacity-100' : 'opacity-50'}`}>
          ع
        </span>
      </button>
    </>
  );
};

export default TranslateButton; 