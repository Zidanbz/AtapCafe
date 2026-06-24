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

function getRequestPayload(request: any) {
  if (Buffer.isBuffer(request.rawBody)) {
    return request.rawBody;
  }

  if (request.body === undefined || request.body === null) {
    return undefined;
  }

  if (Buffer.isBuffer(request.body) || typeof request.body === "string") {
    return request.body;
  }

  return JSON.stringify(request.body);
}

export const api = onRequest(
  {
    region,
    cors: true,
    invoker: "public",
  },
  async (request, response) => {
    const app = await appPromise;
    const result = (await app.inject({
      method: request.method,
      url: request.originalUrl || request.url,
      headers: request.headers,
      payload: getRequestPayload(request),
    } as any)) as any;

    for (const [key, value] of Object.entries(result.headers)) {
      if (value !== undefined) {
        response.setHeader(key, value as string | number | readonly string[]);
      }
    }

    response.status(result.statusCode).send(result.rawPayload ?? result.payload);
  },
);
