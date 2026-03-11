import mixpanel from "mixpanel-browser";

type MixpanelProperties = {
  plan?: string;
  role?: string;
  createdAt?: string;
};

const token = process.env.MIXPANEL_TOKEN;
let isInitialized = false;

export const initMixpanel = () => {
  if (typeof window === "undefined") return;
  if (!token) {
    console.warn("Mixpanel token not configured, skipping initialization");
    return;
  }
  if (isInitialized) return;
  mixpanel.init(token, {
    track_pageview: false,
    persistence: "localStorage",
  });
  isInitialized = true;
};

export const trackEvent = (
  event: string,
  properties?: Record<string, unknown>,
) => {
  if (typeof window === "undefined") return;
  if (!isInitialized) return;
  mixpanel.track(event, properties);
};

// export const identifyUser = (
//   userId: string,
//   properties?: MixpanelProperties,
// ) => {
//   if (typeof window === "undefined") return;
//   if (!isInitialized) return;
//   mixpanel.identify(userId);
//   if (properties) {
//     mixpanel.people.set(properties);
//   }
// };

export const identifyUser = (
  userId: string,
  properties?: MixpanelProperties,
) => {
  if (typeof window === "undefined") return;
  if (!isInitialized) return;
  mixpanel.identify(userId);
  mixpanel.people.set({
    ...properties,
    last_seen: new Date().toISOString(), // always set at least this
  });
};

export const resetUser = () => {
  if (typeof window === "undefined") return;
  if (!isInitialized) return;
  mixpanel.reset();
};
