import { extractJsonFromSchema } from "@/services/server/ai";
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

    const { userPrompt, systemPrompt } = extractInformationBasedOnHeadersPrompt(pdfContents, columnHeaders, rowHeaders)

    // OpenAI API にクエリを送信
    const completionContent = await createCompletion({
      client,
      model: "gpt-4o-mini",
      userPrompt,
      systemPrompt,
    });

    const answer = JSON.parse(extractJsonFromSchema(completionContent)) as ExtractResult;

    res.status(200).json(answer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500);
  }
}

function extractInformationBasedOnHeadersPrompt(
  pdfContents: string[],
  columnHeaders: string[],
  rowHeaders: string[]
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `
You are a helpful assistant for extracting data from PDFs. 

# Rules
- Please extract information based on [RowHeaders] and [ColumnHeaders].
- Please respond with a JSON following [Example] and this schema is defined as [JSON Schema].

# JSON Schema
{
  "type": "array",
  "maxItems": 20,
  "minItems": 1,
  "items": {
    "type": "object",
    "properties": {
        "title": {
          "type":"string",
          "description":"This value must be one of [${rowHeaders.join()}]",
          "enum": "${rowHeaders.join()}"
        },
        ${columnHeaders.map((columnHeader, i) => {
    return `"column-${i + 1}":{
              "type": "string",
              "description": "This value must be extracted from [PDF Contents] based on ${columnHeader} and the title property"
            },`
  })}
    "required": ["title",${columnHeaders.map((_, i) => { return `"column-${i + 1}"` }).join()}]
    }
  },
}

# Example
[ {"title":"札幌", "column-1": "10万円", "column-2": '110%'},{"title":"東京": "column-1": "15万円", "column-2": '90%'}]
`;
  const userPrompt = `
# PDF Contents
${pdfContents.map((pdfContent, index) => {
    return `
## PDF Content ${index + 1}
${pdfContent}
`;
  })}
# Row Headers
${rowHeaders.map((rowHeader: string) => {
    return `- ${rowHeader}`;
  })}

# Column Headers
${columnHeaders.map((columnHeader: string) => {
    return `- ${columnHeader}`;
  })}

`;
  return { systemPrompt, userPrompt };
}