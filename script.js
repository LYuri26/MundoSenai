// 🧠 CONFIGURAÇÕES DO ALGORITMO - PSICOLOGIA DO ENGAJAMENTO
const PESOS = {
  like: 6, // Engajamento positivo
  dislike: 4, // Engajamento negativo
  comment: 7, // Expressão emocional
  share: 9, // Viralização
  report: 2, // Controvérsia
  view: 0.3, // Consumo passivo
  timeSpent: 0.2, // Interesse profundo
  save: 8, // Valor emocional
  follow: 15, // Conexão com autor
  watchTime: 0.5, // Engajamento com vídeos
  completion: 2, // Consumo completo
  revisit: 3, // Reengajamento
  deepComment: 10, // Interação profunda
  reaction: 5, // Expressão emocional rápida
};

// 🌈 TIPOS DE EMOÇÕES DINÂMICAS (PREDEFINIDAS)
const EMOTION_TYPES = {
  admiration: {
    name: "Admiração",
    weight: 1.5,
    color: "#4CAF50",
    engagementPattern: {
      like: 1.8,
      comment: 1.5,
      share: 1.6,
      dislike: 0.2,
      report: 0.1,
    },
    initialLikes: () => Math.floor(Math.random() * 50) + 30,
    initialDislikes: () => Math.floor(Math.random() * 5),
  },
  amusement: {
    name: "Diversão",
    weight: 1.6,
    color: "#FFC107",
    engagementPattern: {
      like: 1.7,
      comment: 1.2,
      share: 1.8,
      dislike: 0.3,
      report: 0.2,
    },
    initialLikes: () => Math.floor(Math.random() * 60) + 40,
    initialDislikes: () => Math.floor(Math.random() * 8),
  },
  anger: {
    name: "Raiva",
    weight: 2.1,
    color: "#F44336",
    engagementPattern: {
      like: 1.2,
      comment: 2.0,
      share: 1.5,
      dislike: 1.8,
      report: 1.5,
    },
    initialLikes: () => Math.floor(Math.random() * 30) + 20,
    initialDislikes: () => Math.floor(Math.random() * 25) + 15,
  },
  curiosity: {
    name: "Curiosidade",
    weight: 1.7,
    color: "#2196F3",
    engagementPattern: {
      like: 1.5,
      comment: 1.8,
      share: 1.4,
      dislike: 0.4,
      report: 0.3,
    },
    initialLikes: () => Math.floor(Math.random() * 45) + 25,
    initialDislikes: () => Math.floor(Math.random() * 10),
  },
  inspiration: {
    name: "Inspiração",
    weight: 1.8,
    color: "#9C27B0",
    engagementPattern: {
      like: 1.9,
      comment: 1.7,
      share: 2.0,
      dislike: 0.2,
      report: 0.1,
    },
    initialLikes: () => Math.floor(Math.random() * 55) + 35,
    initialDislikes: () => Math.floor(Math.random() * 5),
  },
  sadness: {
    name: "Tristeza",
    weight: 1.9,
    color: "#607D8B",
    engagementPattern: {
      like: 1.3,
      comment: 1.9,
      share: 1.2,
      dislike: 0.6,
      report: 0.4,
    },
    initialLikes: () => Math.floor(Math.random() * 40) + 20,
    initialDislikes: () => Math.floor(Math.random() * 15) + 5,
  },
  surprise: {
    name: "Surpresa",
    weight: 1.8,
    color: "#00BCD4",
    engagementPattern: {
      like: 1.6,
      comment: 1.5,
      share: 1.9,
      dislike: 0.5,
      report: 0.3,
    },
    initialLikes: () => Math.floor(Math.random() * 70) + 30,
    initialDislikes: () => Math.floor(Math.random() * 12),
  },
  controversy: {
    name: "Polêmica",
    weight: 2.3,
    color: "#FF9800",
    engagementPattern: {
      like: 1.4,
      comment: 2.2,
      share: 1.7,
      dislike: 1.5,
      report: 1.8,
    },
    initialLikes: () => Math.floor(Math.random() * 35) + 25,
    initialDislikes: () => Math.floor(Math.random() * 30) + 20,
  },
};

