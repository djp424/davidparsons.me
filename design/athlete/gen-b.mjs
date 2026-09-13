// Direction B — Contour. Warm sandstone, pine + rust, topographic texture, ledger rows.
import { artboard, esc, byYear, glyph } from "./shell.mjs";
import { races, stats, week, climbing, gear, nextUp, nav } from "./data.mjs";

const C = {
  page: "#F5F1E8", card: "#FBF9F3", tint: "#EDE7D9",
  ink: "#201E19", body: "#443F36", muted: "#7A7263", faint: "#9A9382",
  rule: "#DED7C6", hair: "#C9C0AB",
  pine: "#2F5D50", rust: "#A6552F",
};

const FONTS = "https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=IBM+Plex+Mono:wght@400;500&display=swap";

const STYLE = `    body { margin: 0; background: ${C.page}; }
    a { color: ${C.ink}; text-decoration: none; }
    a:hover { color: ${C.pine}; }
    .disp { font-family: 'Archivo Narrow', 'Arial Narrow', sans-serif; font-weight: 700; letter-spacing: 0.01em; }
    .mono { font-family: 'IBM Plex Mono', ui-monospace, Menlo, monospace; }
    .lbl { font-family: 'Archivo Narrow', 'Arial Narrow', sans-serif; font-weight: 600; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: ${C.muted}; }
    .row:hover { background: ${C.card}; }`;

const ROOT = (h, inner) =>
  `<div style="width: 1280px; min-height: ${h}px; background: ${C.page}; font-family: Newsreader, Georgia, serif; color: ${C.ink}; display: flex; flex-direction: column;">
${inner}
</div>`;

const header = () => `  <header style="display: flex; justify-content: space-between; align-items: baseline; gap: 40px; padding: 28px 80px 18px; border-bottom: 2px solid ${C.ink};">
    <a href="#" class="disp" style="font-size: 15px; letter-spacing: 0.2em; text-transform: uppercase; color: ${C.ink};">David Parsons</a>
    <nav style="display: flex; gap: 28px;">
${nav.map((n) => `      <a href="#" class="disp" style="font-size: 13px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: ${n.current ? C.pine : C.muted}; ${n.current ? `border-bottom: 2px solid ${C.pine}; padding-bottom: 2px;` : ""}">${n.label}</a>`).join("\n")}
    </nav>
  </header>`;

const footer = () => `  <footer style="margin-top: auto; display: flex; justify-content: space-between; align-items: baseline; gap: 24px; padding: 26px 80px; border-top: 1px solid ${C.hair};">
    <span class="mono" style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${C.faint};">40.0150&deg; N, 105.2705&deg; W &middot; Boulder</span>
    <div style="display: flex; gap: 24px;">
      <a href="#" class="mono" style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${C.muted};">Strava</a>
      <a href="#" class="mono" style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${C.muted};">Mountain Project</a>
      <a href="#" class="mono" style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${C.muted};">Back to the writing &rarr;</a>
    </div>
  </footer>`;

// Nested contour rings, faint, behind the masthead.
const contours = (h) => {
  const rings = [];
  for (let i = 0; i < 9; i++) {
    const k = i * 26;
    rings.push(`<path d="M${-60 - k} ${h - 40 + k * 0.12} C ${200 - k * 0.4} ${h - 190 - k}, ${520 + k * 0.3} ${h + 70 + k * 0.5}, ${820 + k * 0.2} ${h - 130 - k * 0.8} S ${1180 + k * 0.4} ${h - 260 - k * 0.6}, ${1400 + k} ${h - 90 - k * 0.4}" fill="none" stroke="${C.hair}" stroke-width="${i % 4 === 0 ? 1.5 : 1}" opacity="${i % 4 === 0 ? 0.85 : 0.5}"/>`);
  }
  return `<svg viewBox="0 0 1280 ${h}" preserveAspectRatio="none" style="position: absolute; inset: 0; width: 100%; height: 100%; display: block;" aria-hidden="true">${rings.join("")}</svg>`;
};

const masthead = () => `  <section style="position: relative; overflow: hidden; border-bottom: 1px solid ${C.hair};">
    ${contours(400)}
    <div style="position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 48px; align-items: end; padding: 62px 80px 54px;">
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <span class="lbl" style="color: ${C.rust};">Field log &middot; Boulder, Colorado</span>
        <h1 class="disp" style="margin: 0; font-size: 74px; line-height: 0.96; text-transform: uppercase; letter-spacing: -0.005em;">Skis, shoes<br>and a rope</h1>
        <p style="margin: 0; max-width: 560px; font-size: 20px; line-height: 1.62; color: ${C.body}; text-wrap: pretty;">An amateur&rsquo;s logbook. Skimo from December to April, trail races through the summer, rock in between. Twenty finishes since 2024, all of them written down.</p>
      </div>
      <div style="height: 240px; border: 1px dashed ${C.hair}; background: ${C.tint}; display: flex; align-items: center; justify-content: center;">
        <span class="mono" style="font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.faint}; text-align: center;">[ Portrait or<br>action shot ]</span>
      </div>
    </div>
  </section>`;

