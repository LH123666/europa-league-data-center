import { GET } from "../../app/api/uel-live/route";

// Cloudflare Pages Functions adapter for the existing UEL live-data route.
// Keeping one implementation prevents the Sites and Pages deployments from
// drifting apart while the migration is being completed.
export async function onRequestGet(): Promise<Response> {
  return GET();
}
