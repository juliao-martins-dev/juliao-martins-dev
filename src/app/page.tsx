import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ScrollToTop from "@/components/ui/ScrollToTop";
import Navbar from "@/components/layout/Navbar";
import ComputerVisual from "@/components/sections/ComputerVisual";
import Home from "@/components/sections/Home";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import SKills from "@/components/sections/Skills";
import HorizontalGallery from "@/components/sections/HorizontalGallery";
import ContactForm from "@/components/sections/ContactForm";
import Footer from "@/components/layout/Footer";


gsap.registerPlugin(ScrollTrigger);


export default function PortfolioPage() {

  return (
    <main className="font-sans scroll-smooth overflow-hidden">
      <Navbar />
      <ComputerVisual />
      <Home />
      <About />
      <Projects />
      <SKills />
      <HorizontalGallery />
      <ContactForm />
      <ScrollToTop /> {/* ===> Scroll To Top */}
      <Footer />      
    </main>
  );
}
