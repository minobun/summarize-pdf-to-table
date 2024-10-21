import { TableRow } from "@/types";
import { request } from "./api";

export const extractInformationBasedOnHeadersFromPdfUrls = async (
  result: TableRow[],
  pdfUrls: string[]
) => {
  const columnHeaders =
    result.length > 0
      ? [...Object.values(result[0]).filter((row) => row[0] !== "title")]
      : [];
  const rowHeaders =
    result.length > 1
      ? result.filter((_, i) => i > 0).map((item) => item.title)
      : [];
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rowHeaders,
      columnHeaders,
      pdfUrls,
    }),
  };
  return await request<TableRow[]>("/api/extract", options);
};
