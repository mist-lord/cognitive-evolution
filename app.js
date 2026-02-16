const shareLinkButton = document.getElementById("share-link");
const shareResultButton = document.getElementById("share-result");
const copyTextButton = document.getElementById("copy-text");
const shareStatus = document.getElementById("share-status");
const copyStatus = document.getElementById("copy-status");
const assessmentForm = document.getElementById("assessment-form");
const questionContainer = document.getElementById("question-container"); // New container
const assessmentProgressBar = document.getElementById("assessment-progress-bar"); // New bar
const assessmentProgressText = document.getElementById("assessment-progress-text"); // New text
const assessmentReset = document.getElementById("assessment-reset");
let currentQuestionIndex = 0; // State tracking
// Duplicate removed
const resultSummary = document.getElementById("result-summary");
const resultBars = document.getElementById("result-bars");
const resultTags = document.getElementById("result-tags");
const resultHistoryList = document.getElementById("result-history");
const generateShareCardButton = document.getElementById("generate-share-card");
const shareCardImage = document.getElementById("share-card-image");
const downloadShareCard = document.getElementById("download-share-card");
const dailyChallenge = document.getElementById("daily-challenge");
const refreshChallengeButton = document.getElementById("refresh-challenge");
const saveChallengeButton = document.getElementById("save-challenge");
const runnerForm = document.getElementById("runner-form");
const runnerResult = document.getElementById("runner-result");
const saveLogButton = document.getElementById("save-log");
const logList = document.getElementById("log-list");
const modelCards = document.getElementById("model-cards");
const copyInviteLinkButton = document.getElementById("copy-invite-link");
const copyInviteTextButton = document.getElementById("copy-invite-text");
const inviteCodeNode = document.getElementById("invite-code");
const inviteUrlInput = document.getElementById("invite-url");
const growthShareCount = document.getElementById("growth-share-count");
const growthScore = document.getElementById("growth-score");
const growthProgress = document.getElementById("growth-progress");
const growthLevelText = document.getElementById("growth-level-text");
const campaignBanner = document.getElementById("campaign-banner");
const shareTextNode = document.getElementById("share-text");
const backendStatusNode = document.getElementById("backend-status");
const leaderboardList = document.getElementById("leaderboard-list");
const refreshLeaderboardButton = document.getElementById("refresh-leaderboard");

const shareText = "我完成了认知五层测评并生成认知画像，邀请你也来测一次。";
const logStorageKey = "cognitive_logs_v1";
const resultStorageKey = "cognitive_results_v1";
const challengeStorageKey = "cognitive_daily_challenge_v1";
const inviteCodeStorageKey = "cognitive_invite_code_v1";
const growthStorageKey = "cognitive_growth_v1";

const layerNames = ["事实层", "结构层", "模型层", "反直觉", "自我层"];

const assessmentQuestions = [
  {
    id: "q1",
    question: "面对一个复杂问题，你最先做什么？",
    options: [
      { text: "收集可验证事实", scores: [3, 1, 0, 0, 0] },
      { text: "先判断关键角色与约束", scores: [1, 3, 0, 0, 0] },
      { text: "直接套用熟悉模型", scores: [0, 1, 3, 0, 0] },
      { text: "先识别自己的情绪偏差", scores: [0, 0, 1, 1, 3] }
    ]
  },
  {
    id: "q2",
    question: "你如何验证自己的判断？",
    options: [
      { text: "对照事实证据", scores: [3, 1, 0, 0, 0] },
      { text: "检查结构是否闭合", scores: [1, 3, 0, 0, 0] },
      { text: "寻找模型的反例", scores: [0, 1, 2, 3, 0] },
      { text: "复盘自己的偏见来源", scores: [0, 0, 1, 1, 3] }
    ]
  },
  {
    id: "q3",
    question: "团队出现冲突时，你会？",
    options: [
      { text: "先还原发生了什么", scores: [3, 1, 0, 0, 0] },
      { text: "分析权责与激励结构", scores: [1, 3, 0, 0, 0] },
      { text: "用博弈模型分析行动", scores: [0, 1, 3, 0, 0] },
      { text: "提醒自己避免站队偏误", scores: [0, 0, 1, 1, 3] }
    ]
  },
  {
    id: "q4",
    question: "当结果与预期不一致时，你会？",
    options: [
      { text: "检查事实是否准确", scores: [3, 1, 0, 0, 0] },
      { text: "调整结构变量", scores: [1, 3, 1, 0, 0] },
      { text: "替换模型或参数", scores: [0, 1, 3, 0, 0] },
      { text: "检视自己的偏差", scores: [0, 0, 1, 1, 3] }
    ]
  },
  {
    id: "q5",
    question: "你如何处理不确定的信息？",
    options: [
      { text: "只保留可验证部分", scores: [3, 1, 0, 0, 0] },
      { text: "明确关键变量与约束", scores: [1, 3, 0, 0, 0] },
      { text: "用概率模型评估", scores: [0, 1, 3, 0, 0] },
      { text: "寻找反例降低过度自信", scores: [0, 0, 1, 3, 1] }
    ]
  },
  {
    id: "q6",
    question: "当你给出建议时，你更看重？",
    options: [
      { text: "事实是否准确", scores: [3, 1, 0, 0, 0] },
      { text: "结构是否合理", scores: [1, 3, 0, 0, 0] },
      { text: "模型是否可迁移", scores: [0, 1, 3, 0, 0] },
      { text: "是否考虑反直觉可能", scores: [0, 0, 1, 3, 1] }
    ]
  },
  {
    id: "q7",
    question: "你如何判断一条结论是否可靠？",
    options: [
      { text: "查看事实与数据来源", scores: [3, 1, 0, 0, 0] },
      { text: "检查结构闭合性", scores: [1, 3, 0, 0, 0] },
      { text: "用模型交叉验证", scores: [0, 1, 3, 0, 0] },
      { text: "用反例校验", scores: [0, 0, 1, 3, 1] }
    ]
  },
  {
    id: "q8",
    question: "你更愿意用哪种方式提高判断力？",
    options: [
      { text: "积累事实与案例", scores: [3, 1, 0, 0, 0] },
      { text: "训练结构化拆解", scores: [1, 3, 0, 0, 0] },
      { text: "学习模型并复用", scores: [0, 1, 3, 0, 0] },
      { text: "定期复盘纠偏", scores: [0, 0, 1, 1, 3] }
    ]
  },
  {
    id: "q9",
    question: "当信息不足时，你会？",
    options: [
      { text: "明确事实缺口", scores: [3, 1, 0, 0, 0] },
      { text: "找关键结构变量", scores: [1, 3, 0, 0, 0] },
      { text: "用模型做假设", scores: [0, 1, 3, 0, 0] },
      { text: "警惕自己过度自信", scores: [0, 0, 1, 2, 2] }
    ]
  },
  {
    id: "q10",
    question: "当你形成观点后，会做什么？",
    options: [
      { text: "补充事实支撑", scores: [3, 1, 0, 0, 0] },
      { text: "再梳理一次结构", scores: [1, 3, 0, 0, 0] },
      { text: "测试模型可迁移性", scores: [0, 1, 3, 0, 0] },
      { text: "寻找反证与偏差", scores: [0, 0, 1, 3, 1] }
    ]
  },
  {
    id: "q11",
    question: "面对别人的意见，你更倾向于？",
    options: [
      { text: "要求事实与证据", scores: [3, 1, 0, 0, 0] },
      { text: "看结构是否合理", scores: [1, 3, 0, 0, 0] },
      { text: "用模型判断可行性", scores: [0, 1, 3, 0, 0] },
      { text: "考虑自身偏见影响", scores: [0, 0, 1, 1, 3] }
    ]
  },
  {
    id: "q12",
    question: "你最容易忽略的步骤是？",
    options: [
      { text: "事实验证", scores: [3, 0, 0, 0, 0] },
      { text: "结构约束", scores: [0, 3, 0, 0, 0] },
      { text: "模型复用", scores: [0, 0, 3, 0, 0] },
      { text: "反直觉校验", scores: [0, 0, 0, 3, 0] }
    ]
  }
];

