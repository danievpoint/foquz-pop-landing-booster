import { useEffect, useRef, useCallback, VideoHTMLAttributes } from "react";

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
};

/**
 * Reliable autoplaying inline video for mobile (iOS/Safari) and desktop.
 * See notes below for the iOS quirks handled here.
 */
const AutoVideo = ({ src, poster, onEnded, className, loop, play, preload, ...rest }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);
  const gated = play !== undefined;

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

  // Gated path: react to `play` prop changes.
  useEffect(() => {
    if (!gated) return;
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (play) {
      const attempt = () => {
        if (!ref.current) return;
        const p = ref.current.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      };
      attempt();
      // Retry once metadata/data is ready in case play() was too early.
      const onReady = () => attempt();
      v.addEventListener("loadedmetadata", onReady);
      v.addEventListener("canplay", onReady);
      return () => {
        v.removeEventListener("loadedmetadata", onReady);
        v.removeEventListener("canplay", onReady);
      };
    } else {
      try { v.pause(); } catch { /* ignore */ }
    }
  }, [play, gated, src]);

  const videoEl = (
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
      preload={preload ?? "auto"}
      onContextMenu={(e) => e.preventDefault()}
      onEnded={onEnded}
      className={poster ? "absolute inset-0 w-full h-full object-cover" : className}
      {...rest}
    />
  );

  if (!poster) return videoEl;

  // Poster zusätzlich als eigenes <img> darunter legen: es lädt sofort (eager,
  // hohe Priorität) und verhindert das kurze weiße Aufblitzen, bevor das Video
  // seinen ersten Frame malen kann.
  return (
    <div className={`relative ${className ?? ""}`}>
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {videoEl}
    </div>
  );

};

export default AutoVideo;
