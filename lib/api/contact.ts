import axios from "axios";
import { ContactFormData } from "@/types/contact";


export async function sendContactForm(data: ContactFormData) {
  return axios.post(
        "https://sheetdb.io/api/v1/iswzlnv05hdq5",
        {
          data: data
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
  }