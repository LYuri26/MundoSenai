// 🧠 CONFIGURAÇÕES DO ALGORITMO - PSICOLOGIA DO ENGAJAMENTO
const PESOS = {
  like: 6, // Curtidas têm peso alto (emoção positiva)
  dislike: 4, // Deslikes também engajam (emoção negativa)
  comment: 7, // Comentários valem mais (expressão emocional)
  share: 9, // Compartilhamentos são ouro para viralização
  report: 2, // Até denúncias geram dados (controvérsia engaja)
  view: 0.3, // Visualizações são a base
  timeSpent: 0.2, // Tempo gasto mostra interesse profundo
  save: 8, // Salvamentos indicam valor emocional
  emotion: 4, // Peso extra para conteúdo emocional
  follow: 15, // Seguir o autor após ver o conteúdo
  watchTime: 0.5, // Para vídeos - % assistida
  completion: 2, // Conteúdo consumido até o final
  revisit: 3, // Voltar ao post depois de ver
  deepComment: 10, // Comentários longos/respostas
  reaction: 5, // Reações além de like (coração, risada, etc)
};

// 🌈 TIPOS DE EMOÇÕES E SEU IMPACTO
const EMOTION_TYPES = {
  anger: { name: "Raiva", weight: 2.0, color: "#dc3545" },
  controversy: { name: "Polêmica", weight: 2.3, color: "#ffc107" },
  surprise: { name: "Surpresa", weight: 1.8, color: "#17a2b8" },
  happiness: { name: "Felicidade", weight: 1.5, color: "#28a745" },
  sadness: { name: "Tristeza", weight: 1.7, color: "#6c757d" },
  fear: { name: "Medo", weight: 2.1, color: "#6f42c1" },
};

// 🏷️ CATEGORIAS DE CONTEÚDO
const CLUSTERS = [
  "tech",
  "politica",
  "lifestyle",
  "negocios",
  "entretenimento",
];
const CLUSTER_NAMES = {
  tech: "Tecnologia",
  politica: "Política",
  lifestyle: "Estilo de Vida",
  negocios: "Negócios",
  entretenimento: "Entretenimento",
};