const statBand = () => `  <section style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-bottom: 1px solid ${C.hair}; background: ${C.card};">
${stats.map((s, i) => `    <div style="display: flex; align-items: baseline; gap: 12px; padding: 22px 30px; ${i ? `border-left: 1px solid ${C.rule};` : ""} ${i === 0 ? "padding-left: 80px;" : ""}">
      <span class="disp" style="font-size: 34px; color: ${C.pine};">${s.n}</span>
      <span class="lbl" style="font-size: 11px;">${s.label}</span>
    </div>`).join("\n")}
  </section>`;

// Deterministic elevation profile from the race's vertical gain.
const spark = (vert, seed, w = 76, h = 22) => {
  const feet = Number(String(vert).replace(/[^0-9]/g, "")) || 1000;
  const amp = Math.min(1, feet / 10500);
  const pts = [];
  let s = seed * 9301 + 49297;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const shape = Math.sin(t * Math.PI) * 0.72 + Math.sin(t * Math.PI * 2.6) * 0.2;
    const y = h - 2 - (shape + rand() * 0.18) * amp * (h - 5);
    pts.push(`${(t * w).toFixed(1)} ${Math.max(1.5, Math.min(h - 1.5, y)).toFixed(1)}`);
  }
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" aria-hidden="true"><polyline points="${pts.join(" ")}" stroke="${C.pine}" stroke-width="1.3" stroke-linejoin="round" opacity="0.85"/><line x1="0" y1="${h - 1}" x2="${w}" y2="${h - 1}" stroke="${C.rule}" stroke-width="1"/></svg>`;
};

const weekLedger = () => `  <section style="padding: 52px 80px 0;">
    <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid ${C.ink}; padding-bottom: 10px;">
      <h2 class="disp" style="margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 0.06em;">This week</h2>
      <div style="display: flex; gap: 22px; align-items: baseline;">
${Object.entries(week.totals).map(([, v]) => `        <span class="mono" style="font-size: 13px; color: ${C.body};">${v}</span>`).join("\n")}
        <a href="#" class="lbl" style="font-size: 11px; color: ${C.rust};">Strava &rarr;</a>
      </div>
    </div>
${week.activities.map((a) => `    <div class="row" style="display: grid; grid-template-columns: 46px 24px minmax(0, 1fr) 88px 92px 82px; gap: 18px; align-items: center; padding: 13px 8px; border-bottom: 1px solid ${C.rule};">
      <span class="mono" style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${C.faint};">${a.day}</span>
      ${glyph(a.sport, C.pine, 17)}
      <span style="font-size: 18px;">${esc(a.name)}</span>
      <span class="mono" style="font-size: 13px; color: ${C.body}; text-align: right;">${a.dist}</span>
      <span class="mono" style="font-size: 13px; color: ${C.body}; text-align: right;">${a.vert}</span>
      <span class="mono" style="font-size: 13px; color: ${C.muted}; text-align: right;">${a.time}</span>
    </div>`).join("\n")}
    <p class="mono" style="margin: 9px 0 0; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${C.faint};">[ Sample data &mdash; live Strava feed to be wired ]</p>
  </section>`;

const LGRID = "96px 24px minmax(0, 1fr) 76px 76px 84px 92px 92px";

const ledgerHead = () => `    <div style="display: grid; grid-template-columns: ${LGRID}; gap: 16px; padding: 0 8px 9px; border-bottom: 2px solid ${C.ink};">
${["Date", "", "Event", "Profile", "Dist", "Vert", "Time", "Place"].map((h, i) => `      <span class="lbl" style="font-size: 10px; letter-spacing: 0.14em; ${i >= 4 ? "text-align: right;" : ""}">${h}</span>`).join("\n")}
    </div>`;

