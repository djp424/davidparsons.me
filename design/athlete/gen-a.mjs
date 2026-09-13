// Direction A — Alpenglow. Night granite, one alpenglow accent, race-bib display type.
import { artboard, esc, byYear, glyph } from "./shell.mjs";
import { races, stats, week, climbing, gear, nextUp, nav } from "./data.mjs";

const C = {
  page: "#0E1012", panel: "#14181B", panel2: "#191E22", hair: "#262C30",
  text: "#F4F2EE", body: "#B9BFC2", muted: "#7D858A", faint: "#596166",
  accent: "#FF6B3D", soft: "rgba(255,107,61,0.13)",
};

const FONTS = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";

const STYLE = `    body { margin: 0; background: ${C.page}; }
    a { color: ${C.text}; text-decoration: none; }
    a:hover { color: ${C.accent}; }
    .disp { font-family: 'Bebas Neue', Impact, 'Haettenschweiler', sans-serif; font-weight: 400; letter-spacing: 0.015em; }
    .mono { font-family: 'IBM Plex Mono', ui-monospace, Menlo, monospace; }
    .lbl { font-family: 'IBM Plex Mono', ui-monospace, Menlo, monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: ${C.muted}; }
    .row:hover { background: ${C.panel2}; }`;

const ROOT = (h, inner) =>
  `<div style="width: 1280px; min-height: ${h}px; background: ${C.page}; font-family: Barlow, 'Helvetica Neue', sans-serif; color: ${C.text}; display: flex; flex-direction: column;">
${inner}
</div>`;

const header = () => `  <header style="display: flex; justify-content: space-between; align-items: center; gap: 40px; padding: 26px 80px; border-bottom: 1px solid ${C.hair};">
    <a href="#" class="mono" style="font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: ${C.text};">David Parsons</a>
    <nav style="display: flex; gap: 30px;">
${nav.map((n) => `      <a href="#" class="mono" style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: ${n.current ? C.accent : C.muted}; ${n.current ? `border-bottom: 1px solid ${C.accent}; padding-bottom: 3px;` : ""}">${n.label}</a>`).join("\n")}
    </nav>
  </header>`;

const footer = () => `  <footer style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 30px 80px; border-top: 1px solid ${C.hair};">
    <span class="mono" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.faint};">Boulder, Colorado</span>
    <div style="display: flex; gap: 26px;">
      <a href="#" class="mono" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.muted};">Strava</a>
      <a href="#" class="mono" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.muted};">Mountain Project</a>
      <a href="#" class="mono" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.muted};">Back to the writing &rarr;</a>
    </div>
  </footer>`;

// Layered ridge silhouette standing in for the hero photograph.
const ridge = () => `<svg viewBox="0 0 1280 480" preserveAspectRatio="none" style="position: absolute; inset: 0; width: 100%; height: 100%; display: block;" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1B1418"/><stop offset="46%" stop-color="#14161A"/><stop offset="100%" stop-color="${C.page}"/>
        </linearGradient>
        <radialGradient id="glow" cx="0.72" cy="0.52" r="0.5">
          <stop offset="0%" stop-color="#FF6B3D" stop-opacity="0.30"/><stop offset="100%" stop-color="#FF6B3D" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1280" height="480" fill="url(#sky)"/>
      <rect width="1280" height="480" fill="url(#glow)"/>
      <path d="M0 372 L182 250 L286 306 L438 186 L556 268 L690 156 L838 258 L968 200 L1112 288 L1280 214 L1280 480 L0 480 Z" fill="#1A2024" opacity="0.9"/>
      <path d="M0 424 L150 344 L300 396 L470 300 L628 372 L790 292 L946 358 L1108 306 L1280 372 L1280 480 L0 480 Z" fill="#12171A"/>
      <path d="M0 462 L220 414 L432 452 L662 400 L900 448 L1120 412 L1280 444 L1280 480 L0 480 Z" fill="${C.page}"/>
    </svg>`;

const hero = () => `  <section style="position: relative; width: 1280px; height: 480px; overflow: hidden;">
    ${ridge()}
    <span class="mono" style="position: absolute; top: 22px; right: 80px; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.faint}; border: 1px dashed ${C.hair}; padding: 5px 9px;">[ Hero photo &mdash; 2400 &times; 1200 ]</span>
    <div style="position: absolute; left: 80px; right: 80px; bottom: 56px; display: flex; flex-direction: column; gap: 18px;">
      <span class="mono" style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: ${C.accent};">Amateur &middot; Boulder, Colorado</span>
      <h1 class="disp" style="margin: 0; font-size: 104px; line-height: 0.88; color: ${C.text};">Not a pro.<br>Still counting.</h1>
      <p style="margin: 0; max-width: 620px; font-size: 18px; line-height: 1.6; color: ${C.body}; text-wrap: pretty;">Skimo through the winter, trail races all summer, and rock whenever the Flatirons are dry. Twenty races logged since 2024 &mdash; every one of them is on this page.</p>
    </div>
  </section>`;

const statBand = () => `  <section style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-bottom: 1px solid ${C.hair};">
${stats.map((s, i) => `    <div style="padding: 30px 32px 32px; ${i ? `border-left: 1px solid ${C.hair};` : ""} ${i === 0 ? "padding-left: 80px;" : ""} ${i === 3 ? "padding-right: 80px;" : ""}">
      <div class="disp" style="font-size: 54px; line-height: 1; color: ${C.accent};">${s.n}</div>
      <div class="lbl" style="margin-top: 8px;">${s.label}</div>
    </div>`).join("\n")}
  </section>`;

const stravaPanel = () => `  <section style="padding: 56px 80px 0;">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 18px;">
      <h2 class="disp" style="margin: 0; font-size: 34px; letter-spacing: 0.03em;">This week</h2>
      <div style="display: flex; gap: 26px; align-items: baseline;">
${Object.entries(week.totals).map(([, v]) => `        <span class="mono" style="font-size: 13px; color: ${C.body};">${v}</span>`).join("\n")}
        <a href="#" class="mono" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.accent};">On Strava &rarr;</a>
      </div>
    </div>
    <div style="border: 1px solid ${C.hair}; background: ${C.panel}; display: flex; flex-direction: column;">
