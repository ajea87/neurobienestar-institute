export const PIXEL_ID = "2050350505902150";

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

export const pageView = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params);
  }
};

export const events = {
  viewContent: () =>
    trackEvent("ViewContent", {
      content_name: "Test Diagnóstico Nervio Vago",
      content_category: "Diagnóstico",
    }),

  lead: () =>
    trackEvent("Lead", {
      content_name: "Test Nervio Vago Completado",
    }),

  initiateCheckout: () =>
    trackEvent("InitiateCheckout", {
      value: 7.0,
      currency: "EUR",
      content_name: "Protocolo Nervio Vago",
    }),

  completeRegistration: (level: string) =>
    trackEvent("CompleteRegistration", {
      content_name: "Email capturado pre-pago",
      status: level,
    }),

  purchase: () =>
    trackEvent("Purchase", {
      value: 7.0,
      currency: "EUR",
      content_name: "Protocolo Nervio Vago",
      content_type: "product",
    }),
};
