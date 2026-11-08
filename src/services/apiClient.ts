export class ApiError extends Error { constructor(message: string, public status = 0) { super(message); } }
export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let r: Response;
  try { r = await fetch(url, { signal }); } catch (e) {
    if (signal?.aborted) throw e;
    throw new ApiError("Could not reach the book catalogue. Check your connection and try again.");
  }
  if (r.status === 429) throw new ApiError("The catalogue is rate limiting requests. Wait a minute and try again.", 429);
  if (!r.ok) throw new ApiError(`The catalogue returned an error (${r.status}).`, r.status);
  return (await r.json()) as T;
}
