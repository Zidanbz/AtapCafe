import { createHmac, timingSafeEqual } from "crypto";
import type { AdminRole } from "@prisma/client";

const TOKEN_TTL_SECONDS = 60 * 60 * 8;

type AdminTokenPayload = {
  sub: string;
  username: string;
  role: AdminRole;
  exp: number;
};

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getSecret() {
  return process.env.ADMIN_AUTH_SECRET || process.env.DATABASE_URL || "atap-dev-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createAdminToken(payload: Omit<AdminTokenPayload, "exp">) {
  const body = base64UrlEncode(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    }),
  );
  const signature = sign(body);

  return `${body}.${signature}`;
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  const [body, signature] = token.split(".");

  if (!body || !signature) {
    return null;
  }

  const expectedSignature = sign(body);
  const expected = Buffer.from(expectedSignature);
  const actual = Buffer.from(signature);

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as AdminTokenPayload;

    if (!payload.sub || !payload.username || !payload.role || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
