// PowerUps v0.1.5-beta 06.06.2023

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
// Controls (important for mirror powerup)
let mirror = 1;

// Declare variable for the score
let score = 0;
let scoreAddition = 1;
let highScore = localStorage.getItem("highScore") || 0;
// Get the initial speed from the difficulty selector
speed = document.getElementById("difficulty").value;
let nextSpeed = speed;

let isPowUpWaitingToSpawn = false;
let isObstacleUpWaitingToSpawn = false;

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

  // Update grid size and tile size
  gridSize = { x: cellsX < 1 ? 1 : cellsX, y: cellsY < 1 ? 1 : cellsY };
  tileSize = Math.min(Math.floor(width / cellsX), Math.floor(height / cellsY));
  canvas.width = tileSize * gridSize.x;
  canvas.height = tileSize * gridSize.y;

  // Update snake and apple position based on the new grid size
  snake = [{ x: Math.floor(gridSize.x / 2), y: Math.floor(gridSize.y / 2) }];
  if (apple.x >= gridSize.x || apple.y >= gridSize.y) {
    do {
      apple = {
        x: Math.floor(Math.random() * gridSize.x),
        y: Math.floor(Math.random() * gridSize.y),
      };
    } while (apple.x == powerup.x && apple.y == powerup.y);
  }
  if (
    powerup.x >= gridSize.x ||
    (powerup.y >= gridSize.y && !isPowUpWaitingToSpawn)
  ) {
    isPowUpWaitingToSpawn = true;
    // Spawns powerup after 10-20 seconds
    setTimeout(
      spawnPowAfterTime,
      Math.floor(Math.random() * (20 - 10 + 1) + 10)
    );
    powerupCurrentImage.src = powerupsData[powerup.type].style;
  }
  if (
    obstacle.x >= gridSize.x ||
    (obstacle.y >= gridSize.y && !isObstacleUpWaitingToSpawn)
  ) {
    isObstacleUpWaitingToSpawn = true;
    // Spawns obstacle after 10-20 seconds
    setTimeout(
      spawnObstacleAfterTime,
      Math.floor(Math.random() * (20 - 10 + 1) + 10)
    );
    obstacleCurrentImage.src = obstaclesData[obstacle.type].style;
  }
}

// Initialize snake in the middle of the grid
let snake = [{ x: gridSize.x / 2, y: gridSize.y / 2 }];

// Place apple at random position in the grid
let apple = {
  x: Math.floor(Math.random() * gridSize.x),
  y: Math.floor(Math.random() * gridSize.y),
};

let appleImg = new Image();
appleImg.src = "resources/apple.webp";

// Place powerup at random position in the grid
let powerup;

// Power Ups variable
const powerupsData = [
  {
    id: 0,
    value: 500,
    style: "resources/clock.webp",
    desc: "Slow Motion Power Up",
  },
  {
    id: 1,
    value: -1,
    style: "resources/mirror.webp",
    desc: "Mirrored Controls Power Up",
  },
  {
    id: 2,
    value: 50,
    style: "resources/flash.webp",
    desc: "The Flash Power Up",
  },
  {
    id: 3,
    value: 2,
    style: "resources/2x.webp",
    desc: "2x Score Power Up",
  },
  {
    id: 4,
    value: true,
    style: "resources/death.webp",
    desc: "Death Power Down",
  },
];

const powerupCurrentImage = new Image();

function powerUpPlacementBeginning() {
  do {
    let x = powerupsData[Math.floor(Math.random() * powerupsData.length)].id;
    powerup = {
      x: Math.floor(Math.random() * gridSize.x),
      y: Math.floor(Math.random() * gridSize.y),
      type: x,
      active: false,
    };
  } while (powerup.x === apple.x && powerup.y === apple.y);
  powerupCurrentImage.src = powerupsData[powerup.type].style;
}

powerUpPlacementBeginning();

// Place powerup at random position in the grid
let obstacle;

// Power Ups variable
const obstaclesData = [
  {
    name: "bleedScoreByOne",
    value: 1,
    style: "resources/bleed.webp",
    desc: "Bleed Obstacle",
  },
  {
    name: "addSnakeLength",
    value: -1,
    style: "resources/plusOne.webp",
    desc: "Mirrored Controls Obstacle",
  },
  {
    name: "blackHoleEatsPlayer",
    value: true,
    style: "resources/blackHole.webp",
    desc: "The Flash Obstacle",
  },
];

const obstacleCurrentImage = new Image();

function obstaclePlacementBeginning() {
  do {
    obstacle = {
      x: Math.floor(Math.random() * gridSize.x),
      y: Math.floor(Math.random() * gridSize.y),
      type: obstaclesData[Math.floor(Math.random() * obstaclesData.length)]
        .name,
      active: false,
    };
  } while (obstacle.x === apple.x && obstacle.y === apple.y);
  obstacleCurrentImage.src = obstaclesData[obstacle.type].style;
}

