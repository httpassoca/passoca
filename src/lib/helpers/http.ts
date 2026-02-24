type FetchJsonOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  timeoutMs?: number;
};

export class HttpError extends Error {
  status: number;
  url: string;
  bodyText?: string;

  constructor(
    message: string,
    opts: { status: number; url: string; bodyText?: string }
  ) {
    super(message);
    this.name = "HttpError";
    this.status = opts.status;
    this.url = opts.url;
    this.bodyText = opts.bodyText;
  }
}

export async function fetchJson<T>(
  fetchFn: typeof fetch,
  url: string,
  opts: FetchJsonOptions = {}
): Promise<T> {
  const { timeoutMs = 10_000, method, headers, body } = opts;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetchFn(url, {
      method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(headers ?? {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      const bodyText = await res.text().catch(() => undefined);
      throw new HttpError(`Request failed: ${res.status} ${res.statusText}`, {
        status: res.status,
        url,
        bodyText,
      });
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}
