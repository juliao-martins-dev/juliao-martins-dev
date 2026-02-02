import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateTimeline(ref: HTMLDivElement) {
  gsap.fromTo(
    ref.children,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.3,
      scrollTrigger: {
        trigger: ref,
        start: "top 75%",
      },
    }
  );
}
