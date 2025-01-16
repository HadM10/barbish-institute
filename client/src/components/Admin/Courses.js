/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import {
  getAllCourses,
  createCourse,
  updateCourse as updateCourseAPI,
  deleteCourse as deleteCourseAPI,
} from "../../api/courseAPI";
import CategoryAPI from "../../api/categoryAPI";

// Custom Notification Component
const Notification = ({ message, type, onClose }) => {
  const bgColor =
    type === "error" || type === "delete" ? "bg-red-500" : "bg-emerald-500";

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 
                rounded-lg shadow-lg ${bgColor}`}
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

const CourseTable = ({
  courses,
  categories,
  onEdit,
  onDelete,
  onArchive,
  searchTerm,
  showArchived,
}) => {
  const [expandedRows, setExpandedRows] = useState({});

  // Filter courses based on search term and archived status
  const filteredCourses = courses.filter(
    (course) =>
      course.isArchived === showArchived &&
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group filtered courses by category and filter out empty categories
  const groupedCourses = filteredCourses.reduce((acc, course) => {
    if (!acc[course.categoryName]) {
      acc[course.categoryName] = [];
    }
    acc[course.categoryName].push(course);
    return acc;
  }, {});

  // Filter out categories with no active courses when viewing active courses
  const activeCategories = Object.entries(groupedCourses).filter(
    ([category, courses]) => {
      if (showArchived) {
        return courses.length > 0;
      }
      return courses.some((course) => !course.isArchived);
    }
  );

  const toggleRow = (courseId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  return (
    <div className="space-y-6">
      {activeCategories.map(([category, categoryCourses]) => (
        <div
          key={category}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">{category}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categoryCourses.map((course) => (
                  <React.Fragment key={course.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {course.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {course.instructor}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {course.duration} hours
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-green-800 text-sm font-medium bg-green-100 rounded-full">
                          ${course.price}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => toggleRow(course.id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            {expandedRows[course.id] ? (
                              <ChevronUpIcon className="w-5 h-5" />
                            ) : (
                              <ChevronDownIcon className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => onEdit(course)}
                            className="text-blue-400 hover:text-blue-500"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => onDelete(course.id)}
                            className="text-red-400 hover:text-red-500"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => onArchive(course.id)}
                            className="text-yellow-400 hover:text-yellow-500"
                          >
                            <ArchiveBoxIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRows[course.id] && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Description
                              </h4>
                              <p className="mt-1 text-gray-500">
                                {course.description}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Course Content
                              </h4>
                              <ul className="mt-1 space-y-1">
                                {course.content.map((item, index) => (
                                  <li
                                    key={index}
                                    className="text-gray-500 flex items-center"
                                  >
                                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
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
      ))}
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [notification, setNotification] = useState(null);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Find this useEffect in your Courses.js
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        showNotification(
          "Failed to fetch categories: " + (res.message || "Unknown error"),
          "error"
        );
      }
    } catch (error) {
      showNotification("Error fetching categories: " + error.message, "error");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      if (res.success) {
        const adapted = res.data.map((dbCourse) => ({
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
        }));
        setCourses(adapted);
      } else {
        showNotification(
          "Failed to fetch courses: " + (res.message || "Unknown error"),
          "error"
        );
      }
    } catch (error) {
      showNotification("Error fetching courses: " + error.message, "error");
    }
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (course) => {
    setIsEditing(true);
    setFormData({
      ...course,
      content: Array.isArray(course.content)
        ? course.content.join("\n")
        : course.content || "",
    });
    setImagePreview(course.image);
    setShowModal(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const res = await deleteCourseAPI(courseId);
        if (res.success) {
          setCourses((prev) => prev.filter((course) => course.id !== courseId));
          showNotification("Course deleted successfully!", "delete");
        } else {
          showNotification(
            "Failed to delete course: " + (res.message || "Unknown error"),
            "error"
          );
        }
      } catch (error) {
        showNotification("Error deleting course: " + error.message, "error");
      }
    }
  };

  const handleArchive = async (courseId) => {
    try {
      const course = courses.find((c) => c.id === courseId);
      const res = await updateCourseAPI(courseId, {
        isArchived: !course.isArchived,
      });
      if (res.success) {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId ? { ...c, isArchived: !c.isArchived } : c
          )
        );
        showNotification(
          `Course ${
            course.isArchived ? "unarchived" : "archived"
          } successfully!`
        );
      }
    } catch (error) {
      showNotification("Failed to archive course: " + error.message, "error");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.categoryName
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    const selectedCategory = categories.find(
      (category) => category.name === formData.categoryName
    );

    const categoryId = selectedCategory.id;

    // Create payload with FormData
    const dbPayload = {
      title: formData.title,
      description: formData.description,
      content: formData.content,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration) || 0,
      instructor: formData.instructor,
      isArchived: false,
      categoryId,
    };

    // Add image only if it's a File object
    if (formData.image instanceof File) {
      dbPayload.image = formData.image;
    }

    try {
      if (isEditing && formData.id) {
        const res = await updateCourseAPI(formData.id, dbPayload);
        if (res.success) {
          setCourses((prev) =>
            prev.map((course) =>
              course.id === formData.id
                ? {
                    ...course,
                    ...formData,
                    image: res.data.image || course.image, // Use new image URL from response
                    categoryName: selectedCategory.name,
                  }
                : course
            )
          );
          showNotification("Course updated successfully!");
        } else {
          showNotification(
            "Failed to update course: " + (res.message || "Unknown error"),
            "error"
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
              ? newCourse.content
              : newCourse.content?.split("\n") || [],
            price: newCourse.price || 0,
            duration: newCourse.duration || 0,
            instructor: newCourse.instructor,
            image: newCourse.image, // Use image URL from response
            isArchived: newCourse.isArchived,
            categoryName: selectedCategory.name,
          };
          setCourses((prev) => [...prev, adapted]);
          showNotification("Course created successfully!");
        } else {
          showNotification(
            "Failed to create course: " + (res.message || "Unknown error"),
            "error"
          );
        }
      }
      resetForm();
    } catch (error) {
      showNotification("Operation failed: " + error.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Course Management
              </h1>
              <p className="text-gray-500 mt-1">Manage your course catalog</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Search courses or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className="flex-shrink-0 flex items-center px-4 py-2 bg-gradient-to-r 
                          from-yellow-600 to-amber-600 text-white rounded-lg 
                          hover:shadow-lg transition-all"
              >
                <ArchiveBoxIcon className="w-5 h-5 mr-2" />
                {showArchived ? "View Active" : "View Archived"}
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(true)}
                className="flex-shrink-0 flex items-center px-4 py-2 bg-gradient-to-r 
                          from-purple-600 to-indigo-600 text-white rounded-lg 
                          hover:shadow-lg transition-all"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Course
              </motion.button>
            </div>
          </div>

          {searchTerm && (
            <div className="mt-4 text-sm text-gray-500">
              Showing results for "{searchTerm}"
              <button
                onClick={() => setSearchTerm("")}
                className="ml-2 text-purple-600 hover:text-purple-700"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        <CourseTable
          courses={courses}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onArchive={handleArchive}
          searchTerm={searchTerm}
          showArchived={showArchived}
        />

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
                       flex items-center justify-center p-4"
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
                    <div className="mb-4">
                      <label>Category *</label>
                      <select
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleInputChange}
                        className="form-select mt-2 block w-full px-4 py-2 bg-white border border-gray-300 
                                   rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
    </div>
  );
};

export default Courses;
