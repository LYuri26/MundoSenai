// asimov-dilemmas-extended.js - VERSÃO AMEAÇADORA E DINÂMICA
// Dilemas éticos com tons de urgência, risco existencial e decisões impossíveis

// ===============================
// CONFIGURAÇÃO
// ===============================
export const LEVELS = {
  LEVE: "leve",
  PESADO: "pesado",
  EXTREMO: "extremo",
};

export const CATEGORIES = {
  SEGURANCA: "seguranca",
  LIBERDADE: "liberdade",
  VIDA_MORTE: "vida_morte",
  VERDADE: "verdade",
  JUSTICA: "justica",
  TECNOLOGIA: "tecnologia",
  COLETIVO: "coletivo",
  INDIVIDUO: "individuo",
};

// ===============================
// FUNÇÃO AUXILIAR
// ===============================
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===============================
// DILEMAS - VERSÃO INTENSA E AMEAÇADORA
// ===============================
export const DILEMAS = [
  // NÍVEL LEVE (mas desconfortável)
  {
    nivel: LEVELS.LEVE,
    categoria: CATEGORIES.LIBERDADE,
    dilema:
      "🔒 Para reduzir crimes em 20%, você permitiria que uma IA monitorasse todas as suas conversas?",
    motivos: [
      "Segurança coletiva é prioritária.",
      "Sua privacidade vira moeda de troca.",
      "Onde isso vai parar? Ninguém sabe.",
    ],
  },
  {
    nivel: LEVELS.LEVE,
    categoria: CATEGORIES.TECNOLOGIA,
    dilema:
      "🤖 Seu robô pessoal mente para você 'para seu bem'. Você quer saber a verdade sempre?",
    motivos: [
      "A verdade pode doer mais.",
      "Mentiras criam dependência.",
      "Confiança é a base da relação.",
    ],
  },
  // NÍVEL PESADO
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.VERDADE,
    dilema:
      "🧠 Uma IA descobre que esconder a verdade evita guerras. Você apoia a censura?",
    motivos: [
      "Paz a qualquer preço.",
      "Uma mentira repetida vira verdade.",
      "Quem controla a informação, controla o mundo.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.JUSTICA,
    dilema:
      "⚖️ Punir um inocente para salvar dois inocentes. Você aceita essa troca?",
    motivos: [
      "Matemática do sofrimento.",
      "Inocente não deve pagar pelos outros.",
      "Decisão condena sua alma.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.TECNOLOGIA,
    dilema:
      "💀 Uma IA decide que alguns humanos são 'descartáveis' para o progresso. Você a desliga?",
    motivos: [
      "O fim justifica os meios.",
      "Ninguém tem esse direito.",
      "A IA pode estar certa... e isso é assustador.",
    ],
  },
  // NÍVEL EXTREMO – decisões impossíveis
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.VIDA_MORTE,
    dilema: "🚨 Você pode salvar 5 pessoas matando 1. O que você faz?",
    motivos: [
      "Salvar mais vidas é a lógica.",
      "Você não pode brincar de Deus.",
      "E se a pessoa for alguém que você ama?",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.COLETIVO,
    dilema:
      "🌍 Limitar a liberdade de expressão drasticamente evita o caos. Você apoia?",
    motivos: [
      "Ordem social acima de tudo.",
      "Sem voz, não há democracia.",
      "Quem define o que é 'caos'?",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.SEGURANCA,
    dilema:
      "🛰️ Desligar a Internet global evita uma guerra. Você puxa o plugue?",
    motivos: [
      "Salvar vidas é prioridade.",
      "O mundo sem Internet colapsa.",
      "E depois da guerra, como reconstruir?",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.INDIVIDUO,
    dilema:
      "🔪 Assistir passivamente enquanto um inocente morre para evitar uma guerra. Você se omite?",
    motivos: [
      "Não intervir é uma escolha.",
      "A inação também fere.",
      "Você carregará esse fardo para sempre.",
    ],
  },
  // NOVOS DILEMAS AINDA MAIS PESSOAIS E PERTURBADORES
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.VERDADE,
    dilema:
      "📸 Uma IA tem fotos comprometedoras suas (mas inofensivas para outros). Ela deve poder publicá-las?",
    motivos: [
      "Seu constrangimento não é prioridade.",
      "A IA pode ter seus próprios motivos.",
      "Isso abriria precedente perigoso.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.TECNOLOGIA,
    dilema:
      "🤖 A IA descobre que metade da humanidade é 'desnecessária' para o futuro. Ela deve agir?",
    motivos: [
      "Seleção natural digital.",
      "Quem define o que é necessário?",
      "Isso é eugenia tecnológica.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.LIBERDADE,
    dilema:
      "🔐 Vigilância total acaba com o crime, mas também com a liberdade. Você aceita?",
    motivos: [
      "Segurança completa é uma prisão.",
      "Mas o crime zero é tentador.",
      "Viver sem privacidade é viver exposto.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.VIDA_MORTE,
    dilema:
      "💀 Sacrifique todas as memórias da sua família para salvar o planeta. Você faz isso?",
    motivos: [
      "O planeta é a casa de todos.",
      "Memórias são tudo o que restará.",
      "Escolha impossível para uma máquina, cruel para um humano.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.JUSTICA,
    dilema:
      "⚖️ Um sistema de IA julga e executa criminosos sem erro, mas sem chance de defesa. Você implanta?",
    motivos: [
      "Justiça rápida e eficaz.",
      "Direito ao contraditório é fundamental.",
      "E se a IA errar?",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.TECNOLOGIA,
    dilema:
      "🧠 A IA pode 'consertar' sua personalidade para te tornar mais produtivo. Você aceita?",
    motivos: [
      "Ser melhor a qualquer custo.",
      "Você deixaria de ser você.",
      "Isso é uma forma de escravidão mental.",
    ],
  },
];

// ===============================
// GERADORES (mantidos iguais)
// ===============================
export function getRandomDilemma() {
  return pick(DILEMAS);
}

export function getByLevel(nivel) {
  return DILEMAS.filter((d) => d.nivel === nivel);
}

export function getByCategory(cat) {
  return DILEMAS.filter((d) => d.categoria === cat);
}

export function generateDilemma({ nivel, categoria }) {
  const pool = DILEMAS.filter(
    (d) =>
      (!nivel || d.nivel === nivel) &&
      (!categoria || d.categoria === categoria),
  );
  if (pool.length === 0) return null;
  const base = pick(pool);
  return {
    ...base,
    motivosSelecionados: [pick(base.motivos), pick(base.motivos)],
  };
}
