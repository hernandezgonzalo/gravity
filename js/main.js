window.onload = setInterval(() => {
  draw();
}, 10);

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
    this.speed = 2.5; // horizontal speed
    this.gravityAcc = 1; // minimum: 1, maximum: 10
    this.isFlying = true;
    this.isRotating = false;
    this.isLookingLeft = 0; // defines the row of the sprite sheet
    this.image = new Image();
    this.image.src = image;
    this.sprites = sprites;
    this.activeSprite = 0;
  }
}

class Hero extends Character {
  constructor(x, y, width, height, image, sprites) {
    super(x, y, width, height, image, sprites);
  }
}

class Enemey extends Character {
  constructor(x, y, width, height, image, sprites) {
    super(x, y, width, height, image, sprites);
    this.walk();
  }
  walk() {
    setInterval(() => {
      if (!this.isFlying) {
        this.x += this.speed;
        this.activeSprite++;
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
    }, 20);
  }
}

// characters creation
var hero = new Hero(300, 100, 46, 60, "./img/hero-sprites.png", 24);
var enemies = [];
enemies.push(new Enemey(550, 100, 44.5, 60, "./img/enemy-sprites.png", 24));
enemies.push(new Enemey(150, 100, 44.5, 60, "./img/enemy-sprites.png", 24));

// -----------------------
// DRAWING
// -----------------------

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  keyboard(hero);
  enemies.forEach(enemy => {
    drawCharacter(enemy);
  });
  drawCharacter(hero);
}

function drawCharacter(character) {
  rotation(character);
  gravity(character);
  collision(character);

  if (character.activeSprite === character.sprites) character.activeSprite = 0;
  let sx = character.w * character.activeSprite;
  let sy = character.h * character.isLookingLeft;
  ctx.drawImage(
    character.image,
    sx,
    sy,
    character.w,
    character.h,
    character.x,
    character.y,
    character.w,
    character.h
  );
  ctx.restore();
}

// -----------------------
// PHYSICS
// -----------------------

function rotation(character) {
  // rotate when gravity changes
  if (character.isRotating) {
    if (character.gravityAcc > -6 && character.gravityAcc < 0) {
      let degrees = (character.gravityAcc + 1) * 36;
      if (character.isLookingLeft) degrees = -degrees;
      rotate(degrees);
    } else if (character.gravityAcc < 6 && character.gravityAcc > 0) {
      let degrees = (character.gravityAcc - 1) * 36 - 180;
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
    // when the hero is upside down
    rotate(180);
  }

  function rotate(degrees) {
    ctx.save();
    let xTranslate = character.x + character.w / 2;
    let yTranslate = character.y + character.h / 2;
    ctx.translate(xTranslate, yTranslate); // translate to rectangle center
    ctx.rotate((Math.PI / 180) * degrees);
    ctx.translate(-Math.abs(xTranslate), -Math.abs(yTranslate));
  }
}

function gravity(character) {
  character.y += character.gravityAcc;

  // acceleration effect when it starts to fly
  if (character.gravityAcc > -10 && character.gravityAcc < 10) {
    character.gravityAcc *= 1.05;
  } else if (character.gravityAcc < -10) {
    character.gravityAcc = -10;
  } else if (character.gravityAcc > 10) {
    character.gravityAcc = 10;
  }
}

function collision(character) {
  let sideCollision = false; // for enemies

  // check if the character is colliding with the floor
  if (character.y > canvas.height - character.h) {
    character.y = canvas.height - character.h;
    character.isFlying = false;
    character.gravityAcc = 1;
  }

  // check if the character is colliding with the ceiling
  if (character.y < 0) {
    character.y = 0;
    character.isFlying = false;
    character.gravityAcc = -1;
  }

  // check if the character is colliding with the left side
  if (character.x < 0) {
    character.x = 0;
    sideCollision = true;
  }

  // check if the character is colliding with the right side
  if (character.x > canvas.width - character.w) {
    character.x = canvas.width - character.w;
    sideCollision = true;
  }

  return sideCollision;
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

function keyboard(character) {
  if (rightPressed) {
    character.x += character.speed;
    if (!character.isRotating)
      character.isLookingLeft = character.gravityAcc > 0 ? 0 : 1;
    character.activeSprite++;
  } else if (leftPressed) {
    character.x -= character.speed;
    if (!character.isRotating)
      character.isLookingLeft = character.gravityAcc < 0 ? 0 : 1;
    character.activeSprite++;
  } else {
    character.activeSprite = 0;
  }
  collision(character);
}
