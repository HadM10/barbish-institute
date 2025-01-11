// pages/ClientSide/RecordedSessions.js
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaVideo,
  FaChevronRight,
  FaBookReader,
  FaChevronDown,
} from "react-icons/fa";
import { MdSubscriptions, MdPlayCircle } from "react-icons/md";
import Navbar from "../../components/User/Home/Navbar";
import { getUserSubscribedCourses } from "../../api/userAPI";

const EmptyState = ({ type }) => {
  const content = {
    notLoggedIn: {
      icon: <MdSubscriptions className="text-6xl text-blue-500 mb-4" />,
      title: "Login Required",
      description:
        "Please login to access your courses and learning materials.",
      actionText: "Login Now",
      actionLink: "/login",
    },
    noSubscription: {
      icon: <FaBookReader className="text-6xl text-blue-500 mb-4" />,
      title: "No Active Subscriptions",
      description: "Subscribe to our courses to start your learning journey!",
      actionText: "Browse Courses",
      actionLink: "/courses",
    },
    noSessions: {
      icon: <FaVideo className="text-6xl text-blue-500 mb-4" />,
      title: "No Recorded Sessions",
      description:
        "This course doesn't have any recorded sessions yet. Check back soon!",
      actionText: "Back to Courses",
      actionLink: "/courses",
    },
  };

  const { icon, title, description, actionText, actionLink } = content[type];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
      <div className="flex justify-center">{icon}</div>
      <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-3">{title}</h2>
      <p className="text-gray-600 text-lg mb-8">{description}</p>
      <Link
        to={actionLink}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl 
                 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
      >
        {actionText}
        <FaChevronRight className="ml-2" />
      </Link>
    </div>
  );
};

const RecordedSessions = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [expandedCourses, setExpandedCourses] = useState({});

  const fetchData = useCallback(async () => {
    try {
      const coursesResponse = await getUserSubscribedCourses();

      if (coursesResponse.status === "success") {
        const coursesWithVideos = coursesResponse.data.map((course) => ({
          ...course,
          Sessions: course.Sessions?.map((session, index) => ({
            ...session,
            videoUrl:
              session.videoUrl ||
              `https://www.youtube.com/watch?v=ysz5S6PUM-U&t=${index}`,
            description:
              session.description ||
              `Sample description for session ${index + 1}`,
          })),
        }));

        setCourses(coursesWithVideos);

    } }catch (err) {
      console.error("Error fetching data:", err);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchData();
  }, [fetchData, token]);

  const handleWatchClick = (sessionId) => {
    navigate(`/video-player/${sessionId}`);
  };

  const toggleCourse = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="pt-40 pb-20">
          <EmptyState type="notLoggedIn" />
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="pt-40 pb-20">
          <EmptyState type="noSubscription" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-60 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-12">
            My Learning Journey
          </h1>

          <div className="space-y-8">
            {courses.map((course) => {
              const isExpanded = expandedCourses[course.id];

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transform 
                           transition-all duration-200 hover:shadow-xl"
                >
                  <div
                    onClick={() => toggleCourse(course.id)}
                    className="p-8 bg-gradient-to-r from-blue-600 to-blue-800 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-blue-100 text-lg font-medium">
                          {course.Category?.name}
                        </span>
                        <h2 className="text-2xl font-bold text-white mt-2">
                          {course.title}
                        </h2>
                      </div>
                      <div className="flex items-center gap-4">
                        <FaChevronDown
                          className={`text-white transition-transform duration-300 ${
                            isExpanded ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`divide-y divide-gray-200 transition-all duration-300 ease-in-out
                               ${
                                 isExpanded
                                   ? "max-h-[2000px] opacity-100"
                                   : "max-h-0 opacity-0 overflow-hidden"
                               }`}
                  >
                    {!course.Sessions?.length ? (
                      <div className="p-8">
                        <EmptyState type="noSessions" />
                      </div>
                    ) : (
                      course.Sessions.map((session, index) => {
                        return (
                          <div
                            key={session.id}
                            className="p-8 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                <div
                                  className={`w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center`}
                                >
                                  <MdPlayCircle
                                    className={`text-2xl text-blue-600`}
                                  />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    Session {index + 1}: {session.title}
                                  </h3>
                                  <p className="text-gray-500 mt-1">
                                    {session.description ||
                                      "No description available"}
                                  </p>
                                 
                                </div>
                              </div>

                              <button
                                onClick={() => handleWatchClick(session.id)}
                                className={`flex items-center gap-2 px-6 py-3
                                 "bg-blue-600 hover:bg-blue-700"
                                } text-white rounded-xl transition-all duration-200 
                                transform hover:scale-105 focus:outline-none focus:ring-2 
                                focus:ring-offset-2 focus:ring-blue-500"
                                }`}
                              >
                                <span>
                                  {"Watch Now"}
                                </span>
                                <FaChevronRight className="transition-transform group-hover:translate-x-1" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordedSessions;