const modelLibrary = [
  {
    name: "信息不对称",
    definition: "信息分布不均导致决策偏差",
    use: "评估双方掌握信息差导致的风险",
    misuse: "忽略信息变化与动态更新",
    example: "定价谈判时识别对方隐藏的底线"
  },
  {
    name: "安全边际",
    definition: "预留风险缓冲避免过度乐观",
    use: "为不确定性预留空间",
    misuse: "保守到失去行动力",
    example: "预算里设置 20% 的风险冗余"
  },
  {
    name: "期望值",
    definition: "用概率和收益综合判断",
    use: "综合概率与收益评估",
    misuse: "忽略非量化风险",
    example: "多个方案下的收益概率比较"
  },
  {
    name: "反例校验",
    definition: "寻找让结论失效的场景",
    use: "找到模型的边界条件",
    misuse: "用极端案例否定常识",
    example: "用反例验证策略在低概率场景"
  },
  {
    name: "激励结构",
    definition: "分析参与者目标与收益",
    use: "判断参与者的真实动机",
    misuse: "把动机当事实",
    example: "团队分工时识别隐性激励"
  },
  {
    name: "约束识别",
    definition: "找出资源与规则限制",
    use: "明确可行动的边界",
    misuse: "忽视弹性与变化",
    example: "项目排期中识别关键瓶颈"
  }
];

const resultProfiles = [
  {
    label: "事实掌控者",
    summary: "擅长事实校验与信息甄别",
    scenarios: ["忽略关键约束条件", "过度依赖单一证据", "低估情绪变量影响"],
    advice: "补齐结构与约束再下结论"
  },
  {
    label: "结构思考者",
    summary: "擅长拆解结构与角色关系",
    scenarios: ["事实数据不足", "模型调用不稳定", "边界条件未明确"],
    advice: "补充数据与模型验证"
  },
  {
    label: "模型调用者",
    summary: "善用模型快速形成判断",
    scenarios: ["模型过度迁移", "忽略反例场景", "情绪偏差未觉察"],
    advice: "增加反例与自我校验"
  },
  {
    label: "反直觉校验者",
    summary: "善于发现结论的反例",
    scenarios: ["行动拖延", "结构拆解不完整", "事实采样不足"],
    advice: "加快行动并补齐事实"
  },
  {
    label: "自我修正者",
    summary: "重视偏差识别与复盘",
    scenarios: ["过度内省影响速度", "结构缺乏量化", "模型复用不足"],
    advice: "用模型提升决策效率"
  }
];

const nonoLevels = [
  { name: "潜睡蕉 (The Sleeper)", desc: "沉睡的潜能，等待唤醒", color: "#6b8c70", img: "assets/nono_card_sleeper.png" },
  { name: "觉醒蕉 (The Awakened)", desc: "剥开表象，光芒初现", color: "#f0e68c", img: "assets/nono_card_awakened.png" },
  { name: "解构蕉 (The Analyst)", desc: "透视本质，数据重构", color: "#00ffff", img: "assets/nono_card_analyst.png" },
  { name: "破壁蕉 (The Hacker)", desc: "突破规则，逆向思维", color: "#ff00ff", img: "assets/nono_card_hacker.png" },
  { name: "涅槃蕉 (The Sage)", desc: "纯净能量，认知飞升", color: "#ffd700", img: "assets/nono_card_sage.png" }
];

const getNonoAsset = (levelIndex) => {
  const level = nonoLevels[levelIndex];
  return `<img src="${level.img}" class="nono-card-img" alt="${level.name}" />`;
};

