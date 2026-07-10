import { useEffect, useRef, VideoHTMLAttributes } from "react";

type Props = VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
  poster?: string;
  onEnded?: () => void;
};

/**
 * Reliable autoplaying inline video for mobile (iOS/Safari) and desktop.
 * - Forces the DOM `muted` property via ref (React's JSX `muted` attribute is
 *   unreliable on iOS, which then blocks autoplay and shows a play overlay).
 * - Uses `playsinline` + `webkit-playsinline` to keep video inline on iPhone.
 * - Retries `play()` on `canplay` and when the tab/element becomes visible.
 */
const AutoVideo = ({ src, poster, onEnded, className, ...rest }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Force muted DOM property before any play() attempt.
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    tryPlay();
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("loadedmetadata", tryPlay);

    // Retry when the element scrolls into view (iOS pauses off-screen video).
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) tryPlay();
          else v.pause();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(v);

    const onVis = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("loadedmetadata", tryPlay);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      autoPlay
      loop={rest.loop ?? true}
      playsInline
      controls={false}
      disablePictureInPicture
      controlsList="nodownload nofullscreen noremoteplayback"
      preload="auto"
      onContextMenu={(e) => e.preventDefault()}
      onEnded={onEnded}
      className={className}
      {...rest}
    />
  );
};

export default AutoVideo;
