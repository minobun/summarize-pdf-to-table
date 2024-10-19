import { extractJsonFromSchema } from "@/services/server/ai";
import { extractInformationBasedOnHeadersPrompt } from "@/services/server/extract";
import { client, createCompletion } from "@/services/server/openai";
import { downloadPdfAndConvertText } from "@/services/server/pdf";
import { ExtractResult } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const extractSchema = z.object({
  pdfUrls: z.string().url().array().min(1).max(10),
  rowHeaders: z.string().max(100).array().min(1).max(20),
  columnHeaders: z.string().max(100).array().min(1).max(20),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExtractResult>
) {
  const { pdfUrls, rowHeaders, columnHeaders } = extractSchema.parse(req.body);

  try {
    // PDFファイルのダウンロード
    const pdfContents = await Promise.all(
      pdfUrls.map(async (pdfUrl) => await downloadPdfAndConvertText(pdfUrl))
    );

    if (pdfContents.join().length > 100000) throw new Error();

    const { userPrompt, systemPrompt } = extractInformationBasedOnHeadersPrompt(
      pdfContents,
      columnHeaders,
      rowHeaders
    );

    // OpenAI API にクエリを送信
    const completionContent = await createCompletion({
      client,
      model: "gpt-4o-mini",
      userPrompt,
      systemPrompt,
    });

    const answer = JSON.parse(
      extractJsonFromSchema(completionContent)
    ) as ExtractResult;

    res.status(200).json(answer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500);
  }
}
