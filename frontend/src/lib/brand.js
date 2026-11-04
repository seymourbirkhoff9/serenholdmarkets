// Serenhold brand: the logo mark and wordmark, used everywhere the brand appears.
// Fixed colours (not theme tokens) so the mark looks the same in light and dark.
import { html, raw } from './dom.js';

const MARK = `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
  <rect width="32" height="32" rx="9" fill="#0E4D4A"/>
  <path d="M8 13.2c2.7-2.8 5.3-2.8 8 0s5.3 2.8 8 0M8 19.6c2.7-2.8 5.3-2.8 8 0s5.3 2.8 8 0"
        stroke="#7FE3BF" stroke-width="2.6" fill="none" stroke-linecap="round"/>
</svg>`;

/** The square logo mark. `cls` sets its size. */
export const logoMark = (cls = 'h-9 w-9') => html`<span class="inline-block shrink-0 ${cls}">${raw(MARK)}</span>`;

/** Mark + two-line wordmark. `tone: 'chrome'` for the dark app sidebar. */
export const wordmark = ({ sub = 'Markets', tone = 'default' } = {}) => html`
  <span class="flex items-center gap-2.5">
    ${logoMark()}
    <span class="leading-none">
      <span class="block font-serif text-[1.2rem] font-semibold tracking-tight ${tone === 'chrome' ? 'text-chrome-fg' : 'text-ink'}">Serenhold</span>
      <span class="mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.22em] ${tone === 'chrome' ? 'text-chrome-fg/60' : 'text-accent'}">${sub}</span>
    </span>
  </span>`;

/** Wordmark wrapped in a link home. */
export const brandLink = (opts = {}) => html`<a href="/" class="shrink-0 rounded-lg" aria-label="Serenhold Markets home">${wordmark(opts)}</a>`;
