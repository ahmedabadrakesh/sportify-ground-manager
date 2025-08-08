import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, ExternalLink, Play, Instagram } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      const youtubeMatch = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/
      );
      if (youtubeMatch) {
        return youtubeMatch[1];
      }

      // Handle Instagram URLs
      const instagramMatch = url.match(
        /(?:instagram\.com\/(?:p|reel)\/|instagr\.am\/p\/)([^/?#&]+)/
      );
      if (instagramMatch) {
        return instagramMatch[1];
      }

      return null;
    } catch (error) {
      console.error("Error parsing video URL:", error);
      return null;
    }
  };

  const getThumbnailUrl = (url: string): string => {
    if (isYouTubeVideo(url)) {
      const videoId = getVideoId(url);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    } else if (isInstagramVideo(url)) {
      // Instagram doesn't provide direct thumbnail access, so we'll use a placeholder
      return "/placeholder.svg";
    }
    return "/placeholder.svg";
  };

  const getEmbedUrl = (url: string): string => {
    if (isYouTubeVideo(url)) {
      const videoId = getVideoId(url);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    } else if (isInstagramVideo(url)) {
      const videoId = getVideoId(url);
      if (videoId) {
        return `https://www.instagram.com/p/${videoId}/embed`;
      }
    }
    return url;
  };

  const isYouTubeVideo = (url: string): boolean => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const isInstagramVideo = (url: string): boolean => {
    return url.includes("instagram.com") || url.includes("instagr.am");
  };

  const getVideoType = (url: string): "youtube" | "instagram" | "external" => {
    if (isYouTubeVideo(url)) return "youtube";
    if (isInstagramVideo(url)) return "instagram";
    return "external";
  };

  const handleVideoClick = (url: string) => {
    const videoType = getVideoType(url);
    if (videoType === "youtube" || videoType === "instagram") {
      setSelectedVideo(url);
    } else {
      // For non-YouTube/Instagram videos, open in new tab
      window.open(url, "_blank");
    }
  };

  const renderVideoThumbnail = (videoUrl: string, index: number) => {
    const videoType = getVideoType(videoUrl);

    if (videoType === "youtube") {
      return (
        <>
          <img
            src={getThumbnailUrl(videoUrl)}
            alt={`Video ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-50 transition-all duration-300">
            <div className="bg-red-600 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
              <Play className="h-6 w-6 text-white ml-1" fill="white" />
            </div>
          </div>
        </>
      );
    } else if (videoType === "instagram") {
      return (
        <>
          <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
            <Instagram className="h-12 w-12 text-white" />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-50 transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
              <Play className="h-6 w-6 text-white ml-1" fill="white" />
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <ExternalLink className="h-8 w-8 mb-2" />
          <span className="text-sm text-center px-2">External Video Link</span>
        </div>
      );
    }
  };

  const getVideoLabel = (url: string, index: number): string => {
    const videoType = getVideoType(url);
    switch (videoType) {
      case "youtube":
        return `YouTube Video ${index + 1}`;
      case "instagram":
        return `Instagram Video ${index + 1}`;
      default:
        return `Video ${index + 1}`;
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
            {videos.map((videoUrl, index) => {
              const videoType = getVideoType(videoUrl);
              return (
                <div
                  key={index}
                  className="relative group cursor-pointer rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300"
                  onClick={() => handleVideoClick(videoUrl)}
                >
                  <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                    {renderVideoThumbnail(videoUrl, index)}
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-sm text-gray-600 truncate">
                      {getVideoLabel(videoUrl, index)}
                    </p>
                    {videoType === "external" && (
                      <div className="flex items-center gap-1 mt-1">
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          Opens externally
                        </span>
                      </div>
                    )}
                    {videoType === "instagram" && (
                      <div className="flex items-center gap-1 mt-1">
                        <Instagram className="h-3 w-3 text-pink-500" />
                        <span className="text-xs text-pink-500">Instagram</span>
                      </div>
                    )}
                    {videoType === "youtube" && (
                      <div className="flex items-center gap-1 mt-1">
                        <Play className="h-3 w-3 text-red-500" />
                        <span className="text-xs text-red-500">YouTube</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Video Modal */}
      <Dialog
        open={!!selectedVideo}
        onOpenChange={() => setSelectedVideo(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>
              {selectedVideo && getVideoType(selectedVideo) === "instagram"
                ? "Instagram Video"
                : "Video Player"}
            </DialogTitle>
          </DialogHeader>
          <div
            className={`${
              getVideoType(selectedVideo || "") === "instagram"
                ? "aspect-square max-w-md mx-auto"
                : "aspect-video"
            }`}
          >
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
