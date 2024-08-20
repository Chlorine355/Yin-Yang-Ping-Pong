const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const RADIUS = 12;
let score = 0;


let bricks = [];

for (let i = 0; i < 20; i++) {
  let newrow = [];
  for (let j = 0; j < 20; j++) {
    newrow.push("");
  }
  bricks.push([...newrow]);
}

for (let i = 0; i < 20; i++) {
  for (let j = 0; j < 20; j++) {
    if (i >= j) {
      bricks[i][j] = "white";
    } else {bricks[i][j] = "black"}
  }
}

console.log(bricks);

function drawBricks() {
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      ctx.fillStyle = bricks[i][j];
      ctx.fillRect(25 * i, 25 * j, 25, 25);
    }
  }
}

function switchColor(i, j) {
  console.log(i, j);
  console.log("was", bricks[i][j]);
  if (bricks[i][j] == "white") {
    bricks[i][j] = "black";
    score += 1
  } else {
    bricks[i][j] = "white";
    score -= 1
  }
  switch (score) {
    case 10:
      placeBall("black");
      score = 0;
      break;
    case -10:
      placeBall("white");
      score = 0;
    break;
  }
  document.getElementById("score").innerHTML = score;
}


class Ball {
  constructor(x, y, vx, vy, color, radius) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
  }

  checkWallCollision() {
    if (this.x + RADIUS >= 500) {
      this.vx = -this.vx;
    }
    if (this.y + RADIUS >= 500) {
      this.vy = -this.vy;
    }
    if (this.x - RADIUS <= 0) {
      this.vx = -this.vx;
    }
    if (this.y - RADIUS <= 0) {
      this.vy = -this.vy;
    }
  }

  checkBrickCollision() {

    if (bricks[Math.floor((this.x) / 25)][Math.floor((this.y + RADIUS) / 25)] == this.color) {
      switchColor(Math.floor((this.x) / 25),
                  Math.floor((this.y + RADIUS) / 25));
      this.vy = -this.vy;
      return;
    }

    if (bricks[Math.floor((this.x + RADIUS) / 25)][Math.floor(this.y / 25)] == this.color) {
      switchColor(Math.floor((this.x + RADIUS) / 25),
                  Math.floor(this.y / 25));
      this.vx = -this.vx;
      return;
    }

    if (bricks[Math.floor((this.x) / 25)][Math.floor((this.y - RADIUS) / 25)] == this.color) {
      switchColor(Math.floor((this.x) / 25),
                  Math.floor((this.y - RADIUS) / 25));
      this.vy = -this.vy;
      return;
    }

    if (bricks[Math.floor((this.x - RADIUS) / 25)][Math.floor(this.y / 25)] == this.color) {
      switchColor(Math.floor((this.x - RADIUS) / 25),
                  Math.floor(this.y / 25));
      this.vx = -this.vx;
      return;
    }
  }
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function placeBall(color) {
  let [new_i, new_j] = [randInt(1, 18), randInt(1, 18)];
  while (bricks[new_i][new_j] == color) {
    [new_i, new_j] = [randInt(1, 18), randInt(1, 18)];
  }

  let new_vx = randInt(-2, 2);
  while (new_vx == 0) {
    new_vx = randInt(-2, 2);
  }

  let new_vy = randInt(-2, 2);
  while (new_vy == 0) {
    new_vy = randInt(-2, 2);
  }
  console.log(new_i, new_j);
  balls.push(new Ball(new_i * 25, new_j * 25, new_vx, new_vy, color));
}

let balls = [];
placeBall("white");
placeBall("black");


function moveBalls() {
  ctx.clearRect(0, 0, 500, 500);
  drawBricks();
  for (let ball of balls) {
    ball.draw();
    ball.move();
  }
}

let interval = setInterval(function() {
  moveBalls();
  for (let ball of balls) {
    ball.checkWallCollision();
    ball.checkBrickCollision();
  }
}, 1)