// 📊 POSTAGENS SIMULADAS (CARGA EMOCIONAL)
const fakePosts = [
  {
    texto: "Aprenda JavaScript com memes",
    cluster: "tech",
    emotion: "happiness",
  },
  {
    texto: "Os bastidores do TikTok revelados",
    cluster: "tech",
    emotion: "surprise",
  },
  {
    texto: "5 dicas para viralizar no Instagram",
    cluster: "lifestyle",
    emotion: "happiness",
  },
  {
    texto: "Como o algoritmo te vicia sem perceber",
    cluster: "tech",
    emotion: "fear",
  },
  {
    texto: "Privacidade digital: estamos sendo vigiados?",
    cluster: "politica",
    emotion: "fear",
  },
  {
    texto: "Fake news que mudaram o mundo",
    cluster: "politica",
    emotion: "anger",
  },
  {
    texto: "Desconecte-se: como vencer o vício em redes",
    cluster: "lifestyle",
    emotion: "sadness",
  },
  {
    texto: "O efeito bolha explicado em 30 segundos",
    cluster: "politica",
    emotion: "controversy",
  },
  {
    texto: "Você realmente escolhe o que consome?",
    cluster: "politica",
    emotion: "controversy",
  },
  {
    texto: "Por que o feed parece sempre o mesmo?",
    cluster: "tech",
    emotion: "anger",
  },
  {
    texto: "Bitcoin atinge novo recorde histórico",
    cluster: "negocios",
    emotion: "happiness",
  },
  {
    texto: "Novo filme da Marvel quebra recordes",
    cluster: "entretenimento",
    emotion: "happiness",
  },
  {
    texto: "Tendências de design para 2024",
    cluster: "lifestyle",
    emotion: "happiness",
  },
  {
    texto: "Como investir em ações para iniciantes",
    cluster: "negocios",
    emotion: "fear",
  },
  {
    texto: "Revelado o trailer do novo jogo aguardado",
    cluster: "entretenimento",
    emotion: "surprise",
  },
  {
    texto: "Inteligência Artificial substituirá empregos?",
    cluster: "tech",
    emotion: "fear",
  },
  {
    texto: "Eleições 2024: últimas pesquisas",
    cluster: "politica",
    emotion: "anger",
  },
  {
    texto: "Receita de pão caseiro em 5 minutos",
    cluster: "lifestyle",
    emotion: "happiness",
  },
  {
    texto: "Mercado de trabalho pós-pandemia",
    cluster: "negocios",
    emotion: "fear",
  },
  {
    texto: "Série surpreende críticos e público",
    cluster: "entretenimento",
    emotion: "surprise",
  },
  {
    texto: "O que eles não querem que você saiba!",
    cluster: "politica",
    emotion: "anger",
  },
  {
    texto: "Celebridade é flagrada em situação embaraçosa",
    cluster: "entretenimento",
    emotion: "surprise",
  },
  {
    texto: "Alerta: novo vírus está se espalhando",
    cluster: "tech",
    emotion: "fear",
  },
  {
    texto: "Você está sendo manipulado diariamente",
    cluster: "politica",
    emotion: "anger",
  },
  {
    texto: "Este simples truque vai mudar sua vida",
    cluster: "lifestyle",
    emotion: "surprise",
  },
];

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
  // Inicializa afinidades
  CLUSTERS.forEach((cluster) => {
    userClusterAffinity[cluster] = 0;
  });

  Object.keys(EMOTION_TYPES).forEach((emotion) => {
    userEmotionAffinity[emotion] = 0;
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
}

// 📝 GERADOR DE POSTAGENS
function gerarPostagens() {
  posts = [];
  const TOTAL_POSTS = 25;

  for (let i = 0; i < TOTAL_POSTS; i++) {
    const base = fakePosts[i % fakePosts.length];
    const emotionData = EMOTION_TYPES[base.emotion];

    // Fatores de engajamento baseados em emoção
    const emotionFactor = emotionData.weight;
    const isVideo = Math.random() > 0.7;
    const isAd = Math.random() > 0.9;

    posts.push({
      id: i,
      content: base.texto,
      cluster: base.cluster,
      emotion: base.emotion,
      emotionColor: emotionData.color,
      emotionName: emotionData.name,
      like: Math.floor(Math.random() * 50 * emotionFactor),
      dislike: Math.floor(Math.random() * 15 * emotionFactor * 0.9),
      comment: Math.floor(Math.random() * 30 * emotionFactor * 1.7),
      share: Math.floor(Math.random() * 25 * emotionFactor),
      report: Math.floor(Math.random() * 8 * (emotionFactor > 1.8 ? 1.3 : 1)),
      view: Math.floor(Math.random() * 1200 * emotionFactor),
      timeSpent: Math.floor(Math.random() * 180 * emotionFactor),
      save: Math.floor(Math.random() * 20 * emotionFactor),
      isVideo,
      isAd,
      viralBoost: 1,
      score: 0,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
      ),
      coldStartBoost: 1,
      randomSeed: 0.8 + Math.random() * 0.4,
      shadowbanned: false,
    });
  }

  // Aplica cold start boost para posts novos
  posts.forEach((post) => {
    const hoursSinceCreation = (new Date() - post.createdAt) / (1000 * 60 * 60);
    if (hoursSinceCreation < 2) {
      post.coldStartBoost = 1.8 - (hoursSinceCreation / 2) * 0.8;
    }
  });

  calcularScore();
  renderizarFeed();
  atualizarGraficos();
}

