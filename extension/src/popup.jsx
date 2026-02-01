import { useState, useMemo, useEffect, useRef } from "react";
import logoUrl from "./assets/logo.png";
import {
  SiteIcon,
  IconGlobe,
  IconPdf,
  IconDoc,
  IconSheet,
  IconPresentation,
  IconFile,
  IconBookOpen,
  IconSearch,
  IconCopy,
  IconClock,
  IconTrash,
  IconBookmark,
  IconXMark,
  IconFunnel,
  IconChevronDown,
  IconChevronUp,
} from "./Icons";

const LANGUAGE_OPTIONS = [
  { value: "", label: "Any" },
  { value: "lang_en", label: "English" },
  { value: "lang_tr", label: "Turkish" },
  { value: "lang_de", label: "German" },
  { value: "lang_fr", label: "French" },
  { value: "lang_es", label: "Spanish" },
  { value: "lang_ru", label: "Russian" },
  { value: "lang_ja", label: "Japanese" },
  { value: "lang_zh-CN", label: "Chinese (Simplified)" },
];

const REGION_OPTIONS = [
  { value: "", label: "Any" },
  { value: "countryUS", label: "United States" },
  { value: "countryTR", label: "Turkey" },
  { value: "countryUK", label: "United Kingdom" },
  { value: "countryDE", label: "Germany" },
  { value: "countryFR", label: "France" },
  { value: "countryIN", label: "India" },
  { value: "countryBR", label: "Brazil" },
  { value: "countryJP", label: "Japan" },
];

const HISTORY_KEY = "searchHistory";
const SAVED_KEY = "savedSearches";
const HISTORY_MAX = 10;
const LIST_PREVIEW_COUNT = 3;

const DOMAIN_PRESETS = [
  { value: "instagram.com", label: "Instagram", selectedClass: "border-pink-500 bg-pink-500 text-white hover:bg-pink-600" },
  { value: "reddit.com", label: "Reddit", selectedClass: "border-orange-500 bg-orange-500 text-white hover:bg-orange-600" },
  { value: "youtube.com", label: "YouTube", selectedClass: "border-red-600 bg-red-600 text-white hover:bg-red-700" },
  { value: "linkedin.com", label: "LinkedIn", selectedClass: "border-[#0A66C2] bg-[#0A66C2] text-white hover:bg-[#004182]" },
  { value: "x.com", label: "X", selectedClass: "border-neutral-800 bg-neutral-800 text-white hover:bg-neutral-900" },
  { value: "github.com", label: "GitHub", selectedClass: "border-neutral-700 bg-neutral-700 text-white hover:bg-neutral-800" },
  { value: "stackoverflow.com", label: "Stack Overflow", selectedClass: "border-amber-500 bg-amber-500 text-white hover:bg-amber-600" },
];

const FILETYPE_OPTIONS = [
  { value: "", label: "None", Icon: IconFile, selectedClass: null },
  { value: "pdf", label: "PDF", Icon: IconPdf, selectedClass: "border-red-600 bg-red-600 text-white hover:bg-red-700" },
  { value: "docx", label: "DOCX", Icon: IconDoc, selectedClass: "border-[#2B579A] bg-[#2B579A] text-white hover:bg-[#1e3d6d]" },
  { value: "xls", label: "XLS", Icon: IconSheet, selectedClass: "border-[#217346] bg-[#217346] text-white hover:bg-[#185c32]" },
  { value: "ppt", label: "PPT", Icon: IconPresentation, selectedClass: "border-[#D24726] bg-[#D24726] text-white hover:bg-[#b33d1f]" },
  { value: "epub", label: "EPUB", Icon: IconBookOpen, selectedClass: "border-violet-600 bg-violet-600 text-white hover:bg-violet-700" },
];

