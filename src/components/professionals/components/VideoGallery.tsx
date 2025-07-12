
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, ExternalLink, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface VideoGalleryProps {
  videos: string[] | null;
}

const VideoGallery = ({ videos }: VideoGalleryProps) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  if (!videos || videos.length === 0) {
    return null;
  }

  const getVideoId = (url: string): string | null => {
    try {
      // Handle YouTube URLs
      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
      if (youtubeMatch) {
        return youtubeMatch[1];
      }
      return null;
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return null;
    }
  };

  const getThumbnailUrl = (url: string): string => {
    const videoId = getVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return '/placeholder.svg';
  };

  const getEmbedUrl = (url: string): string => {
    const videoId = getVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    return url;
  };

  const isYouTubeVideo = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const handleVideoClick = (url: string) => {
    if (isYouTubeVideo(url)) {
      setSelectedVideo(url);
    } else {
      // For non-YouTube videos, open in new tab
      window.open(url, '_blank');
    }
  };

  return (
    <>
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Video className="h-5 w-5" />
            Featured Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((videoUrl, index) => (
              <div
                key={index}
                className="relative group cursor-pointer rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300"
                onClick={() => handleVideoClick(videoUrl)}
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                  {isYouTubeVideo(videoUrl) ? (
                    <>
                      <img
                        src={getThumbnailUrl(videoUrl)}
                        alt={`Video ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-50 transition-all duration-300">
                        <div className="bg-red-600 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                          <Play className="h-6 w-6 text-white ml-1" fill="white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <ExternalLink className="h-8 w-8 mb-2" />
                      <span className="text-sm text-center px-2">External Video Link</span>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <p className="text-sm text-gray-600 truncate">
                    Video {index + 1}
                  </p>
                  {!isYouTubeVideo(videoUrl) && (
                    <div className="flex items-center gap-1 mt-1">
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-400">Opens externally</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>Video Player</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            {selectedVideo && (
              <iframe
                src={getEmbedUrl(selectedVideo)}
                title="Video Player"
                className="w-full h-full rounded-b-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoGallery;
