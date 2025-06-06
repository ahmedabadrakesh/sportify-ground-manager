
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
    <section className="pt-5">
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
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoGallery;
