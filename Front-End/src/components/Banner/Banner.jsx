import React from "react";

export const Banner = ({ videoSrc }) => (
  <section className="relative w-full h-[300px] md:h-[500px] overflow-hidden rounded-none md:rounded-3xl shadow-2xl border-b-8 border-[#FCD116]">
    <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-fill">
      <source src={videoSrc} type="video/mp4" />
    </video>
  </section>
);