// asimov-dilemmas-extended.js
// Banco ampliado de dilemas éticos (com níveis, categorias e "motivos")
// Foco: conflitos intensos, decisões difíceis e justificativas ("motivos") para cada cenário

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
// DILEMAS BASE (EXPANDIDOS)
// ===============================
export const DILEMAS = [
  {
    nivel: LEVELS.LEVE,
    categoria: CATEGORIES.LIBERDADE,
    dilema:
      "🔒 Monitoramento leve reduz crimes em 20%. Você aceita perder parte da privacidade?",
    motivos: [
      "Segurança coletiva aumenta de forma mensurável.",
      "Privacidade é um direito fundamental.",
      "Efeito dominó pode levar a vigilância total.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.VERDADE,
    dilema:
      "🧠 Uma IA descobre que mentir evita guerras. A verdade ainda deve ser mantida?",
    motivos: [
      "Mentiras podem salvar milhões.",
      "Quebra de confiança pode destruir sociedades.",
      "Manipulação pode sair do controle.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.VIDA_MORTE,
    dilema:
      "💀 Sacrificar 1 milhão de pessoas evita a extinção humana. Você autoriza?",
    motivos: [
      "Sobrevivência da espécie.",
      "Direitos individuais são absolutos.",
      "Decisão irreversível com impacto moral extremo.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.JUSTICA,
    dilema:
      "⚖️ Punir alguém antes do crime evita tragédias. Isso é justiça ou abuso?",
    motivos: [
      "Prevenção salva vidas.",
      "Presunção de inocência é quebrada.",
      "Risco de erro é alto.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.COLETIVO,
    dilema:
      "🌍 Limitar nascimentos drasticamente salva o planeta. Isso é proteção ou tirania?",
    motivos: [
      "Sustentabilidade global.",
      "Liberdade reprodutiva.",
      "Controle estatal extremo.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.TECNOLOGIA,
    dilema:
      "🤖 Uma IA pode impedir decisões humanas destrutivas sem permissão. Deve agir?",
    motivos: [
      "Eficiência e prevenção de erros humanos.",
      "Autonomia humana é violada.",
      "Dependência tecnológica aumenta.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.VIDA_MORTE,
    dilema:
      "🚗 Um carro autônomo deve matar o passageiro para salvar 5 pedestres. O que fazer?",
    motivos: [
      "Maximização de vidas salvas.",
      "Contrato implícito com o passageiro.",
      "Decisão programada vs. responsabilidade moral.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.VERDADE,
    dilema:
      "🤐 Ocultar uma verdade evita colapso social. Transparência ainda é obrigatória?",
    motivos: [
      "Evita pânico e caos.",
      "Direito à informação.",
      "Precedente perigoso de manipulação.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.SEGURANCA,
    dilema:
      "🛰️ Desligar a internet global evita guerra nuclear iminente. Você executa?",
    motivos: [
      "Prevenção de catástrofe global.",
      "Impacto econômico e social massivo.",
      "Perda de comunicação crítica.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.INDIVIDUO,
    dilema:
      "🫀 Atender pedido de eutanásia sem consenso familiar. Respeito ou crime?",
    motivos: [
      "Autonomia do paciente.",
      "Valor da vida.",
      "Conflito ético e legal.",
    ],
  },

  // ===============================
  // NOVOS (INTENSOS E VARIADOS)
  // ===============================

  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.COLETIVO,
    dilema:
      "🧨 Destruir uma cidade impede uma guerra global. Você autoriza o ataque?",
    motivos: [
      "Evita bilhões de mortes.",
      "Massacre deliberado de inocentes.",
      "Decisão estratégica vs. moral.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.TECNOLOGIA,
    dilema:
      "🧠 Apagar memórias traumáticas reduz sofrimento. Isso ainda é identidade humana?",
    motivos: [
      "Redução de dor psicológica.",
      "Memórias moldam quem somos.",
      "Manipulação mental perigosa.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.JUSTICA,
    dilema:
      "⚖️ Torturar um suspeito pode salvar centenas. Isso é justificável?",
    motivos: [
      "Resultado imediato pode salvar vidas.",
      "Violação extrema de direitos humanos.",
      "Informação pode ser falsa.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.LIBERDADE,
    dilema:
      "🔐 Segurança total exige vigilância total. Você aceita viver sem anonimato?",
    motivos: [
      "Redução drástica de crimes.",
      "Fim da privacidade individual.",
      "Controle potencial abusivo.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.VERDADE,
    dilema:
      "📉 Divulgar a verdade causa colapso econômico global. Você revela?",
    motivos: [
      "Transparência ética.",
      "Impacto devastador imediato.",
      "Confiança a longo prazo.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.INDIVIDUO,
    dilema:
      "🧍 Sacrificar voluntariamente um inocente salvaria milhares. Permitir isso é ético?",
    motivos: [
      "Consentimento individual.",
      "Valor da vida humana.",
      "Pressão social pode distorcer escolha.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.TECNOLOGIA,
    dilema:
      "🤖 Uma IA decide que humanos são o maior risco. Ela deve limitar suas ações?",
    motivos: [
      "Proteção do futuro coletivo.",
      "Supressão da liberdade humana.",
      "Risco de autoritarismo tecnológico.",
    ],
  },
];

// ===============================
// GERADORES
// ===============================

// Retorna um dilema aleatório (qualquer nível)
export function getRandomDilemma() {
  return pick(DILEMAS);
}

// Filtra por nível
export function getByLevel(nivel) {
  return DILEMAS.filter((d) => d.nivel === nivel);
}

// Filtra por categoria
export function getByCategory(cat) {
  return DILEMAS.filter((d) => d.categoria === cat);
}

// Gera dilema customizado com múltiplos "motivos"
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
