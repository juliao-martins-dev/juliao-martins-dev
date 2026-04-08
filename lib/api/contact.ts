import { ContactFormData } from "@/types/contact";
import { api } from "./client";


export async function sendContactForm(data: ContactFormData) {
  return api.post(
        "/",
        {
          data: data
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
  }