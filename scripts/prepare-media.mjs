/**
 * IMARAT media pipeline
 * Reads original assets from the parent workspace folder (outside the repo)
 * and writes optimized web assets into public/media/ + a JSON manifest.
 *
 * Usage: npm run media  (idempotent — skips existing outputs)
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(__dirname, "..");
const SRC = path.resolve(APP, "..");
const OUT = path.join(APP, "public", "media");
const MANIFEST_PATH = path.join(APP, "src", "data", "media-manifest.json");

const IMG_SIZES = [640, 1280, 1920];
const CATALOG_WIDTH = 1600;
const CATALOG_MAX_PAGES = 48;

const log = (...a) => console.log("[media]", ...a);
const ensure = (dir) => mkdirSync(dir, { recursive: true });

/* ---------------- concurrency pool ---------------- */
async function pool(items, worker, limit = 4) {
  const queue = [...items];
  const results = [];
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      results.push(await worker(item));
    }
  });
  await Promise.all(runners);
  return results;
}

/* ---------------- sources ---------------- */
const P = (...parts) => path.join(SRC, ...parts);

const projectSources = {
  "sergeli-city": { dir: P("Loyihalar", "Sergeli City") },
  "eco-park": { dir: P("Loyihalar", "Eco Park") },
  bristol: { dir: P("Loyihalar", "Bristol") },
  "yangi-bristol": { dir: P("Loyihalar", "Yangi Bristol") },
  "tuzel-park": { dir: P("Loyihalar", "Tuzel Park") },
  "yangi-hayot": { dir: P("Loyihalar", "Yangi Hayot") },
  "imarat-hills": { dir: P("Loyihalar", "Imarat Hills"), exclude: /pages from catalog/i },
  chortoq: { dir: P("Loyihalar", "Chortoq") },
  "chaman-village": { dir: P("Loyihalar", "Chaman Village"), includeSub: ["Planirovkalar"] },
  "jayhun-avenue": { dir: P("Loyihalar", "Jayhun Avenue") },
};

const catalogSources = {
  "sergeli-city": P("Loyihalar", "Sergeli City", "Segeli city katalog Ko'rinishi_optimized.pdf"),
  // eco-park catalog PDF (69MB, oversized pages) crashes @napi-rs/canvas natively — skipped
  bristol: P("Loyihalar", "Bristol", "Bristol TJM katalog_optimized.pdf"),
  "tuzel-park": P("Loyihalar", "Tuzel Park", "Tuzel park katalog ko'rinishi_optimized.pdf"),
  "yangi-hayot": P("Loyihalar", "Yangi Hayot", "Yangi hayot katalog_optimized.pdf"),
  "imarat-hills": P("Loyihalar", "Imarat Hills", "Imarat Hills katalog_optimized.pdf"),
  chortoq: P("Loyihalar", "Chortoq", "Chortoq katalog ko'rinishi_optimized.pdf"),
  "jayhun-avenue": P("Loyihalar", "Jayhun Avenue", "Yangibog' va Jayhun avenue Katalog ko'rinishi_optimized.pdf"),
};

const clipSources = {
  bristol: [
    P("Qurilish jarayonlaridan lavhalar", "Bristol", "IMG_3316.MP4"),
    P("Qurilish jarayonlaridan lavhalar", "Bristol", "IMG_3463.MP4"),
  ],
  "sergeli-city": [
    P("Qurilish jarayonlaridan lavhalar", "Sergeli City", "IMG_3244.MP4"),
    P("Qurilish jarayonlaridan lavhalar", "Sergeli City", "IMG_3402.MP4"),
    P("Qurilish jarayonlaridan lavhalar", "Sergeli City", "IMG_3403.MP4"),
  ],
  "tuzel-park": [
    P("Qurilish jarayonlaridan lavhalar", "Tuzel Park", "IMG_8746.MP4"),
    P("Qurilish jarayonlaridan lavhalar", "Tuzel Park", "IMG_8798.MP4"),
  ],
  "yangi-hayot": [
    P("Qurilish jarayonlaridan lavhalar", "Yangi Hayot", "IMG_8755.MP4"),
    P("Qurilish jarayonlaridan lavhalar", "Yangi Hayot", "IMG_8800.MP4"),
    P("Qurilish jarayonlaridan lavhalar", "Yangi Hayot", "IMG_8801.MP4"),
  ],
};

