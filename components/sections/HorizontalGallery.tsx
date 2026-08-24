"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { galleryItems } from "@/data/gallery";

import GallerySprites from "./GallerySprites";
import GalleryVideo from "./GalleryVideo";


export default function HorizontalGallery() {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations();
  const reduced = usePrefersReducedMotion();

  useHorizontalScroll({
    containerRef: galleryRef,
    trackRef: trackRef,
  });

  return (
    <section
      id="gallery"
      ref={galleryRef}
      data-gallery-viewport=""
      /*
        Under reduced motion this section becomes a real horizontal scroll
        container (see globals.css). A scroll container with no focusable
        content is unreachable by keyboard, so it takes a tab stop and an
        accessible name. In the pinned default it scrolls with the page and
        needs neither, so the tab stop is not added.
      */
      tabIndex={reduced ? 0 : undefined}
      role={reduced ? "region" : undefined}
      aria-label={reduced ? t("nav.gallery") : undefined}
      className="relative h-screen overflow-hidden bg-linear-to-b from-background to-muted/20"
    >
      <div
        ref={trackRef}
        data-gallery-track=""
        className="flex h-full will-change-transform"
      >
        {/*
          Leading and trailing spacers. Without them the track's own edges are
          the viewport's edges, so the first and last images sit flush against
          them and read as cut off — measured firstLeft 0 and lastRight 1435 of
          a 1440 viewport. `aria-hidden` because they are pure layout.
        */}
        <div aria-hidden className="w-12 shrink-0" />

        {galleryItems.map((item, i) => (
          <div
            key={i}
            data-gallery-item=""
            className="w-[min(90vw,92%)] sm:w-[30vw] lg:w-[25vw] shrink-0 p-6 box-content flex items-center justify-center"
          >
            <div data-gallery-media="" className="relative aspect-square w-full">
              {/*
                TODO: these labels are positional placeholders, not
                descriptions. Julião needs to supply what each slide actually
                shows before they mean anything to a screen reader.
              */}
              {item.video ? (
                <GalleryVideo
                  src={item.src}
                  poster={item.video.poster}
                  width={item.video.width}
                  height={item.video.height}
                  label={t("gallery.imageAlt", { number: i + 1 })}
                />
              ) : (
                <Image
                  src={item.src}
                  alt={t("gallery.imageAlt", { number: i + 1 })}
                  fill
                  className="object-cover rounded-xl shadow-lg"
                  // Must track the slide widths above, or phones download a
                  // ~90px candidate and stretch it across ~324px.
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 30vw, 90vw"
                />
              )}
            </div>
          </div>
        ))}

        <div aria-hidden className="w-12 shrink-0" />
      </div>

      {/* Finds the section and track itself; see GallerySprites. */}
      <GallerySprites />
    </section>
  );
}
