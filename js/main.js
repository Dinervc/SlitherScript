// Design improvements v0.1.3-beta 30.05.2023

// Get canvas from HTML document
const canvas = document.getElementById("gameCanvas");
// Create a 2D rendering context for the canvas
const ctx = canvas.getContext("2d");
// Define maximum number of cells
const maxCells = 20;
// Margin for the grid in pixels
const margin = 60;
// Frame counter variable for matrix color
let frameCounter = 0;

// Declare variable for the score
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
// Get the initial speed from the difficulty selector
let speed = document.getElementById("difficulty").value;

// Display the score and high score
function displayScore() {
  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("highScore").innerText = "High Score: " + highScore;
}

// Call displayScore once on initialization to display initial scores
displayScore();

// Declare variable for tile size and initial grid size
let tileSize;
let gridSize = { x: maxCells, y: maxCells };

// Function to update canvas size dynamically based on window size
function updateCanvasSize() {
  // Calculate the available width and height after subtracting margins
  let width = window.innerWidth - 2 * margin;
  let height = window.innerHeight - 2 * margin;

  // Calculate the number of cells that can fit in the width and height
  let cellsX = Math.floor(width / margin);
  let cellsY = Math.floor(height / margin);

  // Pick the smaller number of cells to maintain a square grid
  let cells = Math.min(cellsX, cellsY);

  // Update grid size and tile size
  gridSize = { x: cellsX < 1 ? 1 : cellsX, y: cellsY < 1 ? 1 : cellsY };
  tileSize = Math.min(Math.floor(width / cellsX), Math.floor(height / cellsY));
  canvas.width = tileSize * gridSize.x;
  canvas.height = tileSize * gridSize.y;

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
    // Increase the score
    score++;
    // Check if new score is a new high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
    // Update displayed score
    displayScore();

    // Update the speed of the snake based on the selected difficulty
    speed = document.getElementById("difficulty").value;

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
  setTimeout(update, speed);
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

// Draws snake with design
function drawRotatedRect(x, y, width, height, color) {
  ctx.save(); // Save the current context state
  ctx.translate(x + width / 2, y + height / 2);

  // Rotate the context by a 0, 90, 180, or 270 degrees
  const randomAngle = (Math.floor(Math.random() * 4) * Math.PI) / 2; // Random angle in radians
  ctx.rotate(randomAngle);

  // Draw this body segment
  ctx.fillStyle = color;
  ctx.fillRect(-width / 2, -height / 2, width, height);

  ctx.restore(); // Restore the context state to what it was before we translated/rotated it
}

// Function to draw the game state
function draw() {
  let matrixColors = [
    "#5f9c23",
    "#8af421",
    "#6f8756",
    "#cef7a5",
    "#677459",
    "#000000",
  ];

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the grid
  drawGrid();

  // Draw the snake
  for (let i = 0; i < snake.length; i++) {
    const part = snake[i];
    if (snakeDesign === "goat") {
      drawRotatedImage(
        goatImg,
        part.x * tileSize,
        part.y * tileSize,
        tileSize,
        tileSize
      );
    } else if (snakeDesign === "matrix") {
      // Select a random color from matrixColors
      ctx.fillStyle =
        matrixColors[Math.floor(Math.random() * matrixColors.length)];
      ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
    } else {
      ctx.fillStyle = snakeDesign;
      ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
    }
  }

  // Draw the apple
  ctx.fillStyle = "red";
  ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);

  // Schedule next draw
  requestAnimationFrame(draw);
}

// Design variables
let snakeDesign = "green";
let gameColor = "#000";
// Define a new Image object and set its source to the goat texture
const goatImg = new Image();
goatImg.src = "resources/goatTexture.png";

// Update snake design
function updateDesign() {
  let designSelect = document.getElementById("snakeDesign");
  snakeDesign = designSelect.options[designSelect.selectedIndex].value;

  /*

  Add this code if more textures in the future

  if (snakeDesign === "goat") {
    // Replace with your image URL
    goatImg.src = "placeholder_for_your_image_url";
  }
  */
}

// Update game design
function updateColor() {
  let selectedValue = document.getElementById("gameColor").value;
  if (selectedValue == "goat") {
    // Replace with your image URL
    let goatImageUrl = "resources/goatTexture.png";
    document.getElementById("gameCanvas").style.backgroundImage =
      "url(" + goatImageUrl + ")";
    document.getElementById("gameCanvas").style.backgroundSize = "cover";
  } else {
    document.getElementById("gameCanvas").style.backgroundColor = selectedValue;
    document.getElementById("gameCanvas").style.backgroundImage = "none";
  }
}

function drawRotatedImage(image, x, y, width, height) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);

  const randomAngle = (Math.floor(Math.random() * 4) * Math.PI) / 2;
  ctx.rotate(randomAngle);

  // Draw this body segment
  ctx.drawImage(image, -width / 2, -height / 2, width, height);

  ctx.restore();
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

// Starts the game
update();
draw();
