# 台北垃圾車地圖

台北市垃圾清運站點、表定清運時間與推估車輛位置地圖。可公開部署至 GitHub Pages，使用者不需要登入 ChatGPT。

**這不是即時 GPS 追蹤。** 車輛位置依時刻表推估，停靠點之間使用直線內插，不代表實際道路行駛路線。實際抵達可能受交通、延誤、臨時異動或特殊停收影響，請提早到場。

## 功能

- 全市 12 區、4,012 個官方清運點，分為 487 條路線班次。
- 行政區、街道、車號與路線搜尋。
- 定位找附近清運點，按直線距離排序。
- 下一班時間、停靠點時刻表、推估車輛位置。
- 預覽今天其他時段，回到現在時間。
- 以台北時區計算；處理跨午夜班次，以及週三、週日例行停收。
- 適用手機與電腦。

## 公開部署到 GitHub Pages

1. 在 GitHub 建立 Public 儲存庫，建議名稱 `taipei-trash-map`，使用 `main` 分支。
2. 把本資料夾**裡面的檔案與資料夾**上傳到儲存庫根目錄，包含 `.github/workflows/pages.yml`。不要把 ZIP 檔或外層 `taipei-trash-map` 資料夾直接當成網站內容。
3. 在儲存庫選擇 **Settings → Pages → Build and deployment → Source → GitHub Actions**。
4. 到 **Actions → Deploy Taipei Trash Map → Run workflow**，選 `main` 並執行。設定 Pages 後，往後每次推送到 `main` 也會自動部署。
5. 工作流程成功後，在 **Settings → Pages** 或工作流程的 `github-pages` 環境取得公開網址。一般專案網址為 `https://你的帳號.github.io/taipei-trash-map/`，以 GitHub 實際顯示的網址為準。

若透過網頁上傳，請確認 `.github` 隱藏資料夾有一併上傳。也可以使用 GitHub Desktop 加入全部檔案並發布，或在此資料夾使用 Git：

```bash
git init -b main
git add .
git commit -m "Add Taipei trash collection map"
git remote add origin https://github.com/你的帳號/taipei-trash-map.git
git push -u origin main
```

儲存庫若不是空的，先下載或複製該儲存庫，再加入本專案檔案；不要用強制推送覆蓋既有內容。

官方部署說明：https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 本機開啟

需要 Python 3，不需要 npm 或其他套件。在專案資料夾開啟終端機：

```bash
python -m http.server 8000 --directory dist --bind 127.0.0.1
```

Windows 若 `python` 無法執行，可改用 `py`；macOS / Linux 可用 `python3`。

瀏覽器開啟 http://localhost:8000 。按 Ctrl+C 停止。請透過 HTTP 開啟，直接雙擊 `index.html` 可能因瀏覽器限制而無法讀取資料。

## 檔案

| 檔案 | 用途 |
| --- | --- |
| `dist/index.html` | 主頁與介面 |
| `dist/style.css` | 外觀與手機版配置 |
| `dist/app.js` | 地圖、搜尋、定位與互動 |
| `dist/logic.js` | 台北時間、班次、位置推估與距離計算 |
| `dist/data.json` | 轉換後的完整清運資料 |
| `dist/leaflet.js`, `dist/leaflet.css` | Leaflet 1.9.4 地圖套件 |
| `source.csv` | 官方原始清運資料快照 |
| `prepare-data.py` | CSV 轉 JSON；僅用 Python 標準函式庫 |
| `.github/workflows/pages.yml` | GitHub Pages 自動部署 |
| `LEAFLET-LICENSE.txt` | Leaflet BSD 2-Clause 授權 |

## 資料來源與更新

提供機關：臺北市政府環境保護局。

資料集：https://data.taipei/dataset/detail?id=6bb3304b-4f46-4bb0-8cd1-60c66dcd1cae

本版使用 **2026-09-21** 資料快照。網站不會自動下載新版官方資料；每 10 秒更新的是時間與推估位置。

更新方式：

1. 從上述官方資料集下載最新 CSV，替換專案根目錄的 `source.csv`。
2. 更新 `prepare-data.py` 中的 `updated` 日期。
3. 在專案根目錄執行 `python prepare-data.py`，重新產生 `dist/data.json`，並檢查輸出的站點數與排除記錄。
4. 同步修改 `dist/index.html` 頁尾的資料版本、行政區與站點數。
5. 提交並推送新版；GitHub Pages 會重新部署。

特殊停收與臨時清運異動沒有自動匯入，請查環保局公告：https://www.dep.gov.taipei/

## 地圖與定位

底圖使用 OpenStreetMap 標準圖磚服務。Leaflet 已包含在專案內，開啟網站仍需連網取得圖磚。底圖服務不可用時，站點與時刻表仍可查詢。

OpenStreetMap 圖磚不是無限制的服務。公開上線後，若流量增加，請改用符合使用規模的圖磚供應商；不要大量預下載或離線快取標準圖磚。

- OpenStreetMap attribution：https://www.openstreetmap.org/copyright
- 圖磚政策：https://operations.osmfoundation.org/policies/tiles/

定位需要使用者同意，正式網站請透過 HTTPS 開啟。程式只在瀏覽器記憶體中使用使用者位置來排序，不會提交到本專案的伺服器或資料庫。載入網站與地圖時，GitHub Pages、圖磚供應商仍可能收到一般連線資訊。

本程式不需 API Key、後端或 ChatGPT 登入。封裝不包含原部署平台的專案設定、Git 歷史或憑證。

## 第三方來源

Leaflet 1.9.4：https://leafletjs.com/ ，授權見 `LEAFLET-LICENSE.txt`。若再發布，請保留第三方授權及地圖來源標示。官方清運資料的使用應遵守資料集公布的授權條款。
