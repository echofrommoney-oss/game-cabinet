// 掃描根目錄下所有含 game.json 的資料夾，產生 games.json 給首頁讀。
// 用法：node scripts/build-games.mjs
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const REQUIRED = ["title", "desc"];

const games = [];
const errors = [];

for (const ent of readdirSync(root, { withFileTypes: true })) {
  if (!ent.isDirectory() || ent.name.startsWith(".")) continue;
  const metaPath = join(root, ent.name, "game.json");
  if (!existsSync(metaPath)) continue;

  let meta;
  try {
    meta = JSON.parse(readFileSync(metaPath, "utf8"));
  } catch (e) {
    errors.push(`${ent.name}/game.json 不是合法 JSON：${e.message}`);
    continue;
  }
  const missing = REQUIRED.filter((k) => !meta[k]);
  if (missing.length) errors.push(`${ent.name}/game.json 缺少欄位：${missing.join(", ")}`);
  if (!existsSync(join(root, ent.name, "index.html"))) errors.push(`${ent.name}/ 沒有 index.html`);

  games.push({
    dir: ent.name,
    title: meta.title,
    kind: meta.kind || "",
    desc: meta.desc,
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    tech: meta.tech || "",
    time: meta.time || "",
    long: Boolean(meta.long),
    thumb: existsSync(join(root, ent.name, "thumb.jpg")) ? `${ent.name}/thumb.jpg` : null,
    order: Number.isFinite(meta.order) ? meta.order : null,
  });
}

if (errors.length) {
  console.error(errors.map((e) => "✗ " + e).join("\n"));
  process.exit(1);
}

// 有 order 的照 order，其餘照資料夾名稱
games.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.dir.localeCompare(b.dir));

writeFileSync(join(root, "games.json"), JSON.stringify(games, null, 2) + "\n");
console.log(`✓ games.json：${games.length} 個遊戲`);
