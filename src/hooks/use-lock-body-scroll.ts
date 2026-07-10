import { useEffect } from "react";

let lockCount = 0;
let lockedScrollY = 0;
let previousBodyStyles: Partial<CSSStyleDeclaration> = {};
let previousHtmlStyles: Partial<CSSStyleDeclaration> = {};

const LOCK_ATTR = "data-scroll-locked";

export const useLockBodyScroll = (locked: boolean) => {
  useEffect(() => {
    if (!locked || typeof window === "undefined") return;

    lockCount += 1;

    if (lockCount === 1) {
      const { body, documentElement } = document;
      lockedScrollY = window.scrollY || documentElement.scrollTop || 0;

      previousBodyStyles = {
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
        overflow: body.style.overflow,
      };
      previousHtmlStyles = {
        overflow: documentElement.style.overflow,
        overscrollBehaviorY: documentElement.style.overscrollBehaviorY,
      };

      documentElement.style.overflow = "hidden";
      documentElement.style.overscrollBehaviorY = "none";
      body.style.position = "fixed";
      body.style.top = `-${lockedScrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      body.setAttribute(LOCK_ATTR, "true");
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount > 0) return;

      const { body, documentElement } = document;
      body.style.position = previousBodyStyles.position ?? "";
      body.style.top = previousBodyStyles.top ?? "";
      body.style.left = previousBodyStyles.left ?? "";
      body.style.right = previousBodyStyles.right ?? "";
      body.style.width = previousBodyStyles.width ?? "";
      body.style.overflow = previousBodyStyles.overflow ?? "";
      documentElement.style.overflow = previousHtmlStyles.overflow ?? "";
      documentElement.style.overscrollBehaviorY = previousHtmlStyles.overscrollBehaviorY ?? "";
      body.removeAttribute(LOCK_ATTR);
      window.scrollTo({ top: lockedScrollY, left: 0, behavior: "auto" });
    };
  }, [locked]);
};