const topVideos = {
  "hero-desktop": { src: P("Primary animation.mp4"), box: 1920, crf: 24 },
  "hero-mobile": { src: P("Primary_animation_mobile.mp4"), box: 1280, crf: 25 },
  "process-desktop": { src: P("building_proccess_desktop.mp4"), box: 1920, crf: 24 },
  "process-mobile": { src: P("building_proccess_mobile.mp4"), box: 1280, crf: 25 },
  drone: { src: P("Shut from drone.mp4"), box: 1920, crf: 24 },
};

const peopleSources = {
  husanov: P("Influencerlar", "Abduqodir Husanov - Futbolchi, Manchester City ximoyachisi.jpg"),
  shomurodov: P("Influencerlar", "Eldor Shomurodov - Futbolchi, İstanbul Başakşehir FK hujumchisi.jpg"),
  kusherbayev: P("Influencerlar", "Rasul Kusherbayev - Jamoatchilik Faoli.jpg"),
  abror: P("Influencerlar", "Abror Muxtor Aliy - Jamoatchilik faoli.jpg"),
  shaxzoda: P("Influencerlar", "Shaxzoda Muhammedova - Dizayner, Akstrisa, Marat Xayrullayevichning rafiqasi.jpg"),
  founder: P("Influencerlar", "Asoschi CEO-Marat Xayrullayevich Hamdamov.jpg"),
};

const ceoSources = [
  P("CEO-Marat Xayrullayevich Hamdamov.jpg"),
  P("CEO-Marat Xayrullayevich Hamdamov-2.jpg"),
  P("CEO-Marat Xayrullayevich Hamdamov-3.jpg"),
];

const adsSources = {
  airport: P("Ads materials", "Yangi Toshkent xalqaro aeroporti Sergeli city va eco park loyihalari yonida Artboard 1.png"),
  metro: P("Ads materials", "Yangi metro bekati Sergeli city va eco park loyihalari yonida Artboard 2.png"),
  highway: P("Ads materials", "Yangi Magistral yo'l (trassa) Sergeli city va eco park loyihalari yonida Artboard 3.png"),
};

const logoSources = {
  imarat: {
    gold: P("IMARAT Development Logo Gold.png"),
    white: P("IMARAT Development Logo White.png"),
    dark: P("IMARAT Development Logo Dark.png"),
  },
  projects: {
    "sergeli-city": {
      light: P("Loyihalar", "Sergeli City", "Logolar", "Sergeli City Logo dark.png"),
      dark: P("Loyihalar", "Sergeli City", "Logolar", "Sergeli City Logo with white name.png"),
    },
    "eco-park": {
      light: P("Loyihalar", "Eco Park", "Logolar", "Eco Park by IMARAT logo gorizontal dark text.png"),
      dark: P("Loyihalar", "Eco Park", "Logolar", "Eco Park by IMARAT logo gorizontal white text.png"),
    },
    bristol: {
      light: P("Loyihalar", "Bristol", "Logolar", "BRISTOL Logo Original.png"),
      dark: P("Loyihalar", "Bristol", "Logolar", "BRISTOL Logo-White.png"),
    },
    "yangi-bristol": {
      light: P("Loyihalar", "Yangi Bristol", "Logolar", "BRISTOL Logo Original.png"),
      dark: P("Loyihalar", "Yangi Bristol", "Logolar", "BRISTOL Logo-White.png"),
    },
    "tuzel-park": {
      light: P("Loyihalar", "Tuzel Park", "Logolar", "Tuzel Park logo dark 4-variant.png"),
      dark: P("Loyihalar", "Tuzel Park", "Logolar", "Tuzel Park logo white 4-variant.png"),
    },
    "yangi-hayot": {
      light: P("Loyihalar", "Yangi Hayot", "Logolar", "Yangi hayot logo dark 1-variant.png"),
      dark: P("Loyihalar", "Yangi Hayot", "Logolar", "Yangi hayot logo white 1-variant.png"),
    },
    "imarat-hills": {
      light: P("Loyihalar", "Imarat Hills", "Logo", "Imarat Hills logo 1.png"),
      dark: P("Loyihalar", "Imarat Hills", "Logo", "Imarat Hills logo 1.png"),
    },
    chortoq: {
      light: P("Loyihalar", "Chortoq", "Logo", "chortoq logo.png"),
      dark: P("Loyihalar", "Chortoq", "Logo", "chortoq logo.png"),
    },
    "chaman-village": {
      light: P("Loyihalar", "Chaman Village", "Logolar", "Chaman Village logo dark Horizontal.png"),
      dark: P("Loyihalar", "Chaman Village", "Logolar", "Chaman Village logo white Horizontal.png"),
    },
    "jayhun-avenue": {
      light: P("Loyihalar", "Jayhun Avenue", "Logo", "Jayhun Avenue Logo.png"),
      dark: P("Loyihalar", "Jayhun Avenue", "Logo", "Jayhun Avenue Logo.png"),
    },
  },
};

