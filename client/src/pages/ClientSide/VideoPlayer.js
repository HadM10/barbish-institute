import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../../components/User/Home/Navbar";
import { getSessionById } from "../../api/sessionAPI";

const VideoPlayer = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [showSecurityOverlay, setShowSecurityOverlay] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await getSessionById(sessionId);
        if (response.success) {
          setSessionData(response.data);
          setVideoError(false); // Reset error state when new video loads
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setVideoError(true);
      }
    };

    fetchSession();

    // Add message listener for YouTube player events
    window.addEventListener("message", handleYouTubeEvent);
    return () => window.removeEventListener("message", handleYouTubeEvent);
  }, [sessionId]);

  // Handle YouTube player events
  const handleYouTubeEvent = (event) => {
    if (event.origin.includes("youtube")) {
      // YouTube iframe API sends events as objects with info property
      const eventData = JSON.stringify(event.data).toLowerCase();

      // Check if the event data contains these strings
      if (
        eventData.includes("share") ||
        eventData.includes("playlist") ||
        eventData.includes("watch-later")
      ) {
        setShowSecurityOverlay(true);
      }
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    let videoId = "";

    // Clean the URL first
    url = url.trim();

    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split(/[?#&]/)[0];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split(/[?#]/)[0];
    } else {
      const regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      videoId = match && match[7].length === 11 ? match[7] : null;
    }

    if (!videoId) return null;

    videoId = videoId.trim();
    // Updated parameters for better compatibility
    const params = new URLSearchParams({
      rel: 0,
      modestbranding: 1,
      controls: 1,
      showinfo: 0,
      iv_load_policy: 3,
      fs: 1,
      playsinline: 1,
      enablejsapi: 1,
      origin: window.location.origin,
      widget_referrer: window.location.origin,
      disablekb: 1,
      cc_load_policy: 0,
      autoplay: 0,
    });

    // Use regular youtube.com instead of youtube-nocookie.com for better compatibility
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

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
                <div className="aspect-video relative">
                  <div className="video-container relative w-full h-full">
                    <iframe
                      className="w-full h-full"
                      src={getYouTubeEmbedUrl(sessionData.videoUrl)}
                      title="Video Player"
                      frameBorder="0"
                      sandbox="allow-same-origin allow-scripts allow-forms allow-presentation"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                      onError={() => setVideoError(true)}
                    />

                    {videoError && (
                      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                        <div className="text-center text-white px-4">
                          <svg
                            className="w-16 h-16 mx-auto mb-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <h3 className="text-xl font-bold mb-2">
                            Video Unavailable
                          </h3>
                          <p className="text-gray-400">
                            This video is currently unavailable. Please try
                            again later or contact support.
                          </p>
                        </div>
                      </div>
                    )}

                    {showSecurityOverlay && (
                      <div
                        className="fixed inset-0 z-[99999] backdrop-blur-md bg-black/70
                                 flex items-center justify-center"
                        onClick={() => setShowSecurityOverlay(false)}
                      >
                        <div
                          className="bg-white rounded-xl p-6 max-w-md mx-4 text-center
                                   transform transition-all duration-300
                                   shadow-2xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="mb-4">
                            <div
                              className="w-16 h-16 bg-red-100 rounded-full mx-auto
                                          flex items-center justify-center"
                            >
                              <svg
                                className="w-8 h-8 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m0 0v2m0-2h2m-2 0H10m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Action Not Allowed
                          </h3>
                          <p className="text-gray-600 mb-6">
                            This is a private video session. Sharing, saving,
                            and external links are disabled.
                          </p>

                          <button
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700
                                     text-white rounded-lg font-medium
                                     hover:from-blue-700 hover:to-blue-800
                                     transition-all duration-300"
                            onClick={() => setShowSecurityOverlay(false)}
                          >
                            Return to Video
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
