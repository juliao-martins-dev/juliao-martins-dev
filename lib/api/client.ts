import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SHEETDB_API_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

export { api };