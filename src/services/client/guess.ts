import { GuessResult } from "@/types";
import { request } from "./api";

export const guessHeadersFromPdfUrls = async (
    pdfUrls: string[]
) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfUrls }),
    };
    return await request<GuessResult>("api/guess", options)
};
