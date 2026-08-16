import { useEffect, useRef } from "react";

export function useAutoplayVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = async () => {
      try {
        await video.play();
      } catch (err) {
        console.warn("Video autoplay blocked, will retry on visibility change:", err);
      }
    };

    // Immediate play attempt
    attemptPlay();

    // Retry on visibility change (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused) {
        attemptPlay();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return videoRef;
}