${week.activities.map((a, i) => `      <div class="row" style="display: grid; grid-template-columns: 52px 26px minmax(0, 1fr) 92px 96px 84px; align-items: center; gap: 18px; padding: 16px 22px; ${i ? `border-top: 1px solid ${C.hair};` : ""}">
        <span class="mono" style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${C.faint};">${a.day}</span>
        ${glyph(a.sport, C.accent, 18)}
        <span style="font-size: 16px; color: ${C.text};">${esc(a.name)}</span>
        <span class="mono" style="font-size: 13px; color: ${C.body}; text-align: right;">${a.dist}</span>
        <span class="mono" style="font-size: 13px; color: ${C.body}; text-align: right;">${a.vert}</span>
        <span class="mono" style="font-size: 13px; color: ${C.muted}; text-align: right;">${a.time}</span>
      </div>`).join("\n")}
    </div>
    <p class="mono" style="margin: 10px 0 0; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${C.faint};">[ Sample data &mdash; live Strava feed to be wired ]</p>
  </section>`;

const recent = () => `  <section style="padding: 52px 80px 0;">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 18px;">
      <h2 class="disp" style="margin: 0; font-size: 34px; letter-spacing: 0.03em;">Latest results</h2>
      <a href="#" class="mono" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.accent};">All 20 races &rarr;</a>
    </div>
    <div style="display: flex; flex-direction: column;">
${races.slice(0, 5).map((r) => `      <div class="row" style="display: grid; grid-template-columns: 108px 26px minmax(0, 1fr) 92px 96px 100px 104px; align-items: center; gap: 18px; padding: 15px 12px; border-top: 1px solid ${C.hair};">
        <span class="mono" style="font-size: 12px; color: ${C.faint};">${r.date}</span>
        ${glyph(r.sport, C.muted, 18)}
        <span style="font-size: 17px; color: ${C.text};">${esc(r.event)}</span>
        <span class="mono" style="font-size: 13px; color: ${C.body}; text-align: right;">${r.dist}</span>
        <span class="mono" style="font-size: 13px; color: ${C.body}; text-align: right;">${r.vert}</span>
        <span class="mono" style="font-size: 13px; color: ${C.text}; text-align: right;">${r.time}</span>
        <span class="mono" style="font-size: 12px; text-align: right; color: ${r.podium ? C.accent : C.muted};">${r.place}</span>
      </div>`).join("\n")}
      <div style="border-top: 1px solid ${C.hair};"></div>
    </div>
  </section>`;

const card = (label, title, lines, cta) => `    <div style="background: ${C.panel}; border: 1px solid ${C.hair}; padding: 26px 24px 24px; display: flex; flex-direction: column; gap: 14px;">
      <span class="lbl">${label}</span>
      <h3 class="disp" style="margin: 0; font-size: 28px; letter-spacing: 0.03em; color: ${C.text};">${title}</h3>
      <div style="display: flex; flex-direction: column; gap: 7px;">
