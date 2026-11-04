"""
app/services/email_templates.py — one branded, escaped HTML email layout.

Built with tables and inline styles: that's what renders reliably in Gmail,
Outlook and Apple Mail (no external CSS, no web fonts, no images required).
Every dynamic value is HTML-escaped: names, notes and reasons are user/admin input.
"""
import re
from decimal import Decimal
from html import escape, unescape
from typing import List, Optional, Sequence, Tuple

from app.config import settings

TEAL, MINT, INK, MUTED, LINE, PAPER = "#0E4D4A", "#7FE3BF", "#102A2A", "#566866", "#DFDBD1", "#F7F5F0"
SANS = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
SERIF = "Georgia,'Times New Roman',serif"


def usd(value) -> str:
    """Human money for messages: 200.00000000 → $200.00."""
    return f"${Decimal(str(value or 0)):,.2f}"


def _site(path: str = "") -> str:
    return settings.FRONTEND_URL.rstrip("/") + path


def render_email(heading: str, name: str, paragraphs: Sequence[str],
                 cta: Optional[Tuple[str, str]] = None,
                 rows: Optional[List[Tuple[str, str]]] = None,
                 preheader: Optional[str] = None) -> str:
    """
    heading     big title, e.g. "Deposit approved"
    name        recipient's name for the greeting
    paragraphs  plain-text paragraphs
    cta         optional (button label, absolute URL)
    rows        optional details table, e.g. [("Amount", "$200.00"), ("Method", "USDT (TRC20)")]
    preheader   optional inbox preview text (defaults to the first paragraph)
    """
    pre = escape(preheader or (paragraphs[0] if paragraphs else heading))
    body = "".join(
        f'<p style="margin:0 0 14px;font:15px/1.6 {SANS};color:{INK};">{escape(p)}</p>' for p in paragraphs)
    table = ""
    if rows:
        cells = "".join(
            f'<tr><td style="padding:10px 0;border-top:1px solid {LINE};font:14px {SANS};color:{MUTED};">{escape(k)}</td>'
            f'<td align="right" style="padding:10px 0;border-top:1px solid {LINE};font:600 14px {SANS};color:{INK};'
            f'word-break:break-all;">{escape(v)}</td></tr>' for k, v in rows)
        table = (f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
                 f'style="margin:6px 0 18px;border-bottom:1px solid {LINE};">{cells}</table>')
    button = ""
    if cta:
        label, url = cta
        button = (
            f'<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 22px;"><tr>'
            f'<td style="background:{TEAL};border-radius:999px;">'
            f'<a href="{escape(url, quote=True)}" style="display:inline-block;padding:13px 26px;font:600 15px {SANS};'
            f'color:#ffffff;text-decoration:none;">{escape(label)}</a></td></tr></table>')
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>{escape(heading)}</title></head>
<body style="margin:0;padding:0;background:{PAPER};">
<span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">{pre}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{PAPER};"><tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
    <tr><td style="background:{TEAL};border-radius:16px 16px 0 0;padding:20px 28px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="width:30px;height:30px;background:{MINT};border-radius:9px;text-align:center;font:600 18px/30px {SERIF};color:{TEAL};">S</td>
        <td style="padding-left:10px;font:600 18px {SERIF};color:#ffffff;">Serenhold <span style="font:700 10px {SANS};letter-spacing:2px;color:{MINT};">MARKETS</span></td>
      </tr></table></td></tr>
    <tr><td style="height:3px;background:{MINT};font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr><td style="background:#ffffff;border:1px solid {LINE};border-top:0;border-radius:0 0 16px 16px;padding:30px 28px 24px;">
      <h1 style="margin:0 0 18px;font:400 26px/1.25 {SERIF};color:{INK};">{escape(heading)}</h1>
      <p style="margin:0 0 14px;font:15px/1.6 {SANS};color:{INK};">Hi {escape(name)},</p>
      {body}{table}{button}
      <p style="margin:18px 0 0;font:13px/1.6 {SANS};color:{MUTED};">Questions? Reply to this email or visit
        <a href="{escape(_site('/'), quote=True)}" style="color:{TEAL};">your account</a>.</p>
    </td></tr>
    <tr><td style="padding:18px 8px 0;font:12px/1.6 {SANS};color:{MUTED};text-align:center;">
      You’re receiving this because you have an account at Serenhold Markets.<br>
      <a href="{escape(_site('/terms.html'), quote=True)}" style="color:{MUTED};">Terms</a> &nbsp;|&nbsp;
      <a href="{escape(_site('/privacy.html'), quote=True)}" style="color:{MUTED};">Privacy</a> &nbsp;|&nbsp;
      <a href="{escape(_site('/risk.html'), quote=True)}" style="color:{MUTED};">Risk Disclosure</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>"""


def html_to_text(html: str) -> str:
    """Plain-text alternative, sent alongside the HTML (better deliverability, readable everywhere)."""
    s = re.sub(r"(?is)<(head|style|title)[^>]*>.*?</\1>", "", html)
    s = re.sub(r'(?is)<span style="display:none[^>]*>.*?</span>', "", s)
    s = re.sub(r'(?is)<a [^>]*href="([^"]+)"[^>]*>(.*?)</a>', lambda m: f"{m.group(2)} ({unescape(m.group(1))})", s)
    s = re.sub(r"(?i)</(p|h1|tr|table)>|<br\s*/?>", "\n", s)
    s = re.sub(r"(?i)</td>", "  ", s)
    s = unescape(re.sub(r"<[^>]+>", "", s)).replace("\xa0", " ")
    lines = [re.sub(r"[ \t]+", " ", l).strip() for l in s.splitlines()]
    return re.sub(r"\n{3,}", "\n\n", "\n".join(lines)).strip()
