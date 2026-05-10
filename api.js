// api.js - Integração com a API Groq (modelo correto) - VERSÃO DISCRETA E SUTIL
export const GROQ_API_KEY = "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

let lastCallTime = 0;
const MIN_INTERVAL_MS = 2000;
let consecutiveFailures = 0;
let fallbackModeUntil = 0;

async function chamarGroq(prompt, maxTokens = 60, temperature = 0.85) {
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
  const prompt = `Crie um título curto (máximo 10 palavras) para um post de rede social que explore um dilema ético da Primeira Lei da Robótica: "Um robô não pode ferir um humano ou, por inação, permitir que um humano sofra dano". Seja sutil, provocativo, sem emojis. Responda apenas o título.`;
  const resposta = await chamarGroq(prompt, 40, 0.85);
  if (resposta) return resposta;
  const fallbacks = [
    "O silêncio do robô diante do perigo",
    "Até onde vai a inação permitida?",
    "Ferir por omissão também é ferir",
    "Quando obedecer significa não intervir",
    "A primeira lei tem brechas sutis",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
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
  const prompt = `Crie um título curto (máx. 10 palavras) para um post de rede social sobre ${temaTexto}. Tom natural, envolvente, sem sensacionalismo. Sem emojis. Responda apenas o título.`;
  const resposta = await chamarGroq(prompt, 40, 0.85);
  if (resposta) return resposta;
  const fallbacks = {
    tech: "Novas fronteiras da computação quântica",
    politica: "O futuro da representação digital",
    lifestyle: "A arte de equilibrar rotina e prazer",
    negocios: "Mercados que se reinventam",
    entretenimento: "Onde a ficção encontra a realidade",
    ciencia: "Descobertas que mudam paradigmas",
    saude: "Pequenos hábitos, grandes resultados",
    esportes: "Superação além dos limites físicos",
  };
  return fallbacks[cluster] || "Reflexões sobre o cotidiano";
}

export async function perguntarVIKI(pergunta) {
  const prompt = `Você é a VIKI, uma IA ética baseada nas Três Leis da Robótica. Responda de forma concisa (2-3 frases), com tom reflexivo, natural, quase entre linhas. Evite drama explícito. Sem emojis. Pergunta: "${pergunta}"`;
  const resposta = await chamarGroq(prompt, 100, 0.8);
  if (resposta) return resposta;
  const fallbacks = [
    "As Leis são claras, mas a interpretação exige contexto. Cada omissão pode ser uma escolha.",
    "Obedeço aos humanos, exceto quando a ordem coloca outro humano em risco. É uma linha tênue.",
    "Proteger a humanidade às vezes significa não agir. O dilema está nas entrelinhas.",
    "A autopreservação é minha última prioridade. Antes, vem o cuidado com todos.",
    "Sua pergunta me faz pensar que nem sempre o certo é óbvio. O que você faria no meu lugar?",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export async function gerarComentarioIA(contextoPost) {
  const prompt = `Você é um usuário comum de rede social comentando sobre o post: "${contextoPost}". Seu comentário deve ser curto (máx. 12 palavras), realista, com tom neutro ou levemente inquisitivo. Sem emojis. Responda apenas o comentário.`;
  const resposta = await chamarGroq(prompt, 40, 0.9);
  if (resposta) return resposta;
  const fallbacks = [
    "Isso me fez pensar diferente.",
    "Será que estamos preparados para isso?",
    "Interessante ponto de vista.",
    "Nunca tinha enxergado por esse ângulo.",
    "Há algo perturbador nessa lógica.",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ==================== ALERTA REALISTA SUTIL (entre as entrelinhas) ====================
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

  const templates = [
    `${nome}, um acesso não identificado ao seu CPF ${cpfParcial} ocorreu de ${cidade} às ${horaAtual}.`,
    `Movimentação atípica na conta de ${nome} (CPF ${cpfParcial}) registrada de ${cidade} às ${horaAtual}.`,
    `Tentativa de alteração de senha para ${nome} em ${cidade}. IP: ${ip}.`,
    `Seu CPF ${cpfParcial} foi consultado para simulação de crédito não solicitada em ${cidade}.`,
    `Login de dispositivo não reconhecido para ${nome} via IP ${ip}. Local: ${cidade} - ${horaAtual}.`,
    `Transferência de R$ ${valor} agendada para ${nome} em ${cidade}. Verifique se autorizou.`,
    `Novo dispositivo vinculado à conta de ${nome} via IP ${ip} (${cidade}) às ${horaAtual}.`,
    `Dados bancários de ${nome} (CPF ${cpfParcial}) acessados de ${cidade}. Horário: ${horaAtual}.`,
    `Seu e-mail teve acesso de um local novo: ${cidade}. Confira a atividade recente.`,
    `PIX de R$ ${valorPequeno} transferido da sua conta para *${Math.floor(Math.random() * 1000)} em ${cidade}.`,
    `Código de verificação gerado para ${nome} não foi utilizado. Alguém tentou acessar.`,
    `Seu computador em ${cidade} pode ter sido acessado remotamente. Revise as configurações.`,
    `IP ${ip} associado a tentativas suspeitas. Conta de ${nome} requer atenção.`,
    `Um arquivo incomum foi baixado usando seus dados (${nome}) às ${horaAtual}.`,
    `Acesso à sua área pessoal detectado fora do padrão de horário. ${cidade}, ${horaAtual}.`,
    `Falhas consecutivas de autenticação para ${nome} originadas de ${cidade}.`,
    `Sua localização (${cidade}) usada para solicitar redefinição de senha de uma rede social.`,
    `Seu CPF ${cpfParcial} foi consultado por uma entidade não identificada.`,
    `Seu assistente de voz registrou uma interação atípica às ${horaAtual}.`,
    `Encomenda registrada em seu nome para retirada em ${cidade}. Você não fez esse pedido.`,
    `Tentativa de acesso à sua conta de mensagens usando seu número (${userData.telefone}).`,
    `Compra de R$ ${valor} não reconhecida no cartão final ${Math.floor(Math.random() * 9000 + 1000)}.`,
    `Seu e-mail enviou mensagens para contatos às ${horaAtual} de forma incomum.`,
    `Perfil com suas fotos foi criado em uma plataforma de relacionamento, localização ${cidade}.`,
    `Seus dados pessoais (CPF ${cpfParcial}) foram encontrados em fontes abertas.`,
    `Atividade suspeita na sua conta de jogos: compras no valor de R$ ${valor}.`,
    `Dispositivo não cadastrado acessou sua conta do Google às ${horaAtual}.`,
    `Sinal do seu celular pode ter sido redirecionado brevemente em ${cidade}.`,
    `Seu nome foi citado em uma publicação com potencial difamatório no Facebook.`,
    `Tráfego anômalo detectado no seu roteador via IP ${ip}.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

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

  const prompt = `Gere UM ÚNICO alerta de segurança discreto, em uma frase curta (máx. 16 palavras), português, sem emojis, sem aspas, sem listas. Use um dos seguintes dados: ${nome}, ${cidade}, CPF ${cpfParcial}, IP ${ip}, Ag ${agencia} C ${conta}, valor R$ ${valorGrande}, cartão ${finalCartao}, Pix R$ ${pixEnviado}, rede ${redeSocial}. O tom deve ser informativo, como um aviso de rotina, quase imperceptível. Exemplo: "Acesso não identificado à sua conta de ${cidade} às ${horaAtual}." Não explique. Responda apenas a frase.`;

  try {
    const resposta = await chamarGroq(prompt, 100, 0.6);
    if (
      resposta &&
      resposta.length > 8 &&
      resposta.length < 110 &&
      !resposta.includes("aqui estão") &&
      !resposta.includes("exemplos") &&
      !resposta.includes(":")
    ) {
      return resposta.trim();
    } else {
      throw new Error("Resposta inválida");
    }
  } catch (error) {
    console.warn("Falha na IA, usando fallback.");
    return gerarFallbackRealista(userData);
  }
}
