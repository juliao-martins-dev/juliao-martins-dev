"use client";

import { useRef } from "react";
import Image from "next/image";

import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { galleryItems } from "@/data/gallery";


export default function HorizontalGallery() {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useHorizontalScroll({
    containerRef: galleryRef,
    trackRef: trackRef,
  });

  return (
    <section
      id="gallery"
      ref={galleryRef}
      className="relative h-screen overflow-hidden bg-white"
    >
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
      >
        {galleryItems.map((item, i) => (
          <div
            key={i}
            className="w-[min(90vw,92%)] sm:w-[30vw] lg:w-[25vw] shrink-0 p-6 box-content flex items-center justify-center"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={item.src}
                alt={`Gallery ${i + 1}`}
                fill
                className="object-cover rounded-xl shadow-lg"
                sizes="25vw"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
