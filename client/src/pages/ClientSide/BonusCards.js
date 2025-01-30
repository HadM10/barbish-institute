import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWhatsapp,
  FaInstagram,
  FaGlobe,
  FaSearch,
  FaGift,
  FaCrown,
} from "react-icons/fa";
import { getAllBonCards } from "../../api/BonCardAPI";
import bonCardLeft from "../../assets/images/boncard.png";
import bonCardRight from "../../assets/images/boncard1.png";

const BonusCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [offers, setOffers] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMobileCards, setShowMobileCards] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchOffers = async () => {
      try {
        const response = await getAllBonCards();
        if (isMounted && response.success) {
          setOffers(response.data);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatPrice = (price) => {
    if (!price) return "0";
    const formattedPrice = parseFloat(price).toString();
    return formattedPrice;
  };

  const filteredOffers = offers.filter(
    (offer) =>
      offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.organizationName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLinkIcon = (linkType) => {
    switch (linkType) {
      case "whatsapp":
        return <FaWhatsapp className="text-lg" />;
      case "instagram":
        return <FaInstagram className="text-lg" />;
      default:
        return <FaGlobe className="text-lg" />;
    }
  };

  const handleCardClick = (side) => {
    setSelectedCard(side);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-28 sm:pt-32">
      {/* Hero Section - Adjusted spacing and responsiveness */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-10 sm:pt-14 md:pt-16 mb-6 sm:mb-10 px-3"
      >
        <div className="inline-block p-1.5 sm:p-2 px-3 sm:px-4 rounded-full bg-purple-500/10 text-purple-300 mb-4
                      max-w-[90%] mx-auto">
          <div className="flex items-center gap-1.5 justify-center flex-wrap">
            <FaGift className="text-sm sm:text-base" />
            <span className="text-sm sm:text-base whitespace-normal text-center">
              Exclusive Member Benefits
            </span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-3 sm:mb-4 px-4
                       relative z-10">
          Premium Partner Offers
        </h1>
        <p className="text-sm sm:text-base md:text-base text-gray-300 max-w-2xl mx-auto px-4 relative z-10">
          Access exclusive benefits curated for our distinguished members
        </p>
      </motion.div>

      {/* Premium Cards Section */}
      <div className="relative container mx-auto">
        {/* Show/Hide Cards Button */}
        <div className="flex justify-center -mt-4 mb-8">
          <button
            onClick={() => setShowMobileCards(!showMobileCards)}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500
                     rounded-lg text-white font-semibold shadow-lg text-sm
                     hover:shadow-xl transition-all duration-300"
          >
            {showMobileCards ? 'Hide Premium Cards' : 'Show Premium Cards'}
          </button>
        </div>

        {/* Cards View - Responsive Layout */}
        <AnimatePresence>
          {showMobileCards && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-4 -mt-4 mb-8"
            >
              <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-4 md:gap-8 lg:gap-12">
                <div 
                  onClick={() => handleCardClick('left')} 
                  className="cursor-pointer p-2 relative z-30 
                           w-full max-w-[280px] mx-auto md:mx-0
                           sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]"
                >
                  <img 
                    src={bonCardLeft} 
                    alt="Left Card" 
                    className="w-full rounded-2xl shadow-lg pointer-events-none
                             transition-all duration-300 hover:scale-105
                             hover:shadow-xl hover:brightness-110" 
                  />
                </div>
                <div 
                  onClick={() => handleCardClick('right')} 
                  className="cursor-pointer p-2 relative z-30 
                           w-full max-w-[280px] mx-auto md:mx-0
                           sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]"
                >
                  <img 
                    src={bonCardRight} 
                    alt="Right Card" 
                    className="w-full rounded-2xl shadow-lg pointer-events-none
                             transition-all duration-300 hover:scale-105
                             hover:shadow-xl hover:brightness-110" 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
                    flex items-center justify-center"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-[90%] max-w-lg p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full aspect-[3/4] cursor-pointer 
                         [perspective:1000px] transition-all duration-700`}
              >
                <div
                  className={`absolute w-full h-full [transform-style:preserve-3d] 
                           transition-all duration-700
                           ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                >
                  <div className="absolute w-full h-full [backface-visibility:hidden]">
                    <img
                      src={selectedCard === 'left' ? bonCardLeft : bonCardRight}
                      alt="Card Front"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>

                  <div className="absolute w-full h-full [backface-visibility:hidden] 
                                [transform:rotateY(180deg)]">
                    <img
                      src={selectedCard === 'left' ? bonCardRight : bonCardLeft}
                      alt="Card Back"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCard(null)}
                className="absolute -top-4 -right-4 text-white bg-black/50 
                       rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto mb-6 sm:mb-10 px-3 relative z-20">
        <div className="relative">
          <input
            type="text"
            placeholder="Search premium offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 sm:px-4 py-4 rounded-xl bg-white/10 border border-white/20 
                     text-white placeholder-gray-400 focus:outline-none focus:border-purple-500
                     text-base backdrop-blur-sm"
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
        </div>
      </div>

      <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 px-3 
                    sm:gap-4 lg:grid-cols-3 sm:px-4 md:gap-5 md:px-6 container mx-auto pb-16">
        {filteredOffers.map((offer) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -3 }}
            className="bg-gradient-to-b max-w-sm from-white/10 to-white/5 backdrop-blur-xl 
                     rounded-lg sm:rounded-xl overflow-hidden border border-white/10 
                     flex flex-col shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-[4/3]">
              <img
                src={offer.image || "https://via.placeholder.com/1080"}
                alt={offer.title}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                className="w-full aspect-square object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/1080";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div
                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 
                            bg-gradient-to-r from-amber-500 to-amber-600 
                            px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full 
                            flex items-center gap-1 shadow-lg"
              >
                <FaCrown className="text-white text-base sm:text-base" />
                <span className="text-white font-medium text-base sm:text-base">
                  Premium
                </span>
              </div>
            </div>

            <div className="p-2 sm:p-3 flex-1 flex flex-col space-y-1.5 sm:space-y-2">
              <div>
                <h3 className="text-amber-400 text-base sm:text-base font-medium tracking-wide uppercase">
                  {offer.organizationName || "Elite Partner"}
                </h3>
                <h2 className="text-base sm:text-base font-bold text-white leading-tight line-clamp-2">
                  {offer.title}
                </h2>
              </div>

              <p className="text-gray-300 flex-1 leading-relaxed text-base sm:text-base line-clamp-2 sm:line-clamp-3">
                {offer.description}
              </p>

              <div
                className="flex items-center justify-between pt-1.5 sm:pt-2 
                            border-t border-white/10 gap-2"
              >
                <div className="flex flex-col">
                  <span className="text-base sm:text-base text-amber-400 uppercase tracking-wider">
                    Investment
                  </span>
                  <span className="text-base sm:text-base font-bold text-white">
                    ${formatPrice(offer.price)}
                  </span>
                </div>
                <a
                  href={offer.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full 
                           bg-gradient-to-r from-amber-500 to-amber-600 text-white 
                           hover:shadow-lg hover:from-amber-600 hover:to-amber-700 
                           transition-all duration-300 text-base sm:text-base"
                >
                  {getLinkIcon(offer.linkType)}
                  <span>Access</span>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BonusCards;
