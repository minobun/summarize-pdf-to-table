import appInsights from "@/libs/appInsights";
import { extractJsonFromSchema } from "@/services/server/ai";
import {
  getAllAnchorsFromPage,
  getAllPdfUrlsFromAnchors,
  guessPdfsUserNeedsPrompt,
} from "@/services/server/explore";
import { client, createCompletion } from "@/services/server/openai";
import { ExploreResult } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer, { Browser } from "puppeteer";
import { z } from "zod";

const exploreSchema = z.object({
  query: z.string().optional(),
  targetUrls: z.string().url().array().min(1).max(5),
  urlsExplored: z.string().url().array(),
});

async function guessPdfsUserNeeds(query: string, content: string, newTargetUrls: string[], newPdfUrls: string[]): Promise<{ targetUrls: string[], pdfUrls: string[] }> {
  try {
    const { userPrompt, systemPrompt } = guessPdfsUserNeedsPrompt(query, content, newTargetUrls, newPdfUrls);

    // OpenAI API にクエリを送信
    const completionContent = await createCompletion({
      client,
      model: "gpt-4o-mini",
      userPrompt,
      systemPrompt,
    });

    const result = JSON.parse(
      extractJsonFromSchema(completionContent)
    ) as { targetUrls: string[], pdfUrls: string[] };

    return result;
  } catch (error) {
    console.error(error);
    return { targetUrls: [], pdfUrls: [] }
  }
}

async function findPdfsAndUrlContent(
  browser: Browser,
  url: string
): Promise<ExploreResult & { content: string }> {
  try {
    const page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0"
    );
    await page.goto(url, { waitUntil: "networkidle0" });
    const content = await page.content();
    const anchors = await getAllAnchorsFromPage(page);
    const targetUrls = anchors
      .map((anchor) => new URL(anchor, url).toString())
      .filter((url) => url.startsWith("http"));
    const pdfUrls = getAllPdfUrlsFromAnchors(targetUrls);
    return {
      targetUrls,
      urlsExplored: [url],
      pdfUrls,
      content,
    };
  } catch (error) {
    console.error(error);
    return {
      targetUrls: [],
      urlsExplored: [],
      pdfUrls: [],
      content: ""
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExploreResult>
) {
  const { query, targetUrls, urlsExplored } = exploreSchema.parse(req.body);
  if (appInsights)
    appInsights.trackTrace({ message: "Received Explore Request" });
  try {
    // Puppeteerのブラウザを起動
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    if (appInsights)
      appInsights.trackTrace({ message: "Successed to launch browser" });

    const urls = targetUrls.filter(
      (targetUrl) => !urlsExplored.includes(targetUrl)
    );

    // PDFファイルの探索
    const results = await Promise.all(
      urls.map(async (url) => {
        const result = await findPdfsAndUrlContent(browser, url);
        if (query) {
          const resultFiltered = await guessPdfsUserNeeds(query, result.content, result.targetUrls, result.pdfUrls);
          return { ...result, ...resultFiltered };
        }
        return result;
      })
    );

    if (appInsights)
      appInsights.trackTrace({ message: "Successed to explore browser" });

    const newTargetUrls = results.flatMap((result) => result.targetUrls);
    const newUrlsExplored = [...urlsExplored, ...results.flatMap((result) => result.urlsExplored)];
    const newPdfUrls = results.flatMap((result) => result.pdfUrls);

    // 最初のhrefと遷移後のURLをレスポンスとして返す
    res.status(200).send({
      targetUrls: newTargetUrls,
      urlsExplored: newUrlsExplored,
      pdfUrls: newPdfUrls,
    });

    await browser.close();
  } catch (error) {
    if (appInsights)
      appInsights.trackTrace({ message: "Failed to process Explore Request." });
    console.error(error);
    res.status(500).end();
  }
}