/* ---------------- helpers ---------------- */
const isImg = (f) => /\.(jpe?g|png|webp)$/i.test(f);

function listImages(dir, { exclude, includeSub = [] } = {}) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const f of readdirSync(dir)) {
    const full = path.join(dir, f);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (includeSub.includes(f)) {
        for (const g of readdirSync(full)) {
          if (isImg(g)) out.push(path.join(full, g));
        }
      }
      continue;
    }
    if (!isImg(f)) continue;
    if (exclude && exclude.test(f)) continue;
    out.push(full);
  }
  return out.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

async function convertImage(src, destBase, { sizes = IMG_SIZES, quality = 78, fit } = {}) {
  const meta = await sharp(src).metadata();
  let w = meta.width ?? 0;
  let h = meta.height ?? 0;
  if ((meta.orientation ?? 1) >= 5) [w, h] = [h, w];
  for (const size of sizes) {
    const dest = `${destBase}_${size}.webp`;
    if (existsSync(dest)) continue;
    let img = sharp(src).rotate();
    if (fit === "square") {
      img = img.resize(size, size, { fit: "cover", position: sharp.strategy.attention });
    } else {
      img = img.resize({ width: size, withoutEnlargement: true });
    }
    await img.webp({ quality }).toFile(dest);
  }
  if (fit === "square") return { w: 1, h: 1 };
  const scale = Math.min(1, 1920 / w);
  return { w: Math.round(w * scale), h: Math.round(h * scale) };
}

async function convertLogo(src, dest, maxW = 800) {
  if (existsSync(dest)) return;
  if (!existsSync(src)) {
    log("!! logo missing:", src);
    return;
  }
  await sharp(src)
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(dest);
}

