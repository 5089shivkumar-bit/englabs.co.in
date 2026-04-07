"use client";
import { useCallback, useRef } from "react";

// Professional mechanical click sound for high-end hardware feel
const SOUND_URLS = {
  click: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", // Precise mechanical click
  lock: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",  // Heavy lock engagement
  error: "https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3", // System error/denied
};

export function useAudio() {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const play = useCallback((soundType: keyof typeof SOUND_URLS) => {
    // Lazy initialize audio objects to preserve performance
    if (typeof window === "undefined") return;

    if (!audioRefs.current[soundType]) {
      audioRefs.current[soundType] = new Audio(SOUND_URLS[soundType]);
      audioRefs.current[soundType].volume = 0.2; // Keep it subtle and professional
    }

    const audio = audioRefs.current[soundType];
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Browsers often block audio until first user interaction - ignore errors
    });
  }, []);

  return { play };
}
