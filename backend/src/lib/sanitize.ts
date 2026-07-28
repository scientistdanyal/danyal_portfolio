/**
 * Lightweight XSS hardening for stored/user-submitted strings.
 * Strips tags and neutralizes common javascript: / data: URL schemes.
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

export function sanitizeOptionalText(
  input: string | null | undefined,
): string | null | undefined {
  if (input === undefined) return undefined;
  if (input === null) return null;
  return sanitizeText(input);
}