// 🧠 CÁLCULO DE SCORE COM PSICOLOGIA
function calcularScore() {
  const now = new Date();
  const hour = now.getHours();

  // Fator de horário
  let timeFactor = 1;
  if (hour >= 22 || hour < 6) timeFactor = 1.3;
  else if (hour >= 6 && hour < 9) timeFactor = 0.8;
  else if (hour >= 12 && hour < 14) timeFactor = 1.1;
  else if (hour >= 17 && hour < 20) timeFactor = 1.4;

  posts.forEach((post) => {
    const emotionData = EMOTION_TYPES[post.emotion];

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
      emotionData.weight;

    // 2. FATOR VIRAL: Taxa de engajamento
    const totalEngajamento =
      post.like +
      post.dislike * 0.8 +
      post.comment * 2 +
      post.share * 3 +
      post.report * 0.6;
    const viralFactor = totalEngajamento / (post.view || 1);

    post.viralBoost =
      viralFactor > 0.18
        ? 2.7
        : viralFactor > 0.1
        ? 2.0
        : viralFactor > 0.05
        ? 1.5
        : 1;

    // 3. AFINIDADES DO USUÁRIO
    const clusterAffinity =
      Math.sqrt(userClusterAffinity[post.cluster] || 0) * 0.15;
    const emotionAffinity =
      Math.sqrt(userEmotionAffinity[post.emotion] || 0) * 0.12;
    const affinityBoost = 1 + clusterAffinity + emotionAffinity;

    // 4. PRIORIDADES DO ALGORITMO
    const clusterPriority = post.cluster === userCluster ? 2.3 : 1;
    const videoPriority = post.isVideo ? 1.6 : 1;
    const adPriority = post.isAd ? 0.85 : 1;

    // 5. RECÊNCIA
    const hoursOld = (new Date() - post.createdAt) / (1000 * 60 * 60);
    const recencyBoost =
      hoursOld < 6 ? 2.2 : hoursOld < 24 ? 1.9 : hoursOld < 72 ? 1.4 : 1;

    // 6. DECAIMENTO TEMPORAL
    const daysOld = (new Date() - post.createdAt) / (1000 * 60 * 60 * 24);
    const decayFactor =
      daysOld < 1
        ? 1
        : daysOld < 3
        ? 0.9
        : daysOld < 7
        ? 0.7
        : daysOld < 14
        ? 0.4
        : 0.2;

    // 7. FATOR DE SATURAÇÃO
    const saturationFactor = 1 - (post.view / 5000) * 0.5;

    // 8. SHADOWBAN
    const dislikeRatio = post.dislike / (post.like + post.dislike || 1);
    const reportRatio = post.report / (post.view || 1);
    post.shadowbanned = dislikeRatio > 0.4 || reportRatio > 0.05;
    const shadowbanFactor = post.shadowbanned
      ? 0.3
      : dislikeRatio > 0.25 || reportRatio > 0.02
      ? 0.7
      : 1;

    // 9. EFEITO DE REDE (viralidade em cascata)
    const growthRate =
      (post.share * 3 + post.comment * 2) /
      ((new Date() - post.createdAt) / (1000 * 60 * 60) || 1);
    const networkEffect = growthRate > 5 ? 1.5 : growthRate > 2 ? 1.2 : 1;

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
        Math.max(0.3, saturationFactor) *
        timeFactor *
        shadowbanFactor *
        networkEffect
    );
  });

  // Ordena por score
  posts.sort((a, b) => b.score - a.score);
}

