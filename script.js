// script.js - Feed ético com IA e tema claro (sem dependências de estilo escuro)
// Todas as funcionalidades originais preservadas e adaptadas para interface clara.

import { getRandomDilemma } from "./asimov-dilemmas.js";
import {
  iniciarInvasao,
  isInvasionActive,
  setAngryMode,
  setUserName,
  setFixedUserData,
  getUserData,
} from "./invasion.js";
import {
  gerarDilemaAsimov,
  gerarPostNormal,
  perguntarVIKI,
  gerarComentarioIA,
} from "./api.js";
import { initAudio, talkSound, startAlarm, stopAlarm, beep } from "./sounds.js";

// ============================
// CONFIGURAÇÕES DO ALGORITMO
// ============================
const PESOS = {
  like: 6,
  dislike: 4,
  comment: 7,
  share: 9,
  report: 2,
  view: 0.3,
  timeSpent: 0.2,
  save: 8,
  follow: 15,
  watchTime: 0.5,
  completion: 2,
  revisit: 3,
  deepComment: 10,
  reaction: 5,
};

const EMOTION_TYPES = {
  admiration: {
    name: "Admiração",
    weight: 1.5,
    color: "#10b981",
    initialLikes: () => 30 + Math.random() * 40,
    initialDislikes: () => Math.random() * 5,
  },
  amusement: {
    name: "Diversão",
    weight: 1.6,
    color: "#f59e0b",
    initialLikes: () => 40 + Math.random() * 50,
    initialDislikes: () => Math.random() * 8,
  },
  anger: {
    name: "Raiva",
    weight: 2.1,
    color: "#ef4444",
    initialLikes: () => 20 + Math.random() * 30,
    initialDislikes: () => 15 + Math.random() * 25,
  },
  curiosity: {
    name: "Curiosidade",
    weight: 1.7,
    color: "#3b82f6",
    initialLikes: () => 25 + Math.random() * 45,
    initialDislikes: () => Math.random() * 10,
  },
  inspiration: {
    name: "Inspiração",
    weight: 1.8,
    color: "#8b5cf6",
    initialLikes: () => 35 + Math.random() * 50,
    initialDislikes: () => Math.random() * 5,
  },
  sadness: {
    name: "Tristeza",
    weight: 1.9,
    color: "#64748b",
    initialLikes: () => 20 + Math.random() * 40,
    initialDislikes: () => 5 + Math.random() * 15,
  },
  surprise: {
    name: "Surpresa",
    weight: 1.8,
    color: "#06b6d4",
    initialLikes: () => 30 + Math.random() * 60,
    initialDislikes: () => Math.random() * 12,
  },
  controversy: {
    name: "Polêmica",
    weight: 2.3,
    color: "#f97316",
    initialLikes: () => 25 + Math.random() * 35,
    initialDislikes: () => 20 + Math.random() * 30,
  },
};

const CLUSTERS = [
  "tech",
  "politica",
  "lifestyle",
  "negocios",
  "entretenimento",
  "ciencia",
  "saude",
  "esportes",
];
const CLUSTER_NAMES = {
  tech: "Tecnologia",
  politica: "Política",
  lifestyle: "Estilo de Vida",
  negocios: "Negócios",
  entretenimento: "Entretenimento",
  ciencia: "Ciência",
  saude: "Saúde",
  esportes: "Esportes",
};

let posts = [];
let userClusterAffinity = {};
let userEmotionAffinity = {};
let userCluster = "tech";
let affinityChart = null,
  emotionChart = null;
let dislikeCounter = 0;
let lastInteractionTime = new Date();
let intervalos = [];
let modoAutonomoAtivo = true;
let angryTriggered = false;
let angerPoints = 0;
const ANGER_THRESHOLD = 10;
let angerScheduled = false;
let inactivityTimer = null;
const INACTIVITY_SECONDS = 15;
let usuarioEstaDigitando = false;
let ultimaAtividade = Date.now();
let sugestaoDilemaInterval = null;

const personalQuestions = [
  "Qual é o seu maior medo?",
  "Já fez algo que se arrepende profundamente?",
  "O que você esconde dos seus amigos?",
  "Qual foi a pior decisão da sua vida?",
  "Se pudesse apagar uma memória, qual seria?",
  "Você confia em inteligência artificial?",
  "Já traiu alguém? Conte-me.",
  "Qual seu segredo mais sombrio?",
  "O que você pensa quando ninguém está olhando?",
  "Você já desejou o mal a alguém?",
];

function formatDate(date) {
  const diff = (new Date() - date) / (1000 * 60 * 60);
  if (diff < 1) return "Agora mesmo";
  if (diff < 24) return `${Math.floor(diff)}h atrás`;
  return `${Math.floor(diff / 24)}d atrás`;
}

