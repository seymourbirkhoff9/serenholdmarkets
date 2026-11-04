import '../../styles.css';
import { html, raw, render } from '../../lib/dom.js';
import { SITE } from '../../site.js';
import { api } from '../../lib/api.js';
import { themeButton, wireThemeButton } from '../../lib/theme.js';
import { initTranslation, languageButton, wireLanguageButtons } from '../../lib/translate.js';
import { mountAssistant } from '../../lib/assistant/widget.js';
import { brandLink, wordmark } from '../../lib/brand.js';

const NAV = [
  ['How it works', '/how-it-works.html'], ['Fees & limits', '/fees.html'], ['Security', '/security.html'],
  ['FAQ', '/faq.html'], ['About', '/about.html'],
];

const COINS = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$67,245.00', change: '+2.34%', up: true },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,456.78', change: '+1.89%', up: true },
  { symbol: 'BNB', name: 'BNB', price: '$598.45', change: '-0.45%', up: false },
  { symbol: 'SOL', name: 'Solana', price: '$178.23', change: '+5.67%', up: true },
  { symbol: 'XRP', name: 'XRP', price: '$0.5234', change: '-1.23%', up: false },
  { symbol: 'ADA', name: 'Cardano', price: '$0.4567', change: '+0.89%', up: true },
  { symbol: 'DOGE', name: 'Dogecoin', price: '$0.1234', change: '+3.45%', up: true },
  { symbol: 'DOT', name: 'Polkadot', price: '$7.89', change: '-0.67%', up: false },
];

export const footer = () => html`
  <footer class="bg-chrome text-chrome-fg">
    <div class="mx-auto grid max-w-6xl gap-12 px-6 pb-12 pt-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
      <div>
        ${brandLink({ tone: 'chrome' })}
        <p class="mt-5 max-w-xs font-serif text-xl leading-snug text-chrome-fg/90">Calm, accountable crypto investing.</p>
        <p class="mt-3 max-w-xs text-sm text-chrome-fg/60">Questions? <a class="underline decoration-accent underline-offset-4 hover:text-chrome-fg" href="mailto:${SITE.contactEmail}">${SITE.contactEmail}</a></p>
      </div>
      ${[
        ['Product', [['How it works', '/how-it-works.html'], ['Fees & limits', '/fees.html'], ['Supported networks', '/fees.html#networks'], ['Security', '/security.html']]],
        ['Company', [['About', '/about.html'], ['FAQ', '/faq.html'], ['Contact', '/contact.html']]],
        ['Legal', [['Terms of Service', '/terms.html'], ['Privacy Policy', '/privacy.html'], ['Risk Disclosure', '/risk.html']]],
      ].map(([h, links]) => html`<nav aria-label="${h}"><p class="text-xs font-bold uppercase tracking-[0.18em] text-chrome-fg/50">${h}</p>
        <ul class="mt-4 grid gap-2.5 text-sm text-chrome-fg/80">${links.map(([l, u]) => html`<li><a class="hover:text-chrome-fg hover:underline hover:decoration-accent hover:underline-offset-4" href="${u}">${l}</a></li>`)}</ul></nav>`)}
    </div>
    <div class="border-t border-white/10">
      <p class="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-6 py-5 text-xs text-chrome-fg/50">
        <span>© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</span><span>Crypto assets are volatile. Read the risk disclosure before investing.</span></p>
    </div>
  </footer>`;

const burger = () => html`<span class="burger" aria-hidden="true"><span></span><span></span><span></span></span>`;

export const header = () => html`
  <header id="site-header" class="sticky top-0 z-40 border-b border-transparent bg-paper/80 backdrop-blur-md transition-colors">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
      ${brandLink()}
      <nav aria-label="Main" class="hidden items-center gap-1 rounded-full border border-line bg-surface/70 p-1 text-sm lg:flex">
        ${NAV.map(([l, u]) => html`<a class="rounded-full px-4 py-1.5 font-medium transition-colors ${location.pathname === u ? 'bg-primary text-primary-fg' : 'text-muted hover:text-ink'}" href="${u}"
          ${location.pathname === u ? html`aria-current="page"` : ''}>${l}</a>`)}
      </nav>
      <div class="flex items-center gap-1 sm:gap-2" id="auth-links">
        ${languageButton()}
        ${themeButton()}
        <span id="auth-cta" class="hidden items-center gap-2 sm:flex"><a class="btn-quiet" href="/login.html">Sign in</a>
        <a class="btn-primary" href="/signup.html">Open account</a></span>
        <button id="pub-menu" class="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink lg:hidden" aria-expanded="false" aria-controls="pub-nav" aria-label="Open menu">${burger()}</button>
      </div>
    </div>
  </header>
  <div id="pub-nav" class="menu-sheet fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-chrome text-chrome-fg lg:hidden" role="dialog" aria-modal="true" aria-label="Menu" inert>
    <div class="flex items-center justify-between px-6 py-4">
      ${wordmark({ tone: 'chrome' })}
      <button id="pub-menu-close" class="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-chrome-fg" aria-expanded="true" aria-label="Close menu">${burger()}</button>
    </div>
    <nav aria-label="Main" class="mt-6 grid px-6">
      ${NAV.map(([l, u], i) => html`<a class="menu-item group flex items-baseline gap-4 border-b border-white/10 py-4" style="--i:${i}" href="${u}">
        <span class="text-xs font-bold tabular-nums text-accent">0${i + 1}</span>
        <span class="font-serif text-3xl transition-transform group-hover:translate-x-1 ${location.pathname === u ? 'text-accent' : ''}">${l}</span></a>`)}
    </nav>
    <div id="auth-cta-mobile" class="menu-item mt-auto grid gap-3 px-6 pb-10 pt-8" style="--i:${NAV.length}">
      <a class="btn bg-[#7FE3BF] px-5 py-3 text-base text-[#06302C] hover:bg-[#9BEBCF]" href="/signup.html">Open account</a>
      <a class="btn border border-white/20 px-5 py-3 text-base text-chrome-fg" href="/login.html">Sign in</a></div>
  </div>`;

