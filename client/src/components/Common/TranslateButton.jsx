import React, { useState, useEffect } from 'react';
import { IoLanguageOutline } from 'react-icons/io5';

const TranslateButton = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 
                 transition-all duration-300"
        title="Translate"
      >
        <IoLanguageOutline 
          className={`text-white text-xl ${isLoading ? 'animate-spin' : ''}`}
        />
      </button>
    </>
  );
};

export default TranslateButton; 