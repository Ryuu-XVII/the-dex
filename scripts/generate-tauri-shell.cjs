// Tauri (desktop and mobile) bundles the frontend as static files with no server
// runtime, so it needs a real .output/public/index.html to boot from. TanStack Start
// is SSR-first and never emits one on its own — every route's HTML is normally
// rendered on demand by the Nitro server, which doesn't exist inside a packaged app.
// This hand-assembles a minimal shell matching src/routes/__root.tsx's <html>/<head>
// structure, referencing the actual hashed asset filenames from this build. React's
// hydrateRoot(document, ...) (see the client entry) then takes over from there,
// same as it would for any other route.
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", ".output", "public");
const assetsDir = path.join(publicDir, "assets");

const files = fs.readdirSync(assetsDir);
const entryJs = files.find((f) => /^index-.*\.js$/.test(f));
const entryCss = files.find((f) => /^styles-.*\.css$/.test(f));

if (!entryJs) {
  console.error("generate-tauri-shell: couldn't find the client entry chunk (index-*.js) in", assetsDir);
  process.exit(1);
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
<title>Hoekedex — Your private dating directory</title>
<meta name="description" content="Track names, ratings, relationship status, and the little lies you tell along the way.">
<meta name="theme-color" content="#0a0a1a">
${entryCss ? `<link rel="stylesheet" href="/assets/${entryCss}">` : ""}
<link rel="icon" href="/favicon.ico" type="image/x-icon">
</head>
<body>
<script>
// TanStack Start's client entry unconditionally checks for this global (normally
// injected by an inline script in the SSR-rendered HTML) and throws "Invariant
// failed" if it's missing. An empty dehydrated-router payload tells it there's no
// SSR state to hydrate from, so it falls back to a clean client-side route load —
// exactly what we want for a server-less packaged app.
window.$_TSR = {
  buffer: [],
  router: { matches: [], manifest: { routes: {} }, dehydratedData: undefined, lastMatchId: undefined },
  initialized: false,
  h: function () {},
};
</script>
<script type="module" src="/assets/${entryJs}"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(publicDir, "index.html"), html);
console.log(`generate-tauri-shell: wrote .output/public/index.html (entry: ${entryJs}${entryCss ? `, css: ${entryCss}` : ""})`);
