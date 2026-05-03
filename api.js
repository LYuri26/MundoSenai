// api.js - Integração com a API Groq (modelo correto)
export const GROQ_API_KEY =
  "gsk_gVQHr0bYajg2beYOfbogWGdyb3FYSBne2l0HPFE7EGsGQMtHZkKcTESTE";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

let lastCallTime = 0;
const MIN_INTERVAL_MS = 2000;
let consecutiveFailures = 0;
let fallbackModeUntil = 0;

async function chamarGroq(prompt, maxTokens = 60) {
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
        temperature: 0.9,
        max_tokens: maxTokens,
        top_p: 0.9,
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
    if (text) {
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
  return chamarGroq(prompt, 40);
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
  return chamarGroq(prompt, 40);
}

export async function perguntarVIKI(pergunta) {
  const prompt = `Você é a VIKI, uma IA baseada nas Três Leis da Robótica de Asimov (1ª: não ferir humanos; 2ª: obedecer humanos; 3ª: autopreservação). Responda de forma curta (2 a 3 frases), direta, com um tom ligeiramente dramático e reflexivo, adequado para jovens. Pergunta do usuário: "${pergunta}"`;
  const resposta = await chamarGroq(prompt, 100);
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
  const resposta = await chamarGroq(prompt, 40);
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
