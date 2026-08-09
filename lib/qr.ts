import QRCode from "qrcode";

export async function toQrDataUrl(
  value: string,
  options?: { fgColor?: string; bgColor?: string; size?: number }
) {
  return QRCode.toDataURL(value, {
    width: options?.size ?? 512,
    margin: 0,
    errorCorrectionLevel: "M",
    color: {
      dark: options?.fgColor ?? "#0b0d12",
      light: options?.bgColor ?? "#ffffff",
    },
  });
}

const qrCache = new Map<string, Promise<string>>();

function cacheKey(value: string, options?: { fgColor?: string; bgColor?: string; size?: number }) {
  return JSON.stringify([value, options?.fgColor, options?.bgColor, options?.size ?? 512]);
}

/**
 * Like `toQrDataUrl`, but memoized so identical codes resolve instantly for
 * repeated renders (e.g. sequential batch export).
 */
export async function getQrDataUrl(
  value: string,
  options?: { fgColor?: string; bgColor?: string; size?: number }
) {
  const key = cacheKey(value, options);
  let pending = qrCache.get(key);
  if (!pending) {
    pending = toQrDataUrl(value, options);
    qrCache.set(key, pending);
  }
  return pending;
}

/** Warms the cache for many values up front so a later mount needs no waiting. */
export async function prewarmQr(
  values: Array<{ value: string; fgColor?: string; bgColor?: string; size?: number }>
) {
  await Promise.all(values.map((v) => getQrDataUrl(v.value, v)));
}