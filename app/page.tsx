"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "@/components/Scene";


gsap.registerPlugin(ScrollTrigger);

const unsplashImages = [
  "1500530855697-b586d89ba3ee",
  "1500534314209-a25ddb2bd429",
  "1521737604893-d14cc237f11d",
  "1519681393784-d120267933ba",
  "1492724441997-5dc865305da7",
  "1520975916090-3105956dac38",
  "1518770660439-4636190af475",
  "1500534314209-a25ddb2bd429",
];


export default function PortfolioPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const galleryRef = useRef<HTMLDivElement | null>(null);
  const galleryTrackRef = useRef<HTMLDivElement | null>(null);

  /* Scroll to top button */
  useEffect(() => {
    const handleScroll = () => {
      const btn = document.getElementById("scrollTop");
      if (window.scrollY > 300) btn?.classList.remove("hidden");
      else btn?.classList.add("hidden");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Horizontal scrolling gallery */
  useEffect(() => {
    if (!galleryRef.current || !galleryTrackRef.current) return;

    const track = galleryTrackRef.current;

    const getScrollAmount = () =>
      track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: "none",
      scrollTrigger: {
        trigger: galleryRef.current,
        start: "top top",
        end: () => `+=${track.scrollWidth}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  /* Form handlers */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        "https://v1.nocodeapi.com/juliaomartins23/google_sheets/QpvkySIKGXzEhiWi?tabId=Sheet1",
        {
          row: [Object.values(formData)],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage("✓ Pesan berhasil dikirim!");
      setFormData({ username: "", email: "", message: "" });
    } catch (error) {
      setMessage("✗ Gagal mengirim pesan. Silahkan coba lagi.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-sans scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white shadow z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="font-bold text-xl">Julião Martins</h1>
          <div className="space-x-6">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* 3d model */}
      <main className="fixed z-10 bottom-20 left-[50%] -translate-x-[50%]">
        <section style={{ height: '100px' }}>
          <Scene />
        </section>
      </main>

      {/* Home */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="text-center">
          <Image src="/juliao_martins.jpg" alt="Juliao Martins" width={200} height={200} className="w-52 h-52 mx-auto mb-3 object-cover object-top rounded-full border-2 border-red-950" />
          <h2 className="text-4xl font-bold mb-4">Hi, I'm Julião</h2>
          <p className="text-gray-600 mb-6">
            Junior Mobile Developer | Next.js | TailwindCSS
          </p>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="min-h-screen max-w-6xl mx-auto px-6 py-24"
      >
        <h3 className="text-3xl font-bold mb-6">About Me</h3>
        <p className="text-gray-600">
          I am a junior mobile developer who focuses on building clean,
          responsive, and scalable applications.
        </p>
      </section>

      {/* Projects */}
      <section
        id="projects"
        className="min-h-screen bg-gray-50 px-6 py-24"
      >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-10">Projects</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((p) => (
              <div key={p} className="bg-white p-6 rounded-xl shadow">
                <h4 className="font-semibold text-xl mb-2">
                  Project {p}
                </h4>
                <p className="text-gray-600 text-sm">
                  Project description here.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section
        id="skills"
        className="min-h-screen max-w-6xl mx-auto px-6 py-24"
      >
        <h3 className="text-3xl font-bold mb-8">Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "JavaScript",
            "TypeScript",
            "React",
            "Next.js",
            "TailwindCSS",
            "Firebase",
            "Git",
            "REST API",
          ].map((skill) => (
            <div
              key={skill}
              className="bg-gray-100 py-3 text-center rounded-lg"
            >
              {skill}
            </div>
          ))}
        </div>
      </section>

      {/* Horizontal Gallery */}
      <section
        id="gallery"
        ref={galleryRef}
        className="relative h-screen overflow-hidden bg-white"
      >
        <div
          ref={galleryTrackRef}
          className="flex h-full will-change-transform"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-[25vw] flex-shrink-0 p-6 box-content flex items-center justify-center"
            >
              <div className="relative w-125 aspect-square">
                <Image
                  src={`https://images.unsplash.com/photo-${unsplashImages[i]}?auto=format&fit=crop&w=600&q=80`}
                  alt={`Gallery ${i + 1}`}
                  fill
                  unoptimized
                  className="object-cover rounded-xl shadow-lg"
                  sizes="500px"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="min-h-screen bg-gray-50 px-6 py-24"
      >
        <div className="max-w-xl mx-auto">
          <h3 className="text-3xl font-bold mb-6">Contact Me</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full border p-3 rounded h-32"
            />
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {message && (
              <p className="text-center text-sm font-medium">
                {message}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Scroll To Top */}
      <button
        id="scrollTop"
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        className="hidden fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full"
      >
        ↑
      </button>

      <footer className="footer text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Julião Martins. Turning ideas into reliable digital products.
      </footer>
    </main>
  );
}
