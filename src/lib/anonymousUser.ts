const OWNER_ID_STORAGE_KEY = "waypoint-owner-id";

export function getAnonymousOwnerId() {
  if (typeof window === "undefined") {
    return "";
  }

  const existingOwnerId = localStorage.getItem(OWNER_ID_STORAGE_KEY);

  if (existingOwnerId) {
    return existingOwnerId;
  }

  const newOwnerId = crypto.randomUUID();
  localStorage.setItem(OWNER_ID_STORAGE_KEY, newOwnerId);

  return newOwnerId;
}