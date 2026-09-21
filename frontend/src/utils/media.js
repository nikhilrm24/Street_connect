export const API_BASE_URL = "http://localhost:5000";

export function resolveImageUrl(imagePath) {
  if (!imagePath) return "";
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  if (imagePath.startsWith("/")) return `${API_BASE_URL}${imagePath}`;
  return imagePath;
}

export function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "SC";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}
