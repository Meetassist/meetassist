import Nylas from "nylas";

if (
  !process.env.NYLAS_API_SECRET_KEY ||
  !process.env.NYLAS_API_URI ||
  !process.env.NYLAS_CLIENT_ID ||
  !process.env.NEXT_PUBLIC_URL
) {
  throw new Error(
    "Missing required environment variables: NYLAS_API_SECRET_KEY, NYLAS_API_URI, NYLAS_CLIENT_ID, NEXT_PUBLIC_URL",
  );
}
export const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_SECRET_KEY,
  apiUri: process.env.NYLAS_API_URI,
});

export const nylasConfig = {
  clientId: process.env.NYLAS_CLIENT_ID!,
  redirectUri:
    process.env.NEXT_PUBLIC_URL!.replace(/\/$/, "") + "/api/oauth/exchange",
  apiKey: process.env.NYLAS_API_SECRET_KEY!,
  apiUri: process.env.NYLAS_API_URI!,
} as const;
