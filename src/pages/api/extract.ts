import { extractJsonFromSchema } from "@/service/extract";
import { client, createCompletion } from "@/service/openai";
import { downloadPdfAndConvertText } from "@/service/pdf";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

type Data = {
  answer: string;
};

function inferHeadersPrompt(pdfContent: string): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `
You are a helpful assistant for extracting data from PDFs. 

# Rules
- Please infer information required by user from based on [PDF Content].

# JSON Schema
{
"type": "object",
"properties": {
    "tableTitle": "string",
    "rowHeaders": { 
      "type":"array",
      "maxItems": 10,
      "minItems": 1,
      "items": {
        "type": "string",
        "maxLength": 20
      },
    },
    "columnHeaders": { 
      "type":"array",
      "maxItems": 10,
      "minItems": 1,
      "items": {
        "type": "string",
        "maxLength": 20
      },
    },
  },
}
}
# Example
{
  "tableTitle": "本販売事業売上高推移",
  "columnHeaders": [
  "札幌店",
  "東京店",
  "横浜店",
  "仙台店"
  ],
  "rowHeaders": [
  "6月売上高",
  "7月売上高",
  "8月売上高"
  ]
}
`;
  const userPrompt = `
# PDF Content
${pdfContent}
`;
  return { systemPrompt, userPrompt };
}

function createTableBasedOnHeadersPrompt(
  pdfContent: string,
  columnHeaders: string[],
  rowHeaders: string[]
): { systemPrompt: string; userPrompt: string } {
  console.log(columnHeaders);
  console.log(rowHeaders);
  const systemPrompt = `
You are a helpful assistant for extracting data from PDFs. 

# Rules
- Please extract information based on [RowHeaders] and [ColumnHeaders].
- Please respond with a JSON following [Example] and this schema is defined as [JSON Schema].

# JSON Schema
{
"type": "object",
"properties": {
  ${columnHeaders.map((columnHeader) => {
    return `
      "${columnHeader}": {
        ${rowHeaders.map((rowHeader) => {
          return `"${rowHeader}": "string"`;
        })}
      },
    `;
  })}
  }
}

# Example
{ "札幌店":{ "9月売上": "10万円", "前月売り上げ比": '110%'},"東京店":{ "9月売上": "15万円", "前月売り上げ比": '90%'}}
`;
  const userPrompt = `
# PDF Content
${pdfContent}

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

const extractSchema = z.object({
  pdfUrl: z.string().url(),
  type: z.union([z.literal("create"), z.literal("infer")]),
  rowHeaders: z.string().max(20).array().min(1).max(10).optional(),
  columnHeaders: z.string().max(20).array().min(1).max(10).optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { pdfUrl, type, rowHeaders, columnHeaders } = extractSchema.parse(
    req.body
  );

  try {
    // PDFファイルのダウンロード
    const pdfContent = await downloadPdfAndConvertText(pdfUrl);

    const { userPrompt, systemPrompt } =
      type === "infer"
        ? inferHeadersPrompt(pdfContent)
        : createTableBasedOnHeadersPrompt(
            pdfContent,
            columnHeaders ?? [],
            rowHeaders ?? []
          );

    // OpenAI API にクエリを送信
    const completionContent = await createCompletion({
      client,
      model: "gpt-4o-mini",
      userPrompt,
      systemPrompt,
    });

    const answer = JSON.parse(extractJsonFromSchema(completionContent));

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ answer: "Error processing PDF" });
  }
}
