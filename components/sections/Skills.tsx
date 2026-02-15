import { skills } from "@/data/skills";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function SKills() {
  const t = useTranslations();

  return (
    <section
      id="skills"
      className="min-h-screen px-6 py-24
        bg-linear-to-b from-muted/10 via-background to-muted/20"
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
  );
}
