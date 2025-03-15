"use client";

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import Image from 'next/image';

const ImageGallery = ({ images, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingStates, setLoadingStates] = useState(images.map(() => true));
  const [errorStates, setErrorStates] = useState(images.map(() => false));

  if (!isOpen) return null;

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageLoad = (index) => {
    setLoadingStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
    setErrorStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  const handleImageError = (index) => {
    setLoadingStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
    setErrorStates(prev => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });
  };

  // Only show navigation if we have more than one valid image
  const showNavigation = images.length > 1;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-4xl mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>

        {/* Main image */}
        <div className="relative h-[60vh] w-full bg-gray-900 rounded-lg overflow-hidden">
          {loadingStates[currentImageIndex] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {errorStates[currentImageIndex] ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <ImageOff size={48} />
              <p className="mt-2">Failed to load image</p>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={images[currentImageIndex].url}
                alt={`Car image ${currentImageIndex + 1}`}
                fill
                className={`object-contain transition-opacity duration-300 ${
                  loadingStates[currentImageIndex] ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => handleImageLoad(currentImageIndex)}
                onError={(e) => {
                  console.error('Gallery image load error:', images[currentImageIndex].url);
                  handleImageError(currentImageIndex);
                  e.target.src = "/images/placeholder-car.jpg";
                }}
                unoptimized={true}
                loading="eager"
                quality={90}
                sizes="(max-width: 1536px) 100vw, 1536px"
              />
            </div>
          )}
        </div>

        {/* Navigation buttons - only show if we have multiple images */}
        {showNavigation && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                onClick={handlePrevious}
                className="bg-black/50 hover:bg-black/70 p-2 rounded-full text-white -ml-6"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={handleNext}
                className="bg-black/50 hover:bg-black/70 p-2 rounded-full text-white -mr-6"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </>
        )}

        {/* Thumbnails - only show if we have multiple images */}
        {showNavigation && (
          <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image._id || index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ${
                  index === currentImageIndex ? 'ring-2 ring-primary' : ''
                }`}
              >
                {loadingStates[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {errorStates[index] ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <ImageOff size={20} className="text-gray-400" />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className={`object-cover transition-opacity duration-300 ${
                        loadingStates[index] ? 'opacity-0' : 'opacity-100'
                      }`}
                      onLoad={() => handleImageLoad(index)}
                      onError={(e) => {
                        console.error('Thumbnail load error:', image.url);
                        handleImageError(index);
                        e.target.src = "/images/placeholder-car.jpg";
                      }}
                      unoptimized={true}
                      loading="eager"
                      quality={50}
                      sizes="64px"
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Image counter - only show if we have multiple images */}
        {showNavigation && (
          <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery; 