const ledgerRow = (r, i) => `    <div class="row" style="display: grid; grid-template-columns: ${LGRID}; gap: 16px; align-items: center; padding: 12px 8px; border-bottom: 1px solid ${C.rule};">
      <span class="mono" style="font-size: 12px; color: ${C.faint};">${r.date}</span>
      ${glyph(r.sport, C.muted, 17)}
      <span style="display: flex; flex-direction: column; gap: 1px;"><a href="#" style="font-size: 18px;">${esc(r.event)}</a><span class="mono" style="font-size: 11px; color: ${C.faint};">${esc(r.loc)}</span></span>
      ${spark(r.vert, i + 3)}
      <span class="mono" style="font-size: 13px; color: ${C.body}; text-align: right;">${r.dist}</span>
      <span class="mono" style="font-size: 13px; color: ${C.body}; text-align: right;">${r.vert}</span>
      <span class="mono" style="font-size: 13px; color: ${C.ink}; text-align: right;">${r.time}</span>
      <span class="mono" style="font-size: 12px; text-align: right; color: ${r.podium ? C.rust : C.muted};">${r.place}</span>
    </div>`;

const recent = () => `  <section style="padding: 50px 80px 0;">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
      <h2 class="disp" style="margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 0.06em;">Latest results</h2>
      <a href="#" class="lbl" style="font-size: 11px; color: ${C.rust};">All 20 races &rarr;</a>
    </div>
${ledgerHead()}
${races.slice(0, 5).map(ledgerRow).join("\n")}
  </section>`;

const panel = (label, title, lines, cta) => `    <div style="background: ${C.card}; border: 1px solid ${C.rule}; padding: 24px 24px 22px; display: flex; flex-direction: column; gap: 13px;">
      <span class="lbl" style="font-size: 11px; color: ${C.rust};">${label}</span>
      <h3 class="disp" style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 0.05em;">${title}</h3>
      <div style="display: flex; flex-direction: column; gap: 6px;">
${lines.map((l) => `        <div style="display: flex; justify-content: space-between; gap: 14px; font-size: 16px; color: ${C.body};"><span>${esc(l[0])}</span><span class="mono" style="font-size: 12px; color: ${C.muted}; white-space: nowrap;">${esc(l[1])}</span></div>`).join("\n")}
      </div>
      <a href="#" class="lbl" style="margin-top: 3px; font-size: 11px; color: ${C.pine};">${cta} &rarr;</a>
    </div>`;

const panels = () => `  <section style="padding: 48px 80px 56px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px;">
${panel("Rock", "Climbing", climbing.bests.map((b) => [b.label, b.value]), "Ticklist")}
${panel("Kit", "What I race on", gear.slice(0, 3).map((g) => [g.cat, g.item]), "Full setup")}
${panel("Ahead", "What's next", nextUp.slice(0, 3).map((n) => [n.what, n.when]), "Season goals")}
  </section>`;

artboard("ContourLanding.dc.html", {
  fonts: FONTS, style: STYLE,
  body: ROOT(1720, [header(), masthead(), statBand(), weekLedger(), recent(), panels(), footer()].join("\n")),
});

// ---- Races -----------------------------------------------------------------

const CHIPS = ["All", "Skimo", "Trail", "Bike", "Road"];

const racesHead = () => `  <section style="position: relative; overflow: hidden; border-bottom: 1px solid ${C.hair};">
    ${contours(300)}
    <div style="position: relative; padding: 56px 80px 44px;">
      <span class="lbl" style="color: ${C.rust};">The log &middot; 2024&ndash;2026</span>
      <h1 class="disp" style="margin: 12px 0 0; font-size: 66px; line-height: 0.98; text-transform: uppercase;">Race results</h1>
      <p style="margin: 16px 0 0; max-width: 620px; font-size: 20px; line-height: 1.6; color: ${C.body}; text-wrap: pretty;">Every race I have finished, kept mostly so I can find it later. Mid-pack is the honest word for most of it.</p>
      <div style="display: flex; gap: 9px; margin-top: 26px;">
${CHIPS.map((c, i) => `        <span class="lbl" style="font-size: 11px; padding: 7px 14px; border: 1px solid ${i === 0 ? C.pine : C.hair}; color: ${i === 0 ? C.card : C.muted}; background: ${i === 0 ? C.pine : "transparent"};">${c}</span>`).join("\n")}
      </div>
    </div>
  </section>`;

const ledger = () => `  <section style="padding: 40px 80px 60px;">
${ledgerHead()}
${byYear(races).map((g) => `    <div style="display: flex; align-items: baseline; gap: 14px; padding: 26px 8px 10px;">
      <span class="disp" style="font-size: 30px; color: ${C.rust};">${g.year}</span>
      <span class="lbl" style="font-size: 11px;">${g.races.length} races</span>
      <span style="flex-grow: 1; height: 1px; background: ${C.hair};"></span>
    </div>
${g.races.map(ledgerRow).join("\n")}`).join("\n")}
  </section>`;

