import "./env";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp, applicationDefault, deleteApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, Timestamp, type DocumentData, type QueryDocumentSnapshot } from "firebase-admin/firestore";

function getProjectId() {
  return process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT;
}

function getPrivateKey() {
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

function getCredential() {
  const projectId = getProjectId();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (projectId && clientEmail && privateKey) {
    return cert({
      projectId,
      clientEmail,
      privateKey,
    });
  }

  if (serviceAccountPath) {
    const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);

    if (existsSync(resolvedPath)) {
      return cert(JSON.parse(readFileSync(resolvedPath, "utf8")) as ServiceAccount);
    }
  }

  return applicationDefault();
}

if (getApps().length === 0) {
  initializeApp({
    credential: getCredential(),
    projectId: getProjectId(),
  });
}

export const db = getFirestore();

export async function closeDatabase() {
  await Promise.all(getApps().map((app) => deleteApp(app)));
}

export function dateToFirestore(value: Date | null | undefined) {
  return value ? Timestamp.fromDate(value) : null;
}

export function firestoreToDate(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    return new Date(value);
  }

  return new Date();
}

export function mapDoc<T>(snapshot: QueryDocumentSnapshot<DocumentData>) {
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as T;
}
