// sounds.js - Gerador de efeitos sonoros usando Web Audio API
let audioContext = null;
let alarmInterval = null;

// Inicializa o contexto de áudio (só após interação do usuário)
function initAudio() {
  if (!audioContext && (window.AudioContext || window.webkitAudioContext)) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // Desbloqueia o áudio no primeiro clique do usuário
    document.body.addEventListener(
      "click",
      () => {
        if (audioContext && audioContext.state === "suspended") {
          audioContext.resume();
        }
      },
      { once: true },
    );
  }
}

// Toca um beep curto (frequência, duração, tipo)
function beep(frequency = 880, duration = 0.2, type = "sine") {
  if (!audioContext) initAudio();
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.00001, now + duration);
  oscillator.start();
  oscillator.stop(now + duration);
}

// Alarme de emergência (toque repetitivo)
function startAlarm() {
  if (alarmInterval) stopAlarm();
  alarmInterval = setInterval(() => {
    beep(950, 0.15, "triangle");
    setTimeout(() => beep(750, 0.15, "triangle"), 100);
  }, 400);
}

function stopAlarm() {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
}

// Som de sucesso (transferência autorizada)
function successSound() {
  beep(1200, 0.1, "sine");
  setTimeout(() => beep(1500, 0.15, "sine"), 50);
}

// Som de falha
function failSound() {
  beep(440, 0.3, "sawtooth");
}

// Som de interação (ao falar)
function talkSound() {
  beep(660, 0.08, "sine");
}

export {
  initAudio,
  beep,
  startAlarm,
  stopAlarm,
  successSound,
  failSound,
  talkSound,
};
