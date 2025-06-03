import React from "react";
import { Play, Youtube, ExternalLink } from "lucide-react";

const VideoGallery = ({ videos }) => {
  const videos1 = [
    {
      id: "dQw4w9WgXcQ",
      title: "Perfect Tennis Serve Technique",
      description: "Master the fundamentals of a powerful and accurate serve",
      thumbnail:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=225&fit=crop",
      duration: "12:34",
      views: "125K",
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Forehand Power & Control",
      description: "Develop consistency and power in your forehand stroke",
      thumbnail:
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=225&fit=crop",
      duration: "8:45",
      views: "89K",
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Mental Game Strategies",
      description: "Build confidence and focus under pressure",
      thumbnail:
        "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=225&fit=crop",
      duration: "15:22",
      views: "67K",
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Beginner Tennis Basics",
      description: "Essential skills every new player should master",
      thumbnail:
        "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=225&fit=crop",
      duration: "20:10",
      views: "203K",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured Training Videos
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Free training content to help you improve your game
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {videos.map((video, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <iframe
                width="100%"
                height="315"
                src={video}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>

            // <div
            //   key={index}
            //   className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            // >
            //   <div className="relative">
            //     <img
            //       src={video.thumbnail}
            //       alt={video.title}
            //       className="w-full h-48 object-cover"
            //     />
            //     <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
            //     <div className="absolute inset-0 flex items-center justify-center">
            //       <button
            //         onClick={() =>
            //           window.open(
            //             `https://www.youtube.com/watch?v=${video.id}`,
            //             "_blank"
            //           )
            //         }
            //         className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transform group-hover:scale-110 transition-all duration-300"
            //       >
            //         <Play className="w-6 h-6 ml-1" />
            //       </button>
            //     </div>
            //     <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
            //       {video.duration}
            //     </div>
            //     <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
            //       {video.views} views
            //     </div>
            //   </div>

            //   <div className="p-6">
            //     <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
            //       {video.title}
            //     </h3>
            //     <p className="text-gray-600 leading-relaxed">
            //       {video.description}
            //     </p>

            //     <div className="mt-4 flex items-center justify-between">
            //       <button
            //         onClick={() =>
            //           window.open(
            //             `https://www.youtube.com/watch?v=${video.id}`,
            //             "_blank"
            //           )
            //         }
            //         className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors duration-300"
            //       >
            //         <Youtube className="w-4 h-4 mr-2" />
            //         Watch on YouTube
            //       </button>
            //       <ExternalLink className="w-4 h-4 text-gray-400" />
            //     </div>
            //   </div>
            // </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoGallery;
