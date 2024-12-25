// pages/ClientSide/Courses.js
import React, { useState, useEffect, useRef } from "react";
import {
  FaWhatsapp,
  FaFilter,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaClock,
  FaUser,
  FaDollarSign,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import course from "../../assets/images/course.png";

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);
  const [overflowCategories, setOverflowCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const categoryContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  const categories = [
    { id: "all", name: "All Courses", count: 45 },
    { id: "web", name: "Web Development", count: 8 },
    { id: "mobile", name: "Mobile Development", count: 6 },
    { id: "data", name: "Data Science", count: 5 },
    { id: "ai", name: "AI & Machine Learning", count: 4 },
    { id: "cloud", name: "Cloud Computing", count: 4 },
    { id: "cyber", name: "Cyber Security", count: 3 },
    { id: "design", name: "UI/UX Design", count: 4 },
    { id: "digital", name: "Digital Marketing", count: 3 },
    { id: "business", name: "Business Analytics", count: 3 },
    { id: "devops", name: "DevOps", count: 4 },
    { id: "blockchain", name: "Blockchain", count: 3 },
    { id: "game", name: "Game Development", count: 4 },
    { id: "iot", name: "IoT Development", count: 3 },
    { id: "testing", name: "Software Testing", count: 5 },
    { id: "frontend", name: "Frontend Development", count: 6 },
    { id: "backend", name: "Backend Development", count: 7 },
    { id: "fullstack", name: "Full Stack", count: 4 },
    { id: "python", name: "Python Programming", count: 5 },
    { id: "javascript", name: "JavaScript", count: 6 },
  ];

  const coursesData = {
    "Web Development": [
      {
        id: 1,
        title: "Full Stack Development",
        image: course,
        shortDescription:
          "Master modern web development with React and Node.js",
        fullDescription:
          "Comprehensive course covering front-end and back-end development with modern technologies. Learn React, Node.js, and more.",
        duration: "12 weeks",
        instructor: "John Smith",
        price: "$499",
        category: "web",
      },
      {
        id: 2,
        title: "Advanced JavaScript",
        image: course,
        shortDescription: "Deep dive into modern JavaScript concepts",
        fullDescription:
          "Master advanced JavaScript concepts and modern development practices.",
        duration: "8 weeks",
        instructor: "Sarah Johnson",
        price: "$399",
        category: "web",
      },
    ],
    "Mobile Development": [
      {
        id: 3,
        title: "iOS App Development",
        image: course,
        shortDescription: "Build iOS apps with Swift",
        fullDescription:
          "Learn to create professional iOS applications using Swift and Xcode.",
        duration: "10 weeks",
        instructor: "Mike Chen",
        price: "$599",
        category: "mobile",
      },
      {
        id: 4,
        title: "Android Development",
        image: course,
        shortDescription: "Create Android apps with Kotlin",
        fullDescription:
          "Master Android app development using Kotlin and Android Studio.",
        duration: "10 weeks",
        instructor: "Lisa Wong",
        price: "$599",
        category: "mobile",
      },
    ],
    "Data Science": [
      {
        id: 5,
        title: "Data Analysis with Python",
        image: course,
        shortDescription: "Master data analysis techniques",
        fullDescription:
          "Learn to analyze and visualize data using Python and popular libraries.",
        duration: "12 weeks",
        instructor: "David Miller",
        price: "$699",
        category: "data",
      },
      {
        id: 6,
        title: "Machine Learning Basics",
        image: course,
        shortDescription: "Introduction to ML algorithms",
        fullDescription:
          "Understanding fundamental machine learning concepts and implementations.",
        duration: "14 weeks",
        instructor: "Emma Wilson",
        price: "$799",
        category: "data",
      },
    ],
    "AI & Machine Learning": [
      {
        id: 7,
        title: "Deep Learning Fundamentals",
        image: course,
        shortDescription: "Master neural networks and deep learning",
        fullDescription:
          "Comprehensive course on deep learning architectures and applications.",
        duration: "16 weeks",
        instructor: "Alex Zhang",
        price: "$899",
        category: "ai",
      },
      {
        id: 8,
        title: "Natural Language Processing",
        image: course,
        shortDescription: "Build AI language models",
        fullDescription:
          "Learn to create and implement NLP solutions using modern techniques.",
        duration: "12 weeks",
        instructor: "Maria Garcia",
        price: "$799",
        category: "ai",
      },
    ],
    "Cloud Computing": [
      {
        id: 9,
        title: "AWS Solutions Architect",
        image: course,
        shortDescription: "Master AWS cloud services",
        fullDescription:
          "Comprehensive AWS cloud architecture and implementation course.",
        duration: "14 weeks",
        instructor: "James Wilson",
        price: "$799",
        category: "cloud",
      },
      {
        id: 10,
        title: "Azure Cloud Development",
        image: course,
        shortDescription: "Build with Microsoft Azure",
        fullDescription:
          "Learn to develop and deploy applications on Microsoft Azure.",
        duration: "12 weeks",
        instructor: "Sarah Miller",
        price: "$699",
        category: "cloud",
      },
    ],
    "Cyber Security": [
      {
        id: 11,
        title: "Network Security",
        image: course,
        shortDescription: "Master network security fundamentals",
        fullDescription:
          "Learn to protect networks and systems from cyber threats.",
        duration: "12 weeks",
        instructor: "Michael Brown",
        price: "$799",
        category: "cyber",
      },
      {
        id: 12,
        title: "Ethical Hacking",
        image: course,
        shortDescription: "Learn penetration testing",
        fullDescription:
          "Master ethical hacking and security assessment techniques.",
        duration: "14 weeks",
        instructor: "David Chen",
        price: "$899",
        category: "cyber",
      },
    ],
    "UI/UX Design": [
      {
        id: 13,
        title: "UI Design Fundamentals",
        image: course,
        shortDescription: "Master modern UI design",
        fullDescription:
          "Learn to create beautiful and functional user interfaces.",
        duration: "10 weeks",
        instructor: "Emily Taylor",
        price: "$599",
        category: "design",
      },
      {
        id: 14,
        title: "UX Research & Design",
        image: course,
        shortDescription: "Master user experience design",
        fullDescription:
          "Learn to conduct UX research and create user-centered designs.",
        duration: "12 weeks",
        instructor: "Sophie Wilson",
        price: "$699",
        category: "design",
      },
    ],
    "Digital Marketing": [
      {
        id: 15,
        title: "Digital Marketing Strategy",
        image: course,
        shortDescription: "Master digital marketing",
        fullDescription:
          "Learn comprehensive digital marketing strategies and implementation.",
        duration: "8 weeks",
        instructor: "Tom Anderson",
        price: "$499",
        category: "digital",
      },
      {
        id: 16,
        title: "Social Media Marketing",
        image: course,
        shortDescription: "Master social media platforms",
        fullDescription:
          "Learn to create and execute effective social media campaigns.",
        duration: "6 weeks",
        instructor: "Lisa Parker",
        price: "$399",
        category: "digital",
      },
    ],
    "Business Analytics": [
      {
        id: 17,
        title: "Business Intelligence",
        image: course,
        shortDescription: "Master data-driven decisions",
        fullDescription:
          "Learn to analyze business data and make informed decisions.",
        duration: "10 weeks",
        instructor: "Robert Johnson",
        price: "$699",
        category: "business",
      },
      {
        id: 18,
        title: "Financial Analytics",
        image: course,
        shortDescription: "Master financial data analysis",
        fullDescription:
          "Learn to analyze and interpret financial data and trends.",
        duration: "12 weeks",
        instructor: "Mary Wilson",
        price: "$799",
        category: "business",
      },
    ],
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (categoryContainerRef.current) {
        const container = categoryContainerRef.current;
        const containerWidth = container.offsetWidth;
        let totalWidth = 0;
        const visible = [];
        const overflow = [];

        categories.forEach((category) => {
          const approximateWidth = category.name.length * 10 + 80;
          if (totalWidth + approximateWidth < containerWidth - 200) {
            totalWidth += approximateWidth;
            visible.push(category);
          } else {
            overflow.push(category);
          }
        });

        setVisibleCategories(visible);
        setOverflowCategories(overflow);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const CourseCard = ({ course }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className="relative group animate-fadeIn">
        <div
          className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer h-[420px] 
                     transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]
                     border border-border/10"
          onClick={() => setIsExpanded(true)}
        >
          <div className="h-48 relative overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="absolute w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>
          <div className="p-6 h-[calc(420px-192px)] flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-text/80 mb-4 line-clamp-3">
                {course.shortDescription}
              </p>
            </div>
            <button
              className="w-full bg-highlight text-white py-3 rounded-lg hover:bg-secondary 
                       transition-all duration-300 flex items-center justify-center gap-2
                       shadow-lg hover:shadow-highlight/20"
              onClick={(e) => e.stopPropagation()}
            >
              <FaWhatsapp className="text-lg" />
              <span>Enquire Now</span>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div
            className="fixed inset-0 bg-primary/90 flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={() => setIsExpanded(false)}
          >
            <div
              className="bg-white rounded-xl overflow-hidden max-w-3xl w-full animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="w-full h-[400px] relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 
                           hover:bg-white/20 transition-colors duration-300 flex items-center justify-center"
                >
                  <FaTimes className="text-white" />
                </button>
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">
                  {course.title}
                </h2>

                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <FaClock className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text/60">Duration</p>
                      <p className="font-medium">{course.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <FaUser className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text/60">Instructor</p>
                      <p className="font-medium">{course.instructor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <FaDollarSign className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text/60">Price</p>
                      <p className="font-medium">{course.price}</p>
                    </div>
                  </div>
                </div>

                <p className="text-text mb-8 leading-relaxed">
                  {course.fullDescription}
                </p>

                <div className="flex items-center gap-4">
                  <button
                    className="flex-1 bg-highlight text-white px-8 py-3 rounded-lg hover:bg-secondary 
                             transition-all duration-300 flex items-center justify-center gap-2
                             shadow-lg hover:shadow-highlight/20"
                  >
                    <FaWhatsapp className="text-lg" />
                    <span>Enquire Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const filteredCourses = Object.values(coursesData)
    .flat()
    .filter((course) => {
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  return (
    <div className="min-h-screen bg-background">
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 
                    ${isScrolled ? "bg-primary shadow-lg" : "bg-transparent"}`}
      >
        <div className="container mx-auto px-4">
          <div className="h-[104px] flex items-center justify-between">
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 rounded-full bg-white/10 border border-white/20 
                         text-white placeholder-white/60 focus:outline-none focus:ring-2 
                         focus:ring-highlight/50"
              />
              <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[104px]">
        <div className="bg-gradient-to-br from-primary via-primary to-secondary">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sky mb-4">
                Our Courses
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Transform Your Career with Professional Training
              </h1>
              <p className="text-xl text-sky/90 leading-relaxed">
                Choose from our wide range of industry-focused courses designed
                to help you succeed
              </p>
            </div>
          </div>
        </div>

        <div className="sticky top-[104px] bg-white shadow-sm z-30">
          <div className="container mx-auto px-4">
            <div className="relative flex items-center justify-between">
              <div
                ref={scrollContainerRef}
                className="flex-1 flex items-center gap-3 py-4 mr-36 overflow-x-hidden"
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 flex items-center px-6 py-2.5 rounded-full
                      ${
                        selectedCategory === category.id
                          ? "bg-highlight text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <span>{category.name}</span>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-sm 
                      ${
                        selectedCategory === category.id
                          ? "bg-white/20"
                          : "bg-white"
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="absolute right-4 z-20">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white hover:bg-primary/90"
                >
                  <FaChevronDown
                    className={`transition-transform duration-200 ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                  <span>See More</span>
                </button>

                {showFilters && (
                  <>
                    <div
                      className="fixed inset-0 bg-black/20 z-40"
                      onClick={() => setShowFilters(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">
                          All Categories
                        </h3>
                      </div>
                      <div className="max-h-[60vh] overflow-y-auto">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setShowFilters(false);
                            }}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                          >
                            <span className="text-gray-700">
                              {category.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-sm">
                              {category.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-primary mb-2">
                No courses found
              </h3>
              <p className="text-text/60">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