const getNonoSVG = (levelIndex) => {
  const colors = ["#a8d67d", "#f0e68c", "#00ff41", "#ff00ff", "#ffd700"];
  const color = colors[levelIndex];

  const basePath = `<path d="M50 10 C 60 10, 80 20, 85 50 C 90 80, 70 130, 40 140 C 30 140, 40 120, 50 110 C 60 100, 70 80, 65 50 C 60 30, 55 20, 50 10 Z" fill="${color}" stroke="white" stroke-width="2" />`;

  if (levelIndex === 0) { // Green Raw
    return `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
      ${basePath}
      <circle cx="55" cy="40" r="3" fill="#333" />
      <circle cx="75" cy="40" r="3" fill="#333" />
      <path d="M60 55 Q 65 58 70 55" stroke="#333" fill="none" />
    </svg>`;
  }
  if (levelIndex === 1) { // Peeling
    return `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 10 C 60 10, 80 20, 85 50 C 90 80, 70 130, 40 140 Z" fill="#fff" opacity="0.5"/>
      <path d="M50 10 C 40 20, 30 50, 40 140" stroke="${color}" stroke-width="4" fill="none" />
      ${basePath}
      <circle cx="55" cy="40" r="4" fill="#333" />
      <circle cx="75" cy="40" r="4" fill="#333" />
      <path d="M60 60 Q 65 70 70 60" stroke="#333" fill="none" />
    </svg>`;
  }
  if (levelIndex === 2) { // Matrix
    return `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="${color}" stroke-width="0.5"/>
        </pattern>
      </defs>
      <path d="M50 10 C 60 10, 80 20, 85 50 C 90 80, 70 130, 40 140 C 30 140, 40 120, 50 110 C 60 100, 70 80, 65 50 C 60 30, 55 20, 50 10 Z" fill="url(#grid)" stroke="${color}" stroke-width="2" />
      <text x="50" y="140" fill="${color}" font-size="10" font-family="monospace">BINARY</text>
    </svg>`;
  }
  if (levelIndex === 3) { // Glitch
    return `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
      <filter id="glitch">
        <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence"/>
        <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <g filter="url(#glitch)">
      ${basePath}
      </g>
      <path d="M40 30 L90 30" stroke="cyan" stroke-width="1" opacity="0.7" />
      <path d="M40 80 L90 80" stroke="magenta" stroke-width="1" opacity="0.7" />
    </svg>`;
  }
  // Zen
  return `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
    <filter id="glow">
      <feGaussianBlur stdDeviation="4.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <g filter="url(#glow)">
       ${basePath}
    </g>
    <circle cx="65" cy="20" r="5" fill="white" filter="url(#glow)" />
  </svg>`;
};

const dailyChallenges = [
  "你需要在 24 小时内决定是否接受一个新项目，信息不完整但时间紧迫。",
  "团队两名核心成员出现冲突，影响交付，你要判断最有效的处理路径。",
  "你要在预算削减 30% 的情况下完成目标，必须调整资源结构。",
  "客户突然改变需求，你必须在有限时间内判断是否接单。",
  "你在复盘一个失败决策，发现多数人当时都选择了同样路径。",
  "你需要决定是否更换供应商，但手里只有部分数据。",
  "你在高压环境下做出重要判断，结果与预期偏差很大。",
  "你准备说服团队尝试新策略，但成员对风险持保留态度。"
];

const growthMilestones = [
  { score: 3, title: "传播启动", reward: "完成首次增长闭环" },
  { score: 8, title: "扩散加速", reward: "形成稳定分享习惯" },
  { score: 15, title: "增长飞轮", reward: "进入高频传播阶段" }
];

const defaultGrowthState = {
  shareCount: 0,
  resultShareCount: 0,
  cardCount: 0
};

let currentResult = null;

const createId = () => `r_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

const createInviteCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const getInviteCode = () => {
  const existing = localStorage.getItem(inviteCodeStorageKey);
  if (existing) return existing;
  const code = createInviteCode();
  localStorage.setItem(inviteCodeStorageKey, code);
  return code;
};

const ownInviteCode = getInviteCode();

const resolveApiBase = () => {
  const preset = localStorage.getItem("cognitive_api_base_v1");
  if (preset) {
    return preset.replace(/\/$/, "");
  }
  if (window.location.protocol === "file:") {
    return "http://127.0.0.1:8787/api";
  }
  return `${window.location.origin}/api`;
};

let apiBase = resolveApiBase();
let backendOnline = false;
let remoteGrowthProfile = null;

const setBackendStatus = (text, isError = false) => {
  if (!backendStatusNode) return;
  backendStatusNode.textContent = text;
  backendStatusNode.style.color = isError ? "var(--danger)" : "var(--accent)";
};

const apiRequest = async (pathname, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  const headers = { ...(options.headers || {}) };
  if (options.body && !headers["content-type"]) {
    headers["content-type"] = "application/json";
  }
  try {
    const response = await fetch(`${apiBase}${pathname}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
      throw new Error(payload.error || `http_${response.status}`);
    }
    return payload;
  } finally {
    clearTimeout(timeout);
  }
};

const detectGrowthBackend = async () => {
  const fallback = "http://127.0.0.1:8787/api";
  const allowLocalFallback =
    window.location.protocol === "file:" ||
    localStorage.getItem("cognitive_allow_local_fallback_v1") === "1";
  const candidates =
    apiBase === fallback ? [apiBase] : allowLocalFallback ? [apiBase, fallback] : [apiBase];
  for (const candidate of candidates) {
    apiBase = candidate;
    try {
      const data = await apiRequest("/health", { method: "GET" });
      if (data?.ok) {
        backendOnline = true;
        setBackendStatus(`后端状态：在线（${apiBase}）`);
        return true;
      }
    } catch (error) {
      backendOnline = false;
    }
  }
  setBackendStatus("后端状态：离线（仅本地统计）", true);
  return false;
};

const getReferralContext = () => {
  const params = new URLSearchParams(window.location.search);
  const referredByRaw = params.get("ref");
  const referredBy = referredByRaw && referredByRaw !== ownInviteCode ? referredByRaw : null;
  const challenge = params.get("challenge");
  return { referredBy, challenge };
};

const registerGrowthProfile = async () => {
  if (!backendOnline) return null;
  const { referredBy, challenge } = getReferralContext();
  const payload = await apiRequest("/invites/register", {
    method: "POST",
    body: JSON.stringify({
      inviteCode: ownInviteCode,
      referredBy,
      challenge
    })
  });
  remoteGrowthProfile = payload.profile || null;
  return remoteGrowthProfile;
};

const refreshRemoteGrowth = async () => {
  if (!backendOnline) return null;
  const payload = await apiRequest(`/growth/${encodeURIComponent(ownInviteCode)}`, { method: "GET" });
  remoteGrowthProfile = payload.profile || null;
  return remoteGrowthProfile;
};

const trackGrowthEvent = async (eventType, context = {}) => {
  if (!backendOnline) return null;
  const payload = await apiRequest("/events", {
    method: "POST",
    body: JSON.stringify({
      inviteCode: ownInviteCode,
      eventType,
      context
    })
  });
  remoteGrowthProfile = payload.profile || remoteGrowthProfile;
  return remoteGrowthProfile;
};

