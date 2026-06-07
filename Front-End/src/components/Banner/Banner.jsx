import React, { useState, useEffect } from "react";
import banner0 from "../../assets/banner0.png";
import banner1 from "../../assets/banner1.png";
import banner11 from "../../assets/banner11.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner3.png";
import banner4 from "../../assets/baner4.png";
import banner5 from "../../assets/banner5.png";

export const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const bannerImages = [
    { id: 1, src: banner0, alt: "Banner 0" },
    { id: 2, src: banner1, alt: "Banner 1" },
    { id: 7, src: banner11, alt: "Banner 11" },
    { id: 3, src: banner2, alt: "Banner 2" },
    { id: 4, src: banner3, alt: "Banner 3" },
    { id: 5, src: banner4, alt: "Banner 4" },
    { id: 6, src: banner5, alt: "Banner 5" },

  ];

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
  };

  return (
    <section className="relative w-full h-[300px] md:h-[500px] overflow-hidden rounded-none md:rounded-3xl shadow-2xl border-b-8 border-[#FCD116] group">
      {/* Images Container */}
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerImages.map((image) => (
          <div key={image.id} className="w-full flex-shrink-0 h-full">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Previous banner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Next banner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index
                ? "bg-[#FCD116] w-4"
                : "bg-white/50 hover:bg-white/80"
              }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};