// Direction C — Summit Log. The site's own paper/ink system, one degree warmer,
// with exactly one accent. Values lifted from app/globals.css and
// components/page-heading.tsx so it drops straight into the existing grid.
import { artboard, esc, byYear } from "./shell.mjs";
import { races, stats, week, climbing, gear, nextUp, nav } from "./data.mjs";

const C = {
  paper: "#FAF8F3",       // the site's #FAFAF8, one degree warmer
  ink: "#17191A", body: "#2E3230", muted: "#6B706E",
  faint: "#9A9E9B", fainter: "#A8ACA8", rule: "#E4E4E0", hair: "#C6C8C3",
  accent: "#B4573C",      // Flatirons rust — sport tags and hover only
};

const FONTS = "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=IBM+Plex+Mono:wght@400;500&display=swap";

const STYLE = `    body { margin: 0; background: ${C.paper}; }
    a { color: ${C.ink}; text-decoration: none; }
    a:hover { color: ${C.ink}; }
    .mono { font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace; }
    .lk { border-bottom: 1px solid ${C.hair}; padding-bottom: 1px; }
    .lk:hover { border-bottom-color: ${C.accent}; }
    .tag { font-family: 'IBM Plex Mono', ui-monospace, Menlo, monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.accent}; }`;

const ROOT = (h, inner) =>
  `<div style="width: 1280px; min-height: ${h}px; background: ${C.paper}; font-family: Newsreader, Georgia, 'Times New Roman', serif; color: ${C.ink}; display: flex; flex-direction: column;">
${inner}
</div>`;

const header = () => `  <header style="max-width: 720px; width: 100%; margin: 0 auto; padding: 44px 0 18px; display: flex; justify-content: space-between; align-items: baseline; gap: 24px; border-bottom: 1px solid ${C.rule};">
    <a href="#" class="mono" style="font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.ink};">David Parsons</a>
    <nav style="display: flex; gap: 26px;">
${nav.map((n) => `      <a href="#" class="mono" style="font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: ${n.current ? C.ink : C.muted}; ${n.current ? `border-bottom: 1px solid ${C.ink}; padding-bottom: 2px;` : ""}">${n.label}</a>`).join("\n")}
    </nav>
  </header>`;

const footer = () => `  <footer style="max-width: 720px; width: 100%; margin: auto auto 0; padding: 72px 0 56px;">
    <p style="margin: 0; font-size: 15px; line-height: 1.7; color: ${C.muted};">Everything here is on <a href="#" class="lk" style="color: ${C.body};">Strava</a> too, and the climbing on <a href="#" class="lk" style="color: ${C.body};">Mountain Project</a>. The writing lives back on <a href="#" class="lk" style="color: ${C.body};">the rest of the site</a>.</p>
  </footer>`;

const main = (inner) => `  <main style="max-width: 720px; width: 100%; margin: 0 auto; padding-top: 88px;">
${inner}
  </main>`;

// The Gutter primitive from components/page-heading.tsx.
const gutter = (label, inner, labelPad = "14px") => `    <div style="display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 0 24px;">
      <div class="mono" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.faint}; padding-top: ${labelPad};">${label}</div>
      <div>
${inner}
      </div>
    </div>`;

const pageHeading = (label, title, lede) => gutter(label, `        <div style="display: flex; flex-direction: column; gap: 10px;">
          <h1 style="margin: 0; font-size: 38px; line-height: 1.15; font-weight: 400; letter-spacing: -0.012em;">${title}</h1>
          <p style="margin: 0; font-size: 17px; line-height: 1.7; color: ${C.muted}; text-wrap: pretty;">${lede}</p>
        </div>`);

const meta = (r) => `<span class="tag">${r.sport}</span><span style="color: ${C.fainter};"> &middot; </span>${r.dist}<span style="color: ${C.fainter};"> &middot; </span>${r.vert}<span style="color: ${C.fainter};"> &middot; </span>${r.time}<span style="color: ${C.fainter};"> &middot; </span>${r.place}${r.note ? `<span style="color: ${C.fainter};"> &middot; </span><span style="color: ${C.accent};">${esc(r.note)}</span>` : ""}`;

// One race, shaped like a row on app/speaking/page.tsx.
const raceRow = (r) => `          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0 16px; align-items: baseline;">
              <p style="margin: 0; font-size: 18px; line-height: 1.4;"><a href="#" class="lk">${esc(r.event)}</a></p>
              <p class="mono" style="margin: 0; font-size: 12px; letter-spacing: 0.03em; white-space: nowrap; color: ${C.faint};">${r.date}</p>
            </div>
            <p class="mono" style="margin: 0; font-size: 11.5px; letter-spacing: 0.02em; color: ${C.faint};">${meta(r)}</p>
          </div>`;