function runFfmpeg(args) {
  const res = spawnSync(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
  if (res.status !== 0) {
    throw new Error(`ffmpeg failed (${res.status}): ${args.join(" ")}\n${res.stderr?.toString().slice(-800)}`);
  }
}

async function transcodeVideo(src, dest, { box = 1280, crf = 28, keepAudio = false } = {}) {
  if (!existsSync(dest)) {
    runFfmpeg([
      "-y",
      "-i", src,
      "-vf", `scale=w=${box}:h=${box}:force_original_aspect_ratio=decrease:force_divisible_by=2`,
      "-c:v", "libx264",
      "-crf", String(crf),
      "-preset", "slow",
      "-pix_fmt", "yuv420p",
      ...(keepAudio ? ["-c:a", "aac", "-b:a", "128k"] : ["-an"]),
      "-movflags", "+faststart",
      dest,
    ]);
  }
  const poster = dest.replace(/\.mp4$/, "-poster.jpg");
  const posterWebp = dest.replace(/\.mp4$/, "-poster.webp");
  if (!existsSync(posterWebp)) {
    runFfmpeg(["-y", "-ss", "0.6", "-i", dest, "-frames:v", "1", "-q:v", "2", poster]);
    await sharp(poster).webp({ quality: 72 }).toFile(posterWebp);
    try {
      const { unlinkSync } = await import("node:fs");
      unlinkSync(poster);
    } catch {}
  }
  const meta = await sharp(posterWebp).metadata();
  return { w: meta.width ?? 0, h: meta.height ?? 0 };
}

async function renderCatalog(slug, pdfPath) {
  const dir = path.join(OUT, "catalogs", slug);
  ensure(dir);
  const donePages = readdirSync(dir).filter((f) => /^page-\d+\.webp$/.test(f));
  if (donePages.length > 0) {
    const meta = await sharp(path.join(dir, "page-001.webp")).metadata();
    return { pages: donePages.length, w: meta.width ?? 0, h: meta.height ?? 0 };
  }
  if (!existsSync(pdfPath)) {
    log("!! catalog missing:", pdfPath);
    return undefined;
  }
  const { pdf } = await import("pdf-to-img");
  // huge-format catalogs overflow the skia canvas at scale 2 — fall back
  for (const scale of [2, 1.2, 0.7, 0.4]) {
    try {
      const doc = await pdf(pdfPath, { scale });
      let i = 0;
      let dims = { w: 0, h: 0 };
      for await (const pageBuf of doc) {
        i += 1;
        if (i > CATALOG_MAX_PAGES) break;
        const dest = path.join(dir, `page-${String(i).padStart(3, "0")}.webp`);
        const out = await sharp(pageBuf)
          .resize({ width: CATALOG_WIDTH, withoutEnlargement: true })
          .webp({ quality: 74 })
          .toFile(dest);
        dims = { w: out.width, h: out.height };
      }
      log(`   catalog ${slug}: ${Math.min(i, CATALOG_MAX_PAGES)} pages (scale ${scale})`);
      return { pages: Math.min(i, CATALOG_MAX_PAGES), ...dims };
    } catch (e) {
      log(`   catalog ${slug}: scale ${scale} failed (${e.message}) — retrying smaller`);
    }
  }
  log(`!! catalog ${slug}: all scales failed`);
  return undefined;
}

/* ---------------- main ---------------- */
async function main() {
  const t0 = Date.now();
  log("source root:", SRC);
  log("output:", OUT);
  if (!ffmpegPath) throw new Error("ffmpeg-static binary not found");

  const manifest = { projects: {}, people: {}, ceo: [], ads: [], videos: {} };

  /* logos */
  log("— logos");
  ensure(path.join(OUT, "logos", "projects"));
  await convertLogo(logoSources.imarat.gold, path.join(OUT, "logos", "imarat-gold.webp"), 1000);
  await convertLogo(logoSources.imarat.white, path.join(OUT, "logos", "imarat-white.webp"), 1000);
  await convertLogo(logoSources.imarat.dark, path.join(OUT, "logos", "imarat-dark.webp"), 1000);
  for (const [slug, v] of Object.entries(logoSources.projects)) {
    await convertLogo(v.light, path.join(OUT, "logos", "projects", `${slug}-light.webp`));
    await convertLogo(v.dark, path.join(OUT, "logos", "projects", `${slug}-dark.webp`));
  }

  /* project galleries */
  log("— project galleries");
  for (const [slug, cfg] of Object.entries(projectSources)) {
    const files = listImages(cfg.dir, cfg);
    const dir = path.join(OUT, "projects", slug);
    ensure(dir);
    const images = [];
    await pool(
      files.map((f, idx) => ({ f, idx })),
      async ({ f, idx }) => {
        const n = `img-${String(idx + 1).padStart(3, "0")}`;
        try {
          const dims = await convertImage(f, path.join(dir, n));
          images[idx] = { n, ...dims };
        } catch (e) {
          log(`!! image failed ${slug}/${path.basename(f)}:`, e.message);
        }
      },
      4,
    );
    manifest.projects[slug] = { images: images.filter(Boolean), clips: [] };
    log(`   ${slug}: ${images.filter(Boolean).length} images`);
  }

  /* construction clips */
  log("— construction clips");
  for (const [slug, clips] of Object.entries(clipSources)) {
    const dir = path.join(OUT, "projects", slug);
    ensure(dir);
    for (let i = 0; i < clips.length; i++) {
      const src = clips[i];
      if (!existsSync(src)) {
        log("!! clip missing:", src);
        continue;
      }
      const n = `clip-${String(i + 1).padStart(2, "0")}`;
      const dims = await transcodeVideo(src, path.join(dir, `${n}.mp4`), {
        box: 1920,
        crf: 25,
        keepAudio: true,
      });
      manifest.projects[slug].clips.push({ n, ...dims });
      log(`   ${slug}/${n} ${dims.w}x${dims.h}`);
    }
  }

  /* top-level videos */
  log("— hero/process/drone videos");
  ensure(path.join(OUT, "videos"));
  for (const [name, cfg] of Object.entries(topVideos)) {
    if (!existsSync(cfg.src)) {
      log("!! video missing:", cfg.src);
      continue;
    }
    const dims = await transcodeVideo(cfg.src, path.join(OUT, "videos", `${name}.mp4`), cfg);
    manifest.videos[name] = dims;
    log(`   ${name} ${dims.w}x${dims.h}`);
  }

  /* catalogs */
  log("— catalogs (PDF → pages)");
  for (const [slug, pdfPath] of Object.entries(catalogSources)) {
    try {
      const info = await renderCatalog(slug, pdfPath);
      if (info && manifest.projects[slug]) manifest.projects[slug].catalog = info;
    } catch (e) {
      log(`!! catalog ${slug} failed:`, e.message);
    }
  }

  /* people (square) */
  log("— people");
  ensure(path.join(OUT, "people"));
  for (const [id, src] of Object.entries(peopleSources)) {
    if (!existsSync(src)) {
      log("!! person missing:", src);
      continue;
    }
    await convertImage(src, path.join(OUT, "people", id), {
      sizes: [320, 640],
      quality: 82,
      fit: "square",
    });
    manifest.people[id] = { w: 1, h: 1 };
  }

  /* ceo portraits */
  log("— CEO portraits");
  ensure(path.join(OUT, "ceo"));
  for (let i = 0; i < ceoSources.length; i++) {
    const src = ceoSources[i];
    if (!existsSync(src)) continue;
    const n = `portrait-${i + 1}`;
    const dims = await convertImage(src, path.join(OUT, "ceo", n), { sizes: [640, 1280], quality: 82 });
    manifest.ceo.push({ n, ...dims });
  }

  /* ads / location strips */
  log("— location artboards");
  ensure(path.join(OUT, "ads"));
  for (const [id, src] of Object.entries(adsSources)) {
    if (!existsSync(src)) {
      log("!! ad missing:", src);
      continue;
    }
    const dims = await convertImage(src, path.join(OUT, "ads", id), { sizes: [640, 1280], quality: 76 });
    manifest.ads.push({ n: id, ...dims });
  }

  /* favicon + og */
  log("— favicon & og image");
  try {
    const iconDest = path.join(APP, "src", "app", "icon.png");
    if (!existsSync(iconDest)) {
      const logo = sharp(logoSources.imarat.gold);
      const meta = await logo.metadata();
      const slashW = Math.round((meta.width ?? 1000) * 0.16);
      const slash = await sharp(logoSources.imarat.gold)
        .extract({ left: 0, top: 0, width: slashW, height: meta.height ?? 300 })
        .resize({ height: 360, withoutEnlargement: false })
        .toBuffer();
      const slashMeta = await sharp(slash).metadata();
      await sharp({
        create: { width: 512, height: 512, channels: 4, background: "#0d0c0a" },
      })
        .composite([
          {
            input: slash,
            left: Math.round((512 - (slashMeta.width ?? 100)) / 2),
            top: Math.round((512 - (slashMeta.height ?? 360)) / 2),
          },
        ])
        .png()
        .toFile(iconDest);
    }
    const ogDest = path.join(APP, "public", "og.jpg");
    if (!existsSync(ogDest)) {
      const heroImg = path.join(OUT, "projects", "sergeli-city", "img-021_1920.webp");
      const base = existsSync(heroImg)
        ? sharp(heroImg)
        : sharp({ create: { width: 1920, height: 1080, channels: 3, background: "#0d0c0a" } });
      const bg = await base.resize(1200, 630, { fit: "cover" }).modulate({ brightness: 0.42 }).toBuffer();
      const logoBuf = await sharp(logoSources.imarat.white).resize({ width: 620 }).toBuffer();
      const logoMeta = await sharp(logoBuf).metadata();
      await sharp(bg)
        .composite([
          {
            input: logoBuf,
            left: Math.round((1200 - (logoMeta.width ?? 620)) / 2),
            top: Math.round((630 - (logoMeta.height ?? 160)) / 2),
          },
        ])
        .jpeg({ quality: 84 })
        .toFile(ogDest);
    }
  } catch (e) {
    log("!! icon/og failed:", e.message);
  }

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 1));
  log("manifest →", MANIFEST_PATH);

  /* size report */
  let total = 0;
  const walk = (d) => {
    for (const f of readdirSync(d)) {
      const full = path.join(d, f);
      const st = statSync(full);
      if (st.isDirectory()) walk(full);
      else total += st.size;
    }
  };
  walk(OUT);
  log(`public/media total: ${(total / 1024 / 1024).toFixed(1)} MB`);
  log(`done in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
