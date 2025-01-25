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
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

// Import your API functions
import {
  getAllBonCards,
  createBonCard,
  updateBonCard,
  deleteBonCard,
} from "../../api/BonCardAPI";

// Only adding image caching function
const getCachedImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error("Image load failed"));
  });
};

// Notification Component
const Notification = ({ message, type }) => {
  const bgColor =
    type === "error" || type === "delete" ? "bg-red-500" : "bg-emerald-500";

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${bgColor}`}
    >
      {type === "delete" ? (
        <TrashIcon className="w-6 h-6 text-white" />
      ) : type === "success" ? (
        <CheckCircleIcon className="w-6 h-6 text-white" />
      ) : (
        <XCircleIcon className="w-6 h-6 text-white" />
      )}
      <p className="text-white font-medium">{message}</p>
    </motion.div>
  );
};

const formatPrice = (price) => {
  if (!price) return "0.00";
  const numPrice = parseFloat(price);
  return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
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
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchBonCards = async () => {
      try {
        const res = await getAllBonCards();
        if (res.success) {
          setBonCards(res.data);
        } else {
          showNotification("Failed to fetch bonus cards", "error");
        }
      } catch (error) {
        showNotification("Error loading bonus cards", "error");
      }
    };

    fetchBonCards();
  }, []); // Empty dependency array since we're defining fetchBonCards inside useEffect

  // Only modification: Add image caching when loading images
  useEffect(() => {
    bonCards.forEach((card) => {
      if (card.image) {
        getCachedImage(card.image).catch(() => {
          // Silently handle failed image loads
        });
      }
    });
  }, [bonCards]);

  const handleEdit = (bonCard) => {
    setIsEditing(true);
    setEditId(bonCard.id);
    setFormData({
      title: bonCard.title || "",
      description: bonCard.description || "",
      image: null, // Don't set the image file, just keep the URL
      price: bonCard.price || "",
      link: bonCard.link || "",
      expiredDate: bonCard.expiredDate ? bonCard.expiredDate.split("T")[0] : "",
    });
    setImagePreview(bonCard.image); // Set the image preview to current image URL
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
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
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
    setShowModal(false);
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.title || !formData.description || !formData.price) {
      showNotification("Please fill in all required fields", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        const res = await updateBonCard(editId, formData);
        if (res.success) {
          setBonCards((prev) =>
            prev.map((card) =>
              card.id === editId
                ? { ...card, ...formData, image: res.data.image }
                : card
            )
          );
          showNotification("Bonus card updated successfully!");
        } else {
          showNotification(
            "Failed to update bonus card: " + (res.message || "Unknown error"),
            "error"
          );
        }
      } else {
        const res = await createBonCard(formData);
        if (res.success) {
          const newBonCard = res.data;
          const adapted = {
            ...newBonCard,
            image: newBonCard.image,
          };
          setBonCards((prev) => [...prev, adapted]);
          showNotification("Bonus card created successfully!");
        } else {
          showNotification(
            "Failed to create bonus card: " + (res.message || "Unknown error"),
            "error"
          );
        }
      }
      resetForm();
    } catch (error) {
      showNotification("Operation failed: " + error.message, "error");
    } finally {
      setIsSubmitting(false);
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
          showNotification("Bonus card deleted successfully", "delete");
        } else {
          showNotification(
            res.message || "Failed to delete bonus card",
            "error"
          );
        }
      } catch (error) {
        showNotification(error.message || "Error deleting bonus card", "error");
      }
    }
  };

  const filteredBonCards = bonCards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.price.toString().includes(searchTerm)
  );

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
              <p className="text-gray-600 mt-2">Manage your bonus cards</p>
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
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Title
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-white font-semibold">
                    Description
                  </th>
                  <th className="hidden sm:table-cell px-6 py-4 text-center text-white font-semibold">
                    Price
                  </th>
                  <th className="hidden lg:table-cell px-6 py-4 text-center text-white font-semibold">
                    Expiry Date
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-center text-white font-semibold">
                    Link
                  </th>
                  <th className="px-6 py-4 text-center text-white font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBonCards.map((bonCard) => (
                  <React.Fragment key={bonCard.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {bonCard.image ? (
                            <img
                              src={bonCard.image}
                              alt={bonCard.title}
                              className="h-20 w-20 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/150";
                              }}
                            />
                          ) : (
                            <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500">No Image</span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium">{bonCard.title}</span>
                            <button
                              onClick={() => toggleRowExpansion(bonCard.id)}
                              className="md:hidden text-blue-600 text-sm flex items-center gap-1"
                            >
                              {expandedRows.has(bonCard.id) ? (
                                <>
                                  <span>Show less</span>
                                  <ChevronUpIcon className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  <span>Show more</span>
                                  <ChevronDownIcon className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-gray-600">
                        <div className="max-w-xs lg:max-w-md xl:max-w-lg">
                          <div className="line-clamp-2">
                            {bonCard.description}
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${formatPrice(bonCard.price)}
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 text-center">
                        {new Date(bonCard.expiredDate).toLocaleDateString()}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-center">
                        <a
                          href={bonCard.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {bonCard.link ? "View Link" : "No link available"}
                        </a>
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
                    {expandedRows.has(bonCard.id) && (
                      <tr className="md:hidden bg-gray-50">
                        <td colSpan="6" className="px-6 py-4">
                          <div className="space-y-3">
                            <div>
                              <span className="font-medium">Description:</span>
                              <p className="mt-1 text-gray-600">
                                {bonCard.description}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Price:</span>
                              <p className="mt-1">
                                ${formatPrice(bonCard.price)}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Expiry Date:</span>
                              <p className="mt-1">
                                {new Date(
                                  bonCard.expiredDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Link:</span>
                              <a
                                href={bonCard.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 block text-blue-500 hover:underline"
                              >
                                {bonCard.link
                                  ? "View Link"
                                  : "No link available"}
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
                                setFormData((prev) => ({
                                  ...prev,
                                  image: null,
                                }));
                              }}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500"
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
                              PNG, JPG, GIF up to 10MB
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
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 
                             text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                        {isEditing ? "Updating..." : "Adding..."}
                      </div>
                    ) : isEditing ? (
                      "Update Bonus Card"
                    ) : (
                      "Add Bonus Card"
                    )}
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
