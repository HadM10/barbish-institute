import React, { useState, useEffect, useCallback, memo } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { IoLanguageOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSelector = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => 
    localStorage.getItem('selectedLanguage') || 'en'
  );

  const applyTranslation = useCallback(async (lang) => {
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = lang;
      selectElement.dispatchEvent(new Event('change'));
      localStorage.setItem('selectedLanguage', lang);
      setCurrentLang(lang);
    }
  }, []);

  // Initialize Google Translate with persistent language
  useEffect(() => {
    let observer;
    const initializeTranslation = () => {
      if (!window.google?.translate?.TranslateElement) {
        setTimeout(initializeTranslation, 100);
        return;
      }

      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ar',
        autoDisplay: false,
        multilanguagePage: true
      }, 'google_translate_element');

      const savedLang = localStorage.getItem('selectedLanguage');
      if (savedLang) {
        setTimeout(() => applyTranslation(savedLang), 500);
      }
    };

    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = initializeTranslation;
      
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    } else {
      initializeTranslation();
    }

    // Mutation observer optimization
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && document.querySelector('.goog-te-combo')) {
          const savedLang = localStorage.getItem('selectedLanguage');
          if (savedLang && savedLang !== 'en') {
            applyTranslation(savedLang);
          }
          observer.disconnect();
          break;
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer?.disconnect();
  }, [applyTranslation]);

  // Hide Google Translate elements - moved to a separate useEffect
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
    return () => style.remove();
  }, []);

  const toggleLanguage = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const newLang = currentLang === 'en' ? 'ar' : 'en';
      await applyTranslation(newLang);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsOpen(false);
      }, 300);
    }
  }, [isLoading, currentLang, applyTranslation]);

  return (
    <>
      <div id="google_translate_element" className="hidden" />
      <div className="relative">
        <motion.button
          id="lang-switch-button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-8 h-8 gap-1
                   bg-highlight/20 rounded-full transition-all duration-300
                   hover:bg-highlight/30 notranslate"
        >
          <span className="text-white text-sm font-medium">
            {currentLang.toUpperCase()}
          </span>
          <FaChevronDown 
            className={`text-white text-xs transition-transform duration-300
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
                         hover:bg-gray-50 transition-all duration-300 notranslate"
              >
                <IoLanguageOutline 
                  className={`text-highlight text-xl
                    ${isLoading ? 'animate-spin' : ''}`}
                />
                <span>
                  {currentLang === 'en' ? 'العربية' : 'English'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
});

LanguageSelector.displayName = 'LanguageSelector';

export default LanguageSelector; 