"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ContactFormData } from "@/types/contact";
import { sendContactForm } from "@/lib/api/contact";


const initialFormData: ContactFormData = {
  Username: "",
  Email: "",
  Message: "",
};


export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const t = useTranslations();

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
      await sendContactForm(formData);
      setMessage(t("contact.success"));
      setFormData(initialFormData);
    } catch (error) {
      setMessage(t("contact.error"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <section
        id="contact"
        className="
          min-h-screen px-6 py-24
          bg-linear-to-b from-gray-50 to-white
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
                    name="Username"
                    placeholder={t("contact.form.username")}
                    value={formData.Username}
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
                    name="Email"
                    type="email"
                    placeholder={t("contact.form.email")}
                    value={formData.Email}
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
                    name="Message"
                    placeholder={t("contact.form.message")}
                    value={formData.Message}
                    onChange={handleInputChange}
                    className="min-h-35"
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
  )
}