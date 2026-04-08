"use client";

import { animateTimeline } from "@/animations/timeline";
import { TimelineItem } from "@/types/timeline";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

/**
 * Per-pin color palette inspired by the reference infographic.
 * Cycled by index so adding more timeline entries Just Works.
 */
const PIN_COLORS = [
  "#EC4899", // pink
  "#F97316", // orange
  "#EF4444", // red
  "#84CC16", // lime
  "#0EA5E9", // sky
  "#F59E0B", // amber
] as const;

const getPinColor = (index: number) =>
  PIN_COLORS[index % PIN_COLORS.length];

export default function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const t = useTranslations();
  const tAbout = useTranslations("about");
  const timeline = tAbout.raw("timeline") as TimelineItem[];

  useEffect(() => {
    if (!sectionRef.current) return;
    const cleanup = animateTimeline(sectionRef.current);
    return cleanup;
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen max-w-6xl mx-auto px-6 py-24"
    >
      <h3 className="text-3xl font-bold mb-6">{t("about.title")}</h3>

      <p className="text-muted-foreground mb-16 max-w-3xl leading-relaxed">
        {t("about.paragraph1")}
      </p>

      {/* ========== MOBILE: vertical color-rail timeline ========== */}
      <div className="md:hidden relative">
        {/* Rainbow rail */}
        <div
          aria-hidden
          className="absolute left-[14px] top-2 bottom-2 w-[2px] rounded-full
                     bg-gradient-to-b from-pink-500 via-amber-400 to-sky-500
                     opacity-80"
        />

        <ol className="flex flex-col gap-8">
          {timeline.map((item, index) => {
            const color = getPinColor(index);
            return (
              <li key={`m-${index}`} className="relative pl-12 timeline-card">
                {/* Dot */}
                <span
                  aria-hidden
                  className="absolute left-[5px] top-3 grid place-items-center"
                >
                  <span
                    className="block h-5 w-5 rounded-full ring-[3px] ring-background"
                    style={{
                      background: color,
                      boxShadow: `0 0 0 4px ${color}33, 0 0 18px ${color}66`,
                    }}
                  />
                </span>

                <Card
                  className="border-l-4 backdrop-blur transition-all duration-300
                             hover:-translate-y-1 hover:shadow-lg"
                  style={{ borderLeftColor: color }}
                >
                  <CardHeader className="space-y-1">
                    <p
                      className="text-2xl font-extrabold tracking-tight"
                      style={{ color }}
                    >
                      {item.year}
                    </p>
                    <p
                      className="text-[11px] font-bold uppercase tracking-[0.2em]"
                      style={{ color }}
                    >
                      {item.title}
                    </p>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {item.company}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ========== DESKTOP: perspective road with vertical pins ========== */}
      <div className="hidden md:block relative pt-4">
        {/* Pin row — alternating heights via top spacers */}
        <div className="relative flex items-stretch justify-around gap-6 min-h-[460px]">
          {timeline.map((item, index) => {
            const color = getPinColor(index);
            const isTall = index % 2 === 0;

            return (
              <div
                key={`d-${index}`}
                className="group relative flex flex-1 max-w-sm flex-col items-center"
              >
                {/* Top spacer to alternate card height */}
                <div
                  aria-hidden
                  style={{ height: isTall ? 0 : 110 }}
                  className="shrink-0 transition-all"
                />

                {/* Card */}
                <Card
                  className="timeline-card w-full rounded-2xl border border-border/50
                             bg-background/85 backdrop-blur-md shadow-md
                             border-t-4 transition-all duration-300
                             group-hover:-translate-y-2
                             group-hover:shadow-[0_24px_45px_-20px_rgba(0,0,0,0.45)]"
                  style={{ borderTopColor: color }}
                >
                  <CardHeader className="space-y-1 pb-2">
                    <p
                      className="text-3xl font-extrabold tracking-tight leading-none"
                      style={{ color }}
                    >
                      {item.year}
                    </p>
                    <p
                      className="text-xs font-bold uppercase tracking-[0.22em]"
                      style={{ color }}
                    >
                      {item.title}
                    </p>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {item.company}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Vertical pin line — fills space between card and road */}
                <div
                  aria-hidden
                  className="timeline-line w-[2px] flex-1 rounded-full origin-top"
                  style={{
                    background: `linear-gradient(to bottom, ${color}, ${color}55)`,
                    boxShadow: `0 0 14px ${color}55`,
                    minHeight: "32px",
                  }}
                />

                {/* Pin head sitting on the road */}
                <div
                  aria-hidden
                  className="timeline-base relative flex flex-col items-center"
                >
                  <div
                    className="h-3 w-3 rounded-full -mb-[5px]"
                    style={{
                      background: color,
                      boxShadow: `0 0 12px ${color}aa`,
                    }}
                  />
                  <div
                    className="h-2 w-12 rounded-full"
                    style={{
                      background: `radial-gradient(ellipse at center, ${color} 0%, ${color}80 60%, transparent 100%)`,
                      boxShadow: `0 0 18px ${color}66, 0 6px 14px ${color}33`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* The road */}
        <div className="relative -mt-2">
          <div
            aria-hidden
            className="h-[6px] w-full rounded-full
                       bg-gradient-to-r from-transparent
                       via-slate-300 dark:via-slate-600
                       to-transparent
                       shadow-[0_2px_18px_rgba(15,23,42,0.18)]"
          />
          <div
            aria-hidden
            className="mx-auto -mt-px h-px w-[92%] rounded-full
                       bg-gradient-to-r from-transparent
                       via-white/70 dark:via-white/15
                       to-transparent"
          />
          {/* Soft ground shadow */}
          <div
            aria-hidden
            className="mx-auto mt-1 h-6 w-[80%] rounded-[100%]
                       bg-gradient-to-b from-slate-400/20 to-transparent
                       blur-md"
          />
        </div>
      </div>
    </section>
  );
}