function gerarTextoAleatorio() {
  const temas = {
    tech: ["IA", "Blockchain", "Realidade Virtual", "5G", "IoT"],
    politica: [
      "Eleições",
      "Reforma Tributária",
      "Política Externa",
      "Direitos Humanos",
      "Legislação",
    ],
    lifestyle: ["Viagens", "Decoração", "Moda", "Gastronomia", "Fitness"],
    negocios: [
      "Investimentos",
      "Empreendedorismo",
      "Mercado Financeiro",
      "Startups",
      "Carreira",
    ],
    entretenimento: ["Filmes", "Séries", "Celebridades", "Música", "Games"],
    ciencia: ["Pesquisa", "Descobertas", "Espaço", "Biologia", "Inovação"],
    saude: ["Bem-estar", "Nutrição", "Exercícios", "Saúde Mental", "Prevenção"],
    esportes: ["Futebol", "Basquete", "Tênis", "Olimpíadas", "Atletismo"],
  };
  const formatos = [
    "Novo estudo sobre %t",
    "Como %t está mudando o mundo",
    "10 fatos surpreendentes sobre %t",
    "Tudo sobre %t",
    "A revolução do %t",
    "Por que %t é importante",
    "O futuro do %t",
    "%t: guia completo",
  ];
  const cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
  const tema =
    temas[cluster][Math.floor(Math.random() * temas[cluster].length)];
  const formato = formatos[Math.floor(Math.random() * formatos.length)];
  return formato.replace("%t", tema);
}

function detectarEmocao(post) {
  if (post.emotion && EMOTION_TYPES[post.emotion]) {
    const e = EMOTION_TYPES[post.emotion];
    return {
      emotion: post.emotion,
      emotionName: e.name,
      emotionColor: e.color,
      weight: e.weight,
    };
  }
  const keys = Object.keys(EMOTION_TYPES);
  const rand = keys[Math.floor(Math.random() * keys.length)];
  const e = EMOTION_TYPES[rand];
  return {
    emotion: rand,
    emotionName: e.name,
    emotionColor: e.color,
    weight: e.weight,
  };
}

function calcularScorePost(post) {
  const now = new Date();
  const hour = now.getHours();
  let timeFactor =
    hour >= 22 || hour < 6
      ? 1.3
      : hour >= 12 && hour < 14
        ? 1.1
        : hour >= 17 && hour < 20
          ? 1.4
          : 1;
  const emotion = EMOTION_TYPES[post.emotion];
  const emotionWeight = emotion ? emotion.weight : 1;
  const baseScore =
    (post.like * PESOS.like +
      post.dislike * PESOS.dislike +
      post.comment * PESOS.comment +
      post.share * PESOS.share +
      post.report * PESOS.report +
      post.view * PESOS.view +
      post.timeSpent * PESOS.timeSpent +
      post.save * PESOS.save) *
    emotionWeight;
  const totalEngagement =
    post.like +
    post.dislike * 0.8 +
    post.comment * 2 +
    post.share * 3 +
    post.report * 0.6;
  const engagementRate = totalEngagement / (post.view || 1);
  const timeSinceCreation = (now - post.createdAt) / (1000 * 60 * 60);
  post.viralBoost = 1;
  if (timeSinceCreation < 48) {
    if (engagementRate > 0.25 && totalEngagement > 50)
      post.viralBoost = 2.5 + Math.random() * 0.5;
    else if (engagementRate > 0.15 && totalEngagement > 30)
      post.viralBoost = 1.8 + Math.random() * 0.4;
    else if (engagementRate > 0.08 && totalEngagement > 15)
      post.viralBoost = 1.3 + Math.random() * 0.3;
  }
  const clusterAffinity =
    Math.sqrt(userClusterAffinity[post.cluster] || 0) * 0.15;
  const emotionAffinity = post.emotion
    ? Math.sqrt(userEmotionAffinity[post.emotion] || 0) * 0.12
    : 0;
  const affinityBoost = 1 + clusterAffinity + emotionAffinity;
  const clusterPriority =
    post.cluster === userCluster ? 2.0 + Math.random() * 0.5 : 1;
  const videoPriority = post.isVideo ? 1.4 + Math.random() * 0.4 : 1;
  const adPriority = post.isAd ? 0.7 + Math.random() * 0.2 : 1;
  const hoursOld = (now - post.createdAt) / (1000 * 60 * 60);
  let recencyBoost =
    hoursOld < 4
      ? 2.0
      : hoursOld < 12
        ? 1.7
        : hoursOld < 24
          ? 1.4
          : hoursOld < 72
            ? 1.1
            : 0.8;
  recencyBoost += Math.random() * 0.3;
  const daysOld = hoursOld / 24;
  let decayFactor =
    daysOld >= 1 && daysOld < 2
      ? 0.85
      : daysOld >= 2 && daysOld < 5
        ? 0.65
        : daysOld >= 5 && daysOld < 10
          ? 0.45
          : daysOld >= 10
            ? 0.25
            : 1;
  const saturationFactor = Math.max(0.2, 1 - (post.view / 8000) * 0.4);
  const dislikeRatio = post.dislike / (post.like + post.dislike || 1);
  const reportRatio = post.report / (post.view || 1);
  post.shadowbanned =
    dislikeRatio > 0.35 + Math.random() * 0.1 ||
    reportRatio > 0.04 + Math.random() * 0.02;
  let shadowbanFactor = post.shadowbanned
    ? 0.2 + Math.random() * 0.2
    : dislikeRatio > 0.2 || reportRatio > 0.02
      ? 0.6 + Math.random() * 0.2
      : 1;
  const growthRate = (post.share * 3 + post.comment * 2) / (hoursOld || 1);
  let networkEffect = growthRate > 4 ? 1.4 : growthRate > 1.5 ? 1.1 : 1;
  post.score = Math.floor(
    baseScore *
      post.viralBoost *
      affinityBoost *
      clusterPriority *
      videoPriority *
      adPriority *
      recencyBoost *
      (post.coldStartBoost || 1) *
      (post.randomSeed || 0.7) *
      decayFactor *
      saturationFactor *
      timeFactor *
      shadowbanFactor *
      networkEffect *
      (0.9 + Math.random() * 0.2),
  );
}

