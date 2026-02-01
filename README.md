# Search Builder

**Build precise Google searches through an easy interface and find exactly what you need anywhere online with less effort.**

Search Builder is a Chrome extension that helps you construct advanced Google search queries using operators like `site:`, `filetype:`, `intitle:`, and more—without memorizing syntax. Use the popup to pick domains, file types, and filters, then run the search or copy the query.

---

## Purpose

- **Precise searches** — Limit results to specific sites, file types, dates, and languages.
- **No syntax to remember** — Fill in fields and get a valid Google query built for you.
- **Reuse and repeat** — Save searches with a name and revisit recent ones from the popup.
- **One-click search** — Open Google with your built query in a new tab, or copy the query for use elsewhere.

---

## Features

| Feature | Description |
|--------|-------------|
| **Search query** | Main search terms (e.g. “annual report 2024”). |
| **Domain** | Restrict to a site via `site:`. Presets: Instagram, Reddit, YouTube, LinkedIn, X, GitHub, Stack Overflow, or any custom domain. Options: “Related” (`related:`) and “Subdomains” (`site:*.domain`). |
| **File type** | Limit to PDF, DOCX, XLS, PPT, EPUB, or a custom extension (`filetype:`). |
| **Contains / Title** | Text that must appear in the page (`intext:`) or in the title (`intitle:`). |
| **Exclude words** | Comma-separated terms to exclude (e.g. `login, admin`). |
| **Language & region** | Set result language and country/region (Google `lr` / `cr`). |
| **Date range** | “After” and “Before” dates (e.g. `YYYY` or `YYYY-MM-DD`) in “More filters”. |
| **Generated query** | Live preview of the full Google query. |
| **Search on Google** | Opens Google search in a new tab with the built query. |
| **Copy query** | Copies the generated query to the clipboard. |
| **Save search** | Save the current query with a name; list appears in “Saved searches”. |
| **Recent searches** | Last 10 searches; click to run again or clear history. |

All saved and recent data is stored **locally** in your browser (Chrome storage). Nothing is sent to any server.

---

## Installation

### From source (developer / unpacked)

1. **Clone or download** this repository.
2. **Install dependencies** and build:
   ```bash
   cd extension
   npm install
   npm run build
   ```
3. **Load the extension** in Chrome:
   - Open `chrome://extensions/`
   - Turn on **Developer mode**
   - Click **Load unpacked**
   - Select the `extension/dist` folder

The extension icon will appear in the toolbar. Click it to open the Search Builder popup.

### Development

- Run `npm run dev` in the `extension` folder for a dev server (e.g. for UI work).
- For the actual extension, use `npm run build` and load `extension/dist` as above.

---

## Usage

1. **Open the popup** — Click the Search Builder icon in the Chrome toolbar.
2. **Build your query** — Enter search terms and use:
   - **Domain**: Pick a preset or type a domain; optionally enable Related or Subdomains.
   - **File type**: Choose a type or enter a custom extension.
   - **Contains / Title / Exclude** and **Language / Region** as needed.
   - **More filters** for title, date range, and region.
3. **Check the result** — The “Generated query” box shows the full query.
4. **Run or copy**:
   - **Search on Google** — Opens Google in a new tab with this query.
   - **Save** — Store the query with a name for later.
   - **Copy** — Copy the query to the clipboard.
5. **Reuse** — Use “Saved searches” and “Recent searches” to run or edit past queries.

---

## Tech stack

- **Chrome Extension** — Manifest V3
- **UI** — React 18, Vite, Tailwind CSS
- **Storage** — Chrome `storage` API (local)
- **Permissions** — `tabs` (open search in new tab), `storage` (saved/recent searches)

---

## Privacy

Search Builder does not collect, transmit, or sell any personal data. Saved and recent searches stay on your device only. For details, see [index.md](./index.md) (Privacy Policy).

---

## License

See the repository for license information.
