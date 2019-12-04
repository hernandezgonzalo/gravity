var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var rightPressed = false;
var leftPressed = false;

// -----------------------
// CLASSES AND OBJECTS
// -----------------------

class Character {
  constructor(x, y, width, height, image, sprites) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.gravityAcc = 1; // minimum: 1, maximum: 10
    this.isFlying = true;
    this.isRotating = false;
    this.isLookingLeft = 0; // defines the row of the sprite sheet
    this.image = new Image();
    this.image.src = image;
    this.sprites = sprites;
    this.activeSprite = 0;
  }
  draw() {
    if (this.activeSprite === this.sprites) this.activeSprite = 0;
    let sx = this.w * this.activeSprite;
    let sy = this.h * this.isLookingLeft;
    ctx.drawImage(
      this.image,
      sx,
      sy,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.restore();
  }
}

class Hero extends Character {
  constructor(x, y, width, height, image, sprites) {
    super(x, y, width, height, image, sprites);
    this.speed = 200; // horizontal speed
  }
}

class Enemy extends Character {
  constructor(x, y, width, height, image, sprites) {
    super(x, y, width, height, image, sprites);
    this.speed = 100; // horizontal speed
    this.spritePace = 0;
  }
  walk(secondsPassed) {
    if (!this.isFlying) {
      this.x += this.speed * secondsPassed;
      if (++this.spritePace === 2) {
        this.activeSprite++;
        this.spritePace = 0;
      }
      if (this.activeSprite === this.sprites) this.activeSprite = 0;
      if (collision(this)) this.speed = -this.speed;
      if (!this.isRotating) {
        if (this.speed > 0) {
          this.isLookingLeft = this.gravityAcc > 0 ? 0 : 1;
        } else {
          this.isLookingLeft = this.gravityAcc < 0 ? 0 : 1;
        }
      }
    }
  }
}

