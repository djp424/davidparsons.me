import { readFileSync, writeFileSync } from 'node:fs';
const DIR = '/Users/davidparsons/Code/davidparsons.me/design';
const talks = JSON.parse(readFileSync(`${DIR}/speaking.json`, 'utf8'));
const years = [...new Set(talks.map(t => t.year))].sort((a, b) => b - a);

const BG = '#0E1113', PANEL = '#151A1C', RAISED = '#1B2225', RULE = '#232A2D';
const INK = '#D8DEE0', BRIGHT = '#EEF3F4', MUTED = '#79878C', DIM = '#5C696D';
const COOL = '#9CC5CE', WARM = '#D2A16A';
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const SANS = "'IBM Plex Sans', system-ui, sans-serif";

const head = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
  <style>
    body { margin: 0; background: ${BG}; }
    a { color: ${COOL}; text-decoration: none; }
    a:hover { color: #C2E0E7; }
    .u { border-bottom: 1px solid rgba(156, 197, 206, 0.38); padding-bottom: 1px; }
    .u:hover { border-bottom-color: ${COOL}; }
  </style>
</helmet>
`;

const topbar = current => `
  <header style="border-bottom: 1px solid ${RULE}; background: ${PANEL};">
    <div style="max-width: 1040px; margin: 0 auto; padding: 0 40px; min-height: 60px; display: flex; align-items: center; justify-content: space-between; gap: 24px;">
      <a href="#" style="font-family: ${MONO}; font-size: 13px; font-weight: 500; letter-spacing: 0.04em; color: ${BRIGHT};">david<span style="color: ${DIM};">parsons</span>.me</a>
      <div style="display: flex; align-items: center; gap: 28px;">
        <nav style="display: flex; gap: 24px; font-family: ${MONO}; font-size: 13px;">
${['Notes', 'Speaking', 'Contact'].map(l => `          <a href="#" style="color: ${l === current ? BRIGHT : MUTED};${l === current ? ` border-bottom: 1px solid ${COOL}; padding-bottom: 3px;` : ''}">${l}</a>`).join('\n')}
        </nav>
        <span style="display: inline-flex; align-items: center; gap: 8px; min-height: 30px; padding: 0 11px; border: 1px solid ${RULE}; background: ${RAISED}; font-family: ${MONO}; font-size: 12px; color: ${MUTED};">
          <span style="color: ${DIM};">Jump to</span>
          <span style="color: ${COOL};">&#8984;K</span>
        </span>
      </div>
    </div>
  </header>`;

const footer = `
  <footer style="border-top: 1px solid ${RULE}; margin-top: auto;">
    <div style="max-width: 1040px; margin: 0 auto; padding: 26px 40px; display: flex; justify-content: space-between; align-items: center; gap: 24px; font-family: ${MONO}; font-size: 12px; color: ${DIM};">
      <span>Elsewhere</span>
      <span style="display: flex; gap: 22px;">
        <a href="#" style="color: ${MUTED};">Twitter</a>
        <a href="#" style="color: ${MUTED};">Github</a>
        <a href="#" style="color: ${MUTED};">LinkedIn</a>
      </span>
    </div>
  </footer>`;

const page = (current, height, body, overlay = '') => `${head}
<div style="position: relative; width: 1280px; min-height: ${height}px; background: ${BG}; color: ${INK}; display: flex; flex-direction: column; overflow: hidden;">
${topbar(current)}
  <main style="max-width: 1040px; width: 100%; margin: 0 auto; padding: 72px 40px 80px; display: flex; flex-direction: column;">
${body}
  </main>
${footer}
${overlay}
</div>
</x-dc>
</body>
</html>
`;

const eyebrow = t => `    <div style="font-family: ${MONO}; font-size: 11px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: ${WARM};">${t}</div>`;

/* ---- Home ---- */
const home = `
    <div style="max-width: 620px; display: flex; flex-direction: column; gap: 24px;">
${eyebrow('Software engineer &middot; 15 years')}
      <h1 style="margin: 0; font-family: ${SANS}; font-size: 46px; font-weight: 600; line-height: 1.1; letter-spacing: -0.03em; color: ${BRIGHT};">Hello, I&rsquo;m David.</h1>
      <p style="margin: 0; font-family: ${SANS}; font-size: 18px; line-height: 1.75; color: ${INK}; text-wrap: pretty;">I&rsquo;ve spent 15 years building software for the web. You might also know me as the lead organizer of <a href="#" class="u">WordCamp NYC 2017</a>.</p>
      <p style="margin: 0; font-family: ${SANS}; font-size: 18px; line-height: 1.75; color: ${INK}; text-wrap: pretty;">I speak at local meetups and conferences when I can. I&rsquo;ve taken a lot from this community, and it feels good to give back.</p>
      <p style="margin: 0; font-family: ${SANS}; font-size: 18px; line-height: 1.75; color: ${INK}; text-wrap: pretty;">If you want to get in touch, <a href="#" class="u">say hello</a>.</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; background: ${RULE}; border: 1px solid ${RULE}; margin-top: 64px;">
      <a href="#" style="display: flex; flex-direction: column; gap: 7px; padding: 22px 24px; background: ${PANEL}; min-height: 44px;">
        <span style="font-family: ${MONO}; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: ${DIM};">Notes</span>
        <span style="font-family: ${SANS}; font-size: 16px; color: ${BRIGHT};">Five posts</span>
        <span style="font-family: ${MONO}; font-size: 12px; color: ${COOL};">2012&ndash;2017</span>
      </a>
      <a href="#" style="display: flex; flex-direction: column; gap: 7px; padding: 22px 24px; background: ${PANEL}; min-height: 44px;">
        <span style="font-family: ${MONO}; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: ${DIM};">Speaking</span>
        <span style="font-family: ${SANS}; font-size: 16px; color: ${BRIGHT};">Twenty-four talks</span>
        <span style="font-family: ${MONO}; font-size: 12px; color: ${COOL};">2012&ndash;2018</span>
      </a>
      <a href="#" style="display: flex; flex-direction: column; gap: 7px; padding: 22px 24px; background: ${PANEL}; min-height: 44px;">
        <span style="font-family: ${MONO}; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: ${DIM};">Contact</span>
        <span style="font-family: ${SANS}; font-size: 16px; color: ${BRIGHT};">Send a note</span>
        <span style="font-family: ${MONO}; font-size: 12px; color: ${COOL};">&rarr;</span>
      </a>
    </div>`;

/* ---- Command palette overlay ---- */
const row = (group, label, meta, active) => `
        <a href="#" style="display: grid; grid-template-columns: 14px minmax(0, 1fr) auto; gap: 14px; align-items: center; min-height: 46px; padding: 0 18px; background: ${active ? '#222B2E' : 'transparent'}; border-left: 2px solid ${active ? COOL : 'transparent'};">
          <span style="font-family: ${MONO}; font-size: 11px; color: ${active ? COOL : DIM};">${group}</span>
          <span style="font-family: ${SANS}; font-size: 15px; color: ${active ? BRIGHT : INK}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${label}</span>
          <span style="font-family: ${MONO}; font-size: 11px; color: ${DIM}; white-space: nowrap;">${meta}</span>
        </a>`;

const paletteOverlay = `
  <div style="position: absolute; inset: 0; background: rgba(8, 10, 11, 0.66);"></div>
  <div style="position: absolute; top: 148px; left: 50%; transform: translateX(-50%); width: 580px; background: ${RAISED}; border: 1px solid #2E383B; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);">
    <div style="display: flex; align-items: center; gap: 12px; padding: 0 18px; min-height: 56px; border-bottom: 1px solid ${RULE};">
      <span style="font-family: ${MONO}; font-size: 13px; color: ${COOL};">&rsaquo;</span>
      <span style="font-family: ${MONO}; font-size: 15px; color: ${BRIGHT};">word<span style="display: inline-block; width: 1.5px; height: 17px; background: ${COOL}; vertical-align: -3px; margin-left: 1px;"></span></span>
      <span style="margin-left: auto; font-family: ${MONO}; font-size: 11px; color: ${DIM};">esc to close</span>
    </div>
    <div style="display: flex; flex-direction: column; padding: 8px 0;">
${row('T', 'WordCamp for Publishers', 'Aug 2018', true)}
${row('T', 'WordCamp Chicago', 'Apr 2016', false)}
${row('T', 'WordCamp Boston', 'Jul 2015', false)}
${row('N', 'WordCamp Miami 2013 Notes', 'Mar 2013', false)}
${row('P', 'Speaking', 'Page', false)}
    </div>
    <div style="display: flex; gap: 20px; padding: 11px 18px; border-top: 1px solid ${RULE}; font-family: ${MONO}; font-size: 11px; color: ${DIM};">
      <span><span style="color: ${MUTED};">&uarr;&darr;</span> navigate</span>
      <span><span style="color: ${MUTED};">&crarr;</span> open</span>
      <span style="margin-left: auto;">24 talks &middot; 5 notes &middot; 4 pages</span>
    </div>
  </div>`;

/* ---- Notes ---- */
const posts = [
  ['Automating My Personal Site Updates', '2017.02.19', 'General', 'I recently moved this site over to DigitalOcean. I decided to start everything over from scratch.'],
  ['Git Merge 2016 Conference Notes', '2016.04.05', 'Conferences', 'Bitmaps beat arrays, use HTTPS, merge instead of rebase, and keep submodules one level deep.'],
  ['WordCamp Miami 2013 Notes', '2013.03.23', 'Conferences', 'Storytelling in web design, WordPress performance on the stack, and a freelance primer.'],
  ['An Open Sourced Life', '2012.12.09', '', 'If this is your first time here, this is my personal site. I found my passion for Computer Science in these past few years.'],
  ['Hello world!', '2012.11.14', '', 'You had me at hello world!'],
];
const notes = `
    <div style="max-width: 620px; display: flex; flex-direction: column; gap: 14px;">
${eyebrow('Notes')}
      <h1 style="margin: 0; font-family: ${SANS}; font-size: 36px; font-weight: 600; line-height: 1.15; letter-spacing: -0.028em; color: ${BRIGHT};">Notes</h1>
      <p style="margin: 0; font-family: ${SANS}; font-size: 17px; line-height: 1.7; color: ${MUTED};">Conference notes, a server rebuild, and a couple of posts from a long time ago.</p>
    </div>

    <div style="display: flex; flex-direction: column; border: 1px solid ${RULE}; margin-top: 44px;">
${posts.map((p, i) => `      <a href="#" style="display: grid; grid-template-columns: 116px minmax(0, 1fr); gap: 24px; padding: 22px 24px; background: ${PANEL};${i === 0 ? '' : ` border-top: 1px solid ${RULE};`}">
        <div style="display: flex; flex-direction: column; gap: 7px;">
          <span style="font-family: ${MONO}; font-size: 12px; color: ${COOL}; letter-spacing: 0.02em;">${p[1]}</span>
${p[2] ? `          <span style="font-family: ${MONO}; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${DIM};">${p[2]}</span>` : ''}
        </div>
        <div style="display: flex; flex-direction: column; gap: 7px;">
          <span style="font-family: ${SANS}; font-size: 20px; font-weight: 500; line-height: 1.3; letter-spacing: -0.015em; color: ${BRIGHT};">${p[0]}</span>
          <span style="font-family: ${SANS}; font-size: 15px; line-height: 1.65; color: ${MUTED}; text-wrap: pretty;">${p[3]}</span>
        </div>
      </a>`).join('\n')}
    </div>`;

/* ---- Speaking ---- */
const speaking = `
    <div style="max-width: 620px; display: flex; flex-direction: column; gap: 14px;">
${eyebrow('Talks')}
      <h1 style="margin: 0; font-family: ${SANS}; font-size: 36px; font-weight: 600; line-height: 1.15; letter-spacing: -0.028em; color: ${BRIGHT};">Speaking</h1>
      <p style="margin: 0; font-family: ${SANS}; font-size: 17px; line-height: 1.7; color: ${MUTED};">Twenty-four talks at WordCamps, BarCamps and meetups between 2012 and 2018.</p>
    </div>

    <div style="display: flex; flex-direction: column; gap: 30px; padding-top: 44px;">
${years.map(y => `      <div style="display: grid; grid-template-columns: 84px minmax(0, 1fr); gap: 0 24px;">
        <div style="font-family: ${MONO}; font-size: 13px; font-weight: 500; letter-spacing: 0.08em; color: ${WARM}; padding-top: 13px;">${y}</div>
        <div style="display: flex; flex-direction: column; border-top: 1px solid ${RULE};">
${talks.filter(t => t.year === y).map(t => `          <div style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 16px; align-items: baseline; padding: 11px 0;">
            <div style="font-family: ${SANS}; font-size: 16px; color: ${INK};"><a href="#" class="u">${t.event}</a>${t.extras.map(e => ` <a href="#" style="font-family: ${MONO}; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${DIM}; border: none;">${e.label}</a>`).join('')}</div>
            <div style="font-family: ${MONO}; font-size: 12px; color: ${DIM}; white-space: nowrap;">${t.date}</div>
          </div>`).join('\n')}
        </div>
      </div>`).join('\n')}
    </div>`;

/* ---- Contact ---- */
const field = (label, tall) => `
      <label style="display: flex; flex-direction: column; gap: 8px;">
        <span style="font-family: ${MONO}; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: ${MUTED};">${label}</span>
        <span style="display: block; border: 1px solid ${RULE}; background: ${PANEL}; min-height: ${tall ? 132 : 48}px; padding: 13px 15px; font-family: ${SANS}; font-size: 16px; color: ${DIM};">&nbsp;</span>
      </label>`;

const contact = `
    <div style="max-width: 560px; display: flex; flex-direction: column; gap: 14px;">
${eyebrow('Contact')}
      <h1 style="margin: 0; font-family: ${SANS}; font-size: 36px; font-weight: 600; line-height: 1.15; letter-spacing: -0.028em; color: ${BRIGHT};">You know what to do!</h1>
      <p style="margin: 0; font-family: ${SANS}; font-size: 17px; line-height: 1.7; color: ${MUTED};">Write below and it lands in my inbox. I read everything.</p>
    </div>

    <div style="max-width: 560px; display: flex; flex-direction: column; gap: 22px; padding-top: 40px;">
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px;">
${field('Name', false)}
${field('Email', false)}
      </div>
${field('Message', true)}
      <div style="display: flex; align-items: center; gap: 18px; padding-top: 6px;">
        <a href="#" style="display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 26px; background: ${COOL}; color: #0E1113; font-family: ${MONO}; font-size: 13px; font-weight: 500; letter-spacing: 0.06em;">Send message</a>
        <span style="font-family: ${MONO}; font-size: 12px; color: ${DIM};">Usually a reply within a day or two.</span>
      </div>
    </div>`;

writeFileSync(`${DIR}/WorkbenchHome.dc.html`, page('', 900, home));
writeFileSync(`${DIR}/WorkbenchPalette.dc.html`, page('', 900, home, paletteOverlay));
writeFileSync(`${DIR}/WorkbenchNotes.dc.html`, page('Notes', 1080, notes));
writeFileSync(`${DIR}/WorkbenchSpeaking.dc.html`, page('Speaking', 1560, speaking));
writeFileSync(`${DIR}/WorkbenchContact.dc.html`, page('Contact', 900, contact));
console.log('wrote 5 Workbench artboards');
