// === ИНИЦИАЛИЗАЦИЯ ИГРЫ ===
function initGame() {
    initPlayer();
    setupUIListeners();
}

// === ИГРОВОЙ ЦИКЛ ===
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        lastTime = performance.now();
        gameLoop();
    }
}


function stopGame() {
    gameRunning = false;
}

function gameLoop(currentTime) {
    if (!gameRunning) return;
    
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Анимация
    if (player.isMoving) {
        animationTimer += deltaTime;
        if (animationTimer > config.animationSpeed) {
            animationTimer = 0;
            currentFrame = (currentFrame + 1) % 4;
        }
    }

    updateGame();
    renderGame();
    requestAnimationFrame(gameLoop);
}

function updateGame() {
    updateMovement();
}

function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем пол
    ctx.fillStyle = '#95a5a6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем стены
    if (currentBuilding && buildingInfo[currentBuilding].walls) {
        ctx.fillStyle = '#7f8c8d';
        buildingInfo[currentBuilding].walls.forEach(wall => {
            ctx.fillRect(wall[0], wall[1], wall[2], wall[3]);
        });
    }

    // Рисуем информационные точки
    if (currentBuilding) {
        const points = buildingInfo[currentBuilding].infoPoints.filter(point => point.floor === currentFloor);
        points.forEach(point => {
            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', point.x, point.y);
        });
    }

    // Рисуем игрока
    drawPlayer();

    // Интерфейс
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Этаж ${currentFloor} - ${currentBuilding || 'Выберите корпус'}`, 20, 20);
}

// Запускаем игру при загрузке
window.addEventListener('load', initGame);