// ---- Landing ---------------------------------------------------------------

const statRow = () => `    <div style="display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 0 24px; padding-top: 48px;">
      <div class="mono" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.faint}; padding-top: 4px;">Tally</div>
      <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px;">
${stats.map((s) => `        <div style="display: flex; flex-direction: column; gap: 3px;">
          <span style="font-size: 26px; line-height: 1.1; color: ${C.accent};">${s.n}</span>
          <span class="mono" style="font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.faint};">${s.label}</span>
        </div>`).join("\n")}
      </div>
    </div>`;

const section = (label, inner, top = 44) => `    <div style="padding-top: ${top}px;">
${gutter(label, inner, "22px")}
    </div>`;

const weekBlock = () => section("This week", `        <div style="display: flex; flex-direction: column;">
${week.activities.map((a, i) => `          <div style="display: grid; grid-template-columns: 34px minmax(0, 1fr) auto; gap: 0 14px; align-items: baseline; border-top: 1px solid ${C.rule}; padding: 11px 0;${i === week.activities.length - 1 ? ` border-bottom: 1px solid ${C.rule};` : ""}">
            <span class="mono" style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${C.fainter};">${a.day}</span>
            <span style="font-size: 17px;">${esc(a.name)}</span>
            <span class="mono" style="font-size: 11.5px; color: ${C.faint}; white-space: nowrap;">${a.dist} <span style="color: ${C.fainter};">&middot;</span> ${a.vert} <span style="color: ${C.fainter};">&middot;</span> ${a.time}</span>
          </div>`).join("\n")}
          <p class="mono" style="margin: 10px 0 0; font-size: 11px; color: ${C.faint};">${week.totals.dist} <span style="color: ${C.fainter};">&middot;</span> ${week.totals.vert} <span style="color: ${C.fainter};">&middot;</span> ${week.totals.time} &nbsp;&nbsp;<a href="#" class="lk" style="color: ${C.accent};">on Strava</a></p>
          <p class="mono" style="margin: 8px 0 0; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${C.fainter};">[ Sample data &mdash; live feed to be wired ]</p>`);

const recent = () => section("Latest", `        <div style="display: flex; flex-direction: column; gap: 14px;">
${races.slice(0, 5).map(raceRow).join("\n")}
        </div>
        <p style="margin: 20px 0 0; font-size: 15px;"><a href="#" class="lk" style="color: ${C.body};">All twenty races &rarr;</a></p>`);

const shortList = (label, lines, cta) => section(label, `        <div style="display: flex; flex-direction: column; gap: 8px;">
${lines.map((l) => `          <div style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0 16px; align-items: baseline;">
            <span style="font-size: 17px; color: ${C.body};">${esc(l[0])}</span>
            <span class="mono" style="font-size: 11.5px; color: ${C.faint}; white-space: nowrap;">${esc(l[1])}</span>
          </div>`).join("\n")}
        </div>
        <p style="margin: 16px 0 0; font-size: 15px;"><a href="#" class="lk" style="color: ${C.body};">${cta} &rarr;</a></p>`);

artboard("SummitLanding.dc.html", {
  fonts: FONTS, style: STYLE,
  body: ROOT(1600, [header(), main([
    pageHeading("Athlete", "Amateur hours", "Skimo through the winter, trail races all summer, and rock whenever the Flatirons are dry &mdash; out of Boulder, Colorado. Twenty finishes since 2024, every one written down."),
    statRow(),
    weekBlock(),
    recent(),
    shortList("Rock", climbing.bests.map((b) => [b.label, b.value]), "Ticklist and home crags"),
    shortList("Kit", gear.slice(0, 3).map((g) => [g.item, g.cat]), "The full setup"),
    shortList("Ahead", nextUp.slice(0, 3).map((n) => [n.what, n.when]), "Season goals"),
  ].join("\n")), footer()].join("\n")),
});

// ---- Races -----------------------------------------------------------------

const yearGroups = () => byYear(races).map((g) => `    <section style="display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 0 24px; border-top: 1px solid ${C.rule}; padding: 22px 0 26px;">
      <h2 class="mono" style="margin: 0; font-size: 13px; letter-spacing: 0.06em; color: ${C.faint}; padding-top: 5px;">${g.year}</h2>
      <div style="display: flex; flex-direction: column; gap: 15px;">
${g.races.map(raceRow).join("\n")}
      </div>
    </section>`).join("\n");