artboard("ContourRaces.dc.html", {
  fonts: FONTS, style: STYLE,
  body: ROOT(2090, [header(), racesHead(), ledger(), footer()].join("\n")),
});

// ---- Training & gear -------------------------------------------------------

const block = (label, title, inner) => `  <section style="padding: 48px 80px 0;">
    <div style="display: flex; align-items: baseline; gap: 14px; border-bottom: 2px solid ${C.ink}; padding-bottom: 10px; margin-bottom: 20px;">
      <h2 class="disp" style="margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 0.06em;">${title}</h2>
      <span class="lbl" style="font-size: 11px; color: ${C.rust};">${label}</span>
    </div>
${inner}
  </section>`;

const climbBlock = () => block("Rock", "Climbing", `    <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-bottom: 24px;">
${climbing.bests.map((b) => `      <div style="background: ${C.card}; border: 1px solid ${C.rule}; padding: 20px 22px; display: flex; align-items: baseline; gap: 12px;">
        <span class="disp" style="font-size: 36px; color: ${C.pine};">${b.value}</span>
        <span class="lbl" style="font-size: 11px;">${b.label}</span>
      </div>`).join("\n")}
    </div>
    <div style="display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 34px;">
      <div style="display: flex; flex-direction: column;">
        <span class="lbl" style="font-size: 11px; padding-bottom: 10px; border-bottom: 1px solid ${C.hair};">Sends worth remembering</span>
${climbing.sends.map((s) => `        <div class="row" style="display: grid; grid-template-columns: minmax(0, 1fr) 60px 180px 48px; gap: 14px; align-items: baseline; padding: 12px 8px; border-bottom: 1px solid ${C.rule};">
          <span style="font-size: 18px;">${esc(s.route)}</span>
          <span class="mono" style="font-size: 13px; color: ${C.rust};">${s.grade}</span>
          <span class="mono" style="font-size: 12px; color: ${C.muted};">${esc(s.crag)}</span>
          <span class="mono" style="font-size: 12px; color: ${C.faint}; text-align: right;">${s.year}</span>
        </div>`).join("\n")}
      </div>
      <div style="display: flex; flex-direction: column; gap: 11px;">
        <span class="lbl" style="font-size: 11px;">Home crags</span>
        <div style="display: flex; flex-wrap: wrap; gap: 7px;">
${climbing.crags.map((c) => `          <span class="mono" style="font-size: 12px; padding: 6px 11px; border: 1px solid ${C.hair}; background: ${C.card}; color: ${C.body};">${esc(c)}</span>`).join("\n")}
        </div>
        <div style="margin-top: 6px; height: 150px; border: 1px dashed ${C.hair}; background: ${C.tint}; display: flex; align-items: center; justify-content: center;">
          <span class="mono" style="font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.faint};">[ Climbing photo ]</span>
        </div>
      </div>
    </div>`);

const gearBlock = () => block("Kit", "Gear", `    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 44px;">
${gear.map((g) => `      <div class="row" style="display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 16px; align-items: baseline; padding: 12px 8px; border-bottom: 1px solid ${C.rule};">
        <span class="lbl" style="font-size: 10px;">${g.cat}</span>
        <span style="font-size: 18px; color: ${C.body};">${esc(g.item)}</span>
      </div>`).join("\n")}
    </div>`);

const nextBlock = () => block("Ahead", "What's next", `    <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px;">
${nextUp.map((n) => `      <div style="background: ${C.card}; border: 1px solid ${C.rule}; border-top: 3px solid ${C.pine}; padding: 18px 20px; display: flex; flex-direction: column; gap: 6px;">
        <span class="lbl" style="font-size: 10px; color: ${C.rust};">${n.when}</span>
        <span style="font-size: 21px;">${esc(n.what)}</span>
        <span class="mono" style="font-size: 12px; color: ${C.muted};">${esc(n.goal)}</span>
      </div>`).join("\n")}
    </div>`);

artboard("ContourTraining.dc.html", {
  fonts: FONTS, style: STYLE,
  body: ROOT(1560, [header(),
    `  <section style="position: relative; overflow: hidden; border-bottom: 1px solid ${C.hair};">${contours(240)}<div style="position: relative; padding: 52px 80px 40px;"><span class="lbl" style="color: ${C.rust};">Off the clock</span><h1 class="disp" style="margin: 12px 0 0; font-size: 66px; line-height: 0.98; text-transform: uppercase;">Training &amp; gear</h1></div></section>`,
    climbBlock(), gearBlock(), nextBlock(),
    `  <div style="height: 56px;"></div>`, footer()].join("\n")),
});

console.log("B: ContourLanding.dc.html, ContourRaces.dc.html, ContourTraining.dc.html");
