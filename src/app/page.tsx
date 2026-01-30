"use client";

import { useScrollNavbar } from "@/hooks/useScrollNavbar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Menu } from "lucide-react";
import {
  SiTailwindcss,
  SiNextdotjs,
  SiReact,
  SiDjango,
} from "react-icons/si";
import { RiFirebaseFill } from "react-icons/ri";
import { IoSparklesSharp } from "react-icons/io5";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "@/components/Scene";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ScrollToTop from "@/components/ui/ScrollToTop";


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

interface FormData {
  username: string;
  email: string;
  message: string;
}

const skills = [
  {
    name: "Tailwind CSS",
    label: "Utility-first CSS",
    icon: SiTailwindcss,
    color: "#38BDF8",
  },
  {
    name: "Next.js",
    label: "React Framework",
    icon: SiNextdotjs,
    color: "#000000",
  },
  {
    name: "GSAP",
    label: "Animation Library",
    icon: IoSparklesSharp,
    color: "#88CE02",
  },
  {
    name: "React Native",
    label: "Mobile Development",
    icon: SiReact,
    color: "#61DAFB",
  },
  {
    name: "Firebase",
    label: "Backend as a Service",
    icon: RiFirebaseFill,
    color: "#FFCA28",
  },
  {
    name: "Django",
    label: "Backend Framework",
    icon: SiDjango,
    color: "#092E20",
  },
];

const galleryItems = [
  { type: "image", src: "/1.jpg" },
  { type: "image", src: "/2.jpg" },
  { type: "image", src: "/3.jpg" },
  { type: "image", src: "/4.gif" },
  { type: "image", src: "/5.jpg" },
  { type: "image", src: "/6.gif" },
  { type: "image", src: "/7.jpg" },
  { type: "image", src: "/8.jpg" },
];


export default function PortfolioPage() {
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const galleryRef = useRef<HTMLDivElement | null>(null);
  const galleryTrackRef = useRef<HTMLDivElement | null>(null);

  const t = useTranslations();
  const scrolled = useScrollNavbar();

  const navItems = [
    { label: t("nav.home"), href: "#home" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.projects"), href: "#projects" },
    { label: t("nav.skills"), href: "#skills" },
    { label: t("nav.gallery"), href: "#gallery" },
    { label: t("nav.contact"), href: "#contact" },
  ];

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

      setMessage(t("contact.success"));
      setFormData({ username: "", email: "", message: "" });
    } catch (error) {
      setMessage(t("contact.error"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-sans scroll-smooth">
      {/* Navbar */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300
        ${scrolled
          ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg shadow-md"
          : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-xl font-bold tracking-tight">
            Julião Martins
          </h1>

          {/* Desktop Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-6">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground
                    hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <LanguageSwitcher />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-70">
              <div className="flex flex-col items-center gap-6 mt-10">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium hover:text-primary transition"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
                <LanguageSwitcher />
              </div>
            </SheetContent>
          </Sheet>
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
          <Image src="/juliao_martins.jpg" priority alt="Juliao Martins" width={200} height={200} className="w-52 h-52 mx-auto mb-3 object-cover object-top rounded-full border-2 border-red-950" />
          <h2 className="text-4xl font-bold mb-4">{t("home.title")}</h2>
          <p className="text-gray-600 mb-6">
            {t("home.subtitle")}
          </p>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="min-h-screen max-w-6xl mx-auto px-6 py-24"
      >
        <h3 className="text-3xl font-bold mb-6">{t("about.title")}</h3>
        <p className="text-gray-600">
          {t("about.description")}
        </p>
      </section>

      {/* Projects */}
      <section
        id="projects"
        className="min-h-screen px-6 py-24
        bg-gradient-to-b from-gray-50 to-white
        dark:from-slate-900 dark:to-slate-950"
      >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 tracking-tight">
            {t("projects.title")}
          </h3>

          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((p) => (
              <Card
                key={p}
                className="
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                <CardHeader>
                  <CardTitle className="text-xl">
                    {t("projects.itemTitle", { number: p })}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("projects.itemDescription")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section
        id="skills"
        className="min-h-screen px-6 py-24
        bg-gradient-to-b from-white to-gray-50
        dark:from-slate-950 dark:to-slate-900"
      >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 tracking-tight">
            {t("skills.title")}
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {skills.map((skill) => (
              <Card
                key={skill.name}
                className="
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                <CardContent className="p-6 flex items-center gap-4">
                  {/* Icon */}
                  <skill.icon
                    className="h-10 w-10"
                    style={{ color: skill.color }}
                  />

                  {/* Text */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">
                      {skill.name}
                    </span>

                    <Badge
                      variant="secondary"
                      className="mt-2 w-fit"
                      style={{
                        backgroundColor: `${skill.color}20`,
                        color: skill.color,
                      }}
                    >
                      {skill.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className="w-[25vw] shrink-0 p-6 box-content flex items-center justify-center"
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

      {/* Contact */}
      <section
        id="contact"
        className="
          min-h-screen px-6 py-24
          bg-gradient-to-b from-gray-50 to-white
          dark:from-slate-900 dark:to-slate-950
        "
      >
        <div className="max-w-xl mx-auto">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                {t("contact.title")}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">
                    {t("contact.form.username")}
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder={t("contact.form.username")}
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t("contact.form.email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("contact.form.email")}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">
                    {t("contact.form.message")}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t("contact.form.message")}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="min-h-[140px]"
                    required
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading
                    ? t("contact.form.sending")
                    : t("contact.form.send")}
                </Button>

                {/* Feedback */}
                {message && (
                  <p className="text-center text-sm font-medium text-muted-foreground">
                    {message}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Scroll To Top */}
      <ScrollToTop />

      <footer
        className="
          border-t border-border
          py-6 text-center text-sm
          text-muted-foreground
          bg-background
        "
      >
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-foreground">
          Julião Martins
        </span>
        . {t("footer.text")}
      </footer>
    </main>
  );
}
