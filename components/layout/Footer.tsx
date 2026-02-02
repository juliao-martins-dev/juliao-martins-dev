import { useTranslations } from "next-intl";


export default function Footer() {
  const t = useTranslations();

  return (
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
  )
}