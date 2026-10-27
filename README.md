# 遊戲櫃 Game Cabinet

一櫃風格、玩法、技術都不一樣的 HTML5 小遊戲。每個遊戲都是獨立的單一網頁，圖像與聲音全部由程式即時產生，沒有外部素材。

- **總站**：`https://<帳號>.github.io/game-cabinet/`
- **單獨開某個遊戲**：`https://<帳號>.github.io/game-cabinet/g05/`
- 進遊戲後網址加 `?demo=1` 會直接播精華

## 目錄結構

```
index.html               總站（讀 games.json 自動列出所有遊戲）
g01/ … g15/              各遊戲
  index.html             遊戲本體
  game.json              遊戲資訊（總站卡片用）
  thumb.jpg              縮圖，建議 1200×750（可省略）
lib/                     共用函式庫（Three.js、Matter.js、cannon-es、GSAP）
scripts/build-games.mjs  掃描所有含 game.json 的資料夾，產生 games.json
```

## 新增一個遊戲

1. 在根目錄開一個新資料夾（例如 `g16/`，名稱就是網址）
2. 放入 `index.html`，需要共用函式庫就用 `../lib/...`，返回總站用 `../`
3. 放入 `game.json`：

   ```json
   {
     "title": "遊戲名稱",
     "kind": "類型",
     "desc": "一兩句介紹",
     "tags": ["canvas"],
     "tech": "Canvas 2D",
     "time": "5 分",
     "long": false
   }
   ```

   - 必填：`title`、`desc`
   - `tags` 用於總站篩選，已知標籤：`canvas`、`webgl`、`dom`、`svg`、`audio`、`long`；寫新標籤會自動多一顆篩選按鈕
   - `long: true` 會顯示「長篇」標記
   - 可加 `"order": 數字` 自訂排序，否則照資料夾名稱排
4. （選用）放一張 `thumb.jpg`，沒有就顯示編號
5. `git push`，GitHub Actions 會自動重建清單並部署，總站不用改

## 本機預覽

```bash
npm run dev
```

會先產生 `games.json`，再開靜態伺服器。直接雙擊 HTML 檔可能因瀏覽器限制載不到函式庫與清單。

## 第三方函式庫

`lib/` 內的檔案各自遵循原專案授權：
[Three.js](https://github.com/mrdoob/three.js)（MIT）、
[Matter.js](https://github.com/liabru/matter-js)（MIT）、
[cannon-es](https://github.com/pmndrs/cannon-es)（MIT）、
[GSAP](https://gsap.com)（GSAP Standard License）。
