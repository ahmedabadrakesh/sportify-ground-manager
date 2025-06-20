import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images1 = [
    {
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      title: "Training Session",
      category: "Coaching",
    },
    {
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop",
      title: "Tournament Victory",
      category: "Competition",
    },
    {
      src: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
      title: "Student Success",
      category: "Achievement",
    },
    {
      src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=300&fit=crop",
      title: "Group Training",
      category: "Coaching",
    },
    {
      src: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
      title: "Facility Overview",
      category: "Facility",
    },
    {
      src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
      title: "Technical Analysis",
      category: "Training",
    },
  ];

  const categories = [
    "All",
    "Coaching",
    "Competition",
    "Achievement",
    "Facility",
    "Training",
  ];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const openImage = (index) => {
    setSelectedImage(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (selectedImage !== null) {
      const newIndex =
        direction === "next"
          ? (selectedImage + 1) % filteredImages.length
          : (selectedImage - 1 + filteredImages.length) % filteredImages.length;
      setSelectedImage(newIndex);
    }
  };

  return (
    <section className="pt-5">
      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredImages.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-xl"
            onClick={() => openImage(index)}
          >
            <img
              src={image}
              alt={image}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeImage}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-300"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={() => navigateImage("prev")}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-300"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={() => navigateImage("next")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-300"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <img
              src={filteredImages[selectedImage]}
              alt={filteredImages[selectedImage]}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />

            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-semibold">
                {filteredImages[selectedImage].title}
              </h3>
              <p className="text-gray-300">
                {filteredImages[selectedImage].category}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageGallery;
