import { extractJsonFromSchema } from "@/services/server/ai";
import { guessHeadersPrompt } from "@/services/server/guess";
import { client, createCompletion } from "@/services/server/openai";
import { downloadPdfAndConvertText } from "@/services/server/pdf";
import { GuessResult } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const guessSchema = z.object({
  pdfUrls: z.string().url().array().min(1).max(10),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GuessResult>
) {
  const { pdfUrls } = guessSchema.parse(req.body);

  try {
    // PDFファイルのダウンロード
    const pdfContents = await Promise.all(
      pdfUrls.map(async (pdfUrl) => await downloadPdfAndConvertText(pdfUrl))
    );

    if (pdfContents.join().length > 100000) throw new Error();

    const { userPrompt, systemPrompt } = guessHeadersPrompt(pdfContents);

    // OpenAI API にクエリを送信
    const completionContent = await createCompletion({
      client,
      model: "gpt-4o-mini",
      userPrompt,
      systemPrompt,
    });

    const answer = JSON.parse(
      extractJsonFromSchema(completionContent)
    ) as GuessResult;

    res.status(200).json(answer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500);
  }
}
