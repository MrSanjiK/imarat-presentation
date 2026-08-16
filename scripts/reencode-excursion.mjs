import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const ROOT = "D:/Workspace/IMARAT DEVELOPMENT PRESENTATION SITE";
const OUT = path.join(ROOT, "imarat-presentation", "public", "media", "excursion");

const sources = [
  "IMG_6114.MOV", "IMG_6115.MOV", "IMG_6121.MOV", "IMG_6129.MOV", "IMG_6132.MOV",
  "IMG_6135.MOV", "IMG_6138.MOV", "IMG_6146.MOV", "IMG_6149.MOV", "IMG_6155.MOV",
  "IMG_6156.MOV", "IMG_6159.MOV", "IMG_6166.MOV", "IMG_6167.MOV", "IMG_6201.MOV",
  "IMG_6207.MOV", "IMG_6223.MOV", "IMG_7665.MOV", "IMG_7762.MOV",
];

for (let i = 0; i < sources.length; i++) {
  const src = path.join(ROOT, "NEW", sources[i]);
  const dest = path.join(OUT, `video-${String(i + 1).padStart(2, "0")}.mp4`);
  if (existsSync(dest)) {
    console.log(`skip ${path.basename(dest)}`);
    continue;
  }
  console.log(`encode ${sources[i]} -> ${path.basename(dest)}`);
  const res = spawnSync(ffmpegPath, [
    "-y",
    "-i", src,
    "-vf", "scale=w=1280:h=1280:force_original_aspect_ratio=decrease:force_divisible_by=2",
    "-c:v", "libx264",
    "-crf", "28",
    "-preset", "medium",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "128k",
    "-movflags", "+faststart",
    dest,
  ], { stdio: ["ignore", "ignore", "pipe"] });
  if (res.status !== 0) {
    console.error(`FAILED ${sources[i]}: ${res.stderr?.toString().slice(-500)}`);
    process.exitCode = 1;
  }
}
console.log("done");
