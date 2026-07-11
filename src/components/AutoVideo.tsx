import { useEffect, useRef, useCallback, VideoHTMLAttributes } from "react";

type Props = VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
  poster?: string;
  onEnded?: () => void;
};

/**
 * Reliable autoplaying inline video for mobile (iOS/Safari) and desktop.
 *
 * Key iOS gotchas handled here:
 * - iOS only autoplays when the element has `muted` AND `playsinline` set as
 *   real HTML attributes BEFORE the src starts loading. React's JSX `muted`
 *   prop is applied as a property after the element exists, which is too
 *   late – iOS then shows the native "tap to play" overlay. We fix this with
 *   a ref callback that sets the attributes synchronously on mount.
 * - iOS pauses videos that were programmatically played if we call
 *   pause() ourselves from an IntersectionObserver. In the carousel only
 *   the active slide is mounted anyway, so we don't need to pause here.
 * - `play()` returns a promise that can reject on iOS Low Power Mode; we
 *   retry on `canplay`, `loadeddata`, and visibility changes.
 */
const AutoVideo = ({ src, poster, onEnded, className, loop, ...rest }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);

  // Ref callback runs synchronously the first time the element exists,
  // BEFORE the browser starts loading the src, so iOS sees the muted +
  // playsinline attributes in time to allow inline autoplay.
  const setRef = useCallback((el: HTMLVideoElement | null) => {
    ref.current = el;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");
    el.setAttribute("x-webkit-airplay", "deny");
    el.setAttribute("disableRemotePlayback", "");
    // Kick off playback as soon as the element is attached.
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const tryPlay = () => {
      if (!v.paused) return;
      v.muted = true;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    // Multiple retry hooks – whichever fires first wins.
    v.addEventListener("loadedmetadata", tryPlay);
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("canplaythrough", tryPlay);

    const onVis = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVis);

    // As a last resort, if playback still hasn't started after a beat,
    // retry once more. Fixes rare iOS races on slow networks.
    const t = window.setTimeout(tryPlay, 400);

    return () => {
      v.removeEventListener("loadedmetadata", tryPlay);
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("canplaythrough", tryPlay);
      document.removeEventListener("visibilitychange", onVis);
      window.clearTimeout(t);
    };
  }, [src]);

  return (
    <video
      ref={setRef}
      src={src}
      poster={poster}
      muted
      autoPlay
      loop={loop ?? true}
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
