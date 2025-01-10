import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCog } from 'react-icons/fa';
import { MdHighQuality } from 'react-icons/md';
import Navbar from '../../components/User/Home/Navbar';

// Updated SAMPLE_VIDEOS with working video URLs
const SAMPLE_VIDEOS = {
  12: {
    qualities: {
      '1080p': 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '720p': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      '480p': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      '360p': 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
    },
    title: 'Advanced Web Development',
    description: 'Learn advanced concepts in web development including modern frameworks and best practices.'
  },
  default: {
    qualities: {
      '1080p': 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      '720p': 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      '480p': 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      '360p': 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4'
    },
    title: 'Sample Course Video',
    description: 'This is a sample video for demonstration purposes.'
  }
};

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuality, setCurrentQuality] = useState('720p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [videoTime, setVideoTime] = useState(0);

  const videoData = SAMPLE_VIDEOS[id] || SAMPLE_VIDEOS.default;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoTime;
    }
  }, [currentQuality, videoTime]);

  const handleQualityChange = (quality) => {
    if (videoRef.current) {
      setVideoTime(videoRef.current.currentTime);
    }
    setCurrentQuality(quality);
    setShowQualityMenu(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center pt-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-60 pb-12">
        <button
          onClick={handleGoBack}
          className="mb-12 flex items-center gap-2 text-gray-600 hover:text-gray-900 
                   transition-colors bg-white px-4 py-2 rounded-lg shadow-sm"
        >
          <FaArrowLeft className="text-xl" />
          <span>Back to Sessions</span>
        </button>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="relative group">
            <div className="aspect-w-16 aspect-h-9">
              <video
                ref={videoRef}
                key={currentQuality}
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
                src={videoData.qualities[currentQuality]}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="absolute bottom-[80px] right-4 opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 z-50">
              <div className="relative">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="bg-black/80 text-white px-4 py-2 rounded-md flex items-center gap-2 
                           hover:bg-black/90 transition-all duration-200"
                >
                  <MdHighQuality className="text-lg" />
                  <span className="text-sm font-medium">{currentQuality}</span>
                  <FaCog 
                    className={`text-sm ${showQualityMenu ? 'rotate-180' : ''} 
                    transition-transform duration-200`} 
                  />
                </button>

                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-1 bg-black/80 rounded-md 
                                overflow-hidden min-w-[120px]">
                    {Object.keys(videoData.qualities).reverse().map((quality) => (
                      <button
                        key={quality}
                        onClick={() => handleQualityChange(quality)}
                        className={`block w-full px-4 py-2 text-sm text-white text-left
                                  hover:bg-white/10 transition-colors duration-150
                                  ${currentQuality === quality ? 'bg-white/20' : ''}`}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {videoData.title}
            </h1>
            <p className="text-gray-600 text-lg">
              {videoData.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 