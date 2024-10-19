import { Page } from "puppeteer";

export function guessAnchorsUserNeedsPrompt(
  query: string,
  content: string,
  anchors: string[],
  maxItems: number
): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `
You are a helpful assistant for guessing anchors user needs.

# Rules
- Please guess anchors which can lead pdf file required by user from [Anchors] based on [User Query].
- [Anchors] are already extracted from [Content].

# JSON Schema
{
    "type": "array",
    "maxItems": ${maxItems},
    "minItems": 1,
    "items": {
        "type": "string",
        "enum": "${anchors.join()}"
    }
}
 
# Example
[
    "//example.com/about",
    "/readme",
    "/link"
]
`;
  const userPrompt = `
# User Query
${query}

# Content
${content}

# Anchors
${anchors.map((anchor) => `- ${anchor}`)}
`;
  return { systemPrompt, userPrompt };
}

export async function getContentFromPage(page: Page): Promise<string> {
  const content = await page.content();
  return content;
}

export async function getAllAnchorsFromPage(page: Page): Promise<string[]> {
  const hrefs = await page.$$eval("a", (anchors) =>
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
