"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PortfolioPage() {
  const [formData, setFormData] = useState({ username: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const btn = document.getElementById("scrollTop");
      if (window.scrollY > 300) btn?.classList.remove("hidden");
      else btn?.classList.add("hidden");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "https://v1.nocodeapi.com/juliaomartins23/google_sheets/QpvkySIKGXzEhiWi?tabId=Sheet1",
        {
          row: [
            Object.values(formData)
          ]
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      setMessage("✓ Pesan berhasil dikirim!");
      setFormData({ username: "", email: "", message: "" });
      console.log("Response:", response.data);
    } catch (error) {
      setMessage("✗ Gagal mengirim pesan. Silahkan coba lagi.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-sans scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white shadow z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="font-bold text-xl">Juli&atilde;o Martins</h1>
          <div className="space-x-6">
            <a href="#home" className="hover:text-blue-600">Home</a>
            <a href="#about" className="hover:text-blue-600">About</a>
            <a href="#projects" className="hover:text-blue-600">Projects</a>
            <a href="#skills" className="hover:text-blue-600">Skills</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      </nav>

      {/* Home */}
      <section id="home" className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Hi, I'm Julião</h2>
          <p className="text-lg text-gray-600 mb-6">Junior Mobile Developer | Next.js | TailwindCSS</p>
          <a href="#projects" className="px-6 py-3 bg-blue-600 text-white rounded-lg">View My Work</a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="min-h-screen max-w-6xl mx-auto px-6 py-24">
        <h3 className="text-3xl font-bold mb-6">About Me</h3>
        <p className="text-gray-600 leading-relaxed">
          I am a junior mobile developer who focuses on building clean, responsive, and scalable applications.
          I enjoy learning new technologies and turning ideas into real products.
        </p>
      </section>

      {/* Projects */}
      <section id="projects" className="min-h-screen bg-gray-50 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-10">Projects</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((p) => (
              <div key={p} className="bg-white p-6 rounded-xl shadow">
                <h4 className="font-semibold text-xl mb-2">Project {p}</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Short description of the project, tech stack, and key features.
                </p>
                <a href="#" className="text-blue-600">View Details</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="min-h-screen max-w-6xl mx-auto px-6 py-24">
        <h3 className="text-3xl font-bold mb-8">Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['JavaScript', 'TypeScript', 'React', 'Next.js', 'TailwindCSS', 'Firebase', 'Git', 'REST API'].map(skill => (
            <div key={skill} className="bg-gray-100 py-3 text-center rounded-lg">
              {skill}
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="min-h-screen bg-gray-50 px-6 py-24">
        <div className="max-w-xl mx-auto">
          <h3 className="text-3xl font-bold mb-6">Contact Me</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full border p-3 rounded focus:outline-none focus:border-blue-600"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full border p-3 rounded focus:outline-none focus:border-blue-600"
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
              required
              className="w-full border p-3 rounded h-32 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
            {message && (
              <p className={`text-center text-sm font-medium ${
                message.includes("✓") ? "text-green-600" : "text-red-600"
              }`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Scroll to Top */}
      <button
        id="scrollTop"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="hidden fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow"
      >
        ↑
      </button>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Julião. All rights reserved.
      </footer>
    </main>
  );
}
