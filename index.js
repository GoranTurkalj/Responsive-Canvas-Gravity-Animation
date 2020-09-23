const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext("2d");

// Variables that holds "gravity" and ""friction"

let gravity = 1;
let friction = 0.7;

// mouse object for mouse positions which will be captured by this event below
let mouse = {
  x: undefined,
  y: undefined,
};

// Helper function for calculating allowed range of spawning locations

function randomRangeNumbers(min, max) {
  return Math.floor(Math.random() * (max - min) + 1) + min;
}

// Event listener for resizing

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Zovem init() svaki put kad se resiza window
  init();
});

// Event listener for clicking on the screen to restart the balls

window.addEventListener("click", () => {
  init();
});

// Creating constructor function for ball objects

function Ball(x, y, dx, dy, radius, fillColor) {
  this.x = x;
  this.y = y;
  this.dx = dx; // velocity for X
  this.dy = dy; // velocity for Y
  this.radius = radius;
  this.fillColor = fillColor;

  this.draw = function () {
    c.beginPath();
    c.strokeStyle = "black";
    c.fillStyle = this.fillColor;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
    c.stroke();
    c.closePath();
  };

  this.update = function () {
    //We must make the ball move downwards but not over the bottom edge

    // VAŽNO!  Dodati ovdje i "+ this.dy" i "-this.dy" (to omogućuje da lopte ne zapinju nimalo na donji i gornji rub!  VAŽNO! //
    if (
      this.y + this.radius + this.dy >= canvas.height ||
      this.y + this.dy + this.radius <= 0
    ) {
      this.dy = -this.dy * friction; // Friction dodajemo tako da umanjujemo velocity dy svaki put kad dotakne dno.
    }
    // Implementacija gravitacije
    else {
      //Basically dy raste ful brzo jer animacija refresha često - što znači da dy raste do 15 - lopta dođe do dna, velocity sad ima NEGATIVNI predznak i krene nazad i sad GUBI na brzini i taman kad dođe do 0 ode automatski opet u MINUS što zapravo mijenja smjer samo po sebi
      this.dy += gravity;
    }

    // Kretanje ball po y axisu.
    this.y += this.dy;

    // VAŽNO - pridodaje this.dx i u prvom i u drugom dijelu kondicionala da se ball ne zakači na rubove.

    if (
      this.x + this.radius + this.dx >= canvas.width ||
      this.x - this.radius + this.dx <= 0
    ) {
      this.dx = -this.dx * friction;
    }

    this.x += this.dx;

    //Iscrtavanje ballsa
    this.draw();
  };
}

// Implementation with init() function

// Create an array to store balls
let ballArray = [];

function init() {
  //Svaki put kad zovemo init() treba isprazniti ballArray - inače bi pri resizanju masu ballsa stvorilo

  ballArray = [];

  let colorArray = ["#5F94D9", "#77A1D9", "#3A6D8C", "#BF988F", "#F22E2E"];

  //Kreiram koliko god hoću lopti i spremim ih u array i svaka je na random poziciji
  for (let x = 0; x < 100; x++) {
    // random radius
    let radius = randomRangeNumbers(10, 50);

    //Spawnanje lopti s lijeve strane ne moze više lijevo nego što je veličina radijusa - tako da ako je radius 50 - centar lopte je na 50, znači taman će dotaknuti lijevi rub
    // desni rub isto tako - ne moze DESNIJE od širine canvasa od koje oduzmemo radius
    let xPosition = randomRangeNumbers(radius, canvas.width - radius);
    let yPosition = randomRangeNumbers(radius, canvas.height - radius * 10);

    // Da se ball ne spawna na rubovima: od canvas.widtha oduzmemo promjer kruga i pošto mozemo onda dobiti 0 ili canvas width - promjer kruga, to znači da nam na desnoj strani nikad nece biti blizu rubu, no da isto postignemo i na lijevoj, dodamo još radius kruga nakon što se ovaj prvi dio kalkulacije završi - tako da će TAMAN na rubovima biti.
    let randomColor = Math.floor(Math.random() * colorArray.length);
    let randomVelocityY = randomRangeNumbers(1, 10);
    let randomVelocityX = randomRangeNumbers(-10, 10);

    let ball = new Ball(
      xPosition,
      yPosition, // ne zelim da se smiju spawnati PRENISKO jer glupo izgleda - to sam ograničio.
      randomVelocityX,
      randomVelocityY,
      radius,
      colorArray[randomColor]
    );

    ballArray.push(ball);
  }
}

// Animating the balls
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Sad svaku loptu iz array animiram tako da pozovem ball.update() metodu

  for (let ball of ballArray) {
    ball.update();
  }
}

// Calling init() and animate()
init();
animate();
