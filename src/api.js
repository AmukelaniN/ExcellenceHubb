export const WHO_CAN_APPLY_OPTIONS = [
  "All applicants",
  "Grade 12",
  "Final-year students or recent graduates",
  "Recent graduates",
  "Unemployed youth",
  "Experienced candidates",
  "Specific qualification/experience",
];

export const API_BASE_URL = (process.env.REACT_APP_API_URL || "https://localhost:7142").replace(/\/$/, "");

export async function apiRequest(path, { method = "GET", body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new Error(`Could not reach the ExcellenceHub API at ${API_BASE_URL}. Start the API and try again.`);
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const validationMessages = result.errors ? Object.values(result.errors).flat() : [];
    throw new Error(validationMessages[0] || result.message || result.title || "The request could not be completed.");
  }
  return result;
}





