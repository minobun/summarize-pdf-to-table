import {
  getAllAnchorsFromPage,
  getAllPdfUrlsFromAnchors,
} from "@/services/server/explore";
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer, { Browser } from "puppeteer";
import { z } from "zod";
import { ExploreResult } from "@/types";

const exploreSchema = z.object({
  targetUrls: z.string().url().array().min(1).max(5),
  urlsExplored: z.string().url().array(),
});

async function guessPdfsUserNeeds(
  browser: Browser,
  url: string
): Promise<ExploreResult> {
  try {
    const page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0"
    );
    await page.goto(url, { waitUntil: "networkidle0" });
    const anchors = await getAllAnchorsFromPage(page);
    const targetUrls = anchors
      .map((anchor) => new URL(anchor, url).toString())
      .filter((url) => url.startsWith("http"));
    const pdfUrls = getAllPdfUrlsFromAnchors(targetUrls);
    return {
      targetUrls,
      urlsExplored: [url],
      pdfUrls,
    };
  } catch (error) {
    console.error(error);
    return {
      targetUrls: [],
      urlsExplored: [],
      pdfUrls: [],
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { targetUrls, urlsExplored } = exploreSchema.parse(req.body);
  try {
    // Puppeteerのブラウザを起動
    const browser = await puppeteer.launch();

    const urls = targetUrls.filter(
      (targetUrl) => !urlsExplored.some((url) => targetUrl === url)
    );

    // PDFファイルの探索
    const results = await Promise.all(
      await urls.map(async (url) => await guessPdfsUserNeeds(browser, url))
    );

    const newTargetUrls = results.flatMap((result) => result.targetUrls);
    const newUrlsExplored = results.flatMap((result) => result.urlsExplored);
    const newPdfUrls = results.flatMap((result) => result.pdfUrls);

    // 最初のhrefと遷移後のURLをレスポンスとして返す
    res.status(200).send({
      targetUrls: newTargetUrls,
      urlsExplored: newUrlsExplored,
      pdfUrls: newPdfUrls,
    });

    await browser.close();
  } catch (error) {
    console.error(error);
    res.status(500);
  }
}