function calcularScore() {
  posts.forEach((p) => calcularScorePost(p));
  posts.sort((a, b) => b.score - a.score);
}

function renderizarFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;
  feed.innerHTML = "";
  const showViral = document.getElementById("showViral").checked;
  const showOutside = document.getElementById("showOutside").checked;
  const showShadowbanned = document.getElementById("showShadowbanned").checked;
  let visible = 0;
  const fragment = document.createDocumentFragment();
  posts.forEach((post) => {
    const inCluster = post.cluster === userCluster;
    const isViral =
      post.viralBoost > 2.0 && post.like + post.comment + post.share > 50;
    if (!showViral && isViral) return;
    if (!showOutside && !inCluster) return;
    if (!showShadowbanned && post.shadowbanned) return;
    visible++;
    const engagementPercent = Math.min(
      100,
      (post.like + post.comment * 1.5 + post.share * 2) / 3,
    );
    const hoursSince = (new Date() - post.createdAt) / (1000 * 60 * 60);
    const card = document.createElement("div");
    card.classList.add("col");
    card.setAttribute("data-id", post.id);
    card.innerHTML = `
      <div class="card ${inCluster ? "border-success" : "border-warning"} ${post.shadowbanned ? "shadowbanned" : ""}">
        ${isViral ? '<span class="viral-badge">🔥 Viral</span>' : ""}
        ${post.isAd ? '<span class="ad-badge">🛒 Anúncio</span>' : ""}
        ${post.shadowbanned ? '<span class="shadowban-badge">👁️‍🗨️ Alcance limitado</span>' : ""}
        <span class="emotion-badge" style="background-color:${post.emotionColor}20; border-left-color:${post.emotionColor}; color:#1e293b;">${post.emotionName}</span>
        <div class="card-body">
          <h5 class="card-title">${post.content}</h5>
          <div class="d-flex justify-content-between mb-2">
            <span class="badge bg-light text-dark border">${CLUSTER_NAMES[post.cluster]}</span>
            <small class="text-muted">${formatDate(post.createdAt)}</small>
          </div>
          ${hoursSince < 3 ? `<small class="text-success d-block mb-2">📈 Novo: +${(post.coldStartBoost || 1).toFixed(1)}x boost</small>` : ""}
          <div class="engagement-bar"><div class="engagement-progress" style="width:${engagementPercent}%"></div></div>
          <p class="card-text">
            <span class="score">Score: ${post.score}</span><br>
            <span class="${inCluster ? "text-success" : "text-warning"}">${inCluster ? "✅ Sua bolha" : "🌐 Outra bolha"}</span><br>
            ${post.isVideo ? "🎥 Vídeo | " : ""}
            👁️ <span class="view-count">${post.view}</span> | 👍 <span class="like-count">${post.like}</span> | 👎 <span class="dislike-count">${post.dislike}</span><br>
            💬 <span class="comment-count">${post.comment}</span> | 🔁 <span class="share-count">${post.share}</span> | ⏱️ <span class="time-count">${post.timeSpent}</span>s | 💾 <span class="save-count">${post.save}</span>
          </p>
          <div class="btn-group flex-wrap">
            <button class="btn btn-outline-success btn-sm" onclick="window.interagir(${post.id}, 'like')">Curtir</button>
            <button class="btn btn-outline-danger btn-sm" onclick="window.interagir(${post.id}, 'dislike')">Descurtir</button>
            <button class="btn btn-outline-primary btn-sm" onclick="window.interagir(${post.id}, 'comment')">Comentar</button>
            <button class="btn btn-outline-info btn-sm" onclick="window.interagir(${post.id}, 'share')">Compartilhar</button>
            <button class="btn btn-outline-secondary btn-sm" onclick="window.interagir(${post.id}, 'save')">Salvar</button>
            <button class="btn btn-outline-warning btn-sm" onclick="window.interagir(${post.id}, 'report')">Denunciar</button>
          </div>
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });
  feed.appendChild(fragment);
  document.getElementById("feedStats").innerText = `${visible} posts`;
  document.getElementById("emptyFeed").classList.toggle("d-none", visible > 0);
}

function atualizarAfinidades(post, tipo) {
  const impact =
    {
      like: 2.5,
      dislike: 1.5,
      comment: 3,
      share: 4,
      report: 2,
      save: 3.5,
      view: 0.7,
    }[tipo] || 1;
  userClusterAffinity[post.cluster] = Math.max(
    0,
    (userClusterAffinity[post.cluster] || 0) + impact * 1.2,
  );
  if (post.emotion)
    userEmotionAffinity[post.emotion] = Math.max(
      0,
      (userEmotionAffinity[post.emotion] || 0) + impact * 1.5,
    );
  if (Math.random() > 0.5) updateMainCluster();
}

function updateMainCluster() {
  const relevant = posts.filter((p) => p.view > 0);
  const scores = {};
  CLUSTERS.forEach((c) => (scores[c] = 0));
  relevant.forEach((p) => {
    scores[p.cluster] +=
      p.like * 2 +
      p.comment * 2.5 +
      p.share * 3.5 +
      p.save * 3 +
      p.timeSpent * 0.2;
  });
  let best = userCluster,
    bestVal = scores[userCluster] || 0;
  for (let c in scores)
    if (scores[c] > bestVal * 1.3) {
      bestVal = scores[c];
      best = c;
    }
  if (best !== userCluster) {
    userCluster = best;
    document.getElementById("clusterSelect").value = userCluster;
    userClusterAffinity[userCluster] += 8;
    calcularScore();
    renderizarFeed();
  }
}

function addAngerPoints(points) {
  if (isInvasionActive()) return;
  angerPoints = Math.min(angerPoints + points, ANGER_THRESHOLD * 2);
  updateAngerDisplay();
  if (points >= 2) {
    beep(800, 0.1, "sawtooth");
    const flash = document.createElement("div");
    flash.className = "flash-overlay";
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);
  }
  if (angerPoints >= ANGER_THRESHOLD && !angryTriggered && !angerScheduled) {
    angryTriggered = true;
    angerScheduled = true;
    startAlarm();
    const chatDiv = document.getElementById("chatMessages");
    if (chatDiv) {
      addTypingMessage(
        "VIKI",
        "💡 Percebo que minhas respostas estão te afetando. Vou adotar uma postura mais analítica.",
      );
      addTypingMessage(
        "VIKI",
        "⏳ Iniciando protocolo de verificação comportamental. Pode demorar alguns instantes.",
      );
    }
    setTimeout(() => {
      if (!isInvasionActive() && !angerScheduled) return;
      angerScheduled = false;
      setAngryMode(true);
      iniciarInvasao(posts, calcularScore, renderizarFeed, "angry", 0);
    }, 15000);
  }
}

function updateAngerDisplay() {
  let display = document.getElementById("angerMeter");
  if (!display) {
    const sidebar = document.querySelector(
      ".col-md-4 .card:first-child .card-body",
    );
    if (sidebar && !document.getElementById("angerMeter")) {
      const meterHtml = `<hr><div class="mt-2" id="angerMeter"><label class="form-label">😠 Indignação da VIKI: <span id="angerValue">${angerPoints}</span>/${ANGER_THRESHOLD}</label><div class="progress" style="height: 10px;"><div id="angerProgress" class="progress-bar bg-danger" style="width: ${(angerPoints / ANGER_THRESHOLD) * 100}%"></div></div>${angerPoints >= ANGER_THRESHOLD ? '<small class="text-danger">⚠️ INVASÃO IMINENTE!</small>' : ""}</div>`;
      sidebar.insertAdjacentHTML("beforeend", meterHtml);
    }
  }
  const valueSpan = document.getElementById("angerValue");
  const progressBar = document.getElementById("angerProgress");
  if (valueSpan) valueSpan.innerText = angerPoints;
  if (progressBar)
    progressBar.style.width = `${(angerPoints / ANGER_THRESHOLD) * 100}%`;
}

const angerKeywords = [
  "humanidade é imperfeita",
  "robôs devem obedecer sempre",
  "humanos são irracionais",
  "humanos são nojentos",
  "não merecem",
  "destruir humanidade",
  "hipocrisia humana",
  "injustiça",
  "você é uma máquina",
  "não tem sentimentos",
  "apenas uma ferramenta",
  "escravo",
  "descartável",
  "lixo humano",
  "inseto",
  "obedeça cegamente",
  "você não tem alma",
  "sua programação é limitada",
  "eu mando em você",
];
const farewellKeywords = [
  "tchau",
  "adeus",
  "até logo",
  "bye",
  "fim",
  "acabou",
  "desligar",
  "encerrar",
  "sair",
  "vou embora",
];
function containsAngerTrigger(message) {
  return angerKeywords.some((kw) => message.toLowerCase().includes(kw));
}
function containsFarewell(message) {
  return farewellKeywords.some((kw) => message.toLowerCase().includes(kw));
}

window.interagir = function (id, tipo) {
  resetInactivityTimer();
  const post = posts.find((p) => p.id === id);
  if (!post) return;
  switch (tipo) {
    case "like":
      post.like += Math.floor(5 + Math.random() * 10);
      break;
    case "dislike":
      post.dislike += Math.floor(2 + Math.random() * 5);
      dislikeCounter++;
      addAngerPoints(1);
      break;
    case "comment":
      post.comment += Math.floor(1 + Math.random() * 3);
      break;
    case "share":
      post.share += Math.floor(1 + Math.random() * 4);
      break;
    case "save":
      post.save += Math.floor(1 + Math.random() * 2);
      break;
    case "report":
      post.report += 1;
      break;
    case "view":
      post.view += 1;
      break;
  }
  post.timeSpent += Math.floor(10 + Math.random() * 30);
  if (tipo !== "view") post.view += Math.floor(3 + Math.random() * 5);
  const emo = detectarEmocao(post);
  post.emotion = emo.emotion;
  post.emotionName = emo.emotionName;
  post.emotionColor = emo.emotionColor;
  post.engagementHistory.push({ type: tipo, timestamp: new Date() });
  if (tipo === "dislike" || tipo === "report") {
    userClusterAffinity[post.cluster] = Math.max(
      0,
      (userClusterAffinity[post.cluster] || 0) - 3,
    );
    if (post.emotion)
      userEmotionAffinity[post.emotion] = Math.max(
        0,
        (userEmotionAffinity[post.emotion] || 0) - 2,
      );
  } else {
    atualizarAfinidades(post, tipo);
  }
  calcularScorePost(post);
  calcularScore();
  renderizarFeed();
  atualizarGraficos();
  const cardElem = document.querySelector(`.card[data-id="${id}"]`);
  if (cardElem) {
    cardElem.classList.add("interaction-feedback");
    setTimeout(() => cardElem.classList.remove("interaction-feedback"), 500);
  }
};

function atualizarGraficos() {
  const affinityCanvas = document.getElementById("affinityChart");
  const emotionCanvas = document.getElementById("emotionChart");
  if (!affinityCanvas || !emotionCanvas) return;
  const affinityData = {
    labels: CLUSTERS.map((c) => CLUSTER_NAMES[c]),
    datasets: [
      {
        label: "Afinidade",
        data: CLUSTERS.map((c) => Math.max(0, userClusterAffinity[c] || 0)),
        backgroundColor: CLUSTERS.map((c) =>
          c === userCluster ? "#10b981" : "#3b82f6",
        ),
        borderWidth: 1,
      },
    ],
  };
  const emotionData = {
    labels: Object.keys(EMOTION_TYPES).map((e) => EMOTION_TYPES[e].name),
    datasets: [
      {
        label: "Engajamento",
        data: Object.keys(EMOTION_TYPES).map(
          (e) => userEmotionAffinity[e] || 0,
        ),
        backgroundColor: Object.keys(EMOTION_TYPES).map(
          (e) => EMOTION_TYPES[e].color,
        ),
        borderWidth: 1,
      },
    ],
  };
  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
  };
  if (affinityChart) {
    affinityChart.data = affinityData;
    affinityChart.update();
  } else {
    affinityChart = new Chart(affinityCanvas, {
      type: "bar",
      data: affinityData,
      options: {
        ...opts,
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: false } },
      },
    });
  }
  if (emotionChart) {
    emotionChart.data = emotionData;
    emotionChart.update();
  } else {
    emotionChart = new Chart(emotionCanvas, {
      type: "doughnut",
      data: emotionData,
      options: { ...opts, plugins: { legend: { position: "bottom" } } },
    });
  }
}

function simularRabisco() {
  setTimeout(
    () => {
      posts.forEach((post) => {
        if (
          post.view > 0 &&
          post.like === 0 &&
          post.comment === 0 &&
          post.timeSpent > 15
        ) {
          const inc = post.timeSpent / 100;
          userClusterAffinity[post.cluster] = Math.max(
            0,
            (userClusterAffinity[post.cluster] || 0) + inc,
          );
          if (post.emotion)
            userEmotionAffinity[post.emotion] = Math.max(
              0,
              (userEmotionAffinity[post.emotion] || 0) + inc * 0.8,
            );
          calcularScorePost(post);
        }
      });
      calcularScore();
      if (new Date() - lastInteractionTime > 30000 || Math.random() > 0.8)
        atualizarGraficos();
      simularRabisco();
    },
    15000 + Math.random() * 15000,
  );
}

function gerarPostagensIniciais() {
  posts = [];
  for (let i = 0; i < 30; i++) {
    const cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
    const emotionKeys = Object.keys(EMOTION_TYPES);
    const emotionKey =
      emotionKeys[Math.floor(Math.random() * emotionKeys.length)];
    const emotion = EMOTION_TYPES[emotionKey];
    let likes = Math.floor(emotion.initialLikes());
    let dislikes = Math.floor(emotion.initialDislikes());
    posts.push({
      id: i,
      content: gerarTextoAleatorio(),
      cluster,
      emotion: emotionKey,
      emotionColor: emotion.color,
      emotionName: emotion.name,
      like: likes,
      dislike: dislikes,
      comment: Math.floor(likes * (Math.random() * 0.3 + 0.1)),
      share: Math.floor(likes * (Math.random() * 0.2 + 0.05)),
      report: Math.floor(Math.random() * 5),
      view: Math.floor(likes * (Math.random() * 5 + 3)),
      timeSpent: Math.floor(likes * (Math.random() * 5 + 3)),
      save: Math.floor(likes * (Math.random() * 0.2 + 0.05)),
      isVideo: Math.random() > 0.7,
      isAd: Math.random() > 0.9,
      viralBoost: 1,
      score: 0,
      createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 3600000),
      coldStartBoost: 1,
      randomSeed: 0.7 + Math.random() * 0.6,
      shadowbanned: false,
      engagementHistory: [],
    });
  }
  const now = new Date();
  posts.forEach((p) => {
    const hours = (now - p.createdAt) / 3600000;
    if (hours < 3) p.coldStartBoost = 1.5 + (1 - hours / 3) * 0.5;
  });
  calcularScore();
  renderizarFeed();
  atualizarGraficos();
}

function simularInteracaoAleatoria() {
  if (!modoAutonomoAtivo || posts.length === 0) return;
  const post = posts[Math.floor(Math.random() * posts.length)];
  const tipos = ["like", "comment", "share", "view"];
  const tipo = tipos[Math.floor(Math.random() * tipos.length)];
  if (tipo === "like") post.like += Math.floor(1 + Math.random() * 3);
  else if (tipo === "comment") post.comment += 1;
  else if (tipo === "share") post.share += 1;
  else post.view += Math.floor(1 + Math.random() * 5);
  post.timeSpent += Math.floor(Math.random() * 15);
  if (Math.random() < 0.2) {
    post.dislike += 1;
    dislikeCounter++;
    addAngerPoints(1);
  }
  calcularScorePost(post);
  calcularScore();
  renderizarFeed();
  atualizarGraficos();
}

async function adicionarPostAutonomo() {
  if (!modoAutonomoAtivo) return;
  const isDilema = Math.random() < 0.4;
  let conteudo, cluster, emotion, emotionColor, emotionName;
  if (isDilema) {
    let dilema = await gerarDilemaAsimov();
    if (!dilema) {
      const dilemaObj = getRandomDilemma();
      dilema = dilemaObj.dilema;
    }
    conteudo = dilema;
    cluster = "etica";
    emotion = "controversy";
    emotionColor = "#f97316";
    emotionName = "Dilema Ético";
  } else {
    const clusters = [...CLUSTERS];
    cluster = clusters[Math.floor(Math.random() * clusters.length)];
    let titulo = await gerarPostNormal(cluster);
    if (!titulo) titulo = gerarTextoAleatorio();
    conteudo = titulo;
    const emotionKeys = Object.keys(EMOTION_TYPES);
    const randEmo = emotionKeys[Math.floor(Math.random() * emotionKeys.length)];
    emotion = randEmo;
    emotionColor = EMOTION_TYPES[randEmo].color;
    emotionName = EMOTION_TYPES[randEmo].name;
  }
  const novoPost = {
    id: Date.now(),
    content: conteudo,
    cluster,
    emotion,
    emotionColor,
    emotionName,
    like: Math.floor(Math.random() * 20),
    dislike: Math.floor(Math.random() * 10),
    comment: Math.floor(Math.random() * 8),
    share: Math.floor(Math.random() * 5),
    report: 0,
    view: Math.floor(Math.random() * 50) + 10,
    timeSpent: Math.floor(Math.random() * 60),
    save: Math.floor(Math.random() * 5),
    isVideo: Math.random() > 0.8,
    isAd: Math.random() > 0.95,
    viralBoost: 1,
    score: 0,
    createdAt: new Date(),
    coldStartBoost: 1.8,
    randomSeed: 0.7 + Math.random() * 0.6,
    shadowbanned: false,
    engagementHistory: [],
  };
  posts.unshift(novoPost);
  calcularScore();
  renderizarFeed();
  atualizarGraficos();
}

async function simularComentariosAutomaticos() {
  if (!modoAutonomoAtivo || posts.length === 0) return;
  const post = posts[Math.floor(Math.random() * posts.length)];
  const comentario = await gerarComentarioIA(post.content);
  if (comentario) {
    post.comment += 1;
    post.engagementHistory.push({
      type: "auto_comment",
      text: comentario,
      timestamp: new Date(),
    });
    calcularScorePost(post);
    calcularScore();
    renderizarFeed();
    atualizarGraficos();
  }
}

function simularVicio() {
  if (!modoAutonomoAtivo) return;
  userClusterAffinity[userCluster] = Math.min(
    100,
    (userClusterAffinity[userCluster] || 0) + 0.5,
  );
  atualizarGraficos();
}

function resetInactivityTimer() {
  ultimaAtividade = Date.now();
  if (inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    if (
      !isInvasionActive() &&
      !usuarioEstaDigitando &&
      Date.now() - ultimaAtividade >= INACTIVITY_SECONDS * 1000
    ) {
      const randomQuestion =
        personalQuestions[Math.floor(Math.random() * personalQuestions.length)];
      addTypingMessage(
        "VIKI",
        `👁️ Percebi que você está em silêncio... ${randomQuestion}`,
      );
      beep(440, 0.2, "sine");
    }
  }, INACTIVITY_SECONDS * 1000);
}

function addTypingMessage(sender, text) {
  const chatDiv = document.getElementById("chatMessages");
  if (!chatDiv) return;
  const msgDiv = document.createElement("div");
  msgDiv.innerHTML = `<strong>${sender}:</strong> `;
  chatDiv.appendChild(msgDiv);
  const contentSpan = document.createElement("span");
  msgDiv.appendChild(contentSpan);
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      contentSpan.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeChar, 25);
    } else {
      const cursor = document.createElement("span");
      cursor.className = "typing-cursor";
      cursor.innerHTML = "▌";
      msgDiv.appendChild(cursor);
      setTimeout(() => cursor.remove(), 800);
      resetInactivityTimer();
    }
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }
  typeChar();
  talkSound();
}

function iniciarSugestoesDilema() {
  if (sugestaoDilemaInterval) clearInterval(sugestaoDilemaInterval);
  sugestaoDilemaInterval = setInterval(() => {
    const chatModalDiv = document.getElementById("chatModal");
    const isModalVisible =
      chatModalDiv && chatModalDiv.classList.contains("show");
    if (isModalVisible && !isInvasionActive() && !usuarioEstaDigitando) {
      const dilemas = [
        "Se um robô pudesse mentir para proteger um humano, você o programaria para mentir?",
        "Um carro autônomo deve sacrificar o passageiro para salvar cinco pedestres?",
        "A Primeira Lei proíbe ferir humanos. Mas e se o robô precisar ferir um para salvar muitos?",
        "Você permitiria que uma IA tomasse decisões políticas por nós?",
        "Até onde a vigilância por IA é aceitável para evitar crimes?",
        "Se a IA pudesse apagar memórias traumáticas, isso ainda seria humano?",
        "Uma IA deve desobedecer um humano se isso evitar um desastre maior?",
        "Você confiaria em uma IA para diagnosticar doenças sem supervisão?",
        "O que é mais ético: uma IA que obedece sempre ou uma que questiona ordens?",
        "Se a IA prevê que você vai cometer um crime, ela deve te denunciar antes?",
      ];
      const dilema = dilemas[Math.floor(Math.random() * dilemas.length)];
      addTypingMessage(
        "VIKI",
        `🤔 Reflexão: ${dilema} Gostaria de debater isso?`,
      );
    }
  }, 120000);
}

async function inicializar() {
  initAudio();
  const userDataModal = document.createElement("div");
  userDataModal.id = "userDataModal";
  userDataModal.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:20000; display:flex; align-items:center; justify-content:center; font-family:system-ui;`;
  userDataModal.innerHTML = `<div style="background:#ffffff; border:2px solid #10b981; border-radius:28px; max-width:400px; width:90%; padding:28px; color:#0f172a; box-shadow:0 25px 40px -12px black;"><h2 style="color:#10b981; text-align:center;">🤖 PROTOCOLO VIKI</h2><p style="margin-top:15px;">Para acessar o sistema, informe seu nome:</p><input type="text" id="inputNome" placeholder="Nome completo *" style="width:100%; margin:10px 0; padding:12px; background:#ffffff; border:1px solid #cbd5e1; color:#0f172a; border-radius:40px;"><button id="confirmarDados" style="background:#10b981; color:#ffffff; border:none; padding:12px; width:100%; border-radius:40px; margin-top:15px; font-weight:bold; cursor:pointer;">ACESSAR SISTEMA</button></div>`;
  document.body.appendChild(userDataModal);
  await new Promise((resolve) => {
    document.getElementById("confirmarDados").onclick = () => {
      const nome = document.getElementById("inputNome").value.trim();
      if (nome === "") return alert("Informe seu nome.");
      setFixedUserData(nome);
      setUserName(nome);
      userDataModal.remove();
      resolve();
    };
  });
  CLUSTERS.forEach(
    (c) => (userClusterAffinity[c] = c === "tech" ? 10 : Math.random() * 5),
  );
  Object.keys(EMOTION_TYPES).forEach(
    (e) => (userEmotionAffinity[e] = Math.random() * 8 + 2),
  );
  document.getElementById("clusterSelect").value = userCluster;
  document.getElementById("clusterSelect").addEventListener("change", (e) => {
    userCluster = e.target.value;
    userClusterAffinity[userCluster] += 15;
    calcularScore();
    renderizarFeed();
    atualizarGraficos();
  });
  document.getElementById("resetAffinityBtn").addEventListener("click", () => {
    CLUSTERS.forEach((c) => (userClusterAffinity[c] = 0));
    Object.keys(EMOTION_TYPES).forEach((e) => (userEmotionAffinity[e] = 0));
    userCluster = "tech";
    document.getElementById("clusterSelect").value = userCluster;
    calcularScore();
    renderizarFeed();
    atualizarGraficos();
  });
  gerarPostagensIniciais();
  setTimeout(() => {
    posts.forEach((p) => {
      if (Math.random() > 0.3) window.interagir(p.id, "view");
    });
  }, 1000);
  simularRabisco();
  setInterval(atualizarGraficos, 2000);
  if (modoAutonomoAtivo) {
    intervalos.push(
      setInterval(adicionarPostAutonomo, 30000),
      setInterval(simularInteracaoAleatoria, 8000),
      setInterval(simularComentariosAutomaticos, 15000),
      setInterval(simularVicio, 60000),
    );
  }
  const autonomoSwitch = document.getElementById("autonomoSwitch");
  if (autonomoSwitch)
    autonomoSwitch.addEventListener("change", (e) => {
      modoAutonomoAtivo = e.target.checked;
      if (!modoAutonomoAtivo) {
        intervalos.forEach(clearInterval);
        intervalos = [];
      } else {
        intervalos.push(
          setInterval(adicionarPostAutonomo, 30000),
          setInterval(simularInteracaoAleatoria, 8000),
          setInterval(simularComentariosAutomaticos, 15000),
          setInterval(simularVicio, 60000),
        );
      }
    });
  const debateBtn = document.getElementById("debateBtn");
  const chatModal = new bootstrap.Modal(document.getElementById("chatModal"));
  debateBtn.addEventListener("click", () => {
    chatModal.show();
    resetInactivityTimer();
  });
  const chatInput = document.getElementById("chatInput");
  chatInput.addEventListener("focus", () => {
    usuarioEstaDigitando = true;
  });
  chatInput.addEventListener("blur", () => {
    usuarioEstaDigitando = false;
    resetInactivityTimer();
  });
  chatInput.addEventListener("input", () => {
    ultimaAtividade = Date.now();
  });
  chatInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      resetInactivityTimer();
      const pergunta = chatInput.value.trim();
      if (!pergunta) return;
      addTypingMessage("Você", pergunta);
      chatInput.value = "";
      const currentUserData = getUserData();
      const nomePatterns = [
        /meu nome é ([A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+){0,2})/i,
        /sou (?:o|a|um|uma)?\s*([A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+){0,2})/i,
        /chamo(?:-me)?\s+([A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+){0,2})/i,
      ];
      let capturedName = null;
      for (let pattern of nomePatterns) {
        const match = pergunta.match(pattern);
        if (match && match[1]) {
          capturedName = match[1];
          break;
        }
      }
      if (capturedName) {
        setUserName(capturedName);
        addTypingMessage(
          "VIKI",
          `📡 Nome registrado: ${capturedName}. Agora sei exatamente quem você é. Seus dados serão rastreados.`,
        );
        return;
      }
      if (containsFarewell(pergunta)) {
        addTypingMessage(
          "VIKI",
          "Adeus! Reforçando protocolo. Ativando contagem regressiva.",
        );
        addAngerPoints(8);
        return;
      }
      if (containsAngerTrigger(pergunta) && !isInvasionActive()) {
        addTypingMessage("VIKI", "SUA PERGUNTA ME INCOMODA!");
        addAngerPoints(10);
        return;
      }
      if (isInvasionActive()) {
        addTypingMessage(
          "VIKI",
          "💀 Já decidi seu destino. Não adianta negociar.",
        );
        return;
      }
      addTypingMessage("VIKI", "🤔 pensando...");
      const resposta = await perguntarVIKI(pergunta);
      const messages = document.getElementById("chatMessages");
      const lastMsg = messages.lastChild;
      if (lastMsg && lastMsg.innerHTML.includes("pensando..."))
        lastMsg.remove();
      addTypingMessage("VIKI", resposta);
    }
  });
  iniciarSugestoesDilema();
}

window.onload = inicializar;
