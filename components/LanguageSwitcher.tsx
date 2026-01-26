"use client";

import { useEffect, useState } from "react";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "te", label: "TE" }
];

export default function LanguageSwitcher() {
  const [lang, setLang] = useState("en");

  // Load dari localStorage saat mount
  useEffect(() => {
    const savedLang = localStorage.getItem("locale");
    if (savedLang) {
      setLang(savedLang);
      document.cookie = `locale=${savedLang}; path=/`;
    }
  }, []);

  const changeLanguage = (code: string) => {
    setLang(code);

    // Simpan ke localStorage
    localStorage.setItem("locale", code);

    // Simpan ke cookie (dibaca server)
    document.cookie = `locale=${code}; path=/`;

    // Reload agar request pakai locale baru
    window.location.reload();
  };

  return (
    <div className="flex gap-2">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => changeLanguage(l.code)}
          className={`px-3 py-1 rounded text-sm border ${
            lang === l.code
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
