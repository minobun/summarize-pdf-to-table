export function guessHeadersPrompt(pdfContents: string[]): {
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
        "type":"object",
        "items": {
            "column-1": "string",
            ...
            "column-20": "string"
        },
        "description": "column names which starts with 'column'. 20 columns at most."
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
    "columnHeaders": {
      "column-1": "売り上げ高",
      "column-2": "前月比率",
      "column-3": "利益率"
    }
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
