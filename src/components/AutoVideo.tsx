import { useEffect, useRef, useCallback, useState, VideoHTMLAttributes } from "react";

type Props = VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
  poster?: string;
  onEnded?: () => void;
  /**
   * When defined, playback is gated by this flag: play when true, pause when
   * false. When undefined (default), the component tries to autoplay as soon
   * as the element mounts (legacy behavior).
   */
  play?: boolean;
  /**
   * When true, an IntersectionObserver on the <video> element itself gates
   * playback: it plays when ≥60% is visible and pauses when it leaves the
   * viewport. Used by the mobile carousel so the first (below-the-fold) slide
   * still autoplays on iOS once the user scrolls to it.
   */
  playWhenVisible?: boolean;
};

/**
 * Reliable autoplaying inline video for mobile (iOS/Safari) and desktop.
 */
const AutoVideo = ({
  src,
  poster,
  onEnded,
  className,
  loop,
  play,
  playWhenVisible,
  preload,
  ...rest
}: Props) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const gated = play !== undefined || playWhenVisible === true;
  const effectivePlay = playWhenVisible ? visible : play;

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
    if (!gated) {
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  }, [gated]);

  // IntersectionObserver-gated mode: mount an IO on the video element itself.
  useEffect(() => {
    if (!playWhenVisible) return;
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.6);
      },
      { threshold: [0, 0.6, 1] }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [playWhenVisible]);

  // Ungated legacy path: retry autoplay via multiple event hooks.
  useEffect(() => {
    if (gated) return;
    const v = ref.current;
    if (!v) return;

    const tryPlay = () => {
      if (!v.paused) return;
      v.muted = true;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    v.addEventListener("loadedmetadata", tryPlay);
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("canplaythrough", tryPlay);

    const onVis = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVis);

    const t = window.setTimeout(tryPlay, 400);

    return () => {
      v.removeEventListener("loadedmetadata", tryPlay);
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("canplaythrough", tryPlay);
      document.removeEventListener("visibilitychange", onVis);
      window.clearTimeout(t);
    };
  }, [src, gated]);

  // Gated path: react to `play`/`visible` changes.
  useEffect(() => {
    if (!gated) return;
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (effectivePlay) {
      const attempt = () => {
        const el = ref.current;
        if (!el) return;
        // Only start if still marked visible (for IO mode).
        if (playWhenVisible && !visible) return;
        el.muted = true;
        const p = el.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      };
      attempt();
      // Retry as soon as the media is ready — handles the case where the
      // element became visible before the first frame was decoded.
      const onReady = () => attempt();
      v.addEventListener("loadedmetadata", onReady);
      v.addEventListener("loadeddata", onReady);
      v.addEventListener("canplay", onReady);
      return () => {
        v.removeEventListener("loadedmetadata", onReady);
        v.removeEventListener("loadeddata", onReady);
        v.removeEventListener("canplay", onReady);
      };
    } else {
      try { v.pause(); } catch { /* ignore */ }
    }
  }, [effectivePlay, gated, playWhenVisible, visible, src]);

  return (
    <video
      ref={setRef}
      src={src}
      poster={poster}
      muted
      autoPlay={!gated}
      loop={loop ?? true}
      playsInline
      controls={false}
      disablePictureInPicture
      controlsList="nodownload nofullscreen noremoteplayback"
      preload={preload ?? "metadata"}
      onContextMenu={(e) => e.preventDefault()}
      onEnded={onEnded}
      className={className}
      {...rest}
    />
  );
};

export default AutoVideo;

