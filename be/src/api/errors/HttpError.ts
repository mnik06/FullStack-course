export class HttpError extends Error {
  constructor(
    readonly params: {
      statusCode: number,
      message: string,
      cause?: Error | unknown,
      errorCode?: number
    }
  ) {
    super(params.message);
  }
}