import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllCourses,
  createCourse,
  updateCourse as updateCourseAPI,
  deleteCourse as deleteCourseAPI,
} from "../../api/courseAPI";

import CategoryAPI from "../../api/categoryAPI";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    image: "",
    description: "",
    content: "",
    price: "",
    duration: "",
    instructor: "",
    isArchived: false,
    categoryName: "",
  });
  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await CategoryAPI.getAllCategories();
      if (res.success) {
        setCategories(res.data.data);
      } else {
        toast.error(
          "Failed to fetch categories: " + (res.message || "Unknown error")
        );
      }
    } catch (error) {
      toast.error("Error fetching categories: " + error.message);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      if (res.success) {
        const adapted = res.data.map((dbCourse) => {
          return {
          id: dbCourse.id,
          title: dbCourse.title,
          image: dbCourse.image || "https://via.placeholder.com/400x300",
          description: dbCourse.description,
          content: Array.isArray(dbCourse.content)
            ? dbCourse.content
            : dbCourse.content?.split("\n") || [],
          price: dbCourse.price,
          duration: dbCourse.duration,
          instructor: dbCourse.instructor,
          isArchived: dbCourse.isArchived,
          categoryName: dbCourse.Category?.name || "Unknown Category",
        };
        });
        setCourses(adapted);
      } else {
        toast.error(
          "Failed to fetch courses: " + (res.message || "Unknown error")
        );
      }
    } catch (error) {
      toast.error("Error fetching courses: " + error.message);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryName") {
      categories.find((category) => category.categoryName === value);

      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.categoryName
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    const selectedCategory = categories.find(
      (category) => category.name === formData.categoryName
    );

    const categoryId = selectedCategory.id;

    const dbPayload = {
      title: formData.title,
      image: imagePreview || "https://via.placeholder.com/400x300",
      description: formData.description,
      content: formData.content,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration) || 0,
      instructor: formData.instructor,
      isArchived: false,
      categoryId,
    };
    try {
      if (isEditing && formData.id) {
        const res = await updateCourseAPI(formData.id, dbPayload);
        if (res.success) {
          setCourses((prev) =>
            prev.map((course) =>
              course.id === formData.id ? { ...course,
                ...formData,  categoryName: selectedCategory.name, } : course
            )
          );
          toast.success("Course updated successfully!");
        } else {
          toast.error(
            "Failed to update course: " + (res.message || "Unknown error")
          );
        }
      } else {
        const res = await createCourse(dbPayload);
        if (res.success) {
          const newCourse = res.data;
          const adapted = {
            id: newCourse.id,
            title: newCourse.title,
            description: newCourse.description,
            content: Array.isArray(newCourse.content)
              ? newCourse.content.join("\n")
              : newCourse.content,
            price: newCourse.price || 0,
            duration: newCourse.duration || 0,
            instructor: newCourse.instructor,
            isArchived: newCourse.isArchived ? "Archived" : "Active",
            categoryName: selectedCategory.name,
          };
          setCourses((prev) => [...prev, adapted]);
          toast.success("Course created successfully!");
        } else {
          toast.error(
            "Failed to create course: " + (res.message || "Unknown error")
          );
        }
      }
    } catch (error) {
      toast.error("Operation failed: " + error.message);
    }

    resetForm();
  };

  const handleEdit = (course) => {
    setIsEditing(true);
    setFormData({
      ...course,
      content: Array.isArray(course.content)
        ? course.content.join("\n")
        : course.content || "",
      id: course.id,
    });
    setImagePreview(course.image);
    setShowModal(true);
  };
  const deleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const res = await deleteCourseAPI(courseId);
        if (res.success) {
          setCourses((prev) => prev.filter((course) => course.id !== courseId));
          toast.success("Course deleted successfully!");
        } else {
          toast.error(
            "Failed to delete course: " + (res.message || "Unknown error")
          );
        }
      } catch (error) {
        toast.error("Error deleting course: " + error.message);
      }
    }
  };
  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      image: "",
      description: "",
      content: "",
      price: "",
      duration: "",
      instructor: "",
      isArchived: false,
      categoryName: "",
    });
    setImagePreview(null);
    setShowModal(false);
    setIsEditing(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Course Management
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage your course catalog
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 
                      text-white rounded-xl hover:shadow-lg transition-all duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Course
            </motion.button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {courses.map((course) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 
                         ${
                           expandedCourse === course.id
                             ? "lg:col-span-2 lg:row-span-2"
                             : ""
                         }`}
              >
                <div className="relative pt-[60%] overflow-hidden group">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover object-center 
                            transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(course)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setExpandedCourse(
                          expandedCourse === course.id ? null : course.id
                        )
                      }
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      {expandedCourse === course.id ? (
                        <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteCourse(course.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    </motion.button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors duration-200">
                      {course.title}
                    </h3>
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full font-medium">
                      ${course.price}
                    </span>
                  </div>
                  <div className="flex items-start mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3 mr-2">
                      Category:
                    </h4>
                    <p className="text-gray-600">{course.categoryName}</p>
                  </div>
                  <div className="flex items-start mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3 mr-2">
                      Instructor :
                    </h4>
                    <p className="text-gray-600 mb-4">{course.instructor}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="w-5 h-5 mr-2 text-gray-400" />
                      {course.duration} hours
                    </div>
                  </div>
                  {expandedCourse === course.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-gray-100"
                    >
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Description
                      </h4>
                      <p className="text-gray-600 mb-4">{course.description}</p>

                      <h4 className="font-semibold text-gray-800 mb-3">
                        Course Content
                      </h4>
                      <ul className="space-y-2">
                        {course.content.map((item, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center text-gray-600"
                          >
                            <div className="w-2 h-2 bg-purple-600 rounded-full mr-3" />
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {isEditing ? "Edit Course" : "Add New Course"}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    {/* Category */}
                    <div className="mb-4">
                      <label>
                        Category *
                      </label>
                      <select
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleInputChange}
                        className="form-select mt-2 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price and Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration (hours)
                        </label>
                        <input
                          type="number"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          placeholder="e.g., 12"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    {/* Instructor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructor Name
                      </label>
                      <input
                        type="text"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Image
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-500 transition-colors">
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
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      ></textarea>
                    </div>
                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Content * (One item per line)
                      </label>
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="React Fundamentals&#10;State Management&#10;Routing&#10;API Integration"
                        required
                      ></textarea>
                    </div>
                    {/* Form Buttons */}
                    <div className="flex justify-end space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700"
                      >
                        {isEditing ? "Update Course" : "Add Course"}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
export default Courses;
