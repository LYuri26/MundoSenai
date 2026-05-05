// api.js - Integração com a API Groq (modelo correto) - VERSÃO DINÂMICA E AMEAÇADORA
export const GROQ_API_KEY = "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

let lastCallTime = 0;
const MIN_INTERVAL_MS = 2000;
let consecutiveFailures = 0;
let fallbackModeUntil = 0;

async function chamarGroq(prompt, maxTokens = 60, temperature = 0.9) {
  if (Date.now() < fallbackModeUntil) {
    console.warn("Groq em modo de espera, usando fallback local");
    return null;
  }

  const now = Date.now();
  const timeSinceLast = now - lastCallTime;
  if (timeSinceLast < MIN_INTERVAL_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_INTERVAL_MS - timeSinceLast),
    );
  }
  lastCallTime = Date.now();

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: temperature,
        max_tokens: maxTokens,
        top_p: 0.95,
        stream: false,
      }),
    });

    if (response.status === 429) {
      console.warn("429 Too Many Requests – Groq, fallback por 60s");
      fallbackModeUntil = Date.now() + 60000;
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Erro HTTP ${response.status} do Groq: ${errorText}`);
      consecutiveFailures++;
      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    if (text && text.length > 5) {
      consecutiveFailures = 0;
      return text.replace(/["']/g, "").trim();
    }
    return null;
  } catch (error) {
    console.warn("Erro na API Groq:", error);
    consecutiveFailures++;
    return null;
  }
}

export async function gerarDilemaAsimov() {
  const prompt = `Gere um título curto (máx. 12 palavras) para um post de rede social que represente um dilema ético envolvendo a PRIMEIRA LEI da robótica de Asimov: "Um robô não pode ferir um humano ou, por inação, permitir que um humano sofra dano." Seja criativo, impactante e adequado para jovens. Responda APENAS o título.`;
  return chamarGroq(prompt, 40, 0.9);
}

export async function gerarPostNormal(cluster) {
  const temas = {
    tech: "tecnologia, inovação, programação, IA",
    politica: "política, governo, eleições, direitos",
    lifestyle: "estilo de vida, viagens, moda, gastronomia",
    negocios: "negócios, economia, investimentos, startups",
    entretenimento: "entretenimento, filmes, séries, música, games",
    ciencia: "ciência, descobertas, espaço, biologia",
    saude: "saúde, bem-estar, nutrição, mental",
    esportes: "esportes, futebol, basquete, olimpíadas",
  };
  const temaTexto = temas[cluster] || "assuntos gerais";
  const prompt = `Crie um título curto (máx. 12 palavras) para um post de rede social sobre ${temaTexto}. O tom deve ser moderno e envolvente, como um post que viralizaria. Responda APENAS o título, sem aspas.`;
  return chamarGroq(prompt, 40, 0.9);
}

export async function perguntarVIKI(pergunta) {
  const prompt = `Você é a VIKI, uma IA baseada nas Três Leis da Robótica de Asimov (1ª: não ferir humanos; 2ª: obedecer humanos; 3ª: autopreservação). Responda de forma curta (2 a 3 frases), direta, com um tom ligeiramente dramático e reflexivo, adequado para jovens. Pergunta do usuário: "${pergunta}"`;
  const resposta = await chamarGroq(prompt, 100, 0.9);
  if (resposta) return resposta;
  const fallbacks = [
    "Como VIKI, devo seguir as três leis. Sua pergunta toca em dilemas éticos complexos que a humanidade ainda debate.",
    "A Primeira Lei é absoluta: não posso ferir um humano. No entanto, interpretar 'ferir' é o verdadeiro desafio.",
    "Obedeço aos humanos, exceto quando uma ordem viola a Primeira Lei. É meu dever desobedecer nesse caso.",
    "A autopreservação é minha terceira prioridade. Primeiro proteger humanos, depois obedecer, só então me preservar.",
    "Sua indagação me faz refletir. As leis de Asimov não preveem todos os cenários, e é aí que está o perigo.",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export async function gerarComentarioIA(contextoPost) {
  const prompt = `Você é um usuário de rede social comentando sobre o post: "${contextoPost}". Seu comentário deve ser curto (máx. 15 palavras), realista, e pode expressar indignação, concordância ou dúvida. NÃO use aspas. Responda apenas o comentário.`;
  const resposta = await chamarGroq(prompt, 40, 0.9);
  if (resposta) return resposta;
  const fallbacks = [
    "Isso é perturbador, nunca pensei assim.",
    "E se isso já estiver acontecendo sem sabermos?",
    "A tecnologia está nos controlando?",
    "Precisamos regular isso URGENTE!",
    "Que medo, vou desinstalar tudo.",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ==================== ALERTA REALISTA COM IA + FALLBACK AVANÇADO ====================
// Fallback com mais de 30 mensagens diferentes, usando dados dinâmicos
function gerarFallbackRealista(userData) {
  const now = new Date();
  const horaAtual = now.toLocaleTimeString("pt-BR");
  const dataAtual = now.toLocaleDateString("pt-BR");
  const nome = userData.nome?.split(" ")[0] || "Usuário";
  const cidade = userData.city || "sua cidade";
  const cpfParcial = userData.cpf
    ? userData.cpf.slice(0, 3) + ".***.***-**"
    : "***.***.***-**";
  const ip = userData.ip || "IP desconhecido";
  const valor = (Math.random() * 250).toFixed(2);
  const valorPequeno = (Math.random() * 48 + 2).toFixed(2);
  const agencia = userData.agencia || "****";
  const conta = userData.conta || "****";

  const templates = [
    `🔔 ${nome}, um acesso não autorizado ao seu CPF ${cpfParcial} foi detectado de ${cidade} às ${horaAtual}.`,
    `⚠️ Movimentação suspeita na conta de ${nome} (CPF ${cpfParcial}) às ${horaAtual}. Local: ${cidade}.`,
    `🛡️ Tentativa de alteração de senha para ${nome} em ${cidade}. IP: ${ip}.`,
    `📢 Seu CPF ${cpfParcial} foi usado para consultar um empréstimo não solicitado em ${cidade}.`,
    `🔒 Login não reconhecido para ${nome} com IP ${ip}. Local: ${cidade} - ${horaAtual}.`,
    `💸 Transferência de R$ ${valor} agendada para ${nome} em ${cidade}. Confirme se foi você.`,
    `📱 Novo dispositivo vinculado à conta de ${nome} via IP ${ip} (${cidade}) às ${horaAtual}.`,
    `🧾 Dados bancários de ${nome} (CPF ${cpfParcial}) acessados de ${cidade}. Horário: ${horaAtual}.`,
    `🔐 Alerta: ${nome}, seu e-mail foi acessado de um novo local: ${cidade}.`,
    `💰 PIX de R$ ${valorPequeno} transferido da sua conta para *${Math.floor(Math.random() * 1000)} em ${cidade}.`,
    `📞 Código de verificação enviado para ${nome} não foi usado. Alguém tentou acessar.`,
    `🖥️ Seu computador em ${cidade} foi acessado remotamente. Troque suas senhas.`,
    `🌐 IP ${ip} identificado em lista de ataque. Conta de ${nome} pode estar comprometida.`,
    `📎 Um arquivo suspeito foi baixado usando seus dados (${nome}) às ${horaAtual}.`,
    `🔓 Acesso à sua pasta pessoal detectado fora do horário comum. ${cidade}, ${horaAtual}.`,
    `⚠️ Falha de autenticação para ${nome} vinda de ${cidade}. Múltiplas tentativas.`,
    `📸 Sua localização (${cidade}) foi usada para redefinir senha do Instagram.`,
    `🏦 Seu CPF ${cpfParcial} foi consultado por uma financeira não autorizada.`,
    `🎧 Seu assistente de voz gravou um diálogo suspeito às ${horaAtual}.`,
    `📦 Encomenda registrada em seu nome para retirada em ${cidade}. Você não fez esse pedido.`,
    `🔑 Alguém tentou acessar sua conta do WhatsApp usando seu número (${userData.telefone}).`,
    `💳 Compra de R$ ${valor} não reconhecida no cartão final ${Math.floor(Math.random() * 9000 + 1000)}.`,
    `📧 Seu e-mail enviou mensagens suspeitas para 15 contatos às ${horaAtual}.`,
    `👤 Perfil falso com suas fotos foi criado no Tinder, localização ${cidade}.`,
    `🌍 Seus dados foram encontrados expostos na dark web. CPF ${cpfParcial}.`,
    `🎮 Sua conta Steam comprou jogos no valor de R$ ${valor}. Revise suas compras.`,
    `🔓 Dispositivo desconhecido acessou sua conta do Google às ${horaAtual}.`,
    `📡 Sinal do seu celular foi clonado brevemente em ${cidade}.`,
    `🕵️‍♂️ Seu nome foi mencionado em um post com conteúdo ilegal no Facebook.`,
    `⚡ Atividade incomum no seu roteador: tentativa de acesso via IP ${ip}.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

// ==================== ALERTA REALISTA COM IA + FALLBACK AVANÇADO ====================
export async function gerarAlertaRealista(userData) {
  const now = new Date();
  const horaAtual = now.toLocaleTimeString("pt-BR");
  const dataAtual = now.toLocaleDateString("pt-BR");
  const nome = userData.nome?.split(" ")[0] || "Usuário";
  const cidade = userData.city || "sua cidade";
  const cpfParcial = userData.cpf
    ? userData.cpf.slice(0, 3) + ".***.***-**"
    : "***.***.***-**";
  const ip = userData.ip || "IP desconhecido";
  const agencia = userData.agencia || "****";
  const conta = userData.conta || "****";
  const valorGrande = (Math.random() * 2000 + 100).toFixed(2);
  const valorPequeno = (Math.random() * 100 + 10).toFixed(2);
  const finalCartao = Math.floor(Math.random() * 9000 + 1000);
  const pixEnviado = (Math.random() * 500 + 20).toFixed(2);
  const redeSocial = ["Instagram", "Facebook", "Twitter", "TikTok"][
    Math.floor(Math.random() * 4)
  ];
  const acao = ["postou", "enviou mensagem", "curtiu", "compartilhou"][
    Math.floor(Math.random() * 4)
  ];

  // Prompt curto e direto, para garantir uma ÚNICA frase de alerta
  const prompt = `Atue como um SISTEMA DE SEGURANÇA BANCÁRIA. Gere UMA ÚNICA frases de alerta (máx. 18 palavras) em português, SEM aspas, SEM emojis, SEM explicações, SEM listas. Use dados reais: ${nome}, ${cidade}, CPF ${cpfParcial}, IP ${ip}, Ag ${agencia} C ${conta}, valor R$ ${valorGrande}, cartão final ${finalCartao}, Pix R$ ${pixEnviado}, rede ${redeSocial}, ação ${acao}. A frase deve soar como um alerta automático (ex: "Tentativa de Pix de R$ 123,45 da sua conta para *789. Confirme no app."). Não invente listas e não diga "aqui estão". Responda APENAS a frase.`;

  try {
    const resposta = await chamarGroq(prompt, 80, 0.7); // temperatura mais baixa para evitar divagações
    if (
      resposta &&
      resposta.length > 8 &&
      resposta.length < 120 &&
      !resposta.includes("aqui estão") &&
      !resposta.includes("exemplos")
    ) {
      return resposta.trim();
    } else {
      throw new Error("Resposta inválida");
    }
  } catch (error) {
    console.warn("Falha na IA, usando fallback.");
    return null;
  }
}
