import { createServer } from "http";
import { parse } from "url";
import next from "next";
import dotenv from "dotenv";

// .envファイルを読み込む
dotenv.config();

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});

const appInsights = require("applicationinsights");
appInsights
  .setup(process.env.APPLICATION_INSTRUMENTAION_KEY)
  .setAutoCollectConsole(true, true)
  .setSendLiveMetrics(true)
  .start();
