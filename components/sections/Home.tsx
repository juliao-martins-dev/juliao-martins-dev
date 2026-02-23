import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Home() {
  const t = useTranslations();
  
  return (
    <section
        id="home"
        className="min-h-screen flex items-center justify-center bg-linear-to-b from-background via-background to-muted/25"
      >
      <article className="mx-auto max-w-2xl text-center">
        <Image src="/juliao_martins.jpg" priority alt="Juliao Martins" width={200} height={200} className="w-52 h-52 mx-auto mb-3 object-cover object-top rounded-full border-2 border-primary/30" />
        <h1 className="text-4xl font-bold mb-4">{t("home.title")}</h1>
        <p className="text-muted-foreground mb-6">
          {t("home.subtitle")}
        </p>
      </article>
    </section>
  );
}
