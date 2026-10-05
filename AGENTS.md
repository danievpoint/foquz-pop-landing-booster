# Agent rules

- Marquee and navbar are both `position: fixed` and shifted with the same `transform` driven by `--marquee-height`/`--marquee-full`; never animate their `top` — separate movement causes visible gaps while scrolling.
- Fixed header elements carry `data-chrome`; the white preload overlay in `index.html` ignores them when deciding if page content is ready, so the header can never appear alone.
- Header background images are inlined via `build.assetsInlineLimit` so the navbar paints in the same frame as the page.
- Keep heavy libs (e.g. recharts) out of shared `manualChunks` so they stay off the critical path.