${lines.map((l) => `        <div style="display: flex; justify-content: space-between; gap: 14px; font-size: 14px; color: ${C.body};"><span>${esc(l[0])}</span><span class="mono" style="color: ${C.muted}; white-space: nowrap;">${esc(l[1])}</span></div>`).join("\n")}
      </div>
      <a href="#" class="mono" style="margin-top: 4px; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.accent};">${cta} &rarr;</a>
    </div>`;

const cards = () => `  <section style="padding: 52px 80px 60px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px;">
${card("Rock", "Climbing", climbing.bests.map((b) => [b.label, b.value]), "Ticklist")}
${card("Kit", "What I race on", gear.slice(0, 3).map((g) => [g.cat, g.item]), "Full setup")}
${card("Ahead", "What's next", nextUp.slice(0, 3).map((n) => [n.what, n.when]), "Season goals")}
  </section>`;

artboard("Main.dc.html", {
  fonts: FONTS, style: STYLE,
  body: ROOT(1900, [header(), hero(), statBand(), stravaPanel(), recent(), cards(), footer()].join("\n")),
});

// ---- Races -----------------------------------------------------------------

const CHIPS = ["All", "Skimo", "Trail", "Bike", "Road"];

const racesHead = () => `  <section style="padding: 62px 80px 0;">
    <span class="lbl">The log</span>
    <h1 class="disp" style="margin: 12px 0 0; font-size: 88px; line-height: 0.9;">Race results</h1>
    <p style="margin: 18px 0 0; max-width: 640px; font-size: 18px; line-height: 1.6; color: ${C.body}; text-wrap: pretty;">Every race I have finished, oldest to newest, kept mostly so I can find it later. Mid-pack is the honest word for most of it.</p>
    <div style="display: flex; gap: 10px; margin-top: 30px;">
${CHIPS.map((c, i) => `      <span class="mono" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 8px 15px; border: 1px solid ${i === 0 ? C.accent : C.hair}; color: ${i === 0 ? C.accent : C.muted}; background: ${i === 0 ? C.soft : "transparent"};">${c}</span>`).join("\n")}
    </div>
  </section>`;

const GRID = "104px 26px minmax(0, 1fr) 84px 92px 96px 100px 96px";

const table = () => `  <section style="padding: 44px 80px 64px;">
    <div style="display: grid; grid-template-columns: ${GRID}; gap: 18px; padding: 0 12px 12px; border-bottom: 1px solid ${C.hair};">
${["Date", "", "Event", "Dist", "Vert", "Time", "Place", "Note"].map((h, i) => `      <span class="lbl" style="font-size: 10px; ${i >= 3 && i <= 6 ? "text-align: right;" : ""}">${h}</span>`).join("\n")}
    </div>
${byYear(races).map((g) => `    <div style="display: flex; align-items: baseline; gap: 18px; padding: 30px 12px 12px;">
      <span class="disp" style="font-size: 40px; line-height: 1; color: ${C.accent};">${g.year}</span>
      <span class="mono" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.faint};">${g.races.length} races</span>
      <span style="flex-grow: 1; height: 1px; background: ${C.hair};"></span>
    </div>
${g.races.map((r) => `    <div class="row" style="display: grid; grid-template-columns: ${GRID}; gap: 18px; align-items: center; padding: 14px 12px; border-top: 1px solid ${C.hair};">
      <span class="mono" style="font-size: 12px; color: ${C.faint};">${r.date}</span>
      ${glyph(r.sport, C.muted, 18)}
      <span style="display: flex; flex-direction: column; gap: 2px;"><a href="#" style="font-size: 17px; color: ${C.text};">${esc(r.event)}</a><span class="mono" style="font-size: 11px; color: ${C.faint};">${esc(r.loc)}</span></span>
      <span class="mono" style="font-size: 13px; color: ${C.body}; text-align: right;">${r.dist}</span>
      <span class="mono" style="font-size: 13px; color: ${C.body}; text-align: right;">${r.vert}</span>
      <span class="mono" style="font-size: 13px; color: ${C.text}; text-align: right;">${r.time}</span>
      <span class="mono" style="font-size: 12px; color: ${r.podium ? C.accent : C.muted}; text-align: right;">${r.place}</span>
      <span class="mono" style="font-size: 11px; color: ${r.podium ? C.accent : C.faint};">${esc(r.note)}</span>
    </div>`).join("\n")}`).join("\n")}
    <div style="border-top: 1px solid ${C.hair};"></div>
  </section>`;

artboard("AlpenglowRaces.dc.html", {
  fonts: FONTS, style: STYLE,
  body: ROOT(2260, [header(), racesHead(), table(), footer()].join("\n")),
});

// ---- Training & gear -------------------------------------------------------

const block = (label, title, inner) => `  <section style="padding: 54px 80px 0;">
    <div style="display: flex; align-items: baseline; gap: 16px; margin-bottom: 22px;">
      <h2 class="disp" style="margin: 0; font-size: 38px; letter-spacing: 0.03em;">${title}</h2>
      <span class="lbl">${label}</span>
      <span style="flex-grow: 1; height: 1px; background: ${C.hair};"></span>
    </div>
