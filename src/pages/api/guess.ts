import { extractJsonFromSchema } from "@/services/server/ai";
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

        const answer = JSON.parse(extractJsonFromSchema(completionContent)) as GuessResult;

        res.status(200).json(answer);
    } catch (error) {
        console.error("Error:", error);
        res.status(500);
    }
}



function guessHeadersPrompt(pdfContents: string[]): {
    systemPrompt: string;
    userPrompt: string;
} {
    const systemPrompt = `
You are a helpful assistant for extracting data from PDFs.

# Rules
- Please infer information required by user from based on [PDF Contents].
- If there are multiple PDFs, pick up the common information to compare PDFs.

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
            "maxLength": 30
        },
    },
    "columnHeaders": {
        "type":"array",
        "maxItems": 10,
        "minItems": 1,
        "items": {
            "type": "string",
            "maxLength": 30
        },
    },
    },
}
}
# Example
{
    "tableTitle": "本販売事業売上高推移",
    "rowHeaders": [
    "札幌店",
    "東京店",
    "横浜店",
    "仙台店"
    ],
    "columnHeaders": [
    "6月売上高",
    "7月売上高",
    "8月売上高"
    ]
}
`;
    const userPrompt = `
# PDF Contents
${pdfContents.map((pdfContent, index) => {
        return `
## PDF Content ${index + 1}
${pdfContent}
`;
    })}
`;
    return { systemPrompt, userPrompt };
}