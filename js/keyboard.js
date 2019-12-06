class Keyboard {
  constructor() {
    this.rightPressed = false;
    this.leftPressed = false;
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
  }

  keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      this.rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      this.leftPressed = true;
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

  keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      this.rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      this.leftPressed = false;
    }
  }

  controller(character, secondsPassed) {
    if (this.rightPressed) {
      character.x += character.speed * secondsPassed;
      if (!character.isRotating)
        character.isLookingLeft = character.gravityAcc > 0 ? 0 : 1;
      character.activeSprite++;
    } else if (this.leftPressed) {
      character.x -= character.speed * secondsPassed;
      if (!character.isRotating)
        character.isLookingLeft = character.gravityAcc < 0 ? 0 : 1;
      character.activeSprite++;
    } else {
      character.activeSprite = 0;
    }
    collision(character);
  }
}
