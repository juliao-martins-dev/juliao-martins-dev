"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";
import { cn } from "@/lib/utils";
import { Menu, MoonStar, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import LanguageSwitcher from "../LanguageSwitcher";
import { Button } from "../ui/button";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

const getSystemTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const resolveTheme = (value: string | null): Theme =>
  value === "light" || value === "dark" ? value : getSystemTheme();

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
};

function ThemeToggleButton({
  onToggle,
  className,
}: {
  onToggle: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onToggle}
      aria-label="Toggle dark mode"
      className={cn(
        "relative h-10 w-[4.5rem] rounded-full border border-border/60 bg-background/80 p-1 shadow-sm backdrop-blur-md transition-all duration-300",
        "hover:bg-background hover:shadow-md",
        className
      )}
    >
      <span className="absolute left-1 top-1 h-8 w-8 rounded-full bg-primary shadow-sm transition-transform duration-300 ease-out dark:translate-x-8" />
      <span className="relative z-10 grid h-full w-full grid-cols-2 place-items-center">
        <Sun className="h-4 w-4 text-primary-foreground transition-colors duration-300 dark:text-muted-foreground/70" />
        <MoonStar className="h-4 w-4 text-muted-foreground/70 transition-colors duration-300 dark:text-primary-foreground" />
      </span>
    </Button>
  );
}

export default function Navbar() {
  const scrolled = useScrollNavbar();
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations();

  const navItems = [
    { label: t("nav.home"), href: "#home" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.projects"), href: "#projects" },
    { label: t("nav.skills"), href: "#skills" },
    { label: t("nav.gallery"), href: "#gallery" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  const toggleTheme = () => {
    const activeTheme = resolveTheme(
      document.documentElement.getAttribute("data-theme")
    );
    const nextTheme: Theme = activeTheme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/75 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <p className="text-xl font-bold tracking-tight text-foreground">
          Julião Martins
        </p>

        <NavigationMenu className="hidden sm:flex">
          <NavigationMenuList className="gap-6">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <ThemeToggleButton onToggle={toggleTheme} />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <LanguageSwitcher className="ml-1" />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggleButton onToggle={toggleTheme} />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="border border-border/60 bg-background/70 backdrop-blur-sm"
                aria-label="Open Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-72 border-l border-border/50 bg-background/95 backdrop-blur-xl"
            >
              <div className="mt-10 flex flex-col items-center gap-6">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="mt-2 flex items-center gap-3">
                  <ThemeToggleButton onToggle={toggleTheme} />
                  <LanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