${inner}
  </section>`;

const climbBlock = () => block("Rock", "Climbing", `    <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; margin-bottom: 26px;">
${climbing.bests.map((b) => `      <div style="background: ${C.panel}; border: 1px solid ${C.hair}; padding: 22px 24px;">
        <div class="disp" style="font-size: 46px; line-height: 1; color: ${C.accent};">${b.value}</div>
        <div class="lbl" style="margin-top: 6px;">${b.label}</div>
      </div>`).join("\n")}
    </div>
    <div style="display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 34px;">
      <div style="display: flex; flex-direction: column;">
        <span class="lbl" style="padding-bottom: 12px;">Sends worth remembering</span>
${climbing.sends.map((s) => `        <div class="row" style="display: grid; grid-template-columns: minmax(0, 1fr) 64px 180px 52px; gap: 16px; align-items: baseline; padding: 13px 10px; border-top: 1px solid ${C.hair};">
          <span style="font-size: 16px;">${esc(s.route)}</span>
          <span class="mono" style="font-size: 13px; color: ${C.accent};">${s.grade}</span>
          <span class="mono" style="font-size: 12px; color: ${C.muted};">${esc(s.crag)}</span>
          <span class="mono" style="font-size: 12px; color: ${C.faint}; text-align: right;">${s.year}</span>
        </div>`).join("\n")}
        <div style="border-top: 1px solid ${C.hair};"></div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <span class="lbl">Home crags</span>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
${climbing.crags.map((c) => `          <span class="mono" style="font-size: 12px; padding: 7px 12px; border: 1px solid ${C.hair}; color: ${C.body};">${esc(c)}</span>`).join("\n")}
        </div>
        <div style="margin-top: 8px; height: 148px; border: 1px dashed ${C.hair}; display: flex; align-items: center; justify-content: center;">
          <span class="mono" style="font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.faint};">[ Climbing photo &mdash; 1200 &times; 900 ]</span>
        </div>
      </div>
    </div>`);

const gearBlock = () => block("Kit", "Gear", `    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 44px;">
${gear.map((g) => `      <div class="row" style="display: grid; grid-template-columns: 116px minmax(0, 1fr); gap: 18px; align-items: baseline; padding: 13px 10px; border-top: 1px solid ${C.hair};">
        <span class="lbl" style="font-size: 10px;">${g.cat}</span>
        <span style="font-size: 16px; color: ${C.body};">${esc(g.item)}</span>
      </div>`).join("\n")}
    </div>`);

const nextBlock = () => block("Ahead", "What's next", `    <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px;">
${nextUp.map((n) => `      <div style="background: ${C.panel}; border: 1px solid ${C.hair}; border-left: 2px solid ${C.accent}; padding: 20px 22px; display: flex; flex-direction: column; gap: 7px;">
        <span class="mono" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.accent};">${n.when}</span>
        <span style="font-size: 19px; color: ${C.text};">${esc(n.what)}</span>
        <span class="mono" style="font-size: 12px; color: ${C.muted};">${esc(n.goal)}</span>
      </div>`).join("\n")}
    </div>`);

artboard("AlpenglowTraining.dc.html", {
  fonts: FONTS, style: STYLE,
  body: ROOT(1720, [header(),
    `  <section style="padding: 62px 80px 0;"><span class="lbl">Off the clock</span><h1 class="disp" style="margin: 12px 0 0; font-size: 88px; line-height: 0.9;">Training &amp; gear</h1></section>`,
    climbBlock(), gearBlock(), nextBlock(),
    `  <div style="height: 60px;"></div>`, footer()].join("\n")),
});

console.log("A: Main.dc.html, AlpenglowRaces.dc.html, AlpenglowTraining.dc.html");