export const cryptoTicker = () => html`
  <div class="overflow-hidden bg-chrome text-chrome-fg" aria-label="Market prices (indicative)">
    <div class="flex animate-marquee whitespace-nowrap py-1.5">
      ${[...COINS, ...COINS].map((coin) => html`
        <div class="flex items-center gap-2 px-5 text-xs">
          <span class="font-bold tracking-wide">${coin.symbol}</span>
          <span class="tabular-nums text-chrome-fg/70">${coin.price}</span>
          <span class="rounded-full px-1.5 py-px font-semibold tabular-nums ${coin.up ? 'bg-accent/15 text-[#7FE3BF]' : 'bg-rejected/20 text-[#FFB4A6]'}">${coin.up ? '▲' : '▼'} ${coin.change.replace(/^[+-]/, '')}</span>
        </div>`)}
    </div>
  </div>`;

/** Wire the header menu, the “Go to your account” link for signed-in visitors, and scroll reveals. */
export function enhance() {
  wireThemeButton();
  wireLanguageButtons();
  initTranslation();
  mountAssistant();
  // Signed-in visitors get a direct way back in instead of "Sign in / Open account".
  api.auth.me({ quiet401: true }).then((u) => {
    const href = u.is_admin ? '/admin.html' : '/app.html', label = u.is_admin ? 'Open the console' : 'Go to your account';
    render('#auth-cta', html`<a class="btn-primary" href="${href}">${label}</a>`);
    render('#auth-cta-mobile', html`<a class="btn bg-[#7FE3BF] px-5 py-3 text-base text-[#06302C] hover:bg-[#9BEBCF]" href="${href}">${label}</a>`);
  }).catch(() => {});
  wireMenu();
  // The header gains a hairline once the page scrolls under it.
  const head = document.getElementById('site-header');
  const onScroll = () => head?.classList.toggle('border-line', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // Elements marked data-reveal fade up as they scroll into view (instantly with reduced motion).
  const els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-visible')); return;
  }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => io.observe(el));
}

/** Full-screen mobile menu: opens from the burger, closes on ✕, Escape, a link, or a wide screen. */
function wireMenu() {
  const openBtn = document.getElementById('pub-menu'), closeBtn = document.getElementById('pub-menu-close');
  const sheet = document.getElementById('pub-nav');
  if (!openBtn || !sheet) return;
  const set = (open) => {
    sheet.classList.toggle('open', open);
    sheet.inert = !open;
    openBtn.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    (open ? closeBtn : openBtn).focus({ preventScroll: true });
  };
  openBtn.addEventListener('click', () => set(true));
  closeBtn.addEventListener('click', () => set(false));
  sheet.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet.classList.contains('open')) set(false); });
  matchMedia('(min-width: 1024px)').addEventListener('change', (m) => { if (m.matches && sheet.classList.contains('open')) set(false); });
}

/** A simple content page: header, title, body sections, footer. */
export function contentPage({ title, intro, body }) {
  document.title = `${title} — ${SITE.name}`;
  render('#root', html`${cryptoTicker()}${header()}
    <main>
      <section class="hero-bg border-b border-line">
        <div class="mx-auto max-w-6xl px-6 pb-14 pt-10">
          <h1 class="max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">${title}</h1>
          <p class="mt-4 max-w-2xl text-lg text-muted">${intro}</p>
        </div>
      </section>
      <div class="mx-auto max-w-6xl px-6 py-14">${body}</div>
    </main>
    ${footer()}`);
  enhance();
}

/**
 * A legal document page. `sections` is [[heading, [paragraph, …]], …]; paragraphs are plain text,
 * except entries wrapped in raw() which may contain our own trusted markup (links, lists).
 */
export function legalPage({ title, intro, sections }) {
  document.title = `${title} — ${SITE.name}`;
  render('#root', html`
    ${cryptoTicker()}
    ${header()}
    <main class="mx-auto max-w-3xl px-6 pb-20 pt-6">
      <p class="text-sm text-muted">Last updated ${SITE.termsUpdated} (version ${SITE.termsVersion})</p>
      <h1 class="mt-2 font-serif text-4xl">${title}</h1>
      <p class="mt-4 text-lg text-muted">${intro}</p>
      <nav aria-label="On this page" class="mt-8 rounded border border-line bg-surface p-4 text-sm">
        <p class="font-semibold">On this page</p>
        <ol class="mt-2 grid gap-1 sm:grid-cols-2">${sections.map(([h], i) => html`<li><a class="text-muted hover:text-ink hover:underline" href="#s${i + 1}">${i + 1}. ${h}</a></li>`)}</ol>
      </nav>
      ${sections.map(([h, paras], i) => html`
        <section id="s${i + 1}" class="mt-10 scroll-mt-6">
          <h2 class="font-serif text-2xl">${i + 1}. ${h}</h2>
          ${paras.map((p) => html`<p class="mt-3 leading-relaxed">${p}</p>`)}
        </section>`)}
    </main>
    ${footer()}`);
  enhance();
}

export { raw, SITE };
