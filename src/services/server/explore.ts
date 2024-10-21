import { Page } from "puppeteer";

export function guessPdfsUserNeedsPrompt(
  query: string,
  content: string,
  targetUrls: string[],
  pdfUrls: string[],
): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `
You are a helpful assistant for guessing urls user needs.

# Rules
- Please guess urls and pdf urls which have the pdf file required by user based on [User Query] and [Content].
- Please answer urls from [Urls] and pdf urls from [Pdf Urls]
- [Urls] and [Pdf Urls] are already extracted from [Content].

# JSON Schema
{
  "type": "object"
  "properties": {
      "targetUrls":{
        "type": "array",
        "maxItems": 3,
        "minItems": 1,
        "items": {
            "type": "string",
            "description": "url"
            "enum": "${targetUrls.join()}"
        }
      },
      "pdfUrls":{
        "type": "array",
        "maxItems": 5,
        "minItems": 1,
        "items": {
            "type": "string",
            "description": "pdf url"
            "enum": "${pdfUrls.join()}"
        }
      },
  }
}

# Example
{
  "targetUrls":[
      "https:/example.com/about",
      "https:/example.com/readme",
      "https:/example.com/link"
  ],
  "pdfUrls":[
      "https:/example.com/about/info.pdf",
      "https:/example.com/info.pdf",
      "https:/example.com/link.pdf"
  ]
}
`;
  const userPrompt = `
# User Query
${query}

# Content
${content.slice(0, 5000)}

# Urls
${targetUrls.map((url) => `- ${url}
`)}

# PdfUrls
${pdfUrls.map((url) => `- ${url}
`)}

`;
  return { systemPrompt, userPrompt };
}

export async function getContentFromPage(page: Page): Promise<string> {
  const content = await page.content();
  return content;
}

export async function getAllAnchorsFromPage(page: Page): Promise<string[]> {
  const hrefs = await page.$$eval("a", (anchors: any[]) =>
    anchors
      .map((anchor) => anchor.getAttribute("href"))
      .filter((href) => href !== null)
  );
  return hrefs;
}
export function getAllPdfUrlsFromAnchors(hrefs: string[]): string[] {
  const pdfUrls = hrefs.filter((href) => href.endsWith(".pdf"));
  return pdfUrls;
}
