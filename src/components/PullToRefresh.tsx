import { useState, useRef, useCallback, useEffect } from "react";

const THRESHOLD = 80;

const PullToRefresh = ({ children }: { children: React.ReactNode }) => {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const isDragging = useRef(false);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      isDragging.current = true;
    }
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current || refreshing) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0 && window.scrollY === 0) {
      setPulling(true);
      setPullDistance(Math.min(diff * 0.4, 120));
    } else {
      setPulling(false);
      setPullDistance(0);
    }
  }, [refreshing]);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
    if (pullDistance >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullDistance(50);
      setPulling(false);
      // Page will reload — keep spinner visible until unload
      window.location.reload();
    } else {
      setPulling(false);
      setPullDistance(0);
    }
  }, [pullDistance, refreshing]);

  useEffect(() => {
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]);

  const offset = pulling || refreshing ? pullDistance : 0;

  return (
    <div
      style={{
        transform: offset > 0 ? `translateY(${offset}px)` : undefined,
        transition: !pulling ? 'transform 0.3s ease' : undefined,
      }}
    >
      {offset > 0 && (
        <div
          className="absolute left-0 right-0 z-[99999] flex items-center justify-center pointer-events-none"
          style={{
            top: -offset,
            height: offset,
            opacity: Math.min(offset / THRESHOLD, 1),
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            className={refreshing ? "animate-spin" : ""}
            style={{
              transform: !refreshing ? `rotate(${pullDistance * 3}deg)` : undefined,
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="14"
                y1="4"
                x2="14"
                y2="9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity={refreshing ? 0.25 + (i / 12) * 0.75 : Math.min(pullDistance / THRESHOLD, 1) * (0.15 + (i / 12) * 0.85)}
                transform={`rotate(${i * 30} 14 14)`}
                className="text-foreground"
              />
            ))}
          </svg>
        </div>
      )}
      {children}
    </div>
  );
};

export default PullToRefresh;
