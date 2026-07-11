import { useEffect } from "react";

let lockCount = 0;
let lockedScrollY = 0;
let previousBodyStyles: Partial<CSSStyleDeclaration> = {};
let previousHtmlStyles: Partial<CSSStyleDeclaration> = {};
let previousBodyBg = "";
let previousHtmlBg = "";
let previousThemeColor = "";
let previousRootBg = "";
let previousStatusBarStyle = "";

const LOCK_ATTR = "data-scroll-locked";

const setThemeColor = (color: string) => {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", color);
};

const getThemeColor = () => {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  return meta?.getAttribute("content") ?? "";
};

const setStatusBarStyle = (value: string) => {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "apple-mobile-web-app-status-bar-style";
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", value);
};

const getStatusBarStyle = () => {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-status-bar-style"]');
  return meta?.getAttribute("content") ?? "";
};

export const useLockBodyScroll = (locked: boolean) => {
  useEffect(() => {
    if (!locked || typeof window === "undefined") return;

    lockCount += 1;

    if (lockCount === 1) {
      const { body, documentElement } = document;
      const root = document.getElementById("root");
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
      previousBodyBg = body.style.backgroundColor;
      previousHtmlBg = documentElement.style.backgroundColor;
      previousRootBg = root?.style.backgroundColor ?? "";
      previousThemeColor = getThemeColor();
      previousStatusBarStyle = getStatusBarStyle();

      documentElement.style.overflow = "hidden";
      documentElement.style.overscrollBehaviorY = "none";
      documentElement.style.backgroundColor = "#ffffff";
      documentElement.setAttribute(LOCK_ATTR, "true");
      body.style.position = "fixed";
      body.style.top = `-${lockedScrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      body.style.backgroundColor = "#ffffff";
      if (root) root.style.backgroundColor = "#ffffff";
      body.setAttribute(LOCK_ATTR, "true");
      setThemeColor("#ffffff");
      // iOS: verhindert, dass Safari die Statusbar/Dynamic-Island-Zone einfärbt.
      setStatusBarStyle("default");
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount > 0) return;

      const { body, documentElement } = document;
      const root = document.getElementById("root");
      body.style.position = previousBodyStyles.position ?? "";
      body.style.top = previousBodyStyles.top ?? "";
      body.style.left = previousBodyStyles.left ?? "";
      body.style.right = previousBodyStyles.right ?? "";
      body.style.width = previousBodyStyles.width ?? "";
      body.style.overflow = previousBodyStyles.overflow ?? "";
      body.style.backgroundColor = previousBodyBg;
      documentElement.style.overflow = previousHtmlStyles.overflow ?? "";
      documentElement.style.overscrollBehaviorY = previousHtmlStyles.overscrollBehaviorY ?? "";
      documentElement.style.backgroundColor = previousHtmlBg;
      documentElement.removeAttribute(LOCK_ATTR);
      if (root) root.style.backgroundColor = previousRootBg;
      body.removeAttribute(LOCK_ATTR);
      if (previousThemeColor) setThemeColor(previousThemeColor);
      window.scrollTo({ top: lockedScrollY, left: 0, behavior: "auto" });
    };
  }, [locked]);
};
