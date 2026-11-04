import '../../styles.css';
import { html, render } from '../../lib/dom.js';
import { themeButton, wireThemeButton } from '../../lib/theme.js';
import { initTranslation, languageButton, wireLanguageButtons } from '../../lib/translate.js';
import { mountAssistant } from '../../lib/assistant/widget.js';
import { cryptoTicker } from '../public/layout.js';
import { brandLink } from '../../lib/brand.js';

/** Two-column auth layout: form on the left, a short factual note on the right. */
export function authLayout({ title, intro, form, aside }) {
  render('#root', html`
    ${cryptoTicker()}
    <div class="grid min-h-[calc(100vh-30px)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:p-3">
      <aside class="relative hidden overflow-hidden rounded-[1.75rem] bg-chrome p-14 text-chrome-fg lg:flex lg:flex-col lg:justify-between">
        <div class="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/25 blur-3xl" aria-hidden="true"></div>
        <div class="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary/50 blur-3xl" aria-hidden="true"></div>
        <p class="relative font-serif text-3xl leading-snug">Calm, accountable crypto investing.</p>
        <div class="relative">${aside}</div>
      </aside>
      <main class="flex flex-col px-6 py-8 sm:px-12">
        <div class="flex items-center justify-between">
          ${brandLink()}
          <div class="flex items-center gap-1">${languageButton()}${themeButton()}</div>
        </div>
        <div id="auth-body" class="mx-auto my-auto w-full max-w-sm py-10">
          <h1 class="font-serif text-4xl tracking-tight">${title}</h1>
          ${intro ? html`<p class="mt-2 text-muted">${intro}</p>` : ''}
          <div class="mt-8">${form}</div>
        </div>
        <nav aria-label="Legal" class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <a class="hover:text-ink hover:underline" href="/terms.html">Terms</a>
          <a class="hover:text-ink hover:underline" href="/privacy.html">Privacy</a>
          <a class="hover:text-ink hover:underline" href="/risk.html">Risk Disclosure</a></nav>
      </main>
    </div>`);
  wireThemeButton();
  wireLanguageButtons();
  initTranslation();
  mountAssistant();
}

/** What happens to money here, step by step — the honest version. */
export const processAside = html`
  <div class="max-w-md">
    <p class="text-xs font-bold uppercase tracking-[0.18em] text-chrome-fg/50">How money moves</p>
    <ol class="mt-6 grid gap-6">
      ${[
        ['You send crypto to an address the operator publishes', 'Pick an asset and network, then report the USD value and transaction hash.'],
        ['An operator checks it and credits your Main wallet', 'Nothing is credited automatically. Each deposit is reviewed by a person.'],
        ['Withdrawals are paid out by hand', 'Funds are held while pending, and returned in full if the request is rejected.'],
      ].map(([t, d], i) => html`
        <li class="grid grid-cols-[2rem_1fr] gap-3">
          <span class="figure grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-sm text-[#7FE3BF]">${i + 1}</span>
          <span><span class="block font-medium">${t}</span><span class="mt-1 block text-sm text-chrome-fg/60">${d}</span></span>
        </li>`)}
    </ol>
  </div>`;