const fetchLeaderboard = async () => {
  if (!backendOnline) return [];
  const payload = await apiRequest("/growth/leaderboard?limit=10", { method: "GET" });
  return payload.leaderboard || [];
};

const syncGrowthEvent = async (eventType, context = {}) => {
  try {
    await trackGrowthEvent(eventType, context);
    renderGrowthPanel();
  } catch (error) {
    if (backendOnline) {
      setBackendStatus("后端状态：部分同步失败，已本地记录", true);
    }
  }
};

const buildTrackedUrl = (extraParams = {}) => {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  const params = new URLSearchParams({
    ref: ownInviteCode,
    utm_source: "share",
    utm_medium: "invite",
    utm_campaign: "cognitive_growth"
  });
  Object.entries(extraParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, String(value));
    }
  });
  url.search = params.toString();
  return url.toString();
};

const buildInviteText = (context = "") => {
  const suffix = context ? `\n我的结果：${context}` : "";
  return `我刚完成了认知五层测评，3 分钟就能测出你的判断模式。${suffix}\n来挑战：${buildTrackedUrl()}`;
};

const getGrowthState = () => {
  const raw = localStorage.getItem(growthStorageKey);
  if (!raw) return { ...defaultGrowthState };
  try {
    return { ...defaultGrowthState, ...JSON.parse(raw) };
  } catch (error) {
    return { ...defaultGrowthState };
  }
};

const saveGrowthState = (state) => {
  localStorage.setItem(growthStorageKey, JSON.stringify(state));
};

const computeGrowthScore = (state) => state.shareCount + state.resultShareCount * 2 + state.cardCount * 2;

const getDisplayGrowthMetrics = () => {
  if (remoteGrowthProfile?.stats) {
    const shareActions =
      remoteGrowthProfile.stats.shareLink +
      remoteGrowthProfile.stats.shareResult +
      remoteGrowthProfile.stats.shareCard;
    return {
      shareActions,
      score: remoteGrowthProfile.score,
      referralVisits: remoteGrowthProfile.stats.referralVisits,
      rank: remoteGrowthProfile.rank || null,
      source: "remote"
    };
  }
  const local = getGrowthState();
  return {
    shareActions: local.shareCount + local.resultShareCount + local.cardCount,
    score: computeGrowthScore(local),
    referralVisits: 0,
    rank: null,
    source: "local"
  };
};

const resolveGrowthProgress = (score) => {
  const next = growthMilestones.find((item) => score < item.score);
  const currentIndex = next ? Math.max(growthMilestones.indexOf(next) - 1, -1) : growthMilestones.length - 1;
  const current = currentIndex >= 0 ? growthMilestones[currentIndex] : null;
  const currentScore = current ? current.score : 0;
  if (!next) {
    return { percent: 100, text: `当前等级：${growthMilestones[growthMilestones.length - 1].title}，已达最高等级` };
  }
  const span = next.score - currentScore || 1;
  const percent = Math.max(0, Math.min(100, ((score - currentScore) / span) * 100));
  const delta = Math.max(0, next.score - score);
  return { percent, text: `当前等级：${current ? current.title : "待启动"}，距离 ${next.title} 还差 ${delta} 分` };
};

const renderGrowthPanel = () => {
  const metrics = getDisplayGrowthMetrics();
  const progress = resolveGrowthProgress(metrics.score);
  if (growthShareCount) {
    growthShareCount.textContent = String(metrics.shareActions);
  }
  if (growthScore) {
    growthScore.textContent = String(metrics.score);
  }
  if (growthProgress) {
    growthProgress.style.width = `${progress.percent}%`;
  }
  if (growthLevelText) {
    const nextReward = growthMilestones.find((item) => metrics.score < item.score)?.reward || "已全部解锁";
    const referralText = metrics.referralVisits ? ` · 引流访问：${metrics.referralVisits}` : "";
    const rankText = metrics.rank ? ` · 排名：#${metrics.rank}` : "";
    const sourceText = metrics.source === "remote" ? "云端" : "本地";
    growthLevelText.textContent = `${progress.text} · 下一奖励：${nextReward}${referralText}${rankText} · 数据源：${sourceText}`;
  }
};

const renderLeaderboard = (entries) => {
  if (!leaderboardList) return;
  if (!entries || entries.length === 0) {
    leaderboardList.innerHTML = "<div class=\"micro\">暂无排行榜数据</div>";
    return;
  }
  leaderboardList.innerHTML = entries
    .map(
      (item) => `<div class="log-item">
        <div class="log-meta">#${item.rank} · 邀请码 ${item.inviteCode}</div>
        <div><strong>增长分 ${item.score}</strong> · 分享动作 ${item.shareActions}</div>
        <div class="micro">引流访问：${item.referralVisits}</div>
      </div>`
    )
    .join("");
};

const recordGrowthAction = (metric) => {
  const state = getGrowthState();
  if (typeof state[metric] !== "number") return;
  state[metric] += 1;
  saveGrowthState(state);
  renderGrowthPanel();
};

const renderInvitePanel = () => {
  if (inviteCodeNode) {
    inviteCodeNode.textContent = ownInviteCode;
  }
  if (inviteUrlInput) {
    inviteUrlInput.value = buildTrackedUrl();
  }
  if (shareTextNode) {
    shareTextNode.textContent = buildInviteText();
  }
};

const renderCampaignBanner = () => {
  if (!campaignBanner) return;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  const challenge = params.get("challenge");
  const segments = [];
  if (ref && ref !== ownInviteCode) {
    segments.push(`你通过邀请码 ${ref} 进入了测评`);
  }
  if (challenge) {
    segments.push(`挑战主题：${challenge}`);
  }
  if (segments.length === 0) {
    campaignBanner.hidden = true;
    return;
  }
  campaignBanner.textContent = `${segments.join(" · ")}。完成测评后可生成你的专属邀请链接继续传播。`;
  const action = document.createElement("a");
  action.href = "#assessment";
  action.textContent = "立即开始";
  campaignBanner.append(" ");
  campaignBanner.append(action);
  campaignBanner.hidden = false;
};

const getResults = () => {
  const raw = localStorage.getItem(resultStorageKey);
  return raw ? JSON.parse(raw) : [];
};

const saveResults = (results) => {
  localStorage.setItem(resultStorageKey, JSON.stringify(results));
};

