import React from "react";

export const ImageCarousel = ({ images, currentIndex, setCurrentIndex }) => {
  return (
    <section className="max-w-[100%] mx-auto w-full overflow-hidden rounded-3xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div 
        className="flex transition-transform duration-1000 ease-in-out" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img) => (
          /* Idinagdag ang mas mataas na Height: h-[900px] (Mobile) at md:h-[1500px] (Desktop) */
          <div key={img.id} className="min-w-full h-[900px] md:h-[1500px] relative group overflow-hidden">
            <img 
              src={img.src} 
              alt={img.alt} 
              className="w-full h-full object-fill bg-slate-100 transition-transform duration-700 group-hover:scale-105" 
            />
            
            {/* Overlay Gradient para sa depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/30 pointer-events-none" />
            
            {/* Floating Badge Indicator */}
            <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-xl text-white px-5 py-2 rounded-2xl text-[10px] font-black tracking-widest border border-white/20 shadow-2xl uppercase">
              Page {img.id} of {images.length}
            </div>
          </div>
        ))}
      </div>
      
      {/* Interactive Pagination Indicators */}
      <div className="flex justify-center items-center gap-4 py-10 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-500 rounded-full ${
              currentIndex === idx 
                ? "w-16 h-3 bg-[#0038A8] shadow-[0_8px_20px_-5px_rgba(0,56,168,0.5)]" 
                : "w-3 h-3 bg-slate-300 hover:bg-[#CE1126] hover:scale-125"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};