artboard("SummitRaces.dc.html", {
  fonts: FONTS, style: STYLE,
  body: ROOT(1900, [header(), main([
    pageHeading("The log", "Race results", "Twenty races between 2024 and 2026 &mdash; skimo, trail, gravel and one road 10K. Kept mostly so I can find it later; mid-pack is the honest word for most of it."),
    `    <div style="display: flex; gap: 8px; padding: 30px 0 0 120px;">
${["All", "Skimo", "Trail", "Bike", "Road"].map((c, i) => `      <span class="mono" style="font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; padding: 6px 11px; border: 1px solid ${i === 0 ? C.accent : C.rule}; color: ${i === 0 ? C.accent : C.muted};">${c}</span>`).join("\n")}
    </div>`,
    `    <div style="display: flex; flex-direction: column; padding-top: 40px;">
${yearGroups()}
      <div style="border-top: 1px solid ${C.rule};"></div>
    </div>`,
  ].join("\n")), footer()].join("\n")),
});

// ---- Training & gear -------------------------------------------------------

const sendsBlock = () => section("Rock", `        <div style="display: flex; gap: 26px; padding-bottom: 20px;">
${climbing.bests.map((b) => `          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-size: 24px; color: ${C.accent};">${b.value}</span>
            <span class="mono" style="font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.faint};">${b.label}</span>
          </div>`).join("\n")}
        </div>
        <div style="display: flex; flex-direction: column;">
${climbing.sends.map((s, i) => `          <div style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0 16px; align-items: baseline; border-top: 1px solid ${C.rule}; padding: 11px 0;${i === climbing.sends.length - 1 ? ` border-bottom: 1px solid ${C.rule};` : ""}">
            <span style="font-size: 17px;"><a href="#" class="lk">${esc(s.route)}</a> <span class="tag">${s.grade}</span></span>
            <span class="mono" style="font-size: 11.5px; color: ${C.faint}; white-space: nowrap;">${esc(s.crag)} <span style="color: ${C.fainter};">&middot;</span> ${s.year}</span>
          </div>`).join("\n")}
        </div>
        <p style="margin: 16px 0 0; font-size: 15px; line-height: 1.7; color: ${C.muted};">Mostly ${climbing.crags.slice(0, 3).map((c) => `<span style="color: ${C.body};">${esc(c)}</span>`).join(", ")} and ${climbing.crags.slice(-1).map((c) => `<span style="color: ${C.body};">${esc(c)}</span>`)}.</p>
        <div style="margin-top: 20px; height: 168px; border: 1px dashed ${C.rule}; display: flex; align-items: center; justify-content: center;">
          <span class="mono" style="font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.fainter};">[ Climbing photo &mdash; 1200 &times; 900 ]</span>
        </div>`);

const gearBlock = () => section("Kit", `        <div style="display: flex; flex-direction: column;">
${gear.map((g, i) => `          <div style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0 16px; align-items: baseline; border-top: 1px solid ${C.rule}; padding: 10px 0;${i === gear.length - 1 ? ` border-bottom: 1px solid ${C.rule};` : ""}">
            <span style="font-size: 17px; color: ${C.body};">${esc(g.item)}</span>
            <span class="mono" style="font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.faint}; white-space: nowrap;">${g.cat}</span>
          </div>`).join("\n")}
        </div>`);

const nextBlock = () => section("Ahead", `        <div style="display: flex; flex-direction: column;">
${nextUp.map((n, i) => `          <div style="display: grid; grid-template-columns: 118px minmax(0, 1fr) auto; gap: 0 16px; align-items: baseline; border-top: 1px solid ${C.rule}; padding: 11px 0;${i === nextUp.length - 1 ? ` border-bottom: 1px solid ${C.rule};` : ""}">
            <span class="mono" style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${C.accent};">${n.when}</span>
            <span style="font-size: 17px;">${esc(n.what)}</span>
            <span class="mono" style="font-size: 11.5px; color: ${C.faint}; white-space: nowrap;">${esc(n.goal)}</span>
          </div>`).join("\n")}
        </div>`);

artboard("SummitTraining.dc.html", {
  fonts: FONTS, style: STYLE,
  body: ROOT(1640, [header(), main([
    pageHeading("Off the clock", "Training &amp; gear", "What I climb, what I race on, and what I am pointed at next."),
    sendsBlock(), gearBlock(), nextBlock(),
  ].join("\n")), footer()].join("\n")),
});

console.log("C: SummitLanding.dc.html, SummitRaces.dc.html, SummitTraining.dc.html");