const buildResultFromScores = (scores) => {
  const total = scores.reduce((sum, value) => sum + value, 0) || 1;
  const sorted = [...scores].map((score, index) => ({ score, index })).sort((a, b) => b.score - a.score);
  const primary = sorted[0];
  const secondary = sorted[1];
  const consistency = Math.round((primary.score / total) * 100);
  return { scores, primary, secondary, total, consistency };
};

const createResultRecord = (result) => ({
  id: createId(),
  scores: result.scores,
  total: result.total,
  consistency: result.consistency,
  primaryIndex: result.primary.index,
  secondaryIndex: result.secondary.index,
  createdAt: new Date().toLocaleString()
});

const renderResultHistory = () => {
  if (!resultHistoryList) return;
  const results = getResults();
  if (results.length === 0) {
    resultHistoryList.innerHTML = "<div class=\"micro\">暂无记录</div>";
    return;
  }
  resultHistoryList.innerHTML = results
    .map(
      (record) => `<div class="log-item" data-result-id="${record.id}">
        <div class="log-meta">${record.createdAt}</div>
        <div><strong>${resultProfiles[record.primaryIndex].label}</strong> · 一致性 ${record.consistency}%</div>
        <div class="micro">主层级：${layerNames[record.primaryIndex]} · 次层级：${layerNames[record.secondaryIndex]}</div>
      </div>`
    )
    .join("");
};

const setStatus = (node, text, isError = false) => {
  if (!node) return;
  node.textContent = text;
  node.style.color = isError ? "var(--danger)" : "var(--accent)";
  if (!text) node.style.color = "";
};

const copyToClipboard = async (text, statusNode) => {
  try {
    await navigator.clipboard.writeText(text);
    setStatus(statusNode, "已复制");
    return true;
  } catch (error) {
    setStatus(statusNode, "复制失败，请手动选择", true);
    return false;
  }
};

if (shareLinkButton) {
  shareLinkButton.addEventListener("click", async () => {
    const url = buildTrackedUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title: "认知五层测评挑战", text: shareText, url });
        setStatus(shareStatus, "已打开分享面板");
        recordGrowthAction("shareCount");
        await syncGrowthEvent("share_link", { channel: "native_share", target: "landing" });
      } catch (error) {
        setStatus(shareStatus, "分享已取消");
      }
    } else {
      const copied = await copyToClipboard(url, shareStatus);
      if (copied) {
        recordGrowthAction("shareCount");
        await syncGrowthEvent("share_link", { channel: "clipboard", target: "landing" });
      }
    }
  });
}

if (copyTextButton) {
  copyTextButton.addEventListener("click", async () => {
    const copied = await copyToClipboard(buildInviteText(), copyStatus);
    if (copied) {
      recordGrowthAction("shareCount");
      await syncGrowthEvent("share_link", { channel: "clipboard", target: "copy_text" });
    }
  });
}

if (shareResultButton) {
  shareResultButton.addEventListener("click", async () => {
    const challenge = currentResult ? layerNames[currentResult.primary.index] : "认知五层";
    const url = buildTrackedUrl({ challenge });
    if (currentResult) {
      const profile = resultProfiles[currentResult.primary.index];
      const text = `我的认知画像：${profile.label}｜主层级${layerNames[currentResult.primary.index]}｜一致性${currentResult.consistency}%`;
      if (navigator.share) {
        try {
          await navigator.share({ title: "认知画像挑战", text, url });
          setStatus(shareStatus, "结果已分享");
          recordGrowthAction("resultShareCount");
          await syncGrowthEvent("share_result", { channel: "native_share", challenge });
          return;
        } catch (error) {
          setStatus(shareStatus, "分享已取消");
        }
      }
      const copied = await copyToClipboard(`${text}\n${url}`, shareStatus);
      if (copied) {
        recordGrowthAction("resultShareCount");
        await syncGrowthEvent("share_result", { channel: "clipboard", challenge });
      }
      return;
    }
    const text = `我刚完成认知五层测评｜${shareText}\n${url}`;
    const copied = await copyToClipboard(text, shareStatus);
    if (copied) {
      recordGrowthAction("resultShareCount");
      await syncGrowthEvent("share_result", { channel: "clipboard", challenge });
    }
  });
}

if (copyInviteLinkButton) {
  copyInviteLinkButton.addEventListener("click", async () => {
    const copied = await copyToClipboard(buildTrackedUrl(), shareStatus);
    if (copied) {
      recordGrowthAction("shareCount");
      await syncGrowthEvent("share_link", { channel: "clipboard", target: "invite_link" });
    }
  });
}

if (copyInviteTextButton) {
  copyInviteTextButton.addEventListener("click", async () => {
    const copied = await copyToClipboard(buildInviteText(), shareStatus);
    if (copied) {
      recordGrowthAction("shareCount");
      await syncGrowthEvent("share_link", { channel: "clipboard", target: "invite_text" });
    }
  });
}

// --- New Assessment Logic ---

const renderCurrentQuestion = () => {
  if (!questionContainer) return;
  if (currentQuestionIndex >= assessmentQuestions.length) {
    finishAssessment();
    return;
  }

  const item = assessmentQuestions[currentQuestionIndex];
  const optionsHTML = item.options.map((option, index) =>
    `<div class="option" onclick="selectOption(${index})">
      <input type="radio" name="${item.id}" value="${index}" id="opt_${index}">
      <label for="opt_${index}">${option.text}</label>
    </div>`
  ).join("");

  questionContainer.innerHTML = `
    <div class="question-card">
      <div class="question-title">Q${currentQuestionIndex + 1}. ${item.question}</div>
      <div class="options-group">${optionsHTML}</div>
    </div>
  `;
  updateProgress();
};

window.selectOption = (optionIndex) => {
  // Store answer temporarily (could be in a state object, here we just simulate form submission behavior)
  const item = assessmentQuestions[currentQuestionIndex];
  // Create a hidden input in the form to persist the answer
  let existingInput = assessmentForm.querySelector(`input[name="${item.id}"]`);
  if (!existingInput) {
    existingInput = document.createElement("input");
    existingInput.type = "hidden";
    existingInput.name = item.id;
    assessmentForm.appendChild(existingInput);
  }
  existingInput.value = optionIndex;

  // Visual feedback then advance
  const options = questionContainer.querySelectorAll(".option");
  options[optionIndex].style.borderColor = "var(--primary)";
  options[optionIndex].style.background = "rgba(97, 211, 196, 0.25)";

  setTimeout(() => {
    currentQuestionIndex++;
    renderCurrentQuestion();
  }, 350);
};

