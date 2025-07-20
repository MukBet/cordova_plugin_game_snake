var exec = require('cordova/exec');

exports.coolMethod = function (arg0, success, error) {
    exec(success, error, 'SnakePlugin', 'coolMethod', [arg0]);
};

exports.vibrate = function (duration, success, error) {
    exec(success, error, 'SnakePlugin', 'vibrate', [duration]);
};

document.addEventListener('deviceready', function () {
    console.log('Device is ready');
    console.log('SnakePlugin доступен:', cordova.plugins?.SnakePlugin);
});

window.startSnakeGame = function () {
    console.log('>> startSnakeGame');

    const body = document.body;
    body.innerHTML = `
        <style>
            button:active {
            transform: scale(0.95);
            opacity: 1;
            }
        </style>
        <div id="startScreen" style="text-align:center; margin-top: 50px;">
            <h1>Snake Game</h1>
            <button id="startButton">Начать игру</button>
        </div>
        <canvas id="snakeCanvas" style="display: none;"></canvas>
        <div id="controls" style="display: none; position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 999;">
            <div style="display: flex; justify-content: center;">
                <button id="up" style="width: 80px; height: 80px; font-size: 32px; margin: 5px; opacity: 0.6;">⬆️</button>
            </div>
            <div style="display: flex; justify-content: center;">
                <button id="left" style="width: 80px; height: 80px; font-size: 32px; margin: 5px; opacity: 0.6;">⬅️</button>
                <button id="down" style="width: 80px; height: 80px; font-size: 32px; margin: 5px; opacity: 0.6;">⬇️</button>
                <button id="right" style="width: 80px; height: 80px; font-size: 32px; margin: 5px; opacity: 0.6;">➡️</button>
            </div>
        </div>
    `;

    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const startScreen = document.getElementById('startScreen');
    const startButton = document.getElementById('startButton');

    const box = 20;
    let snake = [];
    let direction = 'RIGHT';
    let food = {};
    let gameInterval = null;

    document.getElementById('up').addEventListener('click', () => simulateKey("ArrowUp"));
    document.getElementById('down').addEventListener('click', () => simulateKey("ArrowDown"));
    document.getElementById('left').addEventListener('click', () => simulateKey("ArrowLeft"));
    document.getElementById('right').addEventListener('click', () => simulateKey("ArrowRight"));

    function simulateKey(key) {
        const event = new KeyboardEvent("keydown", { key });
        document.dispatchEvent(event);
    }

    startButton.addEventListener('click', startGame);
    document.addEventListener('keydown', handleKeyPress);

    function handleKeyPress(e) {
        if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
        if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
        if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
        if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    }

    function startGame() {
        console.log('>> Game started');
        startScreen.style.display = 'none';
        document.getElementById('controls').style.display = 'block';
        canvas.style.display = 'block';

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        snake = [{ x: 9 * box, y: 10 * box }];
        direction = 'RIGHT';
        generateFood();

        gameInterval = setInterval(draw, 200);
        cordova.plugins.SnakePlugin.coolMethod(
            "turn-oof",                         // аргумент
            function(res) { /* alert(res); чисто скрыл отладочную инфу, если что - раскомментируй Алерт этот*/ },   // success callback
            function(err) { alert("Ошибка: " + err); } // error callback
        );
    }

    function stopGame() {
        clearInterval(gameInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
        startScreen.style.display = 'block';
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    }

    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i === 0 ? 'green' : 'lime';
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, box, box);

        let headX = snake[0].x;
        let headY = snake[0].y;

        if (direction === 'LEFT') headX -= box;
        if (direction === 'UP') headY -= box;
        if (direction === 'RIGHT') headX += box;
        if (direction === 'DOWN') headY += box;

        // Проверка столкновений
        if (
            headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height ||
            snake.some(segment => segment.x === headX && segment.y === headY)
        ) {
            //console.log('cordova.plugins:', cordova.plugins);

            clearInterval(gameInterval);

            if (window.cordova && cordova.plugins && cordova.plugins.SnakePlugin && cordova.plugins.SnakePlugin.vibrate) {
                cordova.plugins.SnakePlugin.vibrate(500, () => console.log('Вибрация прошла'), console.error);
            } else {
                console.warn('Вибрация недоступна или плагин не загружен');
            }

            const restart = confirm('Game Over. Начать новую игру?');
            if (restart) {
                cordova.plugins.SnakePlugin.coolMethod(
                    "turn-oon",                         // аргумент
                    function(res) { /* alert(res); чисто скрыл отладочную инфу, если что - раскомментируй Алерт этот*/ },   // success callback
                    function(err) { alert("Ошибка: " + err); } // error callback
                );
                startGame();
            } else {
                stopGame();
            }
            return;
        }

        // Проверка еды
        if (headX === food.x && headY === food.y) {
            generateFood();
            cordova.plugins.SnakePlugin.coolMethod(
                "turn-oon-flash",                         // аргумент
                function(res) { /* alert(res); чисто скрыл отладочную инфу, если что - раскомментируй Алерт этот*/ },   // success callback
                function(err) { alert("Ошибка: " + err); } // error callback
            );
        } else {
            snake.pop();
        }

        let newHead = { x: headX, y: headY };
        snake.unshift(newHead);
    }
};
