document.addEventListener("DOMContentLoaded", function () {
  const setGameTimeout = document.querySelector("#setGameTimeout");
  const timeLeftDisplay = document.querySelector("#timeLeft");
  const clickTarget = document.querySelector("#clickTarget");
  const themeButton = document.querySelector("#changeTheme");
  const mensajeDisplay = document.querySelector("#mensaje");
  const timeoutInput = document.querySelector("#timeout");
  const startGame = document.querySelector("#startGame");
  const scoreDisplay = document.querySelector("#score");
  const highScoreDisplay = document.querySelector("#highScore");
  const gameArea = document.querySelector("#gameArea");

  let refreshIntervalId = null;
  let timeLeft = 30;
  let score = 0;
  let highScore = localStorage.getItem("highScore") || 0;
  highScoreDisplay.textContent = highScore;

  // 🎵 función para generar sonidos simples
  function playSound(frequency, duration = 150, type = "sine") {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime); // volumen
    oscillator.stop(ctx.currentTime + duration / 1000);
  }

  // Cambiar tema
  themeButton.addEventListener("click", function () {
    const body = document.querySelector("body");
    if (body.style.backgroundColor === "white") {
      body.style.color = "white";
      body.style.backgroundColor = "#121212";
    } else {
      body.style.color = "black";
      body.style.backgroundColor = "white";
    }
  });

  // Ajustar tiempo
  setGameTimeout.addEventListener("click", function () {
    let timeout = timeoutInput.value;
    if (timeout) {
      timeLeft = parseInt(timeout);
      timeLeftDisplay.textContent = timeout;
    }
  });

  // Iniciar juego
  startGame.addEventListener("click", function () {
    mensajeDisplay.textContent = "";
    setGameTimeout.disabled = true;
    timeoutInput.disabled = true;
    startGame.disabled = true;
    score = 0;
    scoreDisplay.textContent = score;
    clickTarget.style.width = "50px";
    clickTarget.style.height = "50px";
    moveTarget();

    refreshIntervalId = setInterval(() => {
      updateTimer(
        (count) => {
          timeLeft = count;
          timeLeftDisplay.textContent = timeLeft;
        },
        () => {
          refreshIntervalId = null;
          gameOver();
        }
      );
    }, 1000);
  });

  // Clic en el objetivo
  clickTarget.addEventListener("click", function () {
    if (refreshIntervalId != null) {
      score++;
      scoreDisplay.textContent = score;

      // 🔊 Sonido de clic
      playSound(600, 100, "square");

      // Reducir tamaño progresivamente
      let newSize = Math.max(20, 50 - score);
      clickTarget.style.width = `${newSize}px`;
      clickTarget.style.height = `${newSize}px`;

      moveTarget();
    }
  });

  // Funciones
  function updateTimer(cadaSegundoCallback, seAcaboElTiempo) {
    if (timeLeft > 0) {
      cadaSegundoCallback(--timeLeft);
    } else {
      if (refreshIntervalId != null) {
        clearInterval(refreshIntervalId);
        cadaSegundoCallback(0);
        seAcaboElTiempo();
      }
    }
  }

  function gameOver() {
    timeoutInput.disabled = false;
    setGameTimeout.disabled = false;
    startGame.disabled = false;

    // Guardar récord
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreDisplay.textContent = highScore;
    }

    mensajeDisplay.textContent = `⏳ Tiempo agotado! Tu puntuación final es: ${score}`;
    // 🔊 Sonido de fin de juego (cuando se acaba el tiempo, es grave el sonido)
    playSound(200, 400, "triangle");

    alert(`Juego terminado 🎮\nTu puntuación: ${score}\nRécord: ${highScore}`);
  }

  function moveTarget() {
    const maxX = gameArea.clientWidth - clickTarget.clientWidth;
    const maxY = gameArea.clientHeight - clickTarget.clientHeight;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    clickTarget.style.left = `${randomX}px`;
    clickTarget.style.top = `${randomY}px`;
  }
});
