export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export function badRequest(message: string) {
  return new HttpError(400, message);
}

export function notFound(message: string) {
  return new HttpError(404, message);
}