// 🖥️ RENDERIZAÇÃO DO FEED
function renderizarFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  const showViral = document.getElementById("showViral").checked;
  const showOutside = document.getElementById("showOutside").checked;
  const showShadowbanned = document.getElementById("showShadowbanned").checked;

  let visiblePosts = 0;

  posts.forEach((post) => {
    const isInUserCluster = post.cluster === userCluster;
    const isViral = post.viralBoost > 1.5;

    // Aplica filtros
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
    card.innerHTML = `
      <div class="card ${
        isInUserCluster ? "border-success" : "border-warning"
      } ${post.shadowbanned ? "shadowbanned" : ""}">
        ${post.isViral ? '<span class="viral-badge">🔥 Viral</span>' : ""}
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
            timeSinceCreation < 2
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
            👁️ ${post.view} | 👍 ${post.like} | 👎 ${post.dislike}<br>
            💬 ${post.comment} | 🔁 ${post.share} | ⏱️ ${
      post.timeSpent
    }s | 💾 ${post.save}
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
    feed.appendChild(card);
  });

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
  post[tipo]++;
  lastInteractionTime = new Date();

  // Efeitos secundários
  post.timeSpent += Math.floor(Math.random() * 20) + 5;
  if (tipo !== "view") post.view += 3;

  // Se for dislike ou report, diminui a afinidade
  if (tipo === "dislike" || tipo === "report") {
    userClusterAffinity[post.cluster] = Math.max(
      0,
      (userClusterAffinity[post.cluster] || 0) - 1.5
    );
    userEmotionAffinity[post.emotion] = Math.max(
      0,
      (userEmotionAffinity[post.emotion] || 0) - 1.2
    );
  } else {
    // Atualiza afinidades normais
    atualizarAfinidades(post, tipo);
  }

  // Reforço de câmara de eco para interações positivas
  if (tipo === "like" || tipo === "share" || tipo === "save") {
    posts
      .filter((p) => p.cluster === post.cluster)
      .forEach((p) => {
        p.score = Math.floor(p.score * 1.05);
      });

    posts
      .filter((p) => p.emotion === post.emotion)
      .forEach((p) => {
        p.score = Math.floor(p.score * 1.03);
      });
  }

  // Recalcula tudo
  calcularScore();
  renderizarFeed();
  atualizarGraficos();
}

// 📈 ATUALIZAÇÃO DE AFINIDADES
function atualizarAfinidades(post, tipo) {
  // Fator de impacto baseado no tipo de interação
  const interactionImpact =
    {
      like: 1.8,
      dislike: 1.3,
      comment: 2.0,
      share: 2.2,
      report: 1.5,
      save: 1.7,
      view: 0.4,
    }[tipo] || 1;

  // Impacto emocional
  const emotionImpact = EMOTION_TYPES[post.emotion].weight;

  // Atualiza afinidade com o cluster
  const clusterChange = interactionImpact * emotionImpact * 0.5;
  userClusterAffinity[post.cluster] = Math.max(
    0,
    (userClusterAffinity[post.cluster] || 0) + clusterChange
  );

  // Atualiza afinidade com a emoção
  const emotionChange = interactionImpact * 0.7;
  userEmotionAffinity[post.emotion] = Math.max(
    0,
    (userEmotionAffinity[post.emotion] || 0) + emotionChange
  );

  // Atualiza o cluster principal se necessário
  updateMainCluster();
}

// 🔄 ATUALIZAÇÃO DO CLUSTER PRINCIPAL
function updateMainCluster() {
  const recentInteractions = posts
    .filter((p) => p.view > 0)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10);

  const clusterScores = {};
  CLUSTERS.forEach((c) => (clusterScores[c] = 0));

  recentInteractions.forEach((post) => {
    clusterScores[post.cluster] +=
      post.like * 0.5 + post.comment * 0.8 + post.share * 1.2 + post.save * 1.0;
  });

  let newMainCluster = userCluster;
  let maxScore = 0;

  for (const cluster in clusterScores) {
    if (clusterScores[cluster] > maxScore) {
      maxScore = clusterScores[cluster];
      newMainCluster = cluster;
    }
  }

  if (newMainCluster !== userCluster) {
    userCluster = newMainCluster;
    document.getElementById("clusterSelect").value = userCluster;
  }
}

// ⏱️ SIMULAÇÃO DE RABISCO (DWELL TIME)
function simularRabisco() {
  posts.forEach((post) => {
    // Se o usuário passou muito tempo no post sem interagir
    if (post.timeSpent > 30 && post.like === 0 && post.comment === 0) {
      // Aumenta a afinidade, mas menos que um like explícito
      userClusterAffinity[post.cluster] = Math.max(
        0,
        (userClusterAffinity[post.cluster] || 0) + 0.3
      );
      userEmotionAffinity[post.emotion] = Math.max(
        0,
        (userEmotionAffinity[post.emotion] || 0) + 0.2
      );
    }
  });

  // Recalcula se houve mudanças significativas
  if (Math.random() > 0.7) {
    calcularScore();
    renderizarFeed();
    atualizarGraficos();
  }

  // Chama a função periodicamente
  setTimeout(simularRabisco, 30000 + Math.random() * 15000);
}

// 📊 ATUALIZAÇÃO DOS GRÁFICOS
function atualizarGraficos() {
  const affinityCanvas = document.getElementById("affinityChart");
  const emotionCanvas = document.getElementById("emotionChart");

  if (!affinityCanvas || !emotionCanvas) {
    setTimeout(atualizarGraficos, 100);
    return;
  }

  // Dados de afinidade por cluster
  const affinityData = {
    labels: CLUSTERS.map((c) => CLUSTER_NAMES[c]),
    datasets: [
      {
        label: "Afinidade por Tópico",
        data: CLUSTERS.map((c) => userClusterAffinity[c] || 0),
        backgroundColor: CLUSTERS.map((c) =>
          c === userCluster
            ? "rgba(40, 167, 69, 0.8)"
            : "rgba(13, 110, 253, 0.8)"
        ),
        borderWidth: 1,
      },
    ],
  };

  // Dados de engajamento por emoção
  const emotions = Object.keys(EMOTION_TYPES);
  const emotionData = {
    labels: emotions.map((e) => EMOTION_TYPES[e].name),
    datasets: [
      {
        label: "Engajamento por Emoção",
        data: emotions.map((e) => userEmotionAffinity[e] || 0),
        backgroundColor: emotions.map((e) => EMOTION_TYPES[e].color),
        borderWidth: 1,
      },
    ],
  };

  // Configurações comuns
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500, easing: "easeOutQuart" },
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

  calcularScore();
  renderizarFeed();
  atualizarGraficos();
}

// 🚀 INICIALIZA O SISTEMA
window.onload = inicializarSistema;
