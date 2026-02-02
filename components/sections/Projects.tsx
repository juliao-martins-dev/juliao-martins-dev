import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";


export default function Projects() {
  const t = useTranslations();
  
  return (
    <section
        id="projects"
        className="min-h-screen px-6 py-24
        bg-linear-to-b from-gray-50 to-white
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
  )
}