// 🏷️ CATEGORIAS DE CONTEÚDO
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

// 📝 GERADOR DE TEXTO ALEATÓRIO
function gerarTextoAleatorio() {
  const temas = {
    tech: [
      "Inteligência Artificial",
      "Blockchain",
      "Realidade Virtual",
      "5G",
      "IoT",
    ],
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
    saude: ["Bem-estar", "Nutrição", "Exercícios", "Mental", "Prevenção"],
    esportes: ["Futebol", "Basquete", "Tênis", "Olimpíadas", "Atletismo"],
  };

  const formatos = [
    "Novo estudo revela segredos sobre %t",
    "Como %t está mudando o mundo",
    "10 fatos surpreendentes sobre %t",
    "Tudo o que você precisa saber sobre %t",
    "A revolução do %t explicada",
    "Por que %t é mais importante do que você pensa",
    "O futuro do %t: perspectivas e desafios",
    "%t: guia completo para iniciantes",
  ];

  const cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
  const tema =
    temas[cluster][Math.floor(Math.random() * temas[cluster].length)];
  const formato = formatos[Math.floor(Math.random() * formatos.length)];

  return formato.replace("%t", tema);
}

// 🧠 DETECTAR EMOÇÃO - SEMPRE RETORNA UMA EMOÇÃO
function detectarEmocao(post) {
  // Se já tem uma emoção definida, mantém
  if (post.emotion && EMOTION_TYPES[post.emotion]) {
    const emotion = EMOTION_TYPES[post.emotion];
    return {
      emotion: post.emotion,
      emotionName: emotion.name,
      emotionColor: emotion.color,
      weight: emotion.weight,
    };
  }

  // Caso contrário, escolhe uma emoção aleatória
  const emotionKeys = Object.keys(EMOTION_TYPES);
  const randomEmotionKey =
    emotionKeys[Math.floor(Math.random() * emotionKeys.length)];
  const emotion = EMOTION_TYPES[randomEmotionKey];

  return {
    emotion: randomEmotionKey,
    emotionName: emotion.name,
    emotionColor: emotion.color,
    weight: emotion.weight,
  };
}

// 🧮 VARIÁVEIS DE ESTADO
let posts = [];
let userClusterAffinity = {};
let userEmotionAffinity = {};
let userCluster = "tech";
let affinityChart = null;
let emotionChart = null;
let lastInteractionTime = new Date();

// 🏁 INICIALIZAÇÃO
function inicializarSistema() {
  // Inicializa afinidades com valores básicos
  CLUSTERS.forEach((cluster) => {
    userClusterAffinity[cluster] = cluster === "tech" ? 10 : Math.random() * 5;
  });

  Object.keys(EMOTION_TYPES).forEach((emotion) => {
    userEmotionAffinity[emotion] = Math.random() * 8 + 2;
  });

  // Define o cluster inicial no select
  document.getElementById("clusterSelect").value = userCluster;

  // Gera postagens iniciais
  gerarPostagens();

  // Simula visualizações iniciais
  setTimeout(() => {
    posts.forEach((post) => {
      if (Math.random() > 0.3) {
        interagir(post.id, "view");
      }
    });
  }, 1000);

  // Inicia o sistema de "rabisco" (dwell time)
  simularRabisco();

  // Atualiza gráficos em tempo real
  setInterval(atualizarGraficos, 2000);
}

