import ExtractTable from "@/components/modules/ExtractTable";
import PdfUrlsImport from "@/components/modules/PdfUrlsImport";
import { Divider } from "@mui/material";
import { useState } from "react";

export default function Extract() {
  const [pdfUrls, setPdfUrls] = useState<string[]>([""]);

  return (
    <>
      <PdfUrlsImport pdfUrls={pdfUrls} setPdfUrls={setPdfUrls} />
      <Divider />
      <ExtractTable pdfUrls={pdfUrls} />
    </>
  );
}
