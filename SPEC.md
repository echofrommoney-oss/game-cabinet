# 遊戲櫃 共同規格

> [!NOTE]
> **這一頁是什麼**  
> 15 個遊戲共同遵守的規格原文：檔案與函式庫、共用外殼、測試流程、交付內容。之後做同類型的網頁小遊戲可以直接沿用。檔案路徑是製作當時的工作區路徑，不在知識庫裡。

遊戲櫃的遊戲。每個遊戲的風格、玩法、技術都要完全不同，品質是「作品集等級」：打開 10 秒就有記憶點、有手感（juice：回饋、緩動、音效、粒子）、細節打磨，不是教學範例。UI 文字用繁體中文（台灣用語）。

## 檔案與路徑
- 工作根目錄：/tmp/claude-0/-home-claude/d94773e5-9f86-5c49-bbdb-20ae072739ae/scratchpad/games/
- 你的遊戲寫在 `gNN/index.html`（NN 是編號）。CSS 與 JS 寫在同一個檔案裡（inline）。完整 HTML 文件（`<!doctype html>`、`<meta charset="utf-8">`、viewport meta）。
- 共用函式庫只能用 `../lib/` 底下的檔案，用相對路徑引用：
  - `../lib/three.module.min.js`（Three.js r174，ES module）
  - `../lib/matter.min.js`（Matter.js，全域 `Matter`）
  - `../lib/cannon-es.js`（cannon-es，ES module）
  - `../lib/gsap.min.js`（GSAP，全域 `gsap`）
  - 需要 Three 的 addons（例如 RoundedBoxGeometry、EffectComposer）：從 `node_modules/three/examples/jsm/` 複製**用到的那幾個檔**到 `lib/three-addons/`（保留子路徑），並在 HTML 用 importmap：`{"imports":{"three":"../lib/three.module.min.js","three/addons/":"../lib/three-addons/"}}`。不要改 lib 裡別人已經放的檔。
- 不准載入任何外部網址的 JS/CSS/圖片/音檔。唯一例外：Google Fonts 的 stylesheet（fonts.googleapis.com / fonts.gstatic.com），而且要有系統字型 fallback（離線也要能玩）。
- 所有圖像用程式畫（Canvas / SVG / CSS / WebGL / data: URI）；所有音效與音樂用 Web Audio 即時合成（不要外部音檔）。音訊要在第一次使用者互動後才啟動（瀏覽器規定）。
- 角色、店名、品牌全部自創；不要模仿任何現有遊戲、角色、商標。

## 每個遊戲都要有的共用外殼
- 開始畫面（遊戲名、一句話、操作說明、開始按鈕）→ 遊戲 → 結束畫面（分數或結局、重玩）。可暫停（Esc 或畫面按鈕）。
- 桌機（鍵盤/滑鼠）與手機（觸控）都能玩；在 375x812 直式與 1440x900 橫式都不破版。用 Pointer Events。
- 右上角聲音開關。尊重 `prefers-reduced-motion`（減少晃動、閃爍）。
- 存檔/最高分用 localStorage，所有讀寫包 try/catch，失敗也能正常玩。
- 展示模式：網址帶 `?demo=1` 時跳過教學、加快節奏，讓只看 30 秒的評審能看到精華。
- 左下角小字「← 遊戲櫃」連到 `../index.html`。
- 頁面 `<title>` 用遊戲名。效能：手機上維持流暢（限制 devicePixelRatio 最多 2、粒子數量上限、離開分頁時暫停）。

## 測試（必做，用 Playwright）
寫一支測試腳本放在 `gNN/test.mjs`（用 `import { chromium } from 'playwright'`，啟動時 `executablePath` 不用設；如果找不到瀏覽器就用 `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`），用本機靜態伺服器（例如 `npx http-server` 或自己用 node http 寫一個，根目錄設在 games/，這樣 ../lib 才找得到）：
1. 1440x900 開啟 `gNN/index.html`，收集 console error 與 pageerror，必須為 0。
2. 點開始、模擬實際操作（鍵盤/滑鼠/觸控）至少 15 秒，確認遊戲狀態有變化（分數、關卡、畫面改變），截圖。
3. 375x812（isMobile、hasTouch）再跑一次並截圖。
4. `?demo=1` 跑 10 秒截圖。
5. 用 Read 工具看截圖，自己檢查畫面是否好看、有沒有破版、文字是否被切，有問題就修再測。
6. 產出縮圖 `gNN/thumb.jpg`（1200x750，遊戲最有代表性的畫面，jpeg quality 82）。

## 交付
- `gNN/index.html`（遊戲）、`gNN/thumb.jpg`、`gNN/test.mjs`。
- `gNN/NOTES.md`：給知識庫用的詳細紀錄（繁體中文，白話＋精確參數），章節：
  1. 一句話與作品集亮點
  2. 玩法與規則（完整：目標、勝負條件、計分公式、難度曲線、關卡/事件清單）
  3. 操作（桌機/手機）
  4. 視覺設計（色票表 HEX＋用途、字型與大小、質感做法、版面、動畫的時間與緩動參數）
  5. 聲音設計（每個音效怎麼合成：波形、頻率、包絡）
  6. 技術架構（程式結構、主要函式/模組、核心演算法與關鍵參數、用到的 lib）
  7. 做了哪些取捨與為什麼（對照原企劃改了什麼）
  8. 測試結果（測了什麼、結果、截圖觀察）
  9. 已知問題與下一步
  10. 可以重複利用到其他專案的做法
- 最後回覆：成功與否、index.html 位元組數、測試結果一句話、已知問題。
- 只寫自己的 gNN/ 資料夾（以及 lib/three-addons/ 需要的檔）。不要動其他遊戲的資料夾。

## 補充
- 本機伺服器 port 用 8100+編號（g07 用 8107），避免和同時在做的其他遊戲衝突。
- 小品目標 3–5 分鐘玩完一輪；「深」的三個（g05、g12、g15）目標 10–20 分鐘。
- 不要為了趕而交出半成品：寧可縮小範圍，也要每個機制都打磨好、沒有 bug。
