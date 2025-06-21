var exec = require('cordova/exec');

exports.coolMethod = function (arg0, success, error) {
    exec(success, error, 'TennisPlugin', 'coolMethod', [arg0]);
};

window.startSnakeGame = function () {
    console.log('!!!window.startSnakeGame');
    const body = document.body;
    body.innerHTML = '<canvas id="snakeCanvas"></canvas>';

    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let box = 20;
    let snake = [{ x: 9 * box, y: 10 * box }];
    let direction = 'RIGHT';
    let food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
        if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
        if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
        if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    });

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

        if (headX === food.x && headY === food.y) {
            food = {
                x: Math.floor(Math.random() * (canvas.width / box)) * box,
                y: Math.floor(Math.random() * (canvas.height / box)) * box
            };
        } else {
            snake.pop();
        }

        let newHead = { x: headX, y: headY };

        if (
            headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height ||
            snake.some(segment => segment.x === headX && segment.y === headY)
        ) {
            alert('Game Over');
            location.reload();
        }

        snake.unshift(newHead);
    }

    setInterval(draw, 100);
};
