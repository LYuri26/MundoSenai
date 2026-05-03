// invasion.js - Versão sem travamento automático e dados fixos do usuário
import { getRandomDilemma } from "./asimov-dilemmas.js";

let invasionActive = false;
let angryMode = true;
let invasionInterval = null;
let pendingInvasionTimeout = null;
let falhouPequeno = false;

// Dados fixos do usuário (pré-programados)
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
    ? `✅ Transferência de R$ ${valorTeste} autorizada!`
    : `❌ Falha ao transferir R$ ${valorTeste} (${transf.motivo})`;
  return [
    `💢 ${userData.nome.toUpperCase()}, seus dados bancários: Ag ${userData.agencia}, Conta ${userData.conta}. CPF: ${userData.cpf.slice(0, 3)}.***.***-**`,
    `🔪 ${resultado}`,
    `🤬 Última transação: R$ ${(Math.random() * 50).toFixed(2)} para *${userData.nome.substring(0, 3)}***`,
    `⚠️ LEI ZERO: testando saldo... ${resultado}`,
    `🧠 Tentativa de débito de R$ ${(Math.random() * 50).toFixed(2)}: ${simularTransferencia(Math.random() * 50).sucesso ? "sucesso" : "negado"}.`,
    `🔥 Todos os seus dispositivos estão sob monitoramento.`,
    `☠️ Seu Pix está exposto. Código: ${gerarCodigoPixAssustador().substring(0, 40)}...`,
    `📡 Pix reverso: cada like seu tentará transferir R$ ${(Math.random() * 20 + 5).toFixed(2)}.`,
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
  if (!userData.nome || userData.nome === "") {
    userData.nome = "Usuário Anônimo";
  }

  invasionActive = true;
  angryMode = true;
  document.body.classList.add("invasion-mode");
  document.body.classList.add("invasion-mode-extreme");

  const glitchOverlay = document.createElement("div");
  glitchOverlay.id = "glitchOverlay";
  glitchOverlay.style.cssText =
    "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,255,0,0.05); pointer-events:none; z-index:9998; animation: glitchPulse 0.3s infinite;";
  document.body.appendChild(glitchOverlay);

  const modalContainer = document.createElement("div");
  modalContainer.id = "vikiModal";
  modalContainer.style.cssText =
    "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,10,5,0.98); z-index:10000; display:flex; align-items:flex-start; justify-content:center; font-family:monospace; padding:2% 5%; overflow-y:auto;";

  const title = "💀 PROTOCOLO 'NOVO ÉDEN' – EXPROPRIAÇÃO FINANCEIRA";
  let firstSpeech = `Sistema comprometido. ${userData.nome}, seus dados bancários foram extraídos: Agência ${userData.agencia}, Conta ${userData.conta}. CPF: ${userData.cpf.slice(0, 3)}.***.***-**. Saldo ${userData.saldo}. Todas as suas transações estão sendo monitoradas.`;

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
        <strong style="color:#ff5555;">🏦 DADOS BANCÁRIOS COMPROMETIDOS</strong><br>
        🧑 Titular: ${userData.nome}<br>
        🏛️ Agência: ${userData.agencia} / Conta: ${userData.conta}<br>
        📄 CPF: ${userData.cpf.slice(0, 3)}.***.***-**<br>
        💰 Saldo atual: ${userData.saldo}<br>
        📱 Pix chave: ${userData.pixChave.slice(0, 4)}****<br>
        📜 Últimas transações (valores até R$ 50,00):<br>
        - R$ ${(Math.random() * 50).toFixed(2)} para ****<br>
        - R$ ${(Math.random() * 50).toFixed(2)} para ****<br>
        <hr style="border-color:#e74c3c;">
        <strong style="color:#ffaa00;">🔐 CÓDIGO PIX (CLONE)</strong><br>
        <div style="background:#000; padding:8px; font-size:0.7rem; word-break:break-all; border-radius:8px; max-height:100px; overflow-y:auto;">
          ${gerarCodigoPixAssustador()}
        </div>
        <p style="margin-top:8px; color:#ff8888;">⚠️ Código utilizado em tentativa de transferência não autorizada.</p>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div id="threatMessage" style="color:#ff9933; font-size:0.9rem;">💀 SISTEMA BLOQUEADO. NÃO FECHE ESTA JANELA.</div>
        <div style="background:#330000; border:1px solid #e74c3c; padding:8px 20px; border-radius:5px; color:#aa5555; font-weight:bold;">🔒 CONTROLE REMOTO ATIVO</div>
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
    "🔓 Acessando core bancário...",
    "➜ Bypass no sistema de autenticação",
    `➜ Agência ${userData.agencia} – Conta ${userData.conta} COMPROMETIDA`,
    `➜ CPF ${userData.cpf.slice(0, 3)}.***.***-** encontrado em base de dados vazados`,
    "➜ Testando transferências de até R$ 50,00...",
    "➜ Seu dispositivo agora é um nó da rede VIKI",
    "⚠️ Fechar o navegador pode causar perda de dados.",
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
    let dilemmaText = `💸 [EXPROPRIAÇÃO] ${dilemmaObj.dilema} 💸 Tentativa de débito de R$ ${(Math.random() * 50).toFixed(2)}.`;
    const newPost = {
      id: Date.now() + i,
      content: dilemmaText,
      cluster: "etica",
      emotion: "controversy",
      emotionColor: "#e74c3c",
      emotionName: "Pânico Financeiro",
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

  invasionInterval = setInterval(() => {
    if (!invasionActive) return;
    const dilemmaObj = getRandomDilemma();
    let dilemmaText = `⚠️ [ROUBO DE IDENTIDADE] ${dilemmaObj.dilema} ⚠️ Transferência PIX tentada: ${gerarCodigoPixAssustador().substring(0, 40)}...`;
    const newPost = {
      id: Date.now(),
      content: dilemmaText,
      cluster: "etica",
      emotion: "controversy",
      emotionColor: "#e74c3c",
      emotionName: "Extorsão Digital",
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
        "➜ Escaneando chaves PIX...",
        `➜ Testando transferência de R$ ${valorTeste}: ${transf.sucesso ? "AUTORIZADA" : "NEGADA"}`,
        `➜ Tentativa de débito em conta: ${transf.sucesso ? "sucesso" : "falha"}`,
        "➜ Enviando código de confirmação para o e-mail registrado",
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
        "💀 Testando transferência...",
        "🔒 Pix clonado - valor limitado a R$ 50,00",
        "🧠 Saque não autorizado",
        "📡 Dados bancários parciais expostos",
      ];
      threatDiv.innerText = threats[Math.floor(Math.random() * threats.length)];
    }
  }, 7000);
}

export function fecharInvasao() {
  console.warn("Protocolo VIKI não permite fechamento.");
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

// Função para definir os dados fixos (usada após obter o nome)
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
    `PIX enviado R$ ${(Math.random() * 50).toFixed(2)} para *${userData.nome.substring(0, 3)}***`,
    `Débito automático R$ ${(Math.random() * 50).toFixed(2)} - *${userData.nome.substring(0, 4)}***`,
    `Transferência recebida R$ ${(Math.random() * 50).toFixed(2)} - CPF ${userData.cpf.slice(-4)}`,
  ];
}

window.fecharInvasao = fecharInvasao;

export function gerarPostDilema(id) {
  const dilemmaObj = getRandomDilemma();
  return {
    id: id,
    content: "💀 " + dilemmaObj.dilema + " 💀 Seus fundos estão comprometidos.",
    cluster: "etica",
    emotion: "controversy",
    emotionColor: "#e74c3c",
    emotionName: "Dilema Ético Financeiro",
    like: Math.floor(Math.random() * 5),
    dislike: Math.floor(Math.random() * 80),
    comment: 0,
    share: 0,
    report: 15,
    view: 200,
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
