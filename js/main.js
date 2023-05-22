// Grundfunktionen v0.1.0-beta 16.05.2023

// Get canvas from HTML document
const canvas = document.getElementById("gameCanvas");
// Create a 2D rendering context for the canvas
const ctx = canvas.getContext("2d");
// Define maximum number of cells
const maxCells = 20;

// Declare variable for tile size and initial grid size
let tileSize;
let gridSize = { x: maxCells, y: maxCells };

// Function to update canvas size dynamically based on window size
function updateCanvasSize() {
  let margin = 40; // Margin for the grid in pixels

  // Calculate the available width and height after subtracting margins
  let width = window.innerWidth - 2 * margin;
  let height = window.innerHeight - 2 * margin;

  // Calculate the number of cells that can fit in the width and height
  let cellsX = Math.floor(width / 40);
  let cellsY = Math.floor(height / 40);

  // Pick the smaller number of cells to maintain a square grid
  let cells = Math.min(cellsX, cellsY);

  // Update grid size and tile size
  gridSize = { x: cellsX, y: cellsY };
  tileSize = Math.min(Math.floor(width / cellsX), Math.floor(height / cellsY));
  canvas.width = tileSize * gridSize.x;
  canvas.height = tileSize * gridSize.y;

  // Center canvas on the page
  canvas.style.marginLeft = (window.innerWidth - canvas.width) / 2 + "px";
  canvas.style.marginTop = (window.innerHeight - canvas.height) / 2 + "px";

  // Update snake and apple position based on the new grid size
  snake = [{ x: Math.floor(gridSize.x / 2), y: Math.floor(gridSize.y / 2) }];
  if (apple.x >= gridSize.x || apple.y >= gridSize.y) {
    apple = {
      x: Math.floor(Math.random() * gridSize.x),
      y: Math.floor(Math.random() * gridSize.y),
    };
  }
}

// Initialize snake in the middle of the grid
let snake = [{ x: gridSize.x / 2, y: gridSize.y / 2 }];

// Place apple at random position in the grid
let apple = {
  x: Math.floor(Math.random() * gridSize.x),
  y: Math.floor(Math.random() * gridSize.y),
};

// Update canvas size upon initialization
updateCanvasSize();

// Initialize velocity
let velocity = { x: 0, y: 0 };

// Update canvas size when window is resized
window.addEventListener("resize", updateCanvasSize);

// Function to update game state at each step
function update() {
  // Calculate new head position based on current velocity
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  // Game ends if the snake hits the grid boundary
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= gridSize.x ||
    head.y >= gridSize.y
  ) {
    return;
  }

  // Game ends if the snake hits itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return;
    }
  }

  // Add new head to the snake
  snake.unshift(head);

  // If the snake has eaten the apple
  if (head.x === apple.x && head.y === apple.y) {
    // Place a new apple at a random position
    apple = {
      x: Math.floor(Math.random() * gridSize.x),
      y: Math.floor(Math.random() * gridSize.y),
    };
  } else {
    // Remove the tail of the snake if it has not eaten an apple
    snake.pop();
  }

  // Schedule next update
  setTimeout(update, 100);
}

// Function to draw the grid lines
function drawGrid() {
  // Set the color for the grid lines
  ctx.strokeStyle = "#cccccc";

  // Draw vertical lines
  for (let i = 1; i < gridSize.x; i++) {
    ctx.beginPath();
    ctx.moveTo(i * tileSize, 0);
    ctx.lineTo(i * tileSize, canvas.height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let i = 1; i < gridSize.y; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * tileSize);
    ctx.lineTo(canvas.width, i * tileSize);
    ctx.stroke();
  }
}

// Function to draw the game state
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the grid
  drawGrid();

  // Draw the snake
  ctx.fillStyle = "green";
  for (const part of snake) {
    ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
  }

  // Draw the apple
  ctx.fillStyle = "red";
  ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);

  // Schedule next draw
  requestAnimationFrame(draw);
}

// Function to handle key down events
function handleKeyDown(event) {
  // Change velocity based on the pressed arrow key
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

// Listen for key down events
window.addEventListener("keydown", handleKeyDown);

// Prevent scrolling when arrow keys are pressed
window.addEventListener(
  "keydown",
  function (e) {
    // Arrow keys' key codes
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
    if (keys[e.keyCode]) {
      e.preventDefault();
      return false;
    }
  },
  false
);

// Start the game
update();
draw();