export default function Popup() {
  const [searchQuery, setSearchQuery] = useState("");
  const [domain, setDomain] = useState("");
  const [filetype, setFiletype] = useState("");
  const [filetypeCustom, setFiletypeCustom] = useState("");
  const [title, setTitle] = useState("");
  const [exclude, setExclude] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [listModalType, setListModalType] = useState(null); // 'saved' | 'recent' | null
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [intext, setIntext] = useState("");
  const [dateAfter, setDateAfter] = useState("");
  const [dateBefore, setDateBefore] = useState("");
  const [language, setLanguage] = useState("");
  const [region, setRegion] = useState("");
  const [useRelated, setUseRelated] = useState(false);
  const [includeSubdomains, setIncludeSubdomains] = useState(false);
  const saveNameInputRef = useRef(null);

  useEffect(() => {
    chrome.storage?.local?.get([HISTORY_KEY, SAVED_KEY], (result) => {
      const list = result[HISTORY_KEY];
      setHistory(Array.isArray(list) ? list : []);
      const saved = result[SAVED_KEY];
      setSavedSearches(Array.isArray(saved) ? saved : []);
    });
  }, []);

  useEffect(() => {
    if (saveModalOpen && saveNameInputRef.current) {
      saveNameInputRef.current.focus();
    }
  }, [saveModalOpen]);

  const saveToHistory = (q) => {
    if (!q?.trim() || !chrome.storage?.local) return;
    const next = [q.trim(), ...history.filter((item) => item !== q.trim())].slice(0, HISTORY_MAX);
    setHistory(next);
    chrome.storage.local.set({ [HISTORY_KEY]: next });
  };

  const selectedPreset =
    domain && DOMAIN_PRESETS.find((p) => p.value === domain.trim())
      ? domain.trim()
      : "";

  const query = useMemo(() => {
    const parts = [];
    const q = searchQuery.trim();
    if (q) parts.push(q);
    const d = domain.trim();
    if (d) {
      if (useRelated) {
        parts.push(`related:${d}`);
      } else {
        parts.push(includeSubdomains ? `site:*.${d}` : `site:${d}`);
      }
    }
    const ft = filetype || filetypeCustom.trim();
    if (ft) parts.push(`filetype:${ft}`);
    if (title.trim()) parts.push(`intitle:"${title.trim()}"`);
    if (intext.trim()) parts.push(`intext:"${intext.trim()}"`);
    if (dateAfter.trim()) parts.push(`after:${dateAfter.trim()}`);
    if (dateBefore.trim()) parts.push(`before:${dateBefore.trim()}`);
    if (exclude.trim()) {
      exclude
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean)
        .forEach((w) => parts.push(`-${w}`));
    }
    return parts.join(" ");
  }, [searchQuery, domain, filetype, filetypeCustom, title, intext, dateAfter, dateBefore, exclude, useRelated, includeSubdomains]);

  const buildSearchUrl = (q) => {
    const url = new URL("https://www.google.com/search");
    url.searchParams.set("q", q);
    if (language) url.searchParams.set("lr", language);
    if (region) url.searchParams.set("cr", region);
    return url.toString();
  };

  const handleCopy = async () => {
    if (!query) return;
    await navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = () => {
    if (!query) return;
    saveToHistory(query);
    chrome.tabs.create({ url: buildSearchUrl(query) });
  };

  const openHistoryQuery = (q) => {
    chrome.tabs.create({ url: buildSearchUrl(q) });
  };

  const clearHistory = () => {
    setHistory([]);
    chrome.storage?.local?.set({ [HISTORY_KEY]: [] });
  };

  const openSaveModal = () => {
    setSaveName("");
    setSaveModalOpen(true);
  };

  const closeSaveModal = () => {
    setSaveModalOpen(false);
    setSaveName("");
  };

  const handleSaveSearch = () => {
    const name = saveName.trim();
    if (!name || !query?.trim() || !chrome.storage?.local) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const next = [...savedSearches, { id, name, query: query.trim() }];
    setSavedSearches(next);
    chrome.storage.local.set({ [SAVED_KEY]: next });
    closeSaveModal();
  };

  const removeSavedSearch = (id) => {
    const next = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(next);
    chrome.storage?.local?.set({ [SAVED_KEY]: next });
  };

  const openSavedQuery = (q) => {
    chrome.tabs.create({ url: buildSearchUrl(q) });
  };

  const handleModalKeyDown = (e) => {
    if (e.key === "Escape") {
      if (saveModalOpen) closeSaveModal();
      else if (listModalType) setListModalType(null);
    }
  };

  const savedPreview = savedSearches.slice(0, LIST_PREVIEW_COUNT);
  const savedHasMore = savedSearches.length > LIST_PREVIEW_COUNT;
  const historyPreview = history.slice(0, LIST_PREVIEW_COUNT);
  const historyHasMore = history.length > LIST_PREVIEW_COUNT;

  return (
    <div className="flex min-h-0 min-w-[320px] max-w-[380px] flex-1 flex-col overflow-hidden bg-slate-100">
      {/* Header */}
      <header className="shrink-0 border-b-2 border-slate-200 bg-white px-3 py-1.5 shadow-bar-bottom">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md">
            <img src={logoUrl} alt="" className="h-full w-full object-contain" />
          </div>
          <h1 className="min-w-0 truncate text-sm font-semibold text-text-primary">
            Search Builder
          </h1>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-section-gap overflow-y-auto overflow-x-hidden p-4">
        {/* Search query – general search terms only */}
        <section className="card">
          <label htmlFor="search-query-input" className="section-label flex items-center gap-2">
            <IconSearch className="h-4 w-4 shrink-0 text-text-muted" />
            Search query
          </label>
          <input
            id="search-query-input"
            type="text"
            className="input-base"
            placeholder="General search terms (e.g. annual report 2024)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search query"
          />
        </section>

        {/* Domain */}
        <section className="card">
          <label className="section-label flex items-center gap-2">
            <IconGlobe className="h-4 w-4 shrink-0 text-text-muted" />
            Domain
          </label>
          <div className="mb-3 flex flex-nowrap items-center gap-1.5">
            {DOMAIN_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setDomain(domain === p.value ? "" : p.value)}
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${selectedPreset === p.value ? p.selectedClass : "border-border bg-surface-muted text-text-secondary hover:border-border-strong hover:bg-slate-200/60"}`}
                title={p.label}
                aria-label={p.label}
              >
                <SiteIcon domain={p.value} className="h-4 w-4 shrink-0" />
              </button>
            ))}
          </div>
          <input
            type="text"
            className="input-base"
            placeholder="Custom domain (e.g. example.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            aria-label="Custom domain"
          />
          {domain.trim() && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setUseRelated((v) => !v)}
                className={`chip-base text-caption ${useRelated ? "border-primary-600 bg-primary-600 text-white hover:bg-primary-700" : "border-border bg-surface-muted text-text-secondary hover:border-border-strong hover:bg-slate-200/60"}`}
                title="Find sites related to this domain"
                aria-pressed={useRelated}
                aria-label="Related sites"
              >
                Related
              </button>
              <button
                type="button"
                onClick={() => setIncludeSubdomains((v) => !v)}
                disabled={useRelated}
                className={`chip-base text-caption ${includeSubdomains ? "border-primary-600 bg-primary-600 text-white hover:bg-primary-700" : "border-border bg-surface-muted text-text-secondary hover:border-border-strong hover:bg-slate-200/60"} disabled:opacity-50 disabled:pointer-events-none`}
                title="Include subdomains (e.g. *.example.com)"
                aria-pressed={includeSubdomains}
                aria-label="Include subdomains"
              >
                Subdomains
              </button>
            </div>
          )}
        </section>

        {/* File type */}
        <section className="card">
          <label className="section-label flex items-center gap-2">
            <IconFile className="h-4 w-4 shrink-0 text-text-muted" />
            File type
          </label>
          <div className="flex flex-wrap gap-2">
            {FILETYPE_OPTIONS.map(({ value, label, Icon, selectedClass }) => (
              <button
                key={value || "none"}
                type="button"
                onClick={() => setFiletype(value)}
                className={`chip-base ${filetype === value ? (selectedClass ?? "border-primary-600 bg-primary-600 text-white hover:bg-primary-700") : "border-border bg-surface-muted text-text-secondary hover:border-border-strong hover:bg-slate-200/60"}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </div>
          <input
            type="text"
            className="input-base mt-2"
            placeholder="Or type a file extension (e.g. txt, csv, xml)"
            value={filetypeCustom}
            onChange={(e) => setFiletypeCustom(e.target.value)}
            aria-label="Custom file type"
          />
        </section>

        <section className="card space-y-3">
          <div>
            <label htmlFor="intext-input" className="section-label">
              Contains
            </label>
            <input
              id="intext-input"
              type="text"
              className="input-base"
              placeholder="e.g. confidential"
              value={intext}
              onChange={(e) => setIntext(e.target.value)}
              aria-label="Contains"
            />
          </div>
          <div>
            <label htmlFor="language-select" className="section-label">
              Language
            </label>
            <select
              id="language-select"
              className="input-base py-2.5"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Language"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value || "any"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="exclude-input" className="section-label">
              Exclude words
            </label>
            <input
              id="exclude-input"
              type="text"
              className="input-base"
              placeholder="login, admin"
              value={exclude}
              onChange={(e) => setExclude(e.target.value)}
              aria-label="Exclude words"
            />
          </div>
        </section>

        {/* More filters (collapsible) */}
        <section className="card overflow-visible">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMoreFiltersOpen((v) => !v);
            }}
            className="flex w-full items-center justify-between gap-2 rounded-md py-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
            aria-expanded={moreFiltersOpen}
            aria-controls="more-filters-content"
            id="more-filters-toggle"
          >
            <span className="section-label mb-0 flex items-center gap-2">
              <IconFunnel className="h-4 w-4 shrink-0 text-text-muted" />
              More filters
            </span>
            {moreFiltersOpen ? (
              <IconChevronUp className="h-4 w-4 shrink-0 text-text-muted" />
            ) : (
              <IconChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
            )}
          </button>
          <div
            id="more-filters-content"
            role="region"
            aria-labelledby="more-filters-toggle"
            aria-hidden={!moreFiltersOpen}
            className={moreFiltersOpen ? "block" : "hidden"}
          >
            <div className="space-y-3 border-t border-border pt-4 mt-3">
                <div>
                  <label htmlFor="title-input" className="section-label">
                    Title contains
                  </label>
                  <input
                    id="title-input"
                    type="text"
                    className="input-base"
                    placeholder="e.g. annual report"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-label="Title contains"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="date-after-input" className="section-label">
                      After (date)
                    </label>
                    <input
                      id="date-after-input"
                      type="text"
                      className="input-base"
                      placeholder="YYYY or YYYY-MM-DD"
                      value={dateAfter}
                      onChange={(e) => setDateAfter(e.target.value)}
                      aria-label="After date"
                    />
                  </div>
                  <div>
                    <label htmlFor="date-before-input" className="section-label">
                      Before (date)
                    </label>
                    <input
                      id="date-before-input"
                      type="text"
                      className="input-base"
                      placeholder="YYYY or YYYY-MM-DD"
                      value={dateBefore}
                      onChange={(e) => setDateBefore(e.target.value)}
                      aria-label="Before date"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="region-select" className="section-label">
                    Region
                  </label>
                  <select
                    id="region-select"
                    className="input-base py-2.5"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    aria-label="Region"
                  >
                    {REGION_OPTIONS.map((opt) => (
                      <option key={opt.value || "any"} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
            </div>
          </div>
        </section>

        {/* Query output */}
        <section className="card rounded-lg border-border bg-slate-900 text-slate-100">
          <p className="section-label mb-2 text-slate-400">Generated query</p>
          <p
            className="min-h-[2.5rem] break-words font-mono text-body leading-relaxed text-slate-100"
            role="status"
            aria-live="polite"
          >
            {query || "—"}
          </p>
        </section>

        {/* Saved searches */}
        <section className="card">
          <label className="section-label mb-3 flex items-center gap-2">
            <IconBookmark className="h-4 w-4 shrink-0 text-text-muted" />
            Saved searches
          </label>
          {savedSearches.length === 0 ? (
            <p className="rounded-md border border-dashed border-border bg-surface-muted/50 py-5 text-center text-caption text-text-muted">
              No saved searches. Use <strong>Save</strong> to store a search.
            </p>
          ) : (
            <>
              <ul className="flex flex-col gap-2" role="list">
                {savedPreview.map((item) => (
                  <li key={item.id}>
                    <div className="flex items-center gap-2 rounded-md border border-border bg-surface-muted/60 p-2.5 transition-colors hover:bg-surface-muted">
                      <button
                        type="button"
                        onClick={() => openSavedQuery(item.query)}
                        className="min-w-0 flex-1 text-left focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                        title={item.query}
                      >
                        <span className="block truncate text-body font-medium text-text-primary">
                          {item.name}
                        </span>
                        <span className="block truncate font-mono text-caption text-text-muted">
                          {item.query}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeSavedSearch(item.id); }}
                        className="shrink-0 rounded p-1.5 text-text-muted hover:bg-slate-200 hover:text-text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                        aria-label={`Remove ${item.name}`}
                        title="Remove"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {savedHasMore && (
                <button
                  type="button"
                  onClick={() => setListModalType("saved")}
                  className="mt-2 w-full rounded-md border border-border bg-surface-muted py-2 text-caption font-medium text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label="View all saved searches"
                >
                  View all ({savedSearches.length})
                </button>
              )}
            </>
          )}
        </section>

        {/* Recent searches */}
        <section className="card">
          <div className="mb-3 flex items-center justify-between">
            <label className="section-label mb-0 flex items-center gap-2">
              <IconClock className="h-4 w-4 shrink-0 text-text-muted" />
              Recent searches
            </label>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="text-caption text-text-muted hover:text-text-secondary focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label="Clear history"
                title="Clear history"
              >
                <IconTrash className="h-4 w-4" />
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="rounded-md border border-dashed border-border bg-surface-muted/50 py-6 text-center text-caption text-text-muted">
              No recent searches. Your searches will appear here.
            </p>
          ) : (
            <>
              <ul className="flex flex-col gap-1" role="list">
                {historyPreview.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <button
                      type="button"
                      onClick={() => openHistoryQuery(item)}
                      className="flex w-full items-center gap-3 rounded-md border border-transparent bg-surface-muted/60 px-3 py-2.5 text-left text-body text-text-primary transition-colors hover:border-border hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                      title={item}
                    >
                      <IconSearch className="h-4 w-4 shrink-0 text-text-muted" />
                      <span className="min-w-0 flex-1 truncate font-mono text-caption">
                        {item}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {historyHasMore && (
                <button
                  type="button"
                  onClick={() => setListModalType("recent")}
                  className="mt-2 w-full rounded-md border border-border bg-surface-muted py-2 text-caption font-medium text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label="View all recent searches"
                >
                  View all ({history.length})
                </button>
              )}
            </>
          )}
        </section>
      </main>

      {/* Actions – sticky at bottom */}
      <div className="shrink-0 border-t-2 border-slate-200 bg-white px-3 py-2 shadow-bar-top">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSearch}
            disabled={!query}
            className="inline-flex h-9 min-h-0 w-full items-center justify-center gap-1.5 rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            aria-label="Search on Google"
          >
            <IconSearch className="h-3.5 w-3.5 shrink-0" />
            Search on Google
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={openSaveModal}
              disabled={!query}
              className="inline-flex h-9 min-h-0 flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              aria-label="Save search"
              title="Save with a custom name"
            >
              <IconBookmark className="h-3.5 w-3.5 shrink-0" />
              Save
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!query}
              className="inline-flex h-9 min-h-0 flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              aria-label="Copy query"
            >
              {copied ? (
                <>
                  <span className="text-primary-600" aria-hidden="true">✓</span>
                  Copied
                </>
              ) : (
                <>
                  <IconCopy className="h-3.5 w-3.5 shrink-0" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Save modal */}
      {saveModalOpen && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => e.target === e.currentTarget && closeSaveModal()}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="save-modal-title"
        >
          <div
            className="w-full max-w-[320px] rounded-lg border border-border bg-surface p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2
                id="save-modal-title"
                className="text-label font-semibold text-text-primary"
              >
                Save this search
              </h2>
              <button
                type="button"
                onClick={closeSaveModal}
                className="rounded p-1 text-text-muted hover:bg-surface-muted hover:text-text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label="Close"
              >
                <IconXMark className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-3 text-caption text-text-muted">
              Give this search a name so you can find it later in Saved searches.
            </p>
            <label htmlFor="save-name-input" className="section-label mb-1.5 block">
              Name
            </label>
            <input
              ref={saveNameInputRef}
              id="save-name-input"
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveSearch()}
              placeholder="e.g. GitHub PDF reports"
              className="input-base mb-4"
              aria-describedby="save-name-hint"
            />
            <p id="save-name-hint" className="sr-only">
              Enter a short name for this search.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeSaveModal}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSearch}
                disabled={!saveName.trim()}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List modal – View all saved or recent */}
      {listModalType && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => e.target === e.currentTarget && setListModalType(null)}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="list-modal-title"
        >
          <div
            className="flex max-h-[85vh] w-full max-w-[360px] flex-col rounded-lg border border-border bg-surface shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <h2
                id="list-modal-title"
                className="flex items-center gap-2 text-label font-semibold text-text-primary"
              >
                {listModalType === "saved" ? (
                  <>
                    <IconBookmark className="h-4 w-4 text-text-muted" />
                    Saved searches
                  </>
                ) : (
                  <>
                    <IconClock className="h-4 w-4 text-text-muted" />
                    Recent searches
                  </>
                )}
              </h2>
              <button
                type="button"
                onClick={() => setListModalType(null)}
                className="rounded p-1.5 text-text-muted hover:bg-surface-muted hover:text-text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label="Close"
              >
                <IconXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {listModalType === "saved" ? (
                savedSearches.length === 0 ? (
                  <p className="py-6 text-center text-caption text-text-muted">
                    No saved searches.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2" role="list">
                    {savedSearches.map((item) => (
                      <li key={item.id}>
                        <div className="flex items-center gap-2 rounded-md border border-border bg-surface-muted/60 p-2.5 transition-colors hover:bg-surface-muted">
                          <button
                            type="button"
                            onClick={() => {
                              openSavedQuery(item.query);
                              setListModalType(null);
                            }}
                            className="min-w-0 flex-1 text-left focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                            title={item.query}
                          >
                            <span className="block truncate text-body font-medium text-text-primary">
                              {item.name}
                            </span>
                            <span className="block truncate font-mono text-caption text-text-muted">
                              {item.query}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSavedSearch(item.id)}
                            className="shrink-0 rounded p-1.5 text-text-muted hover:bg-slate-200 hover:text-text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                            aria-label={`Remove ${item.name}`}
                            title="Remove"
                          >
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                history.length === 0 ? (
                  <p className="py-6 text-center text-caption text-text-muted">
                    No recent searches.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1" role="list">
                    {history.map((item, index) => (
                      <li key={`${item}-${index}`}>
                        <button
                          type="button"
                          onClick={() => {
                            openHistoryQuery(item);
                            setListModalType(null);
                          }}
                          className="flex w-full items-center gap-3 rounded-md border border-transparent bg-surface-muted/60 px-3 py-2.5 text-left transition-colors hover:border-border hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                          title={item}
                        >
                          <IconSearch className="h-4 w-4 shrink-0 text-text-muted" />
                          <span className="min-w-0 flex-1 truncate font-mono text-caption text-text-primary">
                            {item}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>

            {listModalType === "recent" && history.length > 0 && (
              <div className="shrink-0 border-t border-border px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    clearHistory();
                    setListModalType(null);
                  }}
                  className="w-full rounded-md border border-border-strong py-2 text-caption font-medium text-text-muted hover:bg-surface-muted hover:text-text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label="Clear all recent searches"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