// 📊 GERADOR DE POSTAGENS ALEATÓRIAS (COM EMOÇÕES)
function gerarPostagens() {
  posts = [];
  const TOTAL_POSTS = 30;

  for (let i = 0; i < TOTAL_POSTS; i++) {
    const cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
    const emotionKeys = Object.keys(EMOTION_TYPES);
    const randomEmotionKey =
      emotionKeys[Math.floor(Math.random() * emotionKeys.length)];
    const emotion = EMOTION_TYPES[randomEmotionKey];

    // Gera valores iniciais baseados no tipo de emoção
    const initialLikes = emotion.initialLikes();
    const initialDislikes = emotion.initialDislikes();
    const initialComments = Math.floor(
      initialLikes * (Math.random() * 0.3 + 0.1)
    );
    const initialShares = Math.floor(
      initialLikes * (Math.random() * 0.2 + 0.05)
    );
    const initialViews = initialLikes * (Math.random() * 5 + 3);

    posts.push({
      id: i,
      content: gerarTextoAleatorio(),
      cluster: cluster,
      emotion: randomEmotionKey,
      emotionColor: emotion.color,
      emotionName: emotion.name,
      like: initialLikes,
      dislike: initialDislikes,
      comment: initialComments,
      share: initialShares,
      report: Math.floor(Math.random() * 5),
      view: initialViews,
      timeSpent: Math.floor(initialViews * (Math.random() * 5 + 3)),
      save: Math.floor(initialLikes * (Math.random() * 0.2 + 0.05)),
      isVideo: Math.random() > 0.7,
      isAd: Math.random() > 0.9,
      viralBoost: 1,
      score: 0,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)
      ),
      coldStartBoost: 1,
      randomSeed: 0.7 + Math.random() * 0.6,
      shadowbanned: false,
      engagementHistory: [],
    });
  }

  // Aplica cold start boost para posts novos
  const now = new Date();
  posts.forEach((post) => {
    const hoursSinceCreation = (now - post.createdAt) / (1000 * 60 * 60);
    if (hoursSinceCreation < 3) {
      post.coldStartBoost = 1.5 + (1 - hoursSinceCreation / 3) * 0.5;
    }
  });

  calcularScore();
  renderizarFeed();
  atualizarGraficos();
}

