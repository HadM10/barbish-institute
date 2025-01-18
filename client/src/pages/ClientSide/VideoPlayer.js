import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
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

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    let videoId = '';
    
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    } else {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      videoId = match && match[2].length === 11 ? match[2] : null;
    }

    if (!videoId) return null;

    videoId = videoId.trim();
    const params = new URLSearchParams({
      rel: 0,
      modestbranding: 1,
      controls: 1,
      showinfo: 0,
      iv_load_policy: 3,
      fs: 1,
      playsinline: 1,
    });
    
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
                    {/* Main corner overlay */}
                    <div 
                      className="overlay absolute top-0 right-0 z-[9999]"
                      style={{ 
                        width: 'clamp(120px, 25%, 170px)',
                        height: 'clamp(120px, 25%, 170px)',
                        background: 'rgba(0,0,0,0.01)',
                        pointerEvents: 'auto',
                      }}
                      onClick={(e) => e.preventDefault()}
                    ></div>
                    {/* Bottom share overlay */}
                    <div 
                      className="overlay absolute bottom-0 right-0 z-[9999]"
                      style={{ 
                        width: 'clamp(120px, 25%, 170px)',
                        height: 'clamp(40px, 8%, 48px)',
                        background: 'rgba(0,0,0,0.01)',
                        pointerEvents: 'auto',
                      }}
                      onClick={(e) => e.preventDefault()}
                    ></div>
                    {/* YouTube logo overlay */}
                    <div 
                      className="overlay absolute top-0 left-0 z-[9999]"
                      style={{ 
                        width: 'clamp(80px, 15%, 90px)',
                        height: 'clamp(35px, 7%, 40px)',
                        background: 'rgba(0,0,0,0.01)',
                        pointerEvents: 'auto',
                      }}
                      onClick={(e) => e.preventDefault()}
                    ></div>
                    <iframe
                      className="w-full h-full"
                      src={getYouTubeEmbedUrl(sessionData.videoUrl)}
                      title="Video Player"
                      frameBorder="0"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    ></iframe>
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