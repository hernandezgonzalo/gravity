var rightPressed = false;
var leftPressed = false;

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
