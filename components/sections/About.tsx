"use client";

import { animateTimeline } from "@/animations/timeline";
import { TimelineItem } from "@/types/timeline";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function About() {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations();
  const tAbout = useTranslations("about");
  const timeline = tAbout.raw("timeline") as TimelineItem[];
  
  useEffect(() => {
    if (timelineRef.current) animateTimeline(timelineRef.current);
  }, []);
  
  return (
  <section
      id="about"
      className="min-h-screen max-w-6xl mx-auto px-6 py-24"
    >
    <h3 className="text-3xl font-bold mb-6">
      {t("about.title")}
    </h3>

    <p className="text-muted-foreground mb-10 max-w-3xl">
      {t("about.paragraph1")}
    </p>

    {/* Timeline */}
    <div className="relative mt-20">
      {/* LINE */}
      <div
        className="
          absolute z-0
          left-5.75 top-0 bottom-0 w-px
          bg-primary/30
          md:left-0 md:right-0 md:top-2 md:bottom-auto
          md:h-0.5 md:w-auto
          md:bg-linear-to-r md:from-transparent md:via-primary/40 md:to-transparent
        "/>
      <div
        ref={timelineRef}
        className="relative z-10 flex flex-col md:flex-row justify-between gap-16"
      >
        {timeline.map((item, index) => (
          <div
            key={index}
            className="
              relative flex-1 flex flex-col
              pl-12 md:pl-0
              md:items-center md:text-center
              group
            "
            >
            {/* DOT */}
            <div
              className="
                absolute left-4 top-4
                md:static md:mb-6
                z-10
              "
              >
              <div className="h-4 w-4 rounded-full bg-primary shadow-sm" />
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-md scale-150 opacity-0 transition" />
            </div>

            {/* CONNECTOR (desktop only) */}
            <div className="hidden md:block absolute top-10 h-10 w-px bg-primary/30" />

            {/* CARD */}
            <Card
              className="
                w-full max-w-sm
                rounded-2xl
                border border-border/50
                bg-background/80
                backdrop-blur
                shadow-md
                transition-all duration-300
                md:group-hover:-translate-y-2
                md:group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]
                "
              >
              <CardHeader className="md:items-center">
                <Badge
                  variant="secondary"
                  className="mb-3 text-xs tracking-wide"
                >
                  {item.year}
                </Badge>

                <CardTitle className="text-lg font-semibold">
                  {item.title}
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                  {item.company}
                </p>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
}
