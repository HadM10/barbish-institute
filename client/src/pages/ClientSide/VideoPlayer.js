import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPlay, FaExpand, FaCog } from "react-icons/fa";
import Navbar from "../../components/User/Home/Navbar";
import { getSessionById } from "../../api/sessionAPI";

const VideoPlayer = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await getSessionById(sessionId);
        if (response.success) {
          setSessionData(response.data);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
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
              <p className="text-blue-100 text-xs mb-1">
                {sessionData?.Course?.title}
              </p>
              <h1 className="text-lg font-bold text-white">
                {sessionData?.title}
              </h1>
            </div>

            <div className="relative">
              {sessionData?.videoUrl ? (
                <video
                  className="w-full aspect-video"
                  controls
                  src={sessionData.videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="bg-black aspect-video w-full">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-white text-opacity-80 text-sm">
                      Loading video...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
