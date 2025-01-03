import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaGlobe, FaSearch, FaGift, FaCrown } from 'react-icons/fa';
import { getAllBonCards } from '../../api/BonCardAPI';

const BonusCards = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await getAllBonCards();
        if (response.success) {
          setOffers(response.data);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };
    fetchOffers();
  }, []);

  const formatPrice = (price) => {
    if (!price) return '0';
    const formattedPrice = parseFloat(price).toString();
    return formattedPrice;
  };

  const filteredOffers = offers.filter(offer =>
    offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.organizationName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLinkIcon = (linkType) => {
    switch (linkType) {
      case 'whatsapp': return <FaWhatsapp className="text-lg" />;
      case 'instagram': return <FaInstagram className="text-lg" />;
      default: return <FaGlobe className="text-lg" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-40 mb-16 px-4"
      >
        <div className="inline-block p-2 px-6 rounded-full bg-purple-500/10 text-purple-300 mb-6">
          <div className="flex items-center gap-2">
            <FaGift className="text-lg" />
            <span>Exclusive Member Benefits</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text 
                     bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6">
          Premium Partner Offers
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          Access exclusive benefits curated for our distinguished members
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-16 px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search premium offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-8 py-6 rounded-2xl bg-white/10 border border-white/20 
                     text-white placeholder-gray-400 focus:outline-none focus:border-purple-500
                     text-lg backdrop-blur-sm"
          />
          <FaSearch className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 container mx-auto pb-20">
        {filteredOffers.map((offer) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl 
                     rounded-3xl overflow-hidden border border-white/10 group 
                     flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative aspect-square">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 
                            px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <FaCrown className="text-white" />
                <span className="text-white font-semibold">Premium</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col space-y-4">
              <div>
                <h3 className="text-amber-400 text-sm font-medium mb-2 tracking-wide uppercase">
                  {offer.organizationName || 'Elite Partner'}
                </h3>
                <h2 className="text-xl font-bold text-white leading-tight">
                  {offer.title}
                </h2>
              </div>

              <p className="text-gray-300 flex-1 leading-relaxed">
                {offer.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-sm text-amber-400 uppercase tracking-wider mb-1">Investment</span>
                  <span className="text-2xl font-bold text-white">
                    ${formatPrice(offer.price)}
                  </span>
                </div>
                <a
                  href={offer.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full 
                           bg-gradient-to-r from-amber-500 to-amber-600 text-white 
                           hover:shadow-lg hover:from-amber-600 hover:to-amber-700 
                           transition-all duration-300"
                >
                  {getLinkIcon(offer.linkType)}
                  <span>Access Now</span>
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