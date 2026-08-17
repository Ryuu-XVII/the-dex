// Admin access is granted to a fixed allow-list of Firebase Auth UIDs, configured
// via VITE_ADMIN_UIDS (comma-separated). Keep this list in sync with the
// `isAdminUid` conditions duplicated in firestore.rules — client-side env vars
// aren't trusted, so the Firestore rules are the actual enforcement boundary.
const ADMIN_UIDS: string[] = (import.meta.env.VITE_ADMIN_UIDS ?? "")
  .split(",")
  .map((id: string) => id.trim())
  .filter(Boolean);

export function isAdminUid(uid: string | null | undefined): boolean {
  return !!uid && ADMIN_UIDS.includes(uid);
}
