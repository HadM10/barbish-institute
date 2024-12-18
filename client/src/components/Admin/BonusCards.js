// src/components/Admin/BonusCards.js
import React, { useState } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  LinkIcon,
  TagIcon,
  ShoppingBagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BonusCard = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: "Premium Gym Membership",
      organization: "FitLife Gym",
      description: "Get 30% off on annual membership. Access to all facilities including pool and spa.",
      originalPrice: 999,
      discountedPrice: 699,
      image: "https://via.placeholder.com/400x300",
      contactType: "website",
      contactLink: "https://fitlifegym.com",
      validUntil: "2024-12-31",
      isActive: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    image: null,
    contactType: 'website',
    contactLink: '',
    validUntil: '',
    isActive: true
  });

  const handleEdit = (offer) => {
    setIsEditing(true);
    setEditId(offer.id);
    setFormData({
      title: offer.title,
      organization: offer.organization,
      description: offer.description,
      originalPrice: offer.originalPrice,
      discountedPrice: offer.discountedPrice,
      image: offer.image,
      contactType: offer.contactType,
      contactLink: offer.contactLink,
      validUntil: offer.validUntil,
      isActive: offer.isActive
    });
    setImagePreview(offer.image);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      organization: '',
      description: '',
      originalPrice: '',
      discountedPrice: '',
      image: null,
      contactType: 'website',
      contactLink: '',
      validUntil: '',
      isActive: true
    });
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.organization || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const offerData = {
      ...formData,
      image: imagePreview || 'https://via.placeholder.com/400x300'
    };

    if (isEditing) {
      setOffers(prev => prev.map(offer => 
        offer.id === editId ? { ...offer, ...offerData } : offer
      ));
      toast.success('Offer updated successfully!');
    } else {
      const newOffer = {
        id: Date.now(),
        ...offerData
      };
      setOffers(prev => [...prev, newOffer]);
      toast.success('Offer added successfully!');
    }

    resetForm();
  };

  const deleteOffer = (offerId) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffers(prev => prev.filter(offer => offer.id !== offerId));
      toast.success('Offer deleted successfully');
    }
  };

  const toggleOfferStatus = (offerId) => {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId 
        ? { ...offer, isActive: !offer.isActive }
        : offer
    ));
    toast.success('Offer status updated successfully');
  };

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bonus Card Offers</h1>
          <p className="text-gray-600 mt-2">Manage collaboration offers and discounts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Offer
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(offer => (
          <div 
            key={offer.id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl ${
              !offer.isActive ? 'opacity-75' : ''
            }`}
          >
            {/* Offer Image */}
            <div className="relative h-48">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 space-x-2">
                <button
                  onClick={() => handleEdit(offer)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <PencilIcon className="w-5 h-5 text-blue-600" />
                </button>
                <button
                  onClick={() => deleteOffer(offer.id)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            {/* Offer Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{offer.title}</h3>
                  <p className="text-gray-600">{offer.organization}</p>
                </div>
                <button
                  onClick={() => toggleOfferStatus(offer.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    offer.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {offer.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">{offer.description}</p>
              
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <TagIcon className="w-5 h-5 mr-2" />
                  <span className="line-through">${offer.originalPrice}</span>
                </div>
                <div className="flex items-center text-indigo-600">
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  <span className="font-semibold">${offer.discountedPrice}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <LinkIcon className="w-5 h-5 mr-2" />
                <a 
                  href={offer.contactLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  {offer.contactType === 'website' ? 'Visit Website' : 'Contact on WhatsApp'}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Offer' : 'Add New Offer'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price ($) *
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discounted Price ($) *
                  </label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Type
                  </label>
                  <select
                    name="contactType"
                    value={formData.contactType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="website">Website</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Link *
                  </label>
                  <input
                    type="text"
                    name="contactLink"
                    value={formData.contactLink}
                    onChange={handleInputChange}
                    placeholder={formData.contactType === 'whatsapp' ? 'WhatsApp number' : 'Website URL'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Valid Until */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until *
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  required
                ></textarea>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-32 w-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image: null }));
                          }}
                          className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full transform transition-transform duration-200 hover:scale-110"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleImageChange}
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transform transition-all duration-200 hover:scale-105"
                >
                  {isEditing ? 'Update Offer' : 'Add Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BonusCard;