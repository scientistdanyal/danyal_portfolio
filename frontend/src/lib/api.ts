const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  formData?: FormData;
  /** Skip cookies — for public/server fetches */
  public?: boolean;
  revalidate?: number | false;
};

export async function api<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: HeadersInit = {};
  let body: BodyInit | undefined;

  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const init: RequestInit & { next?: { revalidate?: number | false } } = {
    method:
      options.method ??
      (options.body || options.formData ? "POST" : "GET"),
    headers,
    body,
    credentials: options.public ? "omit" : "include",
  };

  if (options.revalidate !== undefined) {
    init.next = { revalidate: options.revalidate };
  } else if (options.public) {
    init.next = { revalidate: 60 };
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, init);
  } catch (err) {
    // Allow Next.js production builds when the API is not reachable yet
    if (options.public) {
      throw new ApiError(
        err instanceof Error ? err.message : "API unreachable",
        503,
      );
    }
    throw err;
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const payload = (await res.json().catch(() => ({}))) as {
    data?: T;
    error?: string;
    details?: unknown;
  };

  if (!res.ok) {
    const detailsMessage = formatValidationDetails(payload.details);
    throw new ApiError(
      detailsMessage
        ? `${payload.error ?? "Request failed"}: ${detailsMessage}`
        : (payload.error ?? "Request failed"),
      res.status,
      payload.details,
    );
  }

  return (payload.data ?? payload) as T;
}

function formatValidationDetails(details: unknown): string | null {
  if (!details || typeof details !== "object") return null;
  const fieldErrors = (details as { fieldErrors?: Record<string, string[]> })
    .fieldErrors;
  if (!fieldErrors) return null;
  const parts = Object.entries(fieldErrors)
    .filter(([, messages]) => messages?.length)
    .map(([field, messages]) => `${field}: ${messages.join(", ")}`);
  return parts.length ? parts.join(" · ") : null;
}

export function mediaUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export { API_BASE };