const updateProgress = () => {
  if (!assessmentProgressBar || !assessmentProgressText) return;
  const percent = ((currentQuestionIndex) / assessmentQuestions.length) * 100;
  assessmentProgressBar.style.width = `${percent}%`;
  assessmentProgressText.textContent = `${currentQuestionIndex + 1}/${assessmentQuestions.length}`;
};

const finishAssessment = () => {
  questionContainer.innerHTML = `<div class="question-card" style="text-align:center">
    <h3>测评完成！</h3>
    <p>正在生成你的认知画像...</p>
  </div>`;
  setTimeout(() => {
    const submitBtn = document.createElement("button"); // Simulate submit
    assessmentForm.dispatchEvent(new Event("submit"));
  }, 800);
};

const assessmentResetHandler = () => {
  currentQuestionIndex = 0;
  assessmentForm.innerHTML = ""; // Clear hidden inputs
  renderCurrentQuestion();
  if (resultSummary) resultSummary.textContent = "";
  if (resultBars) resultBars.innerHTML = "";
  if (resultTags) resultTags.innerHTML = "";
  if (typeof resetShareCard === 'function') resetShareCard();
  currentResult = null;
};

if (assessmentReset) {
  assessmentReset.addEventListener("click", assessmentResetHandler);
}

// Initial render call
// renderAssessment is replaced by renderCurrentQuestion logic, 
// so we hook it into where the page might init.
// For now, call it if we are on the page.
if (questionContainer && assessmentQuestions.length > 0) {
  renderCurrentQuestion();
}

const calculateResult = () => {
  const scores = [0, 0, 0, 0, 0];
  assessmentQuestions.forEach((question) => {
    const val = assessmentForm.querySelector(`input[name="${question.id}"]`)?.value;
    if (val === undefined) return;
    const option = question.options[Number(val)];
    option.scores.forEach((score, index) => {
      scores[index] += score;
    });
  });
  return buildResultFromScores(scores);
};

let radarChartInstance = null;

const renderResult = (result) => {
  if (!resultSummary || !resultTags) return;
  const profile = resultProfiles[result.primary.index];
  resultSummary.innerHTML = `主层级：${layerNames[result.primary.index]} · 一致性 ${result.consistency}% · 标签：${profile.label}`;

  // Render Chart
  const ctx = document.getElementById('radarChart');
  if (ctx) {
    if (radarChartInstance) radarChartInstance.destroy();
    radarChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: layerNames,
        datasets: [{
          label: '认知维度得分',
          data: result.scores,
          backgroundColor: 'rgba(97, 211, 196, 0.2)',
          borderColor: '#61d3c4',
          pointBackgroundColor: '#f0b45b',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#f0b45b'
        }]
      },
      options: {
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            pointLabels: { color: '#e9f0ff', font: { size: 14 } },
            ticks: { display: false, backdropColor: 'transparent' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // Determine Nono Level based on total score or primary index?
  // Use Primary Index for simple mapping to the 5 models (approximate)
  // 0: Facts -> Green (Raw)
  // 1: Structure -> Peeling
  // 2: Model -> Matrix
  // 3: Counter -> Glitch
  // 4: Self -> Zen
  // This maps perfectly to the 5 dimensions.
  // This maps perfectly to the 5 dimensions.
  const nonoIndex = result.primary.index;
  const nono = nonoLevels[nonoIndex];
  const nonoAsset = getNonoAsset(nonoIndex);

  // Calculate DNA for display
  const dna = CardGenerator.calculateDNA(result);

  // History Comparison
  const history = getResults();
  let comparisonHTML = "";
  // history[0] is current (just saved), history[1] is previous
  if (history.length > 1) {
    const prev = history[1]; // previous run
    const scoreDiff = result.total - prev.total;
    const consistencyDiff = result.consistency - prev.consistency;

    const sign = (num) => num > 0 ? "+" : "";
    const color = (num) => num > 0 ? "#61d3c4" : (num < 0 ? "#ff6b6b" : "#a9b4c9");

    comparisonHTML = `
        <div class="card" style="border-left: 4px solid #61d3c4;">
            <h3>认知迭代 (vs 上次)</h3>
            <div style="display: flex; gap: 20px;">
                <div>
                    <div class="micro">总能量变化</div>
                    <div style="font-size: 1.2em; color: ${color(scoreDiff)}">${sign(scoreDiff)}${scoreDiff}</div>
                </div>
                <div>
                    <div class="micro">一致性变化</div>
                    <div style="font-size: 1.2em; color: ${color(consistencyDiff)}">${sign(consistencyDiff)}${consistencyDiff}%</div>
                </div>
                <div>
                    <div class="micro">上次形态</div>
                    <div>${layerNames[prev.primaryIndex]}</div>
                </div>
            </div>
            <p class="micro" style="margin-top:10px; opacity:0.8">你的认知模型正在${scoreDiff >= 0 ? "强化" : "重组"}中。</p>
        </div>
      `;
  }

  resultTags.innerHTML = `
    ${comparisonHTML}
    <div class="card nono-card" style="grid-column: span 3; display: flex; align-items: center; gap: 20px;">
      <div style="flex-shrink: 0;">${nonoAsset}</div>
      <div>
        <h3 style="color:${nono.color}">${nono.name}</h3>
        <p class="lead" style="margin-bottom: 0;">${nono.desc}</p>
        <div class="micro" style="margin-top: 8px; font-family: monospace; opacity: 0.8; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 5px;">
           DNA: H${Math.round(dna.hueShift)} G${Math.round(dna.glitchIntensity * 100)} M${Math.round(dna.matrixOpacity * 100)} <br/>
           GEN: ${dna.seed.slice(-8).toUpperCase()}
        </div>
        <p class="micro" style="opacity: 0.6; margin-top: 5px;">进化建议：多进行"${layerNames[(nonoIndex + 1) % 5]}"训练可解锁下一形态</p>
      </div>
    </div>
    <div class="card">
      <h3>用户标签与画像</h3>
      <p>${profile.label} · ${profile.summary}</p>
      <p class="micro">次优层级：${layerNames[result.secondary.index]}</p>
    </div>
    <div class="card">
      <h3>高频误判场景</h3>
      <ul class="checks">
        ${profile.scenarios.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>
    <div class="card">
      <h3>行动建议</h3>
      <p>${profile.advice}</p>
    </div>
  `;
};

const resetShareCard = () => {
  if (shareCardImage) shareCardImage.removeAttribute("src");
  if (downloadShareCard) downloadShareCard.setAttribute("href", "#");
};

let currentChallengeIndex = null;

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getDailyChallengeIndex = (forceNew = false) => {
  const raw = localStorage.getItem(challengeStorageKey);
  const stored = raw ? JSON.parse(raw) : null;
  const today = getTodayKey();
  if (stored && stored.date === today && !forceNew) {
    return stored.index;
  }
  let index = Math.floor(Math.random() * dailyChallenges.length);
  if (stored && stored.index === index && dailyChallenges.length > 1) {
    index = (index + 1) % dailyChallenges.length;
  }
  localStorage.setItem(challengeStorageKey, JSON.stringify({ date: today, index }));
  return index;
};

const renderDailyChallenge = (forceNew = false) => {
  if (!dailyChallenge) return;
  const index = getDailyChallengeIndex(forceNew);
  currentChallengeIndex = index;
  dailyChallenge.innerHTML = `
    <div class="micro">今日情境</div>
    <div><strong>${dailyChallenges[index]}</strong></div>
  `;
};

const buildShareCard = async (result) => {
  // Ensure assets are loaded
  await CardGenerator.preloadAssets();

  const canvas = document.createElement("canvas");
  canvas.width = CardGenerator.width;
  canvas.height = CardGenerator.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  await CardGenerator.generate(result, ctx);

  return canvas.toDataURL("image/png");
};

// Shim for backward compatibility or lingering references
const renderAssessment = () => {
  console.warn("Using deprecated renderAssessment shim.");
  renderCurrentQuestion();
};

if (assessmentForm) {
  // assessmentReset and progress logic handled internally by new functions
  assessmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const unanswered = assessmentQuestions.filter(
      (question) => !assessmentForm.querySelector(`input[name="${question.id}"]`)
    );
    if (unanswered.length > 0) {
      setStatus(shareStatus, "请先完成所有题目", true);
      return;
    }
    const result = calculateResult();
    renderResult(result);
    const record = createResultRecord(result);
    currentResult = { ...record, ...result };
    const results = getResults();
    results.unshift(record);
    saveResults(results.slice(0, 30));
    renderResultHistory();
    resetShareCard();
    setStatus(shareStatus, "结果已生成并保存");
    await syncGrowthEvent("assessment_completed", {
      primaryLayer: layerNames[result.primary.index],
      consistency: result.consistency
    });
  });
}