function spawnObstacleAfterTime() {
  isObstacleUpWaitingToSpawn = false;
  do {
    obstacle = {
      x: Math.floor(Math.random() * gridSize.x),
      y: Math.floor(Math.random() * gridSize.y),
      type: obstaclesData[Math.floor(Math.random() * obstaclesData.length)]
        .name,
      active: false,
    };
  } while (obstacle.x === apple.x && obstacle.y === apple.y);
  obstacleCurrentImage.src = obstaclesData[obstacle.type].style;
  if (!isObstacleUpWaitingToSpawn) {
    isObstacleUpWaitingToSpawn = true;
    setTimeout(!obstacle.active ? spawnObstacleAfterTime : null, 10000);
  }
}

obstaclePlacementBeginning();

// Update canvas size upon initialization
updateCanvasSize();

// Initialize velocity
let velocity = { x: 0, y: 0 };

// Update canvas size when window is resized
window.addEventListener("resize", updateCanvasSize);

let lastTime = 0;
let accumTime = 0;
let prevSnake = []; // An array to keep track of the previous snake state

// Function to update game state at each step
function update(currentTime) {
  if (!paused && !isDead) {
    // If we have a resumeTime (i.e., we've just resumed), use it to offset lastTime
    let effectiveLastTime = resumeTime ? resumeTime : lastTime;
    // Reset resumeTime now that we've used it
    resumeTime = 0;

    let deltaTime = currentTime - effectiveLastTime;
    lastTime = currentTime;
    accumTime += deltaTime;

    if (accumTime >= speed) {
      // Keep a copy of the old snake state
      prevSnake = snake.map((part) => ({ x: part.x, y: part.y }));

      const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= gridSize.x ||
        head.y >= gridSize.y
      ) {
        isDead = true;
        playSound("resources/gameoverSound.mp3", false);
        return;
      }

      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          isDead = true;
          playSound("resources/gameoverSound.mp3", false);
          return;
        }
      }

      snake.unshift(head);

      // See if touching power up
      if (head.x === powerup.x && head.y === powerup.y) {
        playSound("resources/powerupSound.mp3", false);
        mirror = 1;
        scoreAddition = 1;
        nextSpeed = document.getElementById("difficulty").value;

        switch (powerupsData[powerup.type].id) {
          case 0:
            nextSpeed = powerupsData[powerup.type].value;
            break;
          case 1:
            mirror = -1;
            break;
          case 2:
            nextSpeed = powerupsData[powerup.type].value;
            break;
          case 3:
            scoreAddition = 2;
            break;
          case 4:
            isDead = powerupsData[powerup.type].value;
            playSound("resources/gameoverSound.mp3", false);
            break;
          default:
            break;
        }

        powerup = {
          x: -1,
          y: -1,
          type: null,
          active: true,
        };
        // Spawns powerup after 10-20 seconds
        if (!isPowUpWaitingToSpawn) {
          isPowUpWaitingToSpawn = true;
          setTimeout(
            spawnPowAfterTime,
            Math.floor(Math.random() * (30000 - 20000 + 1) + 20000)
          );
        }
      }

      // See if touching apple
      if (head.x === apple.x && head.y === apple.y) {
        playSound("resources/eatSound.mp3", false);
        nextSpeed = document.getElementById("difficulty").value;
        mirror = 1;
        score += scoreAddition;
        if (score > highScore) {
          highScore = score;
          localStorage.setItem("highScore", highScore);
        }
        displayScore();

        do {
          apple = {
            x: Math.floor(Math.random() * gridSize.x),
            y: Math.floor(Math.random() * gridSize.y),
          };
        } while (apple.x == powerup.x && apple.y == powerup.y);
      } else {
        snake.pop();
      }

      accumTime -= speed;
      speed = nextSpeed;

      canChangeDirection = true;
    }
  }

  requestAnimationFrame(update);
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
  if (!paused && !isDead) {
    let matrixColors = [
      "#5f9c23",
      "#8af421",
      "#6f8756",
      "#cef7a5",
      "#677459",
      "#000000",
    ];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();

    let lerpFactor = accumTime / speed;

    for (let i = 0; i < snake.length; i++) {
      const part = snake[i];
      let prevPart = prevSnake[i] || part;
      let lerpX = lerp(prevPart.x, part.x, lerpFactor);
      let lerpY = lerp(prevPart.y, part.y, lerpFactor);

      if (snakeDesign === "goat") {
        drawRotatedImage(
          goatImg,
          lerpX * tileSize,
          lerpY * tileSize,
          tileSize,
          tileSize
        );
      } else if (snakeDesign === "matrix") {
        ctx.fillStyle =
          matrixColors[Math.floor(Math.random() * matrixColors.length)];
        ctx.fillRect(lerpX * tileSize, lerpY * tileSize, tileSize, tileSize);
      } else {
        ctx.fillStyle = snakeDesign;
        ctx.fillRect(lerpX * tileSize, lerpY * tileSize, tileSize, tileSize);
      }
    }

    // Apple draw
    drawImageRect(appleImg, apple.x, apple.y);

    // Power Up Draw
    drawImageRect(powerupCurrentImage, powerup.x, powerup.y);
  }

  requestAnimationFrame(draw);
}

