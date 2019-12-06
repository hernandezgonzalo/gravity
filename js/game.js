var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var gravityForce = 80;

// characters creation
var hero = new Hero(300, 100, 65, 51, "./img/hero-sprites.png", 19);
var enemies = [];
enemies.push(new Enemy(550, 100, 65, 51, "./img/enemy-sprites.png", 19));
enemies.push(new Enemy(150, 100, 65, 51, "./img/enemy-sprites.png", 19));

// background creation
var backgrounds = [];
backgrounds.push(new Background("./img/bg-back.png", 950, 633));
backgrounds.push(new Background("./img/bg-mid.png", 1000, 667));
backgrounds.push(new Background("./img/bg-front.png", 1050, 700));

// -----------------------
// GAME LOOP
// -----------------------

window.onload = function() {
  window.requestAnimationFrame(gameLoop);
};

var oldTimeStamp = 0;

function gameLoop(timeStamp) {
  let secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  if (secondsPassed > 0.2) secondsPassed = 0.2;
  oldTimeStamp = timeStamp;

  clearScreen();
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

function clearScreen() {
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  let grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grd.addColorStop(0, "#4FC3F7");
  grd.addColorStop(1, "#84F4F4");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
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
  // acceleration effect when it starts to fly
  if (character.gravityAcc > -10 && character.gravityAcc < 10) {
    character.gravityAcc *= 1.1;
  } else if (character.gravityAcc < -10) {
    character.gravityAcc = -10;
  } else if (character.gravityAcc > 10) {
    character.gravityAcc = 10;
  }

  character.y += character.gravityAcc * secondsPassed * gravityForce;

  // when the character falls down from a platform
  if (character.gravityAcc > 1 || character.gravityAcc < -1)
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
      (character.x + character.margin >= brick[0] &&
        character.x + character.margin <= brick[0] + level.brickSize) ||
      (character.x + character.w - character.margin >= brick[0] &&
        character.x + character.w - character.margin <=
          brick[0] + level.brickSize)
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
