"use client";

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
import { Button } from "../ui/button";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";
import clsx from "clsx";
import { useState } from "react";
import LanguageSwitcher from "../LanguageSwitcher";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";


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

  return <nav className={clsx(
            "fixed top-0 z-50 w-full transition-all duration-300",
            scrolled
              ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg shadow-md"
              : "bg-transparent"
          )}
        >
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-xl font-bold tracking-tight">
              Julião Martins
            </h1>
  
            {/* Desktop Menu */}
            <NavigationMenu className="hidden sm:flex">
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
                  className="sm:hidden"
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
}