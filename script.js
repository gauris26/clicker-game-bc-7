document.addEventListener("DOMContentLoaded", function () {
    const gameArea = document.querySelector("#gameArea");
    const clickTarget = document.querySelector("#clickTarget");
    const scoreDisplay = document.querySelector("#score");
    const timeLeftDisplay = document.querySelector("#timeLeft");
    const mensajeDisplay = document.querySelector("#mensaje");
    const timeoutInput = document.querySelector("#timeout");
    const setGameTimeout = document.querySelector("#setGameTimeout");
    const startGame = document.querySelector("#startGame");

    //interval
    //timeout

    let refreshIntervalId = null;
    let score = 0;
    let timeLeft = 30;

    function setGameValueTimeout() {
        let timeout = timeoutInput.value;
        if (timeout) {
            timeLeft = parseInt(timeout);
            timeLeftDisplay.textContent = timeout;
        }
    }
    setGameTimeout.addEventListener("click", setGameValueTimeout);

    startGame.addEventListener("click", function () {
        timeoutInput.disabled = true;
        setGameTimeout.disabled = true;
        startGame.disabled = true;
        mensajeDisplay.textContent = "";

        // Temporizador principal
        refreshIntervalId = setInterval(() => {
            updateTimer(
                (count) => {
                    timeLeft = count;
                    timeLeftDisplay.textContent = timeLeft;
                },
                () => {
                    refreshIntervalId = null;
                    clearInterval(autoMoveIntervalId); // detener movimiento automático
                    setGameValueTimeout();
                }
            );
        }, 1000);

        // Movimiento automático del círculo
        autoMoveIntervalId = setInterval(() => {
            moveTarget();
        }, 1000); // cada 1 segundos
    });

    clickTarget.addEventListener("click", function () {
        if (refreshIntervalId != null) {
            score++;
            scoreDisplay.textContent = score;
            moveTarget();

            // Cambio de color aleatorio
            const randomColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            clickTarget.style.backgroundColor = randomColor;
        }
    });

    function updateTimer(cadaSegundoCallback, seAcaboElTiempo) {
        if (timeLeft > 0) {
            cadaSegundoCallback(--timeLeft);
        } else {
            //Temporizador llego a cero
            if (refreshIntervalId != null) {
                clearInterval(refreshIntervalId);
                cadaSegundoCallback(0);
                seAcaboElTiempo();
            }
            timeoutInput.disabled = false;
            setGameTimeout.disabled = false;
            startGame.disabled = false;
            let mensaje = `Tiempo agotado! Tu puntuación final es: ${score}`;
            mensajeDisplay.textContent = mensaje;
            alert(mensaje);
        }
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