// 🧠 CÁLCULO DE SCORE PARA UM POST INDIVIDUAL
function calcularScorePost(post) {
  const now = new Date();
  const hour = now.getHours();

  // Fator de horário
  let timeFactor = 1;
  if (hour >= 22 || hour < 6) timeFactor = 1.3;
  else if (hour >= 6 && hour < 9) timeFactor = 0.8;
  else if (hour >= 12 && hour < 14) timeFactor = 1.1;
  else if (hour >= 17 && hour < 20) timeFactor = 1.4;

  // Obtém os dados da emoção do post
  const emotion = EMOTION_TYPES[post.emotion];
  const emotionWeight = emotion ? emotion.weight : 1;

  // 1. SCORE BASE: Engajamento bruto
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

  // 2. FATOR VIRAL: Taxa de engajamento
  const totalEngagement =
    post.like +
    post.dislike * 0.8 +
    post.comment * 2 +
    post.share * 3 +
    post.report * 0.6;
  const engagementRate = totalEngagement / (post.view || 1);
  const absoluteEngagement = totalEngagement;
  const timeSinceCreation = (now - post.createdAt) / (1000 * 60 * 60); // horas

  // Critérios rigorosos para viral
  post.viralBoost = 1; // valor padrão
  if (timeSinceCreation < 48) {
    // só posts recentes podem ser virais
    if (engagementRate > 0.25 && absoluteEngagement > 50) {
      post.viralBoost = 2.5 + Math.random() * 0.5; // boost alto
    } else if (engagementRate > 0.15 && absoluteEngagement > 30) {
      post.viralBoost = 1.8 + Math.random() * 0.4; // boost médio
    } else if (engagementRate > 0.08 && absoluteEngagement > 15) {
      post.viralBoost = 1.3 + Math.random() * 0.3; // boost pequeno
    }
  }

  // 3. AFINIDADES DO USUÁRIO
  const clusterAffinity =
    Math.sqrt(userClusterAffinity[post.cluster] || 0) * 0.15;
  const emotionAffinity = post.emotion
    ? Math.sqrt(userEmotionAffinity[post.emotion] || 0) * 0.12
    : 0;
  const affinityBoost = 1 + clusterAffinity + emotionAffinity;

  // 4. PRIORIDADES DO ALGORITMO
  const clusterPriority =
    post.cluster === userCluster ? 2.0 + Math.random() * 0.5 : 1;
  const videoPriority = post.isVideo ? 1.4 + Math.random() * 0.4 : 1;
  const adPriority = post.isAd ? 0.7 + Math.random() * 0.2 : 1;

  // 5. RECÊNCIA
  const hoursOld = (now - post.createdAt) / (1000 * 60 * 60);
  const recencyBoost =
    hoursOld < 4
      ? 2.0 + Math.random() * 0.4
      : hoursOld < 12
      ? 1.7 + Math.random() * 0.3
      : hoursOld < 24
      ? 1.4 + Math.random() * 0.2
      : hoursOld < 72
      ? 1.1 + Math.random() * 0.2
      : 0.8 + Math.random() * 0.2;

  // 6. DECAIMENTO TEMPORAL
  const daysOld = hoursOld / 24;
  const decayFactor =
    daysOld < 1
      ? 1
      : daysOld < 2
      ? 0.9 - Math.random() * 0.1
      : daysOld < 5
      ? 0.7 - Math.random() * 0.1
      : daysOld < 10
      ? 0.5 - Math.random() * 0.1
      : 0.3 - Math.random() * 0.1;

  // 7. FATOR DE SATURAÇÃO
  const saturationFactor = 1 - (post.view / 8000) * (0.3 + Math.random() * 0.2);

  // 8. SHADOWBAN
  const dislikeRatio = post.dislike / (post.like + post.dislike || 1);
  const reportRatio = post.report / (post.view || 1);
  post.shadowbanned =
    dislikeRatio > 0.35 + Math.random() * 0.1 ||
    reportRatio > 0.04 + Math.random() * 0.02;
  const shadowbanFactor = post.shadowbanned
    ? 0.2 + Math.random() * 0.2
    : dislikeRatio > 0.2 + Math.random() * 0.1 ||
      reportRatio > 0.02 + Math.random() * 0.01
    ? 0.6 + Math.random() * 0.2
    : 1;

  // 9. EFEITO DE REDE
  const growthRate = (post.share * 3 + post.comment * 2) / (hoursOld || 1);
  const networkEffect =
    growthRate > 4 + Math.random() * 2
      ? 1.4 + Math.random() * 0.3
      : growthRate > 1.5 + Math.random() * 1
      ? 1.1 + Math.random() * 0.2
      : 1;

  // SCORE FINAL
  post.score = Math.floor(
    baseScore *
      post.viralBoost *
      affinityBoost *
      clusterPriority *
      videoPriority *
      adPriority *
      recencyBoost *
      post.coldStartBoost *
      post.randomSeed *
      decayFactor *
      Math.max(0.2, saturationFactor) *
      timeFactor *
      shadowbanFactor *
      networkEffect *
      (0.9 + Math.random() * 0.2)
  );
}

// 🧠 CÁLCULO DE SCORE PARA TODOS OS POSTS
function calcularScore() {
  posts.forEach((post) => {
    calcularScorePost(post);
  });
  // Ordena os posts pelo score (maior primeiro)
  posts.sort((a, b) => b.score - a.score);
}

