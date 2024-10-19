import { TableRow } from "@/types";
import { request } from "./api";

export const extractInformationBasedOnHeadersFromPdfUrls = async (
  columnHeaders: string[],
  rowHeaders: string[],
  pdfUrls: string[],
) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pdfUrls,
      rowHeaders,
      columnHeaders,
    }),
  };
  return await request<TableRow[]>("/api/extract", options);
};