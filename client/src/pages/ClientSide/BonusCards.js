import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTag, FaExternalLinkAlt, FaWhatsapp, FaInstagram, 
         FaGlobe, FaSearch, FaGift } from 'react-icons/fa';

const BonusCards = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample offers data
  const offers = [
    {
      id: 1,
      organizationName: "TechHub Academy",
      title: "50% Off Programming Courses",
      description: "Get exclusive discount on all programming courses at TechHub Academy",
      discount: "50%",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      link: "https://techhub.com",
      linkType: "website",
      validUntil: "2024-12-31"
    },
    {
      id: 2,
      organizationName: "FitLife Gym",
      title: "3 Months Free Membership",
      description: "Special offer for Barbish Institution students",
      discount: "100%",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
      link: "https://wa.me/1234567890",
      linkType: "whatsapp",
      validUntil: "2024-08-31"
    },
    {
      id: 3,
      organizationName: "Creative Arts Studio",
      title: "25% Off Art Supplies",
      description: "Exclusive discount on all art supplies and workshops",
      discount: "25%",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
      link: "https://instagram.com/creativeartstudio",
      linkType: "instagram",
      validUntil: "2024-09-30"
    }
  ];

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.organizationName.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
        <div className="absolute w-full h-full">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: 360,
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative pt-28 pb-20 px-4 container mx-auto z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-2 px-6 rounded-full bg-purple-500/10 text-purple-300 mb-6">
            <div className="flex items-center gap-2">
              <FaGift className="text-lg" />
              <span>Member Exclusive Benefits</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6">
            Special Partner Offers
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Unlock premium discounts and exclusive benefits from our trusted partners
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search offers..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOffers.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden 
                       border border-white/10 group h-full flex flex-col"
            >
              {/* Offer Image */}
              <div className="relative h-48">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover transition-transform duration-500 
                           group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 
                              text-white px-4 py-2 rounded-full font-bold flex items-center gap-2
                              shadow-lg shadow-red-500/30">
                  <FaTag />
                  {offer.discount} OFF
                </div>
              </div>

              {/* Offer Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-gray-400 text-sm mb-2">{offer.organizationName}</h3>
                <h2 className="text-xl font-bold text-white mb-3">{offer.title}</h2>
                <p className="text-gray-300 mb-6 flex-1">{offer.description}</p>
                
                <div className="flex justify-between items-center mt-auto pt-4 
                              border-t border-white/10">
                  <span className="text-sm text-gray-400">
                    Valid until {new Date(offer.validUntil).toLocaleDateString()}
                  </span>
                  <a
                    href={offer.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-full 
                             bg-gradient-to-r from-purple-600 to-pink-600 text-white 
                             hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    {getLinkIcon(offer.linkType)}
                    <span>Claim Now</span>
                    <FaExternalLinkAlt className="text-sm" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BonusCards;