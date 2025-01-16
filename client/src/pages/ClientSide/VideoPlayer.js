import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaExpand, FaCog } from 'react-icons/fa';
import Navbar from '../../components/User/Home/Navbar';

const VideoPlayer = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  
  // Using a regular constant instead of state since we're not updating it yet
  const sessionData = {
    title: "Introduction to React Hooks",
    courseTitle: "Advanced React Development",
    videoUrl: "sample-url"
  };

  useEffect(() => {
    // This will use the sessionId when you implement the API
    console.log('Session ID:', sessionId);
    // Future implementation will go here
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-52 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 px-3 py-1.5 bg-white 
                     text-blue-600 rounded-lg shadow-md hover:shadow-lg 
                     transition-all duration-200 transform hover:scale-105"
          >
            <FaArrowLeft className="text-base" />
            <span className="font-medium text-sm">Back to Sessions</span>
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-800">
              <p className="text-blue-100 text-xs mb-1">{sessionData.courseTitle}</p>
              <h1 className="text-lg font-bold text-white">{sessionData.title}</h1>
            </div>

            <div className="relative">
              <div className="bg-black aspect-video w-full">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-white text-opacity-80 text-sm">
                    Video Content
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex flex-col gap-1.5">
                  <div className="w-full bg-gray-600 h-0.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 w-1/3 h-full rounded-full"></div>
                  </div>

                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <button className="hover:text-blue-400 transition-colors">
                        <FaPlay className="text-base" />
                      </button>
                      <span className="text-xs">00:00 / 45:00</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="hover:text-blue-400 transition-colors">
                        <FaCog className="text-base" />
                      </button>
                      <button className="hover:text-blue-400 transition-colors">
                        <FaExpand className="text-base" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 