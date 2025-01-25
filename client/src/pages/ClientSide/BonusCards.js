import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-28 sm:pt-32">
      {/* Hero Section with Images */}
      <div className="relative container mx-auto">
        {/* Left Image */}
        <motion.img
          src={bonCardLeft}
          alt="Left Decoration"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-24 md:w-32 lg:w-40 hidden md:block"
        />

        {/* Right Image */}
        <motion.img
          src={bonCardRight}
          alt="Right Decoration"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-24 md:w-32 lg:w-40 hidden md:block"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-10 sm:pt-14 md:pt-16 mb-6 sm:mb-10 px-3"
        >
          <div className="inline-block p-1.5 sm:p-2 px-3 sm:px-4 rounded-full bg-purple-500/10 text-purple-300 mb-4">
            <div className="flex items-center gap-1.5">
              <FaGift className="text-base " />
              <span className="text-base ">Exclusive Member Benefits</span>
            </div>
          </div>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-3 sm:mb-4 px-4"
          >
            Premium Partner Offers
          </h1>
          <p className="text-sm sm:text-base md:text-base text-gray-300 max-w-2xl mx-auto px-4">
            Access exclusive benefits curated for our distinguished members
          </p>
        </motion.div>
      </div>

      {/* Search Bar - Compact Design */}
      <div className="max-w-md mx-auto mb-6 sm:mb-10 px-3">
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

      {/* Offers Grid - Two cards per row on mobile */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 px-3 
                    sm:gap-4 lg:grid-cols-3 sm:px-4 md:gap-5 md:px-6 container mx-auto pb-16"
      >
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
            {/* Image Container */}
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

            {/* Content Section */}
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
