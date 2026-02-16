#!/usr/bin/env node

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "127.0.0.1";
const DATA_DIR = path.join(__dirname, "data");
const STORE_FILE = path.join(DATA_DIR, "growth-store.json");

const EVENT_WEIGHTS = {
  share_link: 1,
  share_result: 2,
  share_card: 2,
  assessment_completed: 3
};

const defaultStore = () => ({
  profiles: {},
  referralEdges: {}
});

const nowIso = () => new Date().toISOString();

const normalizeInviteCode = (value) => {
  if (!value || typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  if (!/^[A-Z0-9_-]{4,20}$/.test(code)) return null;
  return code;
};

const defaultProfile = (inviteCode) => ({
  inviteCode,
  createdAt: nowIso(),
  updatedAt: nowIso(),
  referredBy: null,
  stats: {
    shareLink: 0,
    shareResult: 0,
    shareCard: 0,
    assessmentCompleted: 0,
    referralVisits: 0
  },
  score: 0
});

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(defaultStore(), null, 2));
  }
};

const readStore = () => {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      profiles: parsed.profiles || {},
      referralEdges: parsed.referralEdges || {}
    };
  } catch (error) {
    return defaultStore();
  }
};

const writeStore = (store) => {
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
};

const ensureProfile = (store, inviteCode) => {
  if (!store.profiles[inviteCode]) {
    store.profiles[inviteCode] = defaultProfile(inviteCode);
  }
  store.profiles[inviteCode].updatedAt = nowIso();
  return store.profiles[inviteCode];
};

const calculateRank = (profiles, inviteCode) => {
  const sorted = Object.values(profiles).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.stats.referralVisits - a.stats.referralVisits;
  });
  const index = sorted.findIndex((item) => item.inviteCode === inviteCode);
  return index >= 0 ? index + 1 : null;
};

const parseBody = async (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(new Error("invalid_json"));
      }
    });
    req.on("error", reject);
  });

const buildPublicProfile = (profile, rank = null) => ({
  inviteCode: profile.inviteCode,
  referredBy: profile.referredBy,
  score: profile.score,
  rank,
  stats: profile.stats,
  updatedAt: profile.updatedAt
});

const json = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type"
  });
  res.end(JSON.stringify(payload));
};

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    json(res, 400, { ok: false, error: "missing_url" });
    return;
  }

  if (req.method === "OPTIONS") {
    json(res, 204, {});
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = reqUrl.pathname;

  if (req.method === "GET" && pathname === "/api/health") {
    json(res, 200, { ok: true, now: nowIso() });
    return;
  }

  if (req.method === "POST" && pathname === "/api/invites/register") {
    let body;
    try {
      body = await parseBody(req);
    } catch (error) {
      json(res, 400, { ok: false, error: "invalid_json" });
      return;
    }

    const inviteCode = normalizeInviteCode(body.inviteCode);
    const referredBy = normalizeInviteCode(body.referredBy);

    if (!inviteCode) {
      json(res, 400, { ok: false, error: "invalid_invite_code" });
      return;
    }

    const store = readStore();
    const profile = ensureProfile(store, inviteCode);

    if (referredBy && referredBy !== inviteCode) {
      const referrer = ensureProfile(store, referredBy);
      const edgeKey = `${referredBy}__${inviteCode}`;
      if (!store.referralEdges[edgeKey]) {
        store.referralEdges[edgeKey] = nowIso();
        referrer.stats.referralVisits += 1;
        referrer.score += 2;
      }
      if (!profile.referredBy) {
        profile.referredBy = referredBy;
      }
    }

    profile.updatedAt = nowIso();
    writeStore(store);
    const rank = calculateRank(store.profiles, inviteCode);
    json(res, 200, {
      ok: true,
      profile: buildPublicProfile(profile, rank)
    });
    return;
  }

  if (req.method === "POST" && pathname === "/api/events") {
    let body;
    try {
      body = await parseBody(req);
    } catch (error) {
      json(res, 400, { ok: false, error: "invalid_json" });
      return;
    }

    const inviteCode = normalizeInviteCode(body.inviteCode);
    const eventType = typeof body.eventType === "string" ? body.eventType.trim() : "";
    const weight = EVENT_WEIGHTS[eventType];

    if (!inviteCode) {
      json(res, 400, { ok: false, error: "invalid_invite_code" });
      return;
    }
    if (!weight) {
      json(res, 400, { ok: false, error: "invalid_event_type" });
      return;
    }

    const store = readStore();
    const profile = ensureProfile(store, inviteCode);

    if (eventType === "share_link") profile.stats.shareLink += 1;
    if (eventType === "share_result") profile.stats.shareResult += 1;
    if (eventType === "share_card") profile.stats.shareCard += 1;
    if (eventType === "assessment_completed") profile.stats.assessmentCompleted += 1;
    profile.score += weight;
    profile.updatedAt = nowIso();

    writeStore(store);
    const rank = calculateRank(store.profiles, inviteCode);
    json(res, 200, {
      ok: true,
      profile: buildPublicProfile(profile, rank)
    });
    return;
  }

  if (req.method === "GET" && pathname.startsWith("/api/growth/")) {
    const maybeCode = pathname.slice("/api/growth/".length);
    if (maybeCode && maybeCode !== "leaderboard") {
      const inviteCode = normalizeInviteCode(decodeURIComponent(maybeCode));
      if (!inviteCode) {
        json(res, 400, { ok: false, error: "invalid_invite_code" });
        return;
      }
      const store = readStore();
      const profile = store.profiles[inviteCode];
      if (!profile) {
        json(res, 404, { ok: false, error: "not_found" });
        return;
      }
      const rank = calculateRank(store.profiles, inviteCode);
      json(res, 200, { ok: true, profile: buildPublicProfile(profile, rank) });
      return;
    }
  }

  if (req.method === "GET" && pathname === "/api/growth/leaderboard") {
    const limitRaw = Number(reqUrl.searchParams.get("limit") || 10);
    const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(30, limitRaw)) : 10;
    const store = readStore();
    const ranking = Object.values(store.profiles)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.stats.referralVisits - a.stats.referralVisits;
      })
      .slice(0, limit)
      .map((profile, index) => ({
        rank: index + 1,
        inviteCode: profile.inviteCode,
        score: profile.score,
        referralVisits: profile.stats.referralVisits,
        shareActions: profile.stats.shareLink + profile.stats.shareResult + profile.stats.shareCard
      }));
    json(res, 200, { ok: true, leaderboard: ranking });
    return;
  }

  json(res, 404, { ok: false, error: "not_found" });
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`growth backend running at http://${HOST}:${PORT}\n`);
});
