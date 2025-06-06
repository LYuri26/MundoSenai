// 🎯 PESOS DAS INTERAÇÕES
// Define o impacto de cada tipo de interação no score final do post
const PESOS = {
  like: 5,
  dislike: -3,
  comment: 4,
  share: 8,
  report: -15,
};

// 🎯 CONFIGURAÇÕES GERAIS
const TOTAL_POSTS = 10; // número total de postagens
const CLUSTERS = ["tech", "politica", "lifestyle"]; // bolhas temáticas disponíveis

// 🎯 POSTAGENS SIMULADAS (com temas e clusters definidos)
const fakePosts = [
  { texto: "Aprenda JavaScript com memes", cluster: "tech" },
  { texto: "Os bastidores do TikTok revelados", cluster: "tech" },
  { texto: "5 dicas para viralizar no Instagram", cluster: "lifestyle" },
  { texto: "Como o algoritmo te vicia sem perceber", cluster: "tech" },
  {
    texto: "Privacidade digital: estamos sendo vigiados?",
    cluster: "politica",
  },
  { texto: "Fake news que mudaram o mundo", cluster: "politica" },
  {
    texto: "Desconecte-se: como vencer o vício em redes",
    cluster: "lifestyle",
  },
  { texto: "O efeito bolha explicado em 30 segundos", cluster: "politica" },
  { texto: "Você realmente escolhe o que consome?", cluster: "politica" },
  { texto: "Por que o feed parece sempre o mesmo?", cluster: "tech" },
];

// 🎯 VARIÁVEIS DE ESTADO DO ALGORITMO
let posts = []; // array que conterá os posts gerados
let userClusterAffinity = { tech: 0, politica: 0, lifestyle: 0 }; // afinidade do usuário com cada cluster
let userCluster = "tech"; // bolha atual selecionada pelo usuário

// ✅ FUNÇÃO: GERA OS POSTS COM DADOS ALEATÓRIOS
function gerarPostagens() {
  posts = [];

  for (let i = 0; i < TOTAL_POSTS; i++) {
    const base = fakePosts[i];

    posts.push({
      id: i,
      content: base.texto,
      cluster: base.cluster,
      like: Math.floor(Math.random() * 50),
      dislike: Math.floor(Math.random() * 10),
      comment: Math.floor(Math.random() * 30),
      share: Math.floor(Math.random() * 20),
      report: Math.floor(Math.random() * 5),
      viralBoost: 1, // multiplicador de viralização
      score: 0, // score total do post
    });
  }

  calcularScore(); // calcula a pontuação de cada post
  renderizarFeed(); // atualiza a interface
}

// ✅ FUNÇÃO: CALCULA O SCORE DE CADA POST
function calcularScore() {
  posts.forEach((post) => {
    // 🧮 Calcula o score base somando os pesos
    const baseScore =
      post.like * PESOS.like +
      post.dislike * PESOS.dislike +
      post.comment * PESOS.comment +
      post.share * PESOS.share +
      post.report * PESOS.report;

    // 🧮 Determina se o post é viral com base no volume de engajamento
    const totalEngajamento = post.like + post.comment + post.share;
    post.viralBoost =
      totalEngajamento > 50 ? 1.5 : totalEngajamento > 30 ? 1.2 : 1;

    // 🧠 Calcula o reforço da afinidade com o cluster
    const afinidade = userClusterAffinity[post.cluster] || 0;
    const bolhaBoost = 1 + afinidade * 0.05;

    // 🚀 Impulsionamento automático se estiver dentro da bolha atual
    const clusterPriorityBoost = post.cluster === userCluster ? 1.5 : 1;

    // 🔢 Score final com todos os multiplicadores
    post.score = Math.floor(
      baseScore * post.viralBoost * bolhaBoost * clusterPriorityBoost
    );
  });

  // 🔽 Ordena os posts por score, do maior para o menor
  posts.sort((a, b) => b.score - a.score);
}

// ✅ FUNÇÃO: EXIBE O FEED NA TELA
function renderizarFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach((post) => {
    const isInUserCluster = post.cluster === userCluster;
    const isViral = post.viralBoost > 1;

    // 🔎 Mostra apenas se o post é da bolha ou se for viral
    if (!isInUserCluster && !isViral) return;

    const card = document.createElement("div");
    card.classList.add("col");

    card.innerHTML = `
      <div class="card ${
        !isInUserCluster ? "border-warning" : "border-success"
      }">
        <div class="card-body">
          <h5 class="card-title">${post.content}</h5>
          <p class="card-text">
            <span class="score">Score: ${post.score}</span><br>
            Cluster: <strong>${post.cluster}</strong><br>
            ${
              !isInUserCluster
                ? '<span class="text-warning">🚧 Fora da sua bolha (trend)</span><br>'
                : '<span class="text-success">✅ Dentro da sua bolha</span><br>'
            }
            👍 ${post.like} | 👎 ${post.dislike} | 💬 ${post.comment} | 🔁 ${
      post.share
    } | 🚫 ${post.report}
          </p>
          <div class="btn-group">
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
            <button class="btn btn-outline-warning btn-sm" onclick="interagir(${
              post.id
            }, 'report')">Denunciar</button>
          </div>
        </div>
      </div>
    `;
    feed.appendChild(card);
  });
}

// ✅ FUNÇÃO: ATUALIZA OS DADOS DE INTERAÇÃO DO POST
function interagir(id, tipo) {
  const post = posts.find((p) => p.id === id);
  post[tipo]++; // incrementa a interação clicada

  // Atualiza afinidade do usuário com o cluster do post
  userClusterAffinity[post.cluster] =
    (userClusterAffinity[post.cluster] || 0) + 1;

  calcularScore(); // recalcula os scores após a interação
  renderizarFeed(); // atualiza a interface
}

// ✅ FUNÇÃO: MUDA A BOLHA DE INTERESSE DO USUÁRIO
function mudarBolha(select) {
  userCluster = select.value;
  calcularScore();
  renderizarFeed();
}

// 🚀 Inicializa o sistema ao carregar a página
window.onload = gerarPostagens;
