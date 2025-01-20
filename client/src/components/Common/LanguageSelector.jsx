import React, { useState, useEffect } from 'react';
import { FaChevronDown, IoLanguageOutline } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const button = document.getElementById('lang-switch-button');
    if (button) {
      button.classList.add('notranslate');
    }
  }, []);

  // Initialize Google Translate
  useEffect(() => {
    if (window.googleTranslateInitialized) return;

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ar',
        autoDisplay: false,
        multilanguagePage: true
      }, 'google_translate_element');
      window.googleTranslateInitialized = true;
    };
    
    document.head.appendChild(script);
  }, []);

  // Hide Google Translate elements
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame, 
      .goog-te-balloon-frame,
      #goog-gt-tt,
      .goog-te-balloon-frame,
      .goog-tooltip,
      .goog-tooltip:hover,
      .skiptranslate,
      .goog-te-gadget {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      body {
        top: 0 !important;
        position: static !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const toggleLanguage = () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const newLang = currentLang === 'en' ? 'ar' : 'en';
      const selectElement = document.querySelector('.goog-te-combo');
      
      if (selectElement) {
        selectElement.value = newLang;
        selectElement.dispatchEvent(new Event('change'));
        setCurrentLang(newLang);
        localStorage.setItem('selectedLanguage', newLang);
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsOpen(false);
      }, 300);
    }
  };

  return (
    <>
      <div id="google_translate_element" className="hidden" />
      <div className="relative">
        <motion.button
          id="lang-switch-button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-8 h-8 
                   bg-highlight/20 rounded-full transition-all duration-300
                   hover:bg-highlight/30"
        >
          <FaChevronDown 
            className={`text-white text-sm transition-transform duration-300
              ${isOpen ? 'rotate-180' : ''}`}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl 
                       overflow-hidden min-w-[120px]"
            >
              <button
                onClick={toggleLanguage}
                disabled={isLoading}
                className="w-full px-4 py-3 flex items-center justify-center gap-2
                         hover:bg-gray-50 transition-all duration-300"
              >
                <IoLanguageOutline 
                  className={`text-highlight text-xl
                    ${isLoading ? 'animate-spin' : ''}`}
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default LanguageSelector; 