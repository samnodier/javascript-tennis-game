function playGame() {

  // Check for player inputs
  const input1 = document.querySelector('#input1');
  const input2 = document.querySelector('#input2');
  const player1 = (input1.value === '') ? 'Player 1' : `${input1.value}`;
  const player2 = (input2.value === '') ? 'Player 2' : `${input2.value}`;
  console.log(player1, player2);

  // Animation variable
  let rAF;
  let myInterval;

  document.querySelectorAll('input').forEach((each) => {
    each.style.visibility = "hidden";
  });
  document.querySelector('.controls').style.visibility = "hidden";  

  startBtn.style.visibility = 'hidden';

  // Setup the canvas
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  const leftScore = document.querySelector('.left-score');
  const rightScore = document.querySelector('.right-score');
  const timer = document.querySelector('.timer');
  let scoreLeft = 0;
  let scoreRight = 0;
  let startSecond = new Date().getSeconds();
  let startMin = 0;
  let randomDir = (Math.random() > 0.5) ? random(-4, -6) : random(4, 6);


  const width = canvas.width = window.innerWidth;
  const height = canvas.height = window.innerHeight;

  // function to generate random number

  function random(min,max) {
    const num = Math.floor(Math.random()*(max-min)) + min;
    return num;
  }

  // Initialize the Shape class
  class Shape {
    constructor (x, y, velocityX, velocityY, color) {
      this.x = x;
      this.y = y;
      this._velocityX = velocityX;
      this._velocityY = velocityY;
      this.color = color;
    };

    get velocityX() {
      return this._velocityX;
    }

    get velocityY() {
      return this._velocityY;
    }

    set velocityX(velocityX) {
      this._velocityX = velocityX;
    }

    set velocityY(velocityY) {
      this._velocityY = velocityY;
    }
  }

  class Block extends Shape {
    constructor (x, y, velocityX, velocityY, color, blockWidth, blockHeight) {
      super(x, y, velocityX, velocityY, color);
      this.blockWidth = 20;
      this.blockHeight = height / 4;
    }

    // Move the block up
    moveUp() {
      if(this.y > 0) {
        this.y -= this.velocityY;
      }
    }
    // Move the block down
    moveDown() {
      if(this.y + this.blockHeight < height) {
        this.y += this.velocityY;
      }
    }

    // Draw the blocks
    draw() {
      context.beginPath();
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.blockWidth, this.blockHeight);
      context.fill();
    }

    // Check the bounds of the browser window
    checkBounds() {
      if((this.y + this.blockHeight) >= height) {
        this.y = height - this.blockHeight;
      }

      if(this.y <= 0) {
        this.y = 0;
      }
    }
  }

  function setControls() {
    window.onkeydown = (e) => {
      if(e.key === 'a') {
        leftBlock.moveUp();
      } else if (e.key === 'd') {
        leftBlock.moveDown();
      }

      if(e.key === 'j') {
        rightBlock.moveUp();
      } else if (e.key === 'l') {
        rightBlock.moveDown();
      }

      if (e.key === "Escape") {
        cancelAnimationFrame(rAF);
      }
    }
  }

  class Ball extends Shape {
    constructor(x, y, velocityX, velocityY, color, size) {
      super(x, y, velocityX, velocityY, color);
      this.size = size;
    }

    draw() {
      context.beginPath();
      context.fillStyle = this.color;
      context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      context.fill();
    }

    update() {
      randomDir = (Math.random() > 0.5) ? random(-4, -6) : random(4, 6);

      if ((this.x + this.size) > rightBlock.x && this.y >  rightBlock.y && this.y < rightBlock.y + rightBlock.blockHeight) {
        this.velocityX = -(this.velocityX) - Math.random();
      }

      if ((this.x - this.size) < leftBlock.x + leftBlock.blockWidth && this.y > leftBlock.y && this.y < leftBlock.y + leftBlock.blockHeight) {
        this.velocityX = -(this.velocityX) + Math.random();
      }

      if ((this.y + this.size) >= height) {
        this.velocityY = -(this.velocityY);
      }

      if ((this.y - this.size) <= 0) {
        this.velocityY = -(this.velocityY);
      }

      if((this.x + this.size) >= width) {
        scoreLeft = scoreLeft + 1;
        this.x = width / 2;
        this.y = height / 2;
        this.velocityX = randomDir;
        this.velocityY = randomDir;
      }

      if((this.x - this.size) <= 0) {
        scoreRight = scoreRight + 1;
        this.x = width / 2;
        this.y = height / 2;
        this.velocityX = randomDir;
        this.velocityY = randomDir;
      }

      leftScore.style.color = 'white';
      leftScore.textContent = `${player1}: ${scoreLeft}`;

      rightScore.style.color = 'white';
      rightScore.textContent = `${player2}: ${scoreRight}`;

      this.x += this.velocityX;
      this.y += this.velocityY;
    }
  }

  // Draw two blocks one left and another right
  let leftBlock = new Block(0, ((height / 2) - (height / 8)), 0, 30, 'white', 30, height / 4);
  let rightBlock = new Block(width - 20, ((height / 2) - (height / 8)), 0, 20, 'white', 20, height / 4);

  // Draw the ball to the center of the browser

  // let randomDir = (Math.random() > 0.5) ? random(-4, -6) : random(4, 6);
  console.log(randomDir);

  let ball = new Ball(width/2, height/2, randomDir, randomDir, 'white', 15);

  setControls();

  // let start = new Date().getSeconds();

  // The timer for the game
  let startTime = 0;
  let minutes = 0;
  let seconds = 0;

    // Display the timer
  function displayTimer() {
    minutes = Math.floor(startTime / 60);
    seconds = Math.floor(startTime - minutes*60);

    // Add the leading zero
    minutes = (minutes > 9) ? `${minutes}` : `0${minutes}`
    seconds = (seconds > 9) ? `${seconds}` : `0${seconds}`;
    

    timer.style.color = 'white';
    timer.textContent = `${minutes}:${seconds}`;
    startTime++;
  }

  myInterval = setInterval(displayTimer, 1000);

  // Loop the game to continue endlessly
  function loopGame() {
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'white';
    context.fillRect(width/2, 0, 2, height);

    leftBlock.draw();
    leftBlock.checkBounds();
    // leftBlock.checkCollision();

    rightBlock.draw();
    rightBlock.checkBounds();
    // leftBlock.checkCollision();

    ball.draw();
    ball.update();


    rAF = requestAnimationFrame(loopGame);

    if (scoreLeft === 20) {
    	winner.style.visibility = 'visible';
      winner.style.color = 'white';
      winnerText.textContent = `${player1} WON`;
      restartTheGame.textContent = 'CLICK THIS TEXT TO RESTART';
      clearInterval(myInterval);
      cancelAnimationFrame(rAF);
    } else if (scoreRight === 20) {
    	winner.style.visibility = 'visible';
      winner.style.color = 'white';
      winnerText.textContent = `${player2} WON`;
      restartTheGame.textContent = 'CLICK THIS TEXT TO RESTART';
      clearInterval(myInterval);
      cancelAnimationFrame(rAF);
    }

    if(((Number(minutes) * 60) + Number(seconds)) >= 600) {
      if(scoreLeft > scoreRight) {
      	winner.style.visibility = 'visible';
        winner.style.color = 'white';
        winnerText.textContent = `${player1} WON`;
        restartTheGame.textContent = 'CLICK THIS TEXT TO RESTART';
        clearInterval(myInterval);
        cancelAnimationFrame(rAF);
      } else if (scoreLeft < scoreRight) {
      	winner.style.visibility = 'visible';
        winner.style.color = 'white';
        winnerText.textContent = `${player2} WON`;
        restartTheGame.textContent = 'CLICK THIS TEXT TO RESTART';
        clearInterval(myInterval);
        cancelAnimationFrame(rAF);
      } else if (scoreLeft === scoreRight) {
      	winner.style.visibility = 'visible';
        winner.style.color = 'white';
        winnerText.textContent = `DRAW`;
        restartTheGame.textContent = 'CLICK THIS TEXT TO RESTART';
        clearInterval(myInterval);
        cancelAnimationFrame(rAF);
      }
    }
  }
  loopGame();
}

const winner = document.querySelector('.winner');
const winnerText = document.querySelector('.winner-text');
const restartTheGame = document.querySelector('.restart-the-game');

winner.addEventListener('click', () => {
	playGame();
	winner.style.visibility = 'hidden';
});

const startBtn = document.querySelector('.startbtn');
startBtn.addEventListener('click', playGame);