class Background {
  constructor(image, width, height) {
    this.image = new Image();
    this.image.src = image;
    this.width = width;
    this.height = height;
    this.sx = 0;
    this.sy = 0;
  }
  draw() {
    this.clacPosition();
    ctx.drawImage(
      this.image,
      this.sx,
      this.sy,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }
  clacPosition() {
    // horizontal parallax effect
    let calcX =
      1 - ((hero.x + hero.w / 2) / canvas.width) * (canvas.width - this.width);
    if (calcX < 0) this.sx = 0;
    else if (calcX > this.width - canvas.width)
      this.sx = this.width - canvas.width;
    else this.sx = calcX;
    // vertical parallax effect
    let calcY =
      1 -
      ((hero.y + hero.h / 2) / canvas.height) * (canvas.height - this.height);
    if (calcY < 0) this.sy = 0;
    else if (calcY > this.height - canvas.height)
      this.sy = this.height - canvas.height;
    else this.sy = calcY;
  }
}

// characters creation
var hero = new Hero(300, 100, 46, 60, "./img/hero-sprites.png", 24);
var enemies = [];
enemies.push(new Enemy(550, 100, 44.5, 60, "./img/enemy-sprites.png", 24));
enemies.push(new Enemy(150, 100, 44.5, 60, "./img/enemy-sprites.png", 24));

// background creation
var backgrounds = [];
backgrounds.push(new Background("./img/sky-layer.png", 950, 633));
backgrounds.push(new Background("./img/buildings-layer.png", 1000, 667));

// -----------------------
// GAME LOOP
// -----------------------

window.onload = function() {
  window.requestAnimationFrame(gameLoop);
};

var oldTimeStamp = 0;

function gameLoop(timeStamp) {
  let secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  backgrounds.forEach(bg => {
    bg.draw();
  });
  level.drawBricks();
  keyboard(hero, secondsPassed);
  update(hero, secondsPassed);
  enemies.forEach(enemy => {
    enemy.walk(secondsPassed);
    update(enemy, secondsPassed);
  });

  window.requestAnimationFrame(gameLoop);
}

function update(character, secondsPassed) {
  rotation(character);
  gravity(character, secondsPassed);
  collision(character);
  character.draw();
}

// -----------------------
// PHYSICS
// -----------------------

function rotation(character) {
  // rotate when gravity changes
  if (character.isRotating) {
    if (character.gravityAcc > -5 && character.gravityAcc < 0) {
      let degrees = (character.gravityAcc + 1) * 45;
      if (character.isLookingLeft) degrees = -degrees;
      rotate(degrees);
    } else if (character.gravityAcc < 5 && character.gravityAcc > 0) {
      let degrees = (character.gravityAcc - 1) * 45 - 180;
      if (!character.isLookingLeft) degrees = -degrees;
      rotate(degrees);
    } else if (character.gravityAcc < 0) {
      rotate(-180);
      character.isRotating = false;
    } else {
      rotate(0);
      character.isRotating = false;
    }
  } else if (character.gravityAcc < 0) {
    rotate(180); // when the character is upside down
  }

  function rotate(degrees) {
    ctx.save();
    let xTranslate = character.x + character.w / 2;
    let yTranslate = character.y + character.h / 2;
    ctx.translate(xTranslate, yTranslate);
    ctx.rotate((Math.PI / 180) * degrees);
    ctx.translate(-xTranslate, -yTranslate);
  }
}

function gravity(character, secondsPassed) {
  character.y += character.gravityAcc * secondsPassed;

  // acceleration effect when it starts to fly
  if (character.gravityAcc > -15 && character.gravityAcc < 15) {
    character.gravityAcc += character.gravityAcc * secondsPassed * 10;
  } else if (character.gravityAcc < -15) {
    character.gravityAcc = -15;
  } else if (character.gravityAcc > 15) {
    character.gravityAcc = 15;
  }

  // when the character falls down from a platform
  if (character.gravityAcc > 1.1025 || character.gravityAcc < -1.1025)
    character.isFlying = true;
}

function collision(character) {
  let sideCollision = false; // for enemies
  let fallDown = true; // for enemies

  level.bricks.forEach(brick => {
    if (
      character.y <= brick[1] &&
      character.y + character.h >= brick[1] + level.brickSize
    ) {
      // check if the character is colliding with the right side of a brick
      if (character.x < brick[0] + level.brickSize && character.x > brick[0]) {
        character.x = brick[0] + level.brickSize + 1;
        sideCollision = true;
      }
      // check if the character is colliding with the left side of a brick
      if (
        character.x + character.w >= brick[0] &&
        character.x < brick[0] + level.brickSize
      ) {
        character.x = brick[0] - character.w - 1;
        sideCollision = true;
      }
    }

    if (
      (character.x + 15 >= brick[0] &&
        character.x + 15 <= brick[0] + level.brickSize) ||
      (character.x + character.w - 15 >= brick[0] &&
        character.x + character.w - 15 <= brick[0] + level.brickSize)
    ) {
      // check if the character is colliding with the top of a brick
      if (
        character.y + character.h >= brick[1] &&
        character.y + character.h < brick[1] + level.brickSize
      ) {
        if (character.gravityAcc > 0) {
          character.y = brick[1] - character.h;
          character.isFlying = false;
          character.gravityAcc = 1;
        }
      }
      // check if the character is colliding with the bottom of a brick
      if (character.y < brick[1] + level.brickSize && character.y > brick[1]) {
        if (character.gravityAcc < 0) {
          character.y = brick[1] + level.brickSize;
          character.isFlying = false;
          character.gravityAcc = -1;
        }
      }
    }

    // check if the enemy is going to fall and avoid it
    if (
      (character.speed < 0 &&
        character.x + 30 - level.brickSize >= brick[0] &&
        character.x + 30 - level.brickSize <= brick[0] + level.brickSize) ||
      (character.speed > 0 &&
        character.x + character.w - 30 + level.brickSize >= brick[0] &&
        character.x + character.w - 30 + level.brickSize <=
          brick[0] + level.brickSize)
    ) {
      if (
        (character.gravityAcc > 0 &&
          character.y + character.h >= brick[1] &&
          character.y + character.h < brick[1] + level.brickSize) ||
        (character.gravityAcc < 0 &&
          character.y <= brick[1] + level.brickSize &&
          character.y > brick[1])
      )
        fallDown = false;
    }
  });

  if (character instanceof Enemy) return sideCollision || fallDown;
}

// -----------------------
// KEYBOARD CONTROL
// -----------------------

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  } else if ((e.key == "z" || e.key == "Z") && !hero.isFlying) {
    hero.gravityAcc = -hero.gravityAcc;
    hero.isFlying = true;
    hero.isRotating = true;
    enemies.forEach(enemy => {
      enemy.gravityAcc = -Math.sign(enemy.gravityAcc);
      enemy.isFlying = true;
      enemy.isRotating = true;
      enemy.speed = -enemy.speed;
    });
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function keyboard(character, secondsPassed) {
  if (rightPressed) {
    character.x += character.speed * secondsPassed;
    if (!character.isRotating)
      character.isLookingLeft = character.gravityAcc > 0 ? 0 : 1;
    character.activeSprite++;
  } else if (leftPressed) {
    character.x -= character.speed * secondsPassed;
    if (!character.isRotating)
      character.isLookingLeft = character.gravityAcc < 0 ? 0 : 1;
    character.activeSprite++;
  } else {
    character.activeSprite = 0;
  }
  collision(character);
}
