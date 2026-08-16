import { useEffect, useRef } from "react";

/**
 * Ambient background videos only load and play while on screen. Playing all of
 * them at once exhausts the decoder and crashes the tab with ERR_BLOB_OUT_OF_MEMORY.
 */
export function useAutoplayVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.preload = "none";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.preload = "auto";
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return videoRef;
}
