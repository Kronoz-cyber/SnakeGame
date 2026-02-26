// 游戏变量
let canvas = document.getElementById('game-canvas');
let ctx = canvas.getContext('2d');
let snake = [];
let food = {};
let direction = 'right';
let score = 0;
let gameInterval;
let isGameOver = false;
let snakeColor = '#4CAF50';
const gridSize = 20;
const canvasSize = 400;

// 初始化游戏
function initGame() {
    // 重置游戏状态
    snake = [];
    score = 0;
    direction = 'right';
    isGameOver = false;
    document.getElementById('score').textContent = score;
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'none';
    
    // 创建初始蛇
    for (let i = 3; i >= 0; i--) {
        snake.push({ x: i, y: 0 });
    }
    
    // 生成食物
    generateFood();
    
    // 开始游戏循环
    gameInterval = setInterval(gameLoop, 100);
}

// 生成食物
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)),
        y: Math.floor(Math.random() * (canvasSize / gridSize))
    };
    
    // 确保食物不会出现在蛇身上
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

// 游戏循环
function gameLoop() {
    if (isGameOver) return;
    
    // 移动蛇
    moveSnake();
    
    // 检测碰撞
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    // 检测是否吃到食物
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        document.getElementById('score').textContent = score;
        generateFood();
    } else {
        // 如果没吃到食物，移除尾部
        snake.pop();
    }
    
    // 绘制游戏
    drawGame();
}

// 移动蛇
function moveSnake() {
    // 创建新头部
    let head = { x: snake[0].x, y: snake[0].y };
    
    // 根据方向移动头部
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    // 将新头部添加到蛇的前面
    snake.unshift(head);
}

// 检测碰撞
function checkCollision() {
    let head = snake[0];
    
    // 检测边界碰撞
    if (head.x < 0 || head.x >= canvasSize / gridSize || head.y < 0 || head.y >= canvasSize / gridSize) {
        return true;
    }
    
    // 检测自身碰撞
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// 游戏结束
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    document.getElementById('restart-btn').style.display = 'inline-block';
    
    // 在画布上显示游戏结束信息
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束', canvasSize / 2, canvasSize / 2 - 20);
    ctx.fillText(`最终分数: ${score}`, canvasSize / 2, canvasSize / 2 + 20);
}

// 绘制游戏
function drawGame() {
    // 清空画布
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    
    // 绘制蛇
    ctx.fillStyle = snakeColor;
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    // 绘制食物
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// 键盘控制
document.addEventListener('keydown', function(e) {
    if (isGameOver) return;
    
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

// 按钮点击事件
document.getElementById('start-btn').addEventListener('click', initGame);
document.getElementById('restart-btn').addEventListener('click', initGame);

// 颜色选择事件
document.getElementById('snake-color').addEventListener('change', function(e) {
    snakeColor = e.target.value;
});

// 初始绘制
drawGame();