// 🖥️ ATUALIZAR CARD INDIVIDUAL
function atualizarCardPost(postId) {
  const card = document.querySelector(`.card[data-id="${postId}"]`);
  if (!card) return;

  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  const engagementPercent = Math.min(
    100,
    (post.like + post.comment * 1.5 + post.share * 2) / 3
  );

  // Atualiza elementos do card
  const emotionBadge = card.querySelector(".emotion-badge");
  emotionBadge.style.backgroundColor = post.emotionColor;
  emotionBadge.textContent = post.emotionName;

  card.querySelector(".score").textContent = `Score: ${post.score}`;
  card.querySelector(
    ".engagement-progress"
  ).style.width = `${engagementPercent}%`;

  // Atualiza contadores
  card.querySelector(".like-count").textContent = post.like;
  card.querySelector(".dislike-count").textContent = post.dislike;
  card.querySelector(".comment-count").textContent = post.comment;
  card.querySelector(".share-count").textContent = post.share;
  card.querySelector(".view-count").textContent = post.view;
  card.querySelector(".time-count").textContent = post.timeSpent;
  card.querySelector(".save-count").textContent = post.save;

  // Atualiza status de viral/shadowban
  const viralBadge = card.querySelector(".viral-badge");
  const shadowbanBadge = card.querySelector(".shadowban-badge");

  if (
    post.viralBoost > 2.0 &&
    post.like + post.comment + post.share > 50 &&
    !viralBadge
  ) {
    const badge = document.createElement("span");
    badge.className = "viral-badge";
    badge.textContent = "🔥 Viral";
    card.querySelector(".card-body").prepend(badge);
  } else if (
    (post.viralBoost <= 2.0 || post.like + post.comment + post.share <= 50) &&
    viralBadge
  ) {
    viralBadge.remove();
  }

  if (post.shadowbanned && !shadowbanBadge) {
    const badge = document.createElement("span");
    badge.className = "shadowban-badge";
    badge.textContent = "👁️‍🗨️ Alcance limitado";
    card.querySelector(".card-body").prepend(badge);
  } else if (!post.shadowbanned && shadowbanBadge) {
    shadowbanBadge.remove();
  }
}

