import * as appInsights from "applicationinsights";

// Application Insightsの初期化
appInsights
  .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoCollectConsole(true, true)
  .setSendLiveMetrics(true)
  .start();

const client = appInsights.defaultClient;

if (!client) {
  console.error("Application Insights client failed to initialize.");
}
export default client;