if (resultHistoryList) {
  resultHistoryList.addEventListener("click", (event) => {
    const item = event.target.closest("[data-result-id]");
    if (!item) return;
    const results = getResults();
    const record = results.find((entry) => entry.id === item.dataset.resultId);
    if (!record) return;
    const result = buildResultFromScores(record.scores);
    currentResult = { ...record, ...result };
    renderResult(result);
    resetShareCard();
    setStatus(shareStatus, "已加载历史结果");
  });
}

if (generateShareCardButton) {
  generateShareCardButton.addEventListener("click", async () => {
    if (!currentResult) {
      setStatus(shareStatus, "请先完成测评", true);
      return;
    }
    setStatus(shareStatus, "分享图生成中");
    // Give UI a moment to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    let dataUrl = "";
    try {
      dataUrl = await buildShareCard(currentResult);
    } catch (e) {
      console.error(e);
      setStatus(shareStatus, "生成出错", true);
      return;
    }

    if (!dataUrl) {
      setStatus(shareStatus, "分享图生成失败", true);
      return;
    }

    // Success: Update UI
    if (shareCardImage) shareCardImage.src = dataUrl;
    if (downloadShareCard) downloadShareCard.href = dataUrl;

    recordGrowthAction("cardCount");
    await syncGrowthEvent("share_card", {
      primaryLayer: layerNames[currentResult.primary.index],
      consistency: currentResult.consistency
    });

    setStatus(shareStatus, "分享图已生成");
  });
}

// --- Generation Animation Logic ---

const generationOverlay = document.getElementById("generation-overlay");
const genLog = document.getElementById("gen-log");
const genBar = document.getElementById("gen-bar");

const addLog = (text) => {
  if (!genLog) return;
  const line = document.createElement("div");
  line.textContent = `> ${text}`;
  genLog.appendChild(line);
  genLog.scrollTop = genLog.scrollHeight;
};

const runGenerationSequence = async (result) => {
  if (!generationOverlay) return;

  // Show Overlay
  generationOverlay.hidden = false;
  generationOverlay.style.display = "flex"; // Ensure flex display
  if (genLog) genLog.innerHTML = "";
  if (genBar) genBar.style.width = "0%";

  const steps = [
    { txt: "初始化认知矩阵...", t: 200 },
    { txt: `读取当前状态: ${layerNames[result.primary.index]}`, t: 600 },
    { txt: "提取 DNA 序列...", t: 1000 },
    { txt: "计算视觉参数 (Hue/Glitch/Matrix)...", t: 1500 },
    { txt: "加载 3D 资产...", t: 2000 },
    { txt: "应用 High-Fidelity 滤镜...", t: 2800 },
    { txt: "合成最终纹理...", t: 3500 },
    { txt: "铸造唯一哈希...", t: 4000 },
    { txt: "生成完成.", t: 4200 }
  ];

  const totalTime = 4500;
  const startTime = Date.now();

  // Progress Bar Animation
  const progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const pct = Math.min(100, (elapsed / totalTime) * 100);
    if (genBar) genBar.style.width = `${pct}%`;
    if (elapsed >= totalTime) clearInterval(progressInterval);
  }, 16);

  // Log Animation
  for (const step of steps) {
    setTimeout(() => addLog(step.txt), step.t);
  }

  // Wait for finish
  await new Promise(r => setTimeout(r, totalTime));

  // Hide Overlay
  generationOverlay.style.display = "none";
  generationOverlay.hidden = true;
};

