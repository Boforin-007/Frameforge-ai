"use client"

import { useEffect, useSyncExternalStore } from "react";

const imageCache: Record<string, HTMLImageElement> = {};
let cacheVersion = 0;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return cacheVersion;
}

function notify() {
  cacheVersion += 1;
  listeners.forEach((listener) => listener());
}

/** Loads an image once and exposes the decoded HTMLImageElement for Konva. */
export function useImage(url?: string) {
  const version = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    if (!url) return;
    if (imageCache[url]) return;

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      imageCache[url] = img;
      notify();
    };
    img.src = url;
    return () => {
      cancelled = true;
    };
  }, [url]);

  void version;
  return url ? imageCache[url] : undefined;
}

/** Loads images into the shared cache so subsequent `useImage` reads are instant. */
export async function preloadImage(url: string): Promise<void> {
  if (!url || imageCache[url]) return;
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache[url] = img;
      notify();
      resolve();
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/** Computes a source crop (in image pixels) that "covers" the destination box without distortion. */
export function coverCrop(
  sourceW: number,
  sourceH: number,
  destW: number,
  destH: number
) {
  const scale = Math.max(destW / sourceW, destH / sourceH);
  const srcW = destW / scale;
  const srcH = destH / scale;
  return {
    x: (sourceW - srcW) / 2,
    y: (sourceH - srcH) / 2,
    width: srcW,
    height: srcH,
  };
}