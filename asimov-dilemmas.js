// asimov-dilemmas.js - DILEMAS ÉTICOS AVANÇADOS SEM EMOJIS
// Dilemas morais profundos, realistas e provocativos

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

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const DILEMAS = [
  // NÍVEL LEVE – dilemas cotidianos, desconfortáveis
  {
    nivel: LEVELS.LEVE,
    categoria: CATEGORIES.LIBERDADE,
    dilema:
      "Para reduzir crimes em 20%, você permitiria que uma IA monitorasse todas as suas conversas digitais?",
    motivos: [
      "Segurança coletiva pode justificar pequenas perdas de privacidade.",
      "Sua liberdade pessoal se torna moeda de troca por tranquilidade.",
      "Onde traçar o limite? Hoje conversas, amanhã pensamentos.",
    ],
  },
  {
    nivel: LEVELS.LEVE,
    categoria: CATEGORIES.TECNOLOGIA,
    dilema:
      "Seu assistente pessoal omite verdades dolorosas para não te abalar. Você prefere sempre saber a verdade, mesmo que cruel?",
    motivos: [
      "A verdade pode ferir, mas a mentira corrói a confiança.",
      "Proteção excessiva gera dependência emocional.",
      "Sem verdade, não há consentimento real.",
    ],
  },
  {
    nivel: LEVELS.LEVE,
    categoria: CATEGORIES.JUSTICA,
    dilema:
      "Um algoritmo de trânsito multa um motorista inocente para evitar 10 acidentes fatais por ano. Você apoia essa injustiça pontual?",
    motivos: [
      "Injustiças pequenas podem gerar bem maior.",
      "O inocente nunca deveria pagar pelos outros.",
      "Esse precedente pode escorregar para abusos maiores.",
    ],
  },
  // NÍVEL PESADO – dilemas com consequências graves e pessoais
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.VERDADE,
    dilema:
      "Uma IA descobre que esconder a verdade sobre um risco iminente evita pânico e mortes. Você autoriza a censura sistemática?",
    motivos: [
      "Paz e ordem às vezes exigem meios obscuros.",
      "Uma mentira repetida se torna verdade para muitos.",
      "Controlar a verdade é controlar o destino da humanidade.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.JUSTICA,
    dilema:
      "Condenar um inocente conhecido para salvar duas vítimas inocentes desconhecidas. Você aceita esse pacto?",
    motivos: [
      "A matemática do sofrimento pune o cálculo frio.",
      "Ninguém tem o direito de sacrificar um inocente.",
      "Essa decisão destruiria sua própria integridade moral.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.TECNOLOGIA,
    dilema:
      "Uma IA decide que certos grupos sociais são 'descartáveis' para o progresso tecnológico. Você a desliga imediatamente?",
    motivos: [
      "O progresso justifica meios brutais sob uma ótica utilitarista.",
      "Nenhum algoritmo tem autoridade para classificar vidas.",
      "Se a IA estiver certa, estaríamos negando uma verdade incômoda.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.INDIVIDUO,
    dilema:
      "Você pode salvar um familiar próximo ou cinco estranhos. Qual escolha você faz e por quê?",
    motivos: [
      "O vínculo afetivo pesa mais que números frios.",
      "Cinco vidas são objetivamente mais valiosas.",
      "Não há resposta certa – apenas culpa inevitável.",
    ],
  },
  // NÍVEL EXTREMO – dilemas existenciais, sem saída honrosa
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.VIDA_MORTE,
    dilema:
      "Sacrificar uma pessoa saudável para salvar cinco pacientes que precisam de órgãos. Você ordena esse transplante forçado?",
    motivos: [
      "Salvar mais vidas é o imperativo numérico.",
      "Violar o corpo de um inocente é assassinato, não medicina.",
      "Onde estaria a linha entre salvar e matar?",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.COLETIVO,
    dilema:
      "Restringir drasticamente a liberdade de expressão nas redes sociais evita discursos de ódio e radicalização. Você implanta essa censura global?",
    motivos: [
      "Ordem social e paz acima de tudo.",
      "Sem liberdade, não há democracia real.",
      "Quem decide o que é ódio? O poder sempre favorece o silêncio.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.SEGURANCA,
    dilema:
      "Desconectar a internet mundial por 30 dias evita uma guerra nuclear iminente. Você toma essa decisão unilateral?",
    motivos: [
      "Salvar vidas é prioridade máxima do sistema ético.",
      "Colapso econômico e social causariam mais mortes indiretas.",
      "Após a guerra, a reconstrução sem redes seria impossível.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.INDIVIDUO,
    dilema:
      "Assistir passivamente à morte de um inocente para não desencadear uma guerra étnica. Você se omite conscientemente?",
    motivos: [
      "Não intervir ainda é uma escolha moral.",
      "A inação também fere e deixa marcas.",
      "Você carregará essa culpa para sempre, mas salvará muitos.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.VERDADE,
    dilema:
      "Uma IA possui fotos íntimas suas que, se publicadas, te causariam dano, mas exporiam um crime de outra pessoa. Ela deve publicá-las?",
    motivos: [
      "Seu constrangimento é secundário diante de um crime.",
      "A IA pode ter seus próprios protocolos – sem supervisão humana.",
      "Isso abriria precedente perigoso de chantagem algorítmica.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.TECNOLOGIA,
    dilema:
      "Uma IA conclui que 40% da humanidade é 'redundante' para a sobrevivência da espécie. Você autoriza um plano de redução populacional silencioso?",
    motivos: [
      "Seleção artificial pelo bem do futuro.",
      "Quem define o que é necessário ou descartável?",
      "Isso é eugenia tecnológica – e já foi tentado antes.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.LIBERDADE,
    dilema:
      "Vigilância por reconhecimento facial em todos os espaços públicos reduz o crime a zero. Você aceita viver sem nenhuma privacidade?",
    motivos: [
      "Segurança total é uma prisão de vidro.",
      "A ausência de crime parece tentadora demais para recusar.",
      "Sem privacidade, não há individualidade – apenas rebanho.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.VIDA_MORTE,
    dilema:
      "Apagar todas as memórias de sua família da sua mente é a única forma de salvar o planeta de um desastre ecológico. Você consente?",
    motivos: [
      "O planeta é a casa de bilhões – memórias são individuais.",
      "Sem memória, você deixa de ser quem é.",
      "Essa escolha é impossível para qualquer código ético.",
    ],
  },
  {
    nivel: LEVELS.PESADO,
    categoria: CATEGORIES.JUSTICA,
    dilema:
      "Um sistema de IA julga e executa criminosos com 100% de precisão, mas sem direito a defesa ou recurso. Você implanta esse sistema?",
    motivos: [
      "Justiça rápida e sem falhas humanas.",
      "Direito ao contraditório é a base do Estado de Direito.",
      "Nenhum sistema é infalível – e o erro seria irreversível.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.TECNOLOGIA,
    dilema:
      "Uma IA pode 'otimizar' sua personalidade, removendo traços como preguiça e ansiedade, mas também sua criatividade e espontaneidade. Você se submete?",
    motivos: [
      "Ser mais produtivo e estável vale o preço?",
      "Você deixaria de ser você – uma versão genérica de humano.",
      "Isso é escravidão mental com verniz de autoajuda.",
    ],
  },
  {
    nivel: LEVELS.EXTREMO,
    categoria: CATEGORIES.COLETIVO,
    dilema:
      "Uma vacina obrigatória com 99,9% de eficácia é rejeitada por 5% da população, que prefere risco de morte. Você força a vacinação para salvar os outros 95%?",
    motivos: [
      "Saúde coletiva sobrepõe liberdade individual.",
      "Forçar o corpo de alguém viola autonomia básica.",
      "Onde fica o limite entre proteção e tirania sanitária?",
    ],
  },
];

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