// Update Generate Button to use sequence
if (generateShareCardButton) {
  // Remove old listener (hacky way, or just replace behavior if we can't remove)
  // Since we are replacing the entire block in the tool call, we rewrite the listener.
  const newButton = generateShareCardButton.cloneNode(true);
  generateShareCardButton.parentNode.replaceChild(newButton, generateShareCardButton);

  newButton.addEventListener("click", async () => {
    if (!currentResult) {
      setStatus(shareStatus, "请先完成测评", true);
      return;
    }

    // Start Animation Sequence
    const animPromise = runGenerationSequence(currentResult);

    // Start Generation in background
    let dataUrl = "";
    try {
      dataUrl = await buildShareCard(currentResult);
    } catch (e) {
      console.error(e);
    }

    // Wait for animation to finish (at least)
    await animPromise;

    if (!dataUrl) {
      setStatus(shareStatus, "生成出错", true);
      return;
    }

    if (shareCardImage) shareCardImage.src = dataUrl;
    if (downloadShareCard) downloadShareCard.href = dataUrl;

    recordGrowthAction("cardCount");
    await syncGrowthEvent("share_card", {
      primaryLayer: layerNames[currentResult.primary.index],
      consistency: currentResult.consistency
    });

    setStatus(shareStatus, "分享图已生成");
  });
}


if (refreshChallengeButton) {
  refreshChallengeButton.addEventListener("click", () => {
    renderDailyChallenge(true);
    setStatus(shareStatus, "已更新今日挑战");
  });
}

if (saveChallengeButton) {
  saveChallengeButton.addEventListener("click", () => {
    if (currentChallengeIndex === null) {
      setStatus(shareStatus, "请先生成今日挑战", true);
      return;
    }
    const logs = getLogs();
    logs.unshift({
      problem: dailyChallenges[currentChallengeIndex],
      model: "每日挑战",
      date: new Date().toLocaleString()
    });
    saveLogs(logs.slice(0, 20));
    renderLogs();
    setStatus(shareStatus, "已保存挑战到日志");
  });
}

const buildRunnerReport = () => {
  if (!runnerForm) return null;
  const payload = {
    problem: document.getElementById("runner-problem").value.trim(),
    facts: document.getElementById("runner-facts").value.trim(),
    structure: document.getElementById("runner-structure").value.trim(),
    model: document.getElementById("runner-model").value.trim(),
    counter: document.getElementById("runner-counter").value.trim(),
    self: document.getElementById("runner-self").value.trim()
  };
  const isValid = Object.values(payload).every((value) => value.length > 0);
  if (!isValid) return null;
  return payload;
};

const renderRunnerReport = (data) => {
  if (!runnerResult) return;
  runnerResult.innerHTML = `
    <div><strong>问题：</strong>${data.problem}</div>
    <div><strong>事实：</strong>${data.facts}</div>
    <div><strong>结构：</strong>${data.structure}</div>
    <div><strong>模型：</strong>${data.model}</div>
    <div><strong>反直觉：</strong>${data.counter}</div>
    <div><strong>自我：</strong>${data.self}</div>
  `;
};

const getLogs = () => {
  const raw = localStorage.getItem(logStorageKey);
  return raw ? JSON.parse(raw) : [];
};

const saveLogs = (logs) => {
  localStorage.setItem(logStorageKey, JSON.stringify(logs));
};

const renderLogs = () => {
  if (!logList) return;
  const logs = getLogs();
  if (logs.length === 0) {
    logList.innerHTML = "<div class=\"micro\">暂无日志</div>";
    return;
  }
  logList.innerHTML = logs
    .map(
      (log) => `<div class="log-item">
        <div class="log-meta">${log.date}</div>
        <div><strong>${log.problem}</strong></div>
        <div class="micro">模型：${log.model}</div>
      </div>`
    )
    .join("");
};

if (runnerForm) {
  runnerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const report = buildRunnerReport();
    if (!report) {
      runnerResult.textContent = "请完整填写五层信息。";
      return;
    }
    renderRunnerReport(report);
  });
}

if (saveLogButton) {
  saveLogButton.addEventListener("click", () => {
    const report = buildRunnerReport();
    if (!report) {
      setStatus(shareStatus, "请先生成报告", true);
      return;
    }
    const logs = getLogs();
    logs.unshift({
      problem: report.problem,
      model: report.model,
      date: new Date().toLocaleString()
    });
    saveLogs(logs.slice(0, 20));
    renderLogs();
    setStatus(shareStatus, "已保存到日志");
  });
}

const renderModels = () => {
  if (!modelCards) return;
  modelCards.innerHTML = modelLibrary
    .map(
      (model) => `<div class="card model-card">
        <h3>${model.name}</h3>
        <p>${model.definition}</p>
        <p class="micro">何时用：${model.use}</p>
        <p class="micro">误用：${model.misuse}</p>
        <p class="micro">示例：${model.example}</p>
      </div>`
    )
    .join("");
};

if (refreshLeaderboardButton) {
  refreshLeaderboardButton.addEventListener("click", async () => {
    if (!backendOnline) {
      renderLeaderboard([]);
      setStatus(shareStatus, "后端离线，无法刷新排行", true);
      return;
    }
    try {
      const leaderboard = await fetchLeaderboard();
      renderLeaderboard(leaderboard);
      setStatus(shareStatus, "排行榜已刷新");
    } catch (error) {
      setStatus(shareStatus, "排行榜刷新失败", true);
    }
  });
}

const initGrowthData = async () => {
  renderInvitePanel();
  renderGrowthPanel();
  renderCampaignBanner();
  renderLeaderboard([]);
  const online = await detectGrowthBackend();
  if (!online) return;
  try {
    await registerGrowthProfile();
    await refreshRemoteGrowth();
    renderGrowthPanel();
    const leaderboard = await fetchLeaderboard();
    renderLeaderboard(leaderboard);
  } catch (error) {
    setBackendStatus("后端状态：在线但读取失败", true);
  }
};

renderModels();
renderDailyChallenge();
renderLogs();
renderResultHistory();
const shouldInitGrowth =
  Boolean(backendStatusNode) ||
  Boolean(copyInviteLinkButton) ||
  Boolean(copyInviteTextButton) ||
  Boolean(growthShareCount) ||
  Boolean(growthScore) ||
  Boolean(leaderboardList) ||
  Boolean(refreshLeaderboardButton);
if (shouldInitGrowth) {
  initGrowthData();
}
