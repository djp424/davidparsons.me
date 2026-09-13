import { readFileSync, writeFileSync } from 'node:fs';
const DIR = '/Users/davidparsons/Code/davidparsons.me/design';
const talks = JSON.parse(readFileSync(`${DIR}/speaking.json`, 'utf8'));
const years = [...new Set(talks.map(t => t.year))].sort((a, b) => b - a);

const INK = '#101413', MUTED = '#5F6A68', RULE = '#E4E8E7', ACC = '#1C6E7E';

const head = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500&display=swap">
  <style>
    body { margin: 0; background: #FFFFFF; }
    a { color: ${ACC}; text-decoration: none; }
    a:hover { color: #15545F; }
    .u { background-image: linear-gradient(${ACC}, ${ACC}); background-repeat: no-repeat; background-size: 100% 1px; background-position: 0 100%; padding-bottom: 2px; }
  </style>
</helmet>
`;

const navItem = (label, active) => `
        <a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 44px; color: ${active ? INK : MUTED}; font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: ${active ? 500 : 400};">
          <span style="width: 3px; height: 18px; background: ${active ? ACC : 'transparent'};"></span>
          <span>${label}</span>
        </a>`;

const rail = current => `
    <aside style="width: 340px; flex: none; background: #F5F7F6; border-right: 1px solid ${RULE}; padding: 56px 40px; display: flex; flex-direction: column; gap: 40px;">
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <a href="#" style="font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 600; letter-spacing: -0.022em; color: ${INK};">David Parsons</a>
        <p style="margin: 0; font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; line-height: 1.6; color: ${MUTED};">Software engineer. Fifteen years on the web.</p>
      </div>

      <nav style="display: flex; flex-direction: column; margin-left: -15px;">${['About', 'Notes', 'Speaking', 'Contact'].map(l => navItem(l, l === current)).join('')}
      </nav>

      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: auto;">
        <div style="font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: #97A2A0;">Elsewhere</div>
        <div style="display: flex; flex-direction: column; gap: 9px; font-family: 'IBM Plex Sans', sans-serif; font-size: 15px;">
          <a href="#" class="u">Twitter</a>
          <a href="#" class="u">Github</a>
          <a href="#" class="u">LinkedIn</a>
        </div>
      </div>
    </aside>`;

const page = (current, height, body) => `${head}
<div style="width: 1280px; min-height: ${height}px; background: #FFFFFF; color: ${INK}; display: flex; align-items: stretch;">
${rail(current)}
    <main style="flex: 1 1 auto; padding: 72px 88px; display: flex; flex-direction: column;">
${body}
    </main>
</div>
</x-dc>
</body>
</html>
`;

const eyebrow = t => `      <div style="font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: #97A2A0;">${t}</div>`;

/* ---- Home ---- */
const home = `
      <div style="max-width: 600px; display: flex; flex-direction: column; gap: 26px;">
        <h1 style="margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 44px; font-weight: 600; line-height: 1.12; letter-spacing: -0.03em;">Hello, I&rsquo;m David.</h1>
        <p style="margin: 0; font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; line-height: 1.75; color: #2A302E; text-wrap: pretty;">I&rsquo;ve spent 15 years building software for the web. You might also know me as the lead organizer of <a href="#" class="u">WordCamp NYC 2017</a>.</p>
        <p style="margin: 0; font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; line-height: 1.75; color: #2A302E; text-wrap: pretty;">I speak at local meetups and conferences when I can. I&rsquo;ve taken a lot from this community, and it feels good to give back.</p>
        <p style="margin: 0; font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; line-height: 1.75; color: #2A302E; text-wrap: pretty;">If you want to get in touch, <a href="#" class="u">say hello</a>.</p>
      </div>

      <div style="max-width: 600px; display: flex; flex-direction: column; gap: 16px; padding-top: 64px;">
${eyebrow('Recent notes')}
        <div style="display: flex; flex-direction: column;">
          <a href="#" style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 20px; align-items: baseline; padding: 15px 0; border-top: 1px solid ${RULE}; color: ${INK};">
            <span style="font-family: 'Space Grotesk', sans-serif; font-size: 17px; font-weight: 500;">Automating My Personal Site Updates</span>
            <span style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #97A2A0; white-space: nowrap;">Feb 2017</span>
          </a>
          <a href="#" style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 20px; align-items: baseline; padding: 15px 0; border-top: 1px solid ${RULE}; color: ${INK};">
            <span style="font-family: 'Space Grotesk', sans-serif; font-size: 17px; font-weight: 500;">Git Merge 2016 Conference Notes</span>
            <span style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #97A2A0; white-space: nowrap;">Apr 2016</span>
          </a>
          <a href="#" style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 20px; align-items: baseline; padding: 15px 0; border-top: 1px solid ${RULE}; border-bottom: 1px solid ${RULE}; color: ${INK};">
            <span style="font-family: 'Space Grotesk', sans-serif; font-size: 17px; font-weight: 500;">WordCamp Miami 2013 Notes</span>
            <span style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #97A2A0; white-space: nowrap;">Mar 2013</span>
          </a>
        </div>
      </div>`;

/* ---- Notes ---- */
const posts = [
  ['Automating My Personal Site Updates', 'February 19, 2017', 'General', 'I recently moved this site over to DigitalOcean. I decided to start everything over from scratch.'],
  ['Git Merge 2016 Conference Notes', 'April 5, 2016', 'Conferences', 'Bitmaps beat arrays, use HTTPS, merge instead of rebase, and keep submodules one level deep.'],
  ['WordCamp Miami 2013 Notes', 'March 23, 2013', 'Conferences', 'Storytelling in web design, WordPress performance on the stack, and a freelance primer.'],
  ['An Open Sourced Life', 'December 9, 2012', '', 'If this is your first time here, this is my personal site. I found my passion for Computer Science in these past few years.'],
  ['Hello world!', 'November 14, 2012', '', 'You had me at hello world!'],
];
const notes = `
      <div style="max-width: 620px; display: flex; flex-direction: column; gap: 12px;">
        <h1 style="margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 36px; font-weight: 600; line-height: 1.15; letter-spacing: -0.028em;">Notes</h1>
        <p style="margin: 0; font-family: 'IBM Plex Sans', sans-serif; font-size: 17px; line-height: 1.7; color: ${MUTED};">Conference notes, a server rebuild, and a couple of posts from a long time ago.</p>
      </div>

      <div style="max-width: 620px; display: flex; flex-direction: column; padding-top: 44px;">
${posts.map((p, i) => `        <a href="#" style="display: flex; flex-direction: column; gap: 8px; padding: 24px 0; border-top: 1px solid ${RULE};${i === posts.length - 1 ? ` border-bottom: 1px solid ${RULE};` : ''} color: ${INK};">
          <div style="display: flex; align-items: baseline; gap: 12px;">
            <span style="font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; color: #97A2A0;">${p[1]}</span>
${p[2] ? `            <span style="font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: ${ACC};">${p[2]}</span>` : ''}
          </div>
          <span style="font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 500; line-height: 1.3; letter-spacing: -0.018em;">${p[0]}</span>
          <span style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; line-height: 1.65; color: ${MUTED}; text-wrap: pretty;">${p[3]}</span>
        </a>`).join('\n')}
      </div>`;

/* ---- Speaking ---- */
const speaking = `
      <div style="max-width: 620px; display: flex; flex-direction: column; gap: 12px;">
        <h1 style="margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 36px; font-weight: 600; line-height: 1.15; letter-spacing: -0.028em;">Speaking</h1>
        <p style="margin: 0; font-family: 'IBM Plex Sans', sans-serif; font-size: 17px; line-height: 1.7; color: ${MUTED};">Twenty-four talks at WordCamps, BarCamps and meetups between 2012 and 2018.</p>
      </div>

      <div style="max-width: 660px; display: flex; flex-direction: column; gap: 34px; padding-top: 44px;">
${years.map(y => `        <div style="display: grid; grid-template-columns: 72px minmax(0, 1fr); gap: 0 24px;">
          <div style="font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; letter-spacing: -0.03em; color: #C7D1CF; line-height: 1.5;">${y}</div>
          <div style="display: flex; flex-direction: column;">
${talks.filter(t => t.year === y).map((t, i) => `            <div style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 16px; align-items: baseline; padding: 11px 0;${i === 0 ? '' : ` border-top: 1px solid ${RULE};`}">
              <div style="font-family: 'IBM Plex Sans', sans-serif; font-size: 17px;"><a href="#" class="u">${t.event}</a>${t.extras.map(e => ` <a href="#" style="font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #97A2A0;">${e.label}</a>`).join('')}</div>
              <div style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #97A2A0; white-space: nowrap;">${t.date}</div>
            </div>`).join('\n')}
          </div>
        </div>`).join('\n')}
      </div>`;

/* ---- Contact ---- */
const field = (label, tall, focused) => `
        <label style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: ${MUTED};">${label}</span>
          <span style="display: block; border: 1px solid ${focused ? ACC : RULE}; ${focused ? `box-shadow: 0 0 0 3px rgba(28, 110, 126, 0.12); ` : ''}background: #FFFFFF; min-height: ${tall ? 132 : 48}px; padding: 13px 15px; font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #A9B2B0;">${focused ? '<span style="border-left: 1.5px solid ' + ACC + '; padding-left: 1px;"></span>' : '&nbsp;'}</span>
        </label>`;

const contact = `
      <div style="max-width: 560px; display: flex; flex-direction: column; gap: 12px;">
        <h1 style="margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 36px; font-weight: 600; line-height: 1.15; letter-spacing: -0.028em;">You know what to do!</h1>
        <p style="margin: 0; font-family: 'IBM Plex Sans', sans-serif; font-size: 17px; line-height: 1.7; color: ${MUTED};">Write below and it lands in my inbox. I read everything.</p>
      </div>

      <div style="max-width: 560px; display: flex; flex-direction: column; gap: 22px; padding-top: 40px;">
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px;">
${field('Name', false, true)}
${field('Email', false, false)}
        </div>
${field('Message', true, false)}
        <div style="display: flex; align-items: center; gap: 18px; padding-top: 6px;">
          <a href="#" style="display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 28px; background: ${ACC}; color: #FFFFFF; font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 500;">Send message</a>
          <span style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #97A2A0;">Usually a reply within a day or two.</span>
        </div>
      </div>`;

writeFileSync(`${DIR}/StandingRailHome.dc.html`, page('About', 900, home));
writeFileSync(`${DIR}/StandingRailNotes.dc.html`, page('Notes', 1080, notes));
writeFileSync(`${DIR}/StandingRailSpeaking.dc.html`, page('Speaking', 1560, speaking));
writeFileSync(`${DIR}/StandingRailContact.dc.html`, page('Contact', 900, contact));
console.log('wrote 4 StandingRail artboards');