function drawImageRect(img, x, y) {
  ctx.save();
  ctx.translate(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
  // Draw this body segment
  ctx.drawImage(img, -tileSize / 2, -tileSize / 2, tileSize, tileSize);

  ctx.restore();
}

/* Lerp steht für lineare Interpolation 
und ist in Unity für die Suche nach einem 
gewünschten Wert zwischen zwei Werten bekannt. 

In meinem Programm wäre das der Wert zwischen der neuen und vorherigen Zelle*/
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Design variables
let snakeDesign = "green";
let gameColor = "#000";
// Define a new Image object and set its source to the goat texture
const goatImg = new Image();
goatImg.src = "resources/goatTexture.webp";

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

let sidebar = document.getElementById("sidebar");
let hamburger = document.querySelector(".hamburger");

hamburger.addEventListener("click", function () {
  sidebar.classList.toggle("open");
});

let lastMoveDirection = null;
let canChangeDirection = true; // Allow direction change initially

// Function to handle key down events
function handleKeyDown(e) {
  if (!canChangeDirection) return; // If a direction change is not allowed, return

  switch (e.key) {
    case "ArrowUp":
      if (lastMoveDirection !== "down") {
        velocity = { x: 0, y: -1 * mirror };
        lastMoveDirection = "up";
        canChangeDirection = false;
      }
      break;
    case "ArrowDown":
      if (lastMoveDirection !== "up") {
        velocity = { x: 0, y: 1 * mirror };
        lastMoveDirection = "down";
        canChangeDirection = false;
      }
      break;
    case "ArrowRight":
      if (lastMoveDirection !== "left") {
        velocity = { x: 1 * mirror, y: 0 };
        lastMoveDirection = "right";
        canChangeDirection = false;
      }
      break;
    case "ArrowLeft":
      if (lastMoveDirection !== "right") {
        velocity = { x: -1 * mirror, y: 0 };
        lastMoveDirection = "left";
        canChangeDirection = false;
      }
      break;
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

let paused = false;
let pauseButton = document.getElementById("pause-button");
let resumeTime = 0;

pauseButton.addEventListener("click", function () {
  paused = !paused;
  this.innerHTML = paused ? "Resume" : "Pause";
  if (!paused) {
    // Record the time at which we resumed the game
    resumeTime = performance.now();
  }
});

let muted = true;
let muteButton = document.getElementById("mute-button");

muteButton.addEventListener("click", function () {
  muted = !muted;
  this.innerHTML = muted ? "Mute" : "Unmute";
  return muted ? audio.pause() : audio.play();
});

let initialX = null;
let initialY = null;
let isSwiping = false;
let isDead = false;

function startTouch(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    // Touch is outside the canvas, don't start the movement
    return;
  }

  initialX = x;
  initialY = y;
}

function startMouse(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX;
  const y = e.clientY;

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    // Mouse click is outside the canvas, don't start the movement
    return;
  }

  isSwiping = true;
  initialX = x;
  initialY = y;
}

function moveTouch(e) {
  if (initialX === null || initialY === null) {
    return;
  }

  if (!isDead) {
    const diffX = initialX - e.touches[0].clientX;
    const diffY = initialY - e.touches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Sliding horizontally
      if (diffX > 0 && lastMoveDirection !== "right") {
        // Slid left
        velocity = { x: -1 * mirror, y: 0 };
        lastMoveDirection = "left";
      } else if (lastMoveDirection !== "left") {
        // Slid right
        velocity = { x: 1 * mirror, y: 0 };
        lastMoveDirection = "right";
      }
    } else {
      // Sliding vertically
      if (diffY > 0 && lastMoveDirection !== "down") {
        // Slid up
        velocity = { x: 0, y: -1 * mirror };
        lastMoveDirection = "up";
      } else if (lastMoveDirection !== "up") {
        // Slid down
        velocity = { x: 0, y: 1 * mirror };
        lastMoveDirection = "down";
      }
    }
  }

  initialX = null;
  initialY = null;
}

function moveMouse(e) {
  if (initialX === null || initialY === null || !isSwiping) {
    return;
  }

  moveTouch({
    touches: [
      {
        clientX: e.clientX,
        clientY: e.clientY,
      },
    ],
  });
}

function endMouse() {
  isSwiping = false;
}

window.addEventListener("touchstart", startTouch);
window.addEventListener("touchmove", moveTouch);

window.addEventListener("mousedown", startMouse);
window.addEventListener("mousemove", moveMouse);
window.addEventListener("mouseup", endMouse);

// Starts the game
requestAnimationFrame(update);
requestAnimationFrame(draw);
