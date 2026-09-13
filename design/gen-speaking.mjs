import { readFileSync, writeFileSync } from 'node:fs';
const DIR = '/Users/davidparsons/Code/davidparsons.me/design';
const talks = JSON.parse(readFileSync(`${DIR}/speaking.json`, 'utf8'));
const years = [...new Set(talks.map(t => t.year))].sort((a, b) => b - a);
const byYear = y => talks.filter(t => t.year === y);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/* ---------------- Direction A — Quiet Index ---------------- */
const aYears = years.map(y => `
      <div style="display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 0 24px; padding: 22px 0 26px; border-top: 1px solid #E4E4E0;">
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 13px; letter-spacing: 0.06em; color: #9A9E9B; padding-top: 5px;">${y}</div>
        <div style="display: flex; flex-direction: column; gap: 11px;">
${byYear(y).map(t => `          <div style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 16px; align-items: baseline;">
            <div style="font-size: 18px; line-height: 1.4;"><a href="#" class="lk">${esc(t.event)}</a>${t.extras.map(e => ` <a href="#" style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.06em; color: #9A9E9B;">[${e.label}]</a>`).join('')}</div>
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #9A9E9B; letter-spacing: 0.03em; white-space: nowrap;">${t.date}</div>
          </div>`).join('\n')}
        </div>
      </div>`).join('\n');

const A = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=IBM+Plex+Mono:wght@400;500&display=swap">
  <style>
    body { margin: 0; background: #FAFAF8; }
    a { color: #17191A; text-decoration: none; }
    a:hover { color: #17191A; }
    .lk { border-bottom: 1px solid #C6C8C3; padding-bottom: 1px; }
    .lk:hover { border-bottom-color: #17191A; }
  </style>
</helmet>

<div style="width: 1280px; min-height: 1560px; background: #FAFAF8; font-family: Newsreader, Georgia, serif; color: #17191A; display: flex; flex-direction: column;">

  <header style="max-width: 720px; width: 100%; margin: 0 auto; padding: 44px 0 18px; display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #E4E4E0;">
    <a href="#" style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #17191A;">David Parsons</a>
    <nav style="display: flex; gap: 26px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">
      <a href="#" style="color: #6B706E;">Notes</a>
      <a href="#" style="color: #17191A; border-bottom: 1px solid #17191A; padding-bottom: 2px;">Speaking</a>
      <a href="#" style="color: #6B706E;">Contact</a>
    </nav>
  </header>

  <main style="max-width: 720px; width: 100%; margin: 0 auto; padding: 88px 0 0; display: flex; flex-direction: column;">

    <div style="display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 0 24px; padding-bottom: 48px;">
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9A9E9B; padding-top: 14px;">Talks</div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <h1 style="margin: 0; font-size: 38px; font-weight: 400; line-height: 1.15; letter-spacing: -0.012em;">Speaking</h1>
        <p style="margin: 0; font-size: 17px; line-height: 1.7; color: #6B706E;">Twenty-four talks at WordCamps, BarCamps and meetups between 2012 and 2018.</p>
      </div>
    </div>

    <div style="display: flex; flex-direction: column;">
${aYears}
    </div>
  </main>

  <footer style="max-width: 720px; width: 100%; margin: 64px auto 0; padding: 0 0 56px;">
    <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #6B706E;">You can also find me on <a href="#" class="lk" style="color: #2E3230;">Twitter</a>, <a href="#" class="lk" style="color: #2E3230;">GitHub</a> and <a href="#" class="lk" style="color: #2E3230;">LinkedIn</a>.</p>
  </footer>

</div>
</x-dc>
</body>
</html>
`;
writeFileSync(`${DIR}/QuietIndexSpeaking.dc.html`, A);
console.log('wrote QuietIndexSpeaking.dc.html', A.length);
