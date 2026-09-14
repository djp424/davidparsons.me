#!/usr/bin/env node
/**
 * One-time Strava authorisation, run locally: `npm run strava:token`.
 *
 * Strava has no "API key you paste into a config". Access tokens expire after
 * six hours, so the credential the site actually stores is a *refresh token*,
 * and getting one requires authorising the app in a browser once. This walks
 * that: it opens a throwaway listener on 127.0.0.1, sends you to Strava, takes
 * the callback, exchanges the code, and prints the refresh token.
 *
 * Before the first run, in https://www.strava.com/settings/api set the app's
 * "Authorization Callback Domain" to exactly:  localhost
 *
 * Nothing is written to disk. The token is printed once, for you to paste into
 * .env.local and into the Vercel project settings yourself.
 */

import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

/**
 * Ports to try, in order. Strava validates the callback *domain* (`localhost`)
 * and not the port, so any of these works — which means a dev server, or
 * anything else already sitting on 8787, is not worth failing over. Override
 * with PORT=9000 npm run strava:token if none of them are free.
 */
const PORTS = process.env.PORT
  ? [Number(process.env.PORT)]
  : [8787, 8788, 8789, 8790, 8791, 8888, 9787];

/**
 * Read-all so the feed can see activities you have not made public yet.
 * lib/strava.ts then filters those out before rendering — the scope is wide,
 * what gets published is not. Narrow this to `activity:read` if you would
 * rather the token could not read them at all.
 */
const SCOPE = "activity:read_all";

/** Minimal .env parser — enough for KEY=value, no dependency. */
function readEnvFile(path) {
  const out = {};
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return out;
  }
  for (const line of text.split("\n")) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    out[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const fileEnv = readEnvFile(new URL("../.env.local", import.meta.url).pathname);
const clientId = process.env.STRAVA_CLIENT_ID || fileEnv.STRAVA_CLIENT_ID;
const clientSecret =
  process.env.STRAVA_CLIENT_SECRET || fileEnv.STRAVA_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    [
      "",
      "  Missing credentials.",
      "",
      "  Put these in .env.local first — both are on your app's page at",
      "  https://www.strava.com/settings/api",
      "",
      "    STRAVA_CLIENT_ID=12345",
      "    STRAVA_CLIENT_SECRET=…",
      "",
      "  Then run this again.",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

/** Guards the callback: a stray hit without this is ignored. */
const state = randomBytes(16).toString("hex");

const authorizeUrlFor = (redirectUri) =>
  "https://www.strava.com/oauth/authorize?" +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    approval_prompt: "force",
    scope: SCOPE,
    state,
  });

function page(title, body) {
  return `<!doctype html><meta charset="utf-8"><title>${title}</title><body style="font:16px/1.5 system-ui;margin:4rem auto;max-width:32rem"><h1 style="font-size:1.25rem">${title}</h1><p>${body}</p></body>`;
}

async function exchange(code) {
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
    }),
  });

  if (!response.ok) {
    // The body can echo the secret back; report the status only.
    throw new Error(
      `Strava rejected the exchange (${response.status}). Check the client ` +
        "secret, and that the callback domain is set to `localhost`.",
    );
  }
  return response.json();
}

/** Set once a port is bound, below. */
let redirectUri = null;

const server = createServer(async (request, response) => {
  const url = new URL(request.url, redirectUri ?? "http://localhost");
  if (url.pathname !== "/callback") {
    response.writeHead(404).end();
    return;
  }

  const send = (status, title, body) => {
    response.writeHead(status, { "content-type": "text/html; charset=utf-8" });
    response.end(page(title, body));
  };

  if (url.searchParams.get("state") !== state) {
    send(400, "Ignored", "That callback did not come from this run.");
    return;
  }

  const error = url.searchParams.get("error");
  if (error) {
    send(400, "Denied", `Strava returned: ${error}. Nothing was changed.`);
    console.error(`\n  Authorisation denied: ${error}\n`);
    server.close();
    process.exitCode = 1;
    return;
  }

  const granted = url.searchParams.get("scope") ?? "";
  if (!granted.includes("activity:read")) {
    send(
      400,
      "Missing permission",
      "The activity permission was not ticked. Run the command again and " +
        "leave every box checked.",
    );
    console.error("\n  The activity:read scope was not granted.\n");
    server.close();
    process.exitCode = 1;
    return;
  }

  try {
    const token = await exchange(url.searchParams.get("code"));
    send(200, "Done", "Refresh token printed in your terminal. You can close this tab.");

    console.log(
      [
        "",
        "  Authorised as " +
          `${token.athlete?.firstname ?? ""} ${token.athlete?.lastname ?? ""}`.trim() +
          (token.athlete?.id ? ` (${token.athlete.id})` : ""),
        `  Scopes granted: ${granted}`,
        "",
        "  Add this to .env.local, and to the Vercel project settings for",
        "  Production, Preview and Development:",
        "",
        `    STRAVA_REFRESH_TOKEN=${token.refresh_token}`,
        "",
        "  It is a long-lived credential — treat it like a password. Do not",
        "  commit it; .env* is already gitignored.",
        "",
      ].join("\n"),
    );
    server.close();
  } catch (failure) {
    send(500, "Exchange failed", "See the terminal.");
    console.error(`\n  ${failure.message}\n`);
    server.close();
    process.exitCode = 1;
  }
});

/**
 * Bind the first port nobody else is holding.
 *
 * `server.listen` reports a busy port by emitting `error`, which is fatal if
 * nothing is listening for it — so each attempt gets a one-shot handler and
 * only a non-EADDRINUSE failure is allowed through.
 */
function listenOnFirstFreePort(ports) {
  return new Promise((resolve, reject) => {
    const attempt = (index) => {
      if (index >= ports.length) {
        reject(
          new Error(
            `Every candidate port is in use (${ports.join(", ")}). ` +
              "Free one, or pick your own: PORT=9000 npm run strava:token",
          ),
        );
        return;
      }

      const port = ports[index];

      const onError = (failure) => {
        server.removeListener("listening", onListening);
        if (failure.code === "EADDRINUSE") attempt(index + 1);
        else reject(failure);
      };

      const onListening = () => {
        server.removeListener("error", onError);
        resolve(port);
      };

      server.once("error", onError);
      server.once("listening", onListening);
      server.listen(port, "127.0.0.1");
    };

    attempt(0);
  });
}

try {
  const port = await listenOnFirstFreePort(PORTS);
  redirectUri = `http://localhost:${port}/callback`;

  console.log(
    [
      "",
      "  Open this in a browser and approve the app:",
      "",
      `  ${authorizeUrlFor(redirectUri)}`,
      "",
      `  Waiting for the callback on ${redirectUri} …`,
      "  (Ctrl-C to give up.)",
      "",
    ].join("\n"),
  );
} catch (failure) {
  console.error(`\n  ${failure.message}\n`);
  process.exit(1);
}
