// src/components/Admin/BonusCard.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

// Import your API functions
import {
  getAllBonCards,
  createBonCard,
  updateBonCard,
  deleteBonCard,
} from "../../api/BonCardAPI";

// Notification Component
const Notification = ({ message, type }) => {
  const bgColor = type === 'error' || type === 'delete' 
    ? 'bg-red-500' 
    : 'bg-emerald-500';

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${bgColor}`}
    >
      {type === 'delete' ? (
        <TrashIcon className="w-6 h-6 text-white" />
      ) : type === 'success' ? (
        <CheckCircleIcon className="w-6 h-6 text-white" />
      ) : (
        <XCircleIcon className="w-6 h-6 text-white" />
      )}
      <p className="text-white font-medium">{message}</p>
    </motion.div>
  );
};

const BonusCard = () => {
  const [notification, setNotification] = useState(null);
  const [bonCards, setBonCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    price: "",
    link: "",
    expiredDate: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchBonCards();
  }, []);

  const fetchBonCards = async () => {
    try {
      const res = await getAllBonCards();
      if (res.success) {
        setBonCards(res.data);
      } else {
        showNotification("Failed to fetch bonus cards", 'error');
      }
    } catch (error) {
      showNotification("Error loading bonus cards", 'error');
    }
  };

  const handleEdit = (bonCard) => {
    setIsEditing(true);
    setEditId(bonCard.id);
    setFormData({
      title: bonCard.title,
      description: bonCard.description,
      image: bonCard.image,
      price: bonCard.price,
      link: bonCard.link,
      expiredDate: bonCard.expiredDate ? bonCard.expiredDate.split("T")[0] : "",
    });
    setImagePreview(bonCard.image);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) {
        showNotification("Image size should be less than 5MB", 'error');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
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
      title: "",
      description: "",
      image: null,
      price: "",
      link: "",
      expiredDate: "",
    });
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price) {
      showNotification("Please fill in all required fields", 'error');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        image: imagePreview || "https://via.placeholder.com/400x300",
        price: parseFloat(formData.price) || 0,
        link: formData.link,
        expiredDate: formData.expiredDate || null,
      };

      if (isEditing) {
        const res = await updateBonCard(editId, payload);
        if (res.success) {
          setBonCards((prev) =>
            prev.map((bonCard) => (bonCard.id === editId ? res.data : bonCard))
          );
          showNotification("Bonus card updated successfully!");
        } else {
          showNotification(res.message || "Failed to update bonus card", 'error');
        }
      } else {
        const res = await createBonCard(payload);
        if (res.success) {
          setBonCards((prev) => [...prev, res.data]);
          showNotification("Bonus card created successfully!");
        } else {
          showNotification(res.message || "Failed to create bonus card", 'error');
        }
      }
      resetForm();
    } catch (error) {
      showNotification(error.message || "Operation failed", 'error');
    }
  };

  const deleteBonCardHandler = async (bonCardId) => {
    if (window.confirm("Are you sure you want to delete this bonus card?")) {
      try {
        const res = await deleteBonCard(bonCardId);
        if (res.success) {
          setBonCards((prev) =>
            prev.filter((bonCard) => bonCard.id !== bonCardId)
          );
          showNotification("Bonus card deleted successfully", 'delete');
        } else {
          showNotification(res.message || "Failed to delete bonus card", 'error');
        }
      } catch (error) {
        showNotification(error.message || "Error deleting bonus card", 'error');
      }
    }
  };

  const filteredBonCards = bonCards.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.price.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 p-8">
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                Bonus Cards
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your bonus cards
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bonus cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 
                           focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 
                         text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 
                         flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Bonus Card</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Title</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Description</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Price</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Expiry Date</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBonCards.map((bonCard) => (
                  <tr key={bonCard.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={bonCard.image}
                          alt={bonCard.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-medium">{bonCard.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{bonCard.description}</td>
                    <td className="px-6 py-4 text-center">${bonCard.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      {new Date(bonCard.expiredDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(bonCard)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteBonCardHandler(bonCard.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isEditing ? "Edit Bonus Card" : "Add New Bonus Card"}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    ></textarea>
                  </div>

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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link
                    </label>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      name="expiredDate"
                      value={formData.expiredDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

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
                                setFormData((prev) => ({ ...prev, image: null }));
                              }}
                              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full transform hover:scale-110"
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

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 
                             text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isEditing ? "Update Bonus Card" : "Add Bonus Card"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BonusCard;