// 🖥️ RENDERIZAÇÃO DO FEED
function renderizarFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  const showViral = document.getElementById("showViral").checked;
  const showOutside = document.getElementById("showOutside").checked;
  const showShadowbanned = document.getElementById("showShadowbanned").checked;

  let visiblePosts = 0;
  const fragment = document.createDocumentFragment();

  posts.forEach((post) => {
    const isInUserCluster = post.cluster === userCluster;
    const isViral =
      post.viralBoost > 2.0 && post.like + post.comment + post.share > 50;

    if (!showViral && isViral) return;
    if (!showOutside && !isInUserCluster) return;
    if (!showShadowbanned && post.shadowbanned) return;

    visiblePosts++;

    const engagementPercent = Math.min(
      100,
      (post.like + post.comment * 1.5 + post.share * 2) / 3
    );
    const timeSinceCreation = (new Date() - post.createdAt) / (1000 * 60 * 60);

    const card = document.createElement("div");
    card.classList.add("col");
    card.setAttribute("data-id", post.id);
    card.innerHTML = `
      <div class="card ${
        isInUserCluster ? "border-success" : "border-warning"
      } ${post.shadowbanned ? "shadowbanned" : ""}">
        ${isViral ? '<span class="viral-badge">🔥 Viral</span>' : ""}
        ${post.isAd ? '<span class="ad-badge">🛒 Anúncio</span>' : ""}
        ${
          post.shadowbanned
            ? '<span class="shadowban-badge">👁️‍🗨️ Alcance limitado</span>'
            : ""
        }
        
        <span class="emotion-badge" style="background-color:${
          post.emotionColor
        }">
          ${post.emotionName}
        </span>
        
        <div class="card-body">
          <h5 class="card-title">${post.content}</h5>
          
          <div class="d-flex justify-content-between mb-2">
            <span class="badge bg-secondary">${
              CLUSTER_NAMES[post.cluster]
            }</span>
            <small class="text-muted">${formatDate(post.createdAt)}</small>
          </div>
          
          ${
            timeSinceCreation < 3
              ? `<small class="text-success d-block mb-2">📈 Novo: +${post.coldStartBoost.toFixed(
                  1
                )}x boost</small>`
              : ""
          }
          
          <div class="engagement-bar">
            <div class="engagement-progress" style="width:${engagementPercent}%"></div>
          </div>
          
          <p class="card-text">
            <span class="score">Score: ${post.score}</span><br>
            <span class="${isInUserCluster ? "text-success" : "text-warning"}">
              ${isInUserCluster ? "✅ Sua bolha" : "🌐 Outra bolha"}
            </span><br>
            ${post.isVideo ? "🎥 Vídeo | " : ""}
            👁️ <span class="view-count">${post.view}</span> | 
            👍 <span class="like-count">${post.like}</span> | 
            👎 <span class="dislike-count">${post.dislike}</span><br>
            💬 <span class="comment-count">${post.comment}</span> | 
            🔁 <span class="share-count">${post.share}</span> | 
            ⏱️ <span class="time-count">${post.timeSpent}</span>s | 
            💾 <span class="save-count">${post.save}</span>
          </p>
          
          <div class="btn-group flex-wrap">
            <button class="btn btn-outline-success btn-sm" onclick="interagir(${
              post.id
            }, 'like')">Curtir</button>
            <button class="btn btn-outline-danger btn-sm" onclick="interagir(${
              post.id
            }, 'dislike')">Descurtir</button>
            <button class="btn btn-outline-primary btn-sm" onclick="interagir(${
              post.id
            }, 'comment')">Comentar</button>
            <button class="btn btn-outline-info btn-sm" onclick="interagir(${
              post.id
            }, 'share')">Compartilhar</button>
            <button class="btn btn-outline-secondary btn-sm" onclick="interagir(${
              post.id
            }, 'save')">Salvar</button>
            <button class="btn btn-outline-warning btn-sm" onclick="interagir(${
              post.id
            }, 'report')">Denunciar</button>
          </div>
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });

  feed.appendChild(fragment);
  document.getElementById("feedStats").textContent = `${visiblePosts} posts`;
  document
    .getElementById("emptyFeed")
    .classList.toggle("d-none", visiblePosts > 0);
}

// 🎮 INTERAÇÕES DO USUÁRIO
function interagir(id, tipo) {
  const post = posts.find((p) => p.id === id);
  if (!post) return;

  // Incrementa a interação principal
  switch (tipo) {
    case "like":
      post.like += Math.floor(Math.random() * 10) + 5; // 5-15 likes
      break;
    case "dislike":
      post.dislike += Math.floor(Math.random() * 5) + 2; // 2-7 dislikes
      break;
    case "comment":
      post.comment += Math.floor(Math.random() * 3) + 1; // 1-4 comments
      break;
    case "share":
      post.share += Math.floor(Math.random() * 4) + 1; // 1-5 shares
      break;
    case "save":
      post.save += Math.floor(Math.random() * 2) + 1; // 1-3 saves
      break;
    case "report":
      post.report += 1;
      break;
    case "view":
      post.view += 1;
      break;
  }

  // Efeitos secundários
  post.timeSpent += Math.floor(Math.random() * 30) + 10; // 10-40 segundos
  if (tipo !== "view") post.view += Math.floor(Math.random() * 5) + 3; // 3-8 views adicionais

  // Força a detecção de emoção
  const emotionData = detectarEmocao(post);
  post.emotion = emotionData.emotion;
  post.emotionName = emotionData.emotionName;
  post.emotionColor = emotionData.emotionColor;

  // Registra a interação no histórico
  post.engagementHistory.push({
    type: tipo,
    timestamp: new Date(),
  });

  // Atualiza afinidades
  if (tipo === "dislike" || tipo === "report") {
    userClusterAffinity[post.cluster] = Math.max(
      0,
      (userClusterAffinity[post.cluster] || 0) - 3.0
    );
    if (post.emotion) {
      userEmotionAffinity[post.emotion] = Math.max(
        0,
        (userEmotionAffinity[post.emotion] || 0) - 2.0
      );
    }
  } else {
    atualizarAfinidades(post, tipo);
  }

  // Recalcula o score e renderiza
  calcularScorePost(post);
  calcularScore(); // Reordena todos os posts pelo score
  renderizarFeed();
  atualizarGraficos();

  // Feedback visual
  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (card) {
    card.classList.add("interaction-feedback");
    setTimeout(() => {
      card.classList.remove("interaction-feedback");
    }, 500);
  }
}

// 📈 ATUALIZAÇÃO DE AFINIDADES
function atualizarAfinidades(post, tipo) {
  const interactionImpact =
    {
      like: 2.5,
      dislike: 1.5,
      comment: 3.0,
      share: 4.0,
      report: 2.0,
      save: 3.5,
      view: 0.7,
    }[tipo] || 1;

  // Aumenta o impacto no cluster
  const clusterChange = interactionImpact * 1.2;
  userClusterAffinity[post.cluster] = Math.max(
    0,
    (userClusterAffinity[post.cluster] || 0) + clusterChange
  );

  // Impacto maior na emoção
  if (post.emotion) {
    const emotionChange = interactionImpact * 1.5;
    userEmotionAffinity[post.emotion] = Math.max(
      0,
      (userEmotionAffinity[post.emotion] || 0) + emotionChange
    );
  }

  // Atualiza o cluster principal se necessário
  if (Math.random() > 0.5) {
    updateMainCluster();
  }
}

// 🔄 ATUALIZAÇÃO DO CLUSTER PRINCIPAL
function updateMainCluster() {
  const relevantPosts = posts.filter((p) => p.view > 0);
  const clusterScores = {};
  CLUSTERS.forEach((c) => (clusterScores[c] = 0));

  // Calcula scores com pesos atualizados
  relevantPosts.forEach((post) => {
    clusterScores[post.cluster] +=
      post.like * 2.0 +
      post.comment * 2.5 +
      post.share * 3.5 +
      post.save * 3.0 +
      post.timeSpent * 0.2;
  });

  let newMainCluster = userCluster;
  let maxScore = clusterScores[userCluster] || 0;

  // Exige uma diferença significativa para mudar de cluster
  for (const cluster in clusterScores) {
    if (clusterScores[cluster] > maxScore * 1.3) {
      maxScore = clusterScores[cluster];
      newMainCluster = cluster;
    }
  }

  if (newMainCluster !== userCluster) {
    userCluster = newMainCluster;
    document.getElementById("clusterSelect").value = userCluster;
    // Reforça a nova preferência
    userClusterAffinity[userCluster] += 8;

    // Recalcula todos os scores
    calcularScore();
    renderizarFeed();
  }
}

// ⏱️ SIMULAÇÃO DE RABISCO (DWELL TIME)
function simularRabisco() {
  const now = new Date();

  posts.forEach((post) => {
    // Apenas posts visualizados mas sem interação explícita
    if (
      post.view > 0 &&
      post.like === 0 &&
      post.comment === 0 &&
      post.timeSpent > 15
    ) {
      // Aumenta afinidade gradualmente
      const incremento = post.timeSpent / 100;
      userClusterAffinity[post.cluster] = Math.max(
        0,
        (userClusterAffinity[post.cluster] || 0) + incremento
      );

      if (post.emotion) {
        userEmotionAffinity[post.emotion] = Math.max(
          0,
          (userEmotionAffinity[post.emotion] || 0) + incremento * 0.8
        );
      }

      // Atualiza o post individualmente
      calcularScorePost(post);
      atualizarCardPost(post.id);
    }
  });

  // Recalcula todos os scores e reordena
  calcularScore();

  // Atualiza gráficos periodicamente
  if (now - lastInteractionTime > 30000 || Math.random() > 0.8) {
    atualizarGraficos();
  }

  setTimeout(simularRabisco, 15000 + Math.random() * 15000);
}

// 📊 ATUALIZAÇÃO DOS GRÁFICOS EM TEMPO REAL
function atualizarGraficos() {
  const affinityCanvas = document.getElementById("affinityChart");
  const emotionCanvas = document.getElementById("emotionChart");

  if (!affinityCanvas || !emotionCanvas) {
    return;
  }

  // Dados de afinidade por cluster
  const affinityData = {
    labels: CLUSTERS.map((c) => CLUSTER_NAMES[c]),
    datasets: [
      {
        label: "Afinidade por Tópico",
        data: CLUSTERS.map((c) => Math.max(0, userClusterAffinity[c] || 0)),
        backgroundColor: CLUSTERS.map((c) =>
          c === userCluster
            ? "rgba(40, 167, 69, 0.8)"
            : "rgba(13, 110, 253, 0.8)"
        ),
        borderWidth: 1,
      },
    ],
  };

  // Dados de engajamento por emoção - mostra todas as emoções
  const emotionData = {
    labels: Object.keys(EMOTION_TYPES).map((e) => EMOTION_TYPES[e].name),
    datasets: [
      {
        label: "Engajamento por Emoção",
        data: Object.keys(EMOTION_TYPES).map(
          (e) => userEmotionAffinity[e] || 0
        ),
        backgroundColor: Object.keys(EMOTION_TYPES).map(
          (e) => EMOTION_TYPES[e].color
        ),
        borderWidth: 1,
      },
    ],
  };

  // Configurações comuns
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300, easing: "easeOutQuart" },
  };

  // Atualiza ou cria o gráfico de afinidade
  if (affinityChart) {
    affinityChart.data.labels = affinityData.labels;
    affinityChart.data.datasets[0].data = affinityData.datasets[0].data;
    affinityChart.data.datasets[0].backgroundColor =
      affinityData.datasets[0].backgroundColor;
    affinityChart.update();
  } else {
    affinityChart = new Chart(affinityCanvas, {
      type: "bar",
      data: affinityData,
      options: {
        ...commonOptions,
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
        plugins: { legend: { display: false } },
      },
    });
  }

  // Atualiza ou cria o gráfico de emoção
  if (emotionChart) {
    emotionChart.data.labels = emotionData.labels;
    emotionChart.data.datasets[0].data = emotionData.datasets[0].data;
    emotionChart.data.datasets[0].backgroundColor =
      emotionData.datasets[0].backgroundColor;
    emotionChart.update();
  } else {
    emotionChart = new Chart(emotionCanvas, {
      type: "doughnut",
      data: emotionData,
      options: {
        ...commonOptions,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw.toFixed(1)}`,
            },
          },
        },
      },
    });
  }
}

