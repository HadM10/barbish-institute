// src/components/Admin/BonusCard.js
import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your API functions
import {
  getAllBonCards,
  createBonCard,
  updateBonCard,
  deleteBonCard
} from '../../api/BonCardAPI';

const BonusCard = () => {
  // State
  const [bonCards, setBonCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Define form data based on the BonCard model
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    price: '',
    expiredDate: ''
  });

  // Fetch all BonCards on component mount
  useEffect(() => {
    fetchBonCards();
  }, []);

  const fetchBonCards = async () => {
    try {
      const res = await getAllBonCards();
      if (res.success) {
        setBonCards(res.data);
      } else {
        toast.error('Failed to fetch BonCards: ' + (res.message || 'Unknown error'));
      }
    } catch (error) {
      toast.error('Error fetching BonCards: ' + error.message);
    }
  };

  // Handle open modal for editing
  const handleEdit = (bonCard) => {
    setIsEditing(true);
    setEditId(bonCard.id);
    setFormData({
      title: bonCard.title,
      description: bonCard.description,
      image: bonCard.image,
      price: bonCard.price,
      expiredDate: bonCard.expiredDate ? bonCard.expiredDate.split('T')[0] : ''
    });
    setImagePreview(bonCard.image);
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
      description: '',
      image: null,
      price: '',
      expiredDate: ''
    });
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
    setShowModal(false);
  };

  // Create or Update in the DB
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Prepare payload based on the BonCard model
      const payload = {
        title: formData.title,
        description: formData.description,
        // If handling actual image uploads, integrate accordingly.
        image: imagePreview || 'https://via.placeholder.com/400x300',
        price: parseFloat(formData.price) || 0,
        expiredDate: formData.expiredDate || null
      };

      if (isEditing) {
        // Update existing BonCard
        const res = await updateBonCard(editId, payload);
        if (res.success) {
          // Update the local state
          setBonCards(prev =>
            prev.map(bonCard =>
              bonCard.id === editId ? res.data : bonCard
            )
          );
          toast.success('BonCard updated successfully!');
        } else {
          toast.error('Failed to update BonCard: ' + (res.message || 'Unknown error'));
        }
      } else {
        // Create new BonCard
        const res = await createBonCard(payload);
        if (res.success) {
          setBonCards(prev => [...prev, res.data]);
          toast.success('BonCard created successfully!');
        } else {
          toast.error('Failed to create BonCard: ' + (res.message || 'Unknown error'));
        }
      }
    } catch (error) {
      toast.error('Operation failed: ' + error.message);
    } finally {
      resetForm();
    }
  };

  // Delete from the DB
  const deleteBonCardHandler = async (bonCardId) => {
    if (window.confirm('Are you sure you want to delete this BonCard?')) {
      try {
        const res = await deleteBonCard(bonCardId);
        if (res.success) {
          setBonCards(prev => prev.filter(bonCard => bonCard.id !== bonCardId));
          toast.success('BonCard deleted successfully');
        } else {
          toast.error('Failed to delete BonCard: ' + (res.message || 'Unknown error'));
        }
      } catch (error) {
        toast.error('Error deleting BonCard: ' + error.message);
      }
    }
  };

  // Same UI as before but adjusted to the BonCard model
  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bonus Cards</h1>
          <p className="text-gray-600 mt-2">Manage your bonus cards</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New BonCard
        </button>
      </div>

      {/* BonCards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bonCards.map(bonCard => (
          <div 
            key={bonCard.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
          >
            {/* BonCard Image */}
            <div className="relative h-48">
              <img
                src={bonCard.image}
                alt={bonCard.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 space-x-2">
                <button
                  onClick={() => handleEdit(bonCard)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <PencilIcon className="w-5 h-5 text-blue-600" />
                </button>
                <button
                  onClick={() => deleteBonCardHandler(bonCard.id)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            {/* BonCard Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800">{bonCard.title}</h3>
              <p className="text-gray-600 mb-4">{bonCard.description}</p>
              
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <span className="font-semibold">Price:</span>
                  <span className="ml-2 text-indigo-600">${bonCard.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <span className="font-semibold">Expires On:</span>
                <span className="ml-2">{new Date(bonCard.expiredDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit BonCard' : 'Add New BonCard'}
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
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
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
                    Description *
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

                {/* Pricing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Expiration Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    name="expiredDate"
                    value={formData.expiredDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
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
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
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
                  {isEditing ? 'Update BonCard' : 'Add BonCard'}
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
