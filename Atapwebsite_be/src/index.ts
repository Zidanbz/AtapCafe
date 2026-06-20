import "./config/env";
import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2/options";
import { buildApp } from "./app";

const region = process.env.FUNCTION_REGION || "asia-southeast2";

setGlobalOptions({
  region,
  maxInstances: 10,
});

const appPromise = buildApp().then(async (app) => {
  await app.ready();
  return app;
});

export const api = onRequest(
  {
    region,
    cors: true,
    invoker: "public",
  },
  async (request, response) => {
    const app = await appPromise;

    app.server.emit("request", request, response);
  },
);