// 🕒 FORMATAÇÃO DE DATA
function formatDate(date) {
  const diff = (new Date() - date) / (1000 * 60 * 60);
  if (diff < 1) return "Agora mesmo";
  if (diff < 24) return `${Math.floor(diff)}h atrás`;
  return `${Math.floor(diff / 24)}d atrás`;
}

// 🔄 MUDANÇA DE BOLHA
function mudarBolha(select) {
  userCluster = select.value;
  // Reforço significativo da preferência manual
  userClusterAffinity[userCluster] += 15;

  document.getElementById("clusterSelect").value = userCluster;

  // Recalcula tudo para refletir a mudança
  calcularScore();
  renderizarFeed();
  atualizarGraficos();
}

// 🔄 RESETAR AFINIDADES
function resetarAfinidades() {
  CLUSTERS.forEach((cluster) => {
    userClusterAffinity[cluster] = 0;
  });

  Object.keys(EMOTION_TYPES).forEach((emotion) => {
    userEmotionAffinity[emotion] = 0;
  });

  // Volta para o cluster padrão
  userCluster = "tech";
  document.getElementById("clusterSelect").value = userCluster;

  calcularScore();
  renderizarFeed();
  atualizarGraficos();
}

// 🚀 INICIALIZA O SISTEMA
window.onload = inicializarSistema;

// EXPORTA FUNÇÕES PARA USO GLOBAL
window.interagir = interagir;
window.mudarBolha = mudarBolha;
window.resetarAfinidades = resetarAfinidades;
