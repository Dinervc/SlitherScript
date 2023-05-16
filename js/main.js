// Grundfunktionen v0.1.0-beta 16.05.2023

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const maxCells = 20;

let tileSize;
let gridSize = { x: maxCells, y: maxCells };

function updateCanvasSize() {
  let smallerDimension = Math.min(window.innerWidth, window.innerHeight);
  let cells = Math.floor(smallerDimension / 40);
  cells = Math.min(Math.max(cells, 10), maxCells); // Ensuring cells number is between 10 and maxCells
  gridSize = { x: cells, y: cells };
  tileSize = Math.floor(smallerDimension / cells);
  canvas.width = tileSize * gridSize.x;
  canvas.height = tileSize * gridSize.y;
  canvas.style.marginLeft = (window.innerWidth - canvas.width) / 2 + "px";
  canvas.style.marginTop = (window.innerHeight - canvas.height) / 2 + "px";
}

updateCanvasSize();

let snake = [{ x: gridSize.x / 2, y: gridSize.y / 2 }];
let apple = {
  x: Math.floor(Math.random() * gridSize.x),
  y: Math.floor(Math.random() * gridSize.y),
};
let velocity = { x: 0, y: 0 };

window.addEventListener("resize", updateCanvasSize);

function update() {
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= gridSize.x ||
    head.y >= gridSize.y
  ) {
    return;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return;
    }
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    apple = {
      x: Math.floor(Math.random() * gridSize.x),
      y: Math.floor(Math.random() * gridSize.y),
    };
  } else {
    snake.pop();
  }

  setTimeout(update, 100);
}

function drawGrid() {
  ctx.strokeStyle = "#cccccc";
  for (let i = 1; i < gridSize.x; i++) {
    ctx.beginPath();
    ctx.moveTo(i * tileSize, 0);
    ctx.lineTo(i * tileSize, canvas.height);
    ctx.stroke();
  }

  for (let i = 1; i < gridSize.y; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * tileSize);
    ctx.lineTo(canvas.width, i * tileSize);
    ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  ctx.fillStyle = "green";
  for (const part of snake) {
    ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);

  requestAnimationFrame(draw);
}

function handleKeyDown(event) {
  if (event.key === "ArrowUp" && velocity.y === 0) {
    velocity = { x: 0, y: -1 };
  } else if (event.key === "ArrowDown" && velocity.y === 0) {
    velocity = { x: 0, y: 1 };
  } else if (event.key === "ArrowLeft" && velocity.x === 0) {
    velocity = { x: -1, y: 0 };
  } else if (event.key === "ArrowRight" && velocity.x === 0) {
    velocity = { x: 1, y: 0 };
  }
}

window.addEventListener("keydown", handleKeyDown);

window.addEventListener(
  "keydown",
  function (e) {
    // keys array includes "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
    if (keys[e.keyCode]) {
      e.preventDefault();
      return false;
    }
  },
  false
);

update();
draw();
