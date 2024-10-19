import { ExploreResult } from "@/types";
import { request } from "./api";

export const explorePdfsBasedOnQueryFromUrl = async (
  query: string,
  targetUrl: string
): Promise<ExploreResult> => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetUrl,
      query,
      maxItems: 3,
    }),
  };
  return await request<ExploreResult>("/api/explore", options);
};

export const explorePdfsFromUrl = async (
  targetUrls: string[],
  urlsExplored: string[]
): Promise<ExploreResult> => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetUrls: targetUrls.filter((_, i) => i < 4),
      urlsExplored,
    }),
  };
  return await request<ExploreResult>("/api/explore", options);
};
