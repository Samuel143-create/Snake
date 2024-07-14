document.addEventListener('DOMContentLoaded', () => {

    const gameArea = document.querySelector('.game-area');
    const gridSize = 30; // Tamaño de cada cuadro del juego en píxeles
    const gameWidth = 600; // Ancho total del área del juego en píxeles
    const gameHeight = 600; // Alto total del área del juego en píxeles

    let snake = [
        { x: 3, y: 2 },
        { x: 2, y: 2 },
        { x: 1, y: 2 }
    ]; // Posición inicial de la serpiente
    let direction = 'right'; // Dirección inicial
    let food = { x: 15, y: 15 }; // Posición inicial de la comida
    let gameInterval = null; // Variable para almacenar el intervalo del juego
    let isGameOver = false; // Bandera para verificar si el juego ha terminado
    let gamePaused = false; // Bandera para verificar si el juego está pausado
    let darkModeEnabled = false; // Bandera para verificar si el modo oscuro está activado

    function startGame() {
        clearInterval(gameInterval); // Limpiar intervalo anterior si existe
        snake = [
            { x: 3, y: 2 },
            { x: 2, y: 2 },
            { x: 1, y: 2 }
        ]; // Reiniciar posición inicial de la serpiente
        direction = 'right'; // Reiniciar dirección inicial
        food = { x: 15, y: 15 }; // Reiniciar posición inicial de la comida
        isGameOver = false; // Reiniciar bandera de juego terminado
        clearGameArea(); // Limpiar el área de juego antes de redibujar
        drawSnake(); // Dibujar la serpiente inicialmente
        drawFood(); // Dibujar la comida inicialmente
        gameInterval = setInterval(updateGameArea, 100); // Iniciar el juego
    }

    function updateGameArea() {
        if (isGameOver) {
            clearInterval(gameInterval);
            alert('Game Over!'); // Mostrar un mensaje de Game Over
            return;
        }
        if (!gamePaused) {
            moveSnake();
            if (checkCollision()) {
                isGameOver = true; // Establecer bandera de juego terminado
            }
            if (checkFoodCollision()) {
                growSnake();
                moveFood();
            }
            clearGameArea();
            drawFood();
            drawSnake();
        }
    }

    function moveSnake() {
        const head = { ...snake[0] };
        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        snake.unshift(head); // Añadir la nueva cabeza

        // Verificar si la serpiente ha comido la comida (no se elimina la cola)
        if (!checkFoodCollision()) {
            snake.pop(); // Eliminar la última cola solo si no ha comido comida
        }
    }

    function drawSnake() {
        snake.forEach(segment => {
            const snakeElement = document.createElement('div');
            snakeElement.style.gridRowStart = segment.y;
            snakeElement.style.gridColumnStart = segment.x;
            snakeElement.classList.add('snake');
            gameArea.appendChild(snakeElement);
        });
    }

    function drawFood() {
        const foodElement = document.createElement('div');
        foodElement.style.gridRowStart = food.y;
        foodElement.style.gridColumnStart = food.x;
        foodElement.classList.add('food');
        gameArea.appendChild(foodElement);
    }

    function moveFood() {
        food.x = Math.floor(Math.random() * (gameWidth / gridSize)) + 1;
        food.y = Math.floor(Math.random() * (gameHeight / gridSize)) + 1;
    }

    function growSnake() {
        const tail = { ...snake[snake.length - 1] };
        snake.push(tail);
    }

    function clearGameArea() {
        gameArea.innerHTML = ''; // Limpiar el área de juego antes de redibujar
    }

    function checkCollision() {
        // Comprobar si la serpiente choca con los bordes
        if (
            snake[0].x < 1 || snake[0].x > gameWidth / gridSize ||
            snake[0].y < 1 || snake[0].y > gameHeight / gridSize
        ) {
            return true;
        }
        // Comprobar si la serpiente choca consigo misma
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                return true;
            }
        }
        return false;
    }

    function checkFoodCollision() {
        return snake[0].x === food.x && snake[0].y === food.y;
    }

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    });

    // Botón para reiniciar el juego
    const restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', () => {
        startGame(); // Reiniciar el juego al hacer clic en el botón
    });

    // Botón para pausar/reanudar el juego
    const pauseResumeBtn = document.getElementById('pause-resume-btn');
    pauseResumeBtn.addEventListener('click', () => {
        gamePaused = !gamePaused; // Alternar entre pausar y reanudar el juego
        if (!gamePaused) {
            pauseResumeBtn.textContent = 'Pausar Juego';
            gameInterval = setInterval(updateGameArea, 100); // Reanudar el intervalo del juego
        } else {
            pauseResumeBtn.textContent = 'Continuar Juego';
            clearInterval(gameInterval); // Detener el intervalo del juego
        }
    });

    // Botón para modo oscuro
    const darkModeBtn = document.getElementById('dark-mode-btn');
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeEnabled = !darkModeEnabled; // Alternar estado del modo oscuro
    });

    // Iniciar el juego al cargar la página
    startGame();

});
