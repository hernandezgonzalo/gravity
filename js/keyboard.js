class Keyboard {
  constructor() {
    this.playerKeys = {
      left: 37,
      right: 39,
      action: 90
    };
    this.rightPressed = false;
    this.leftPressed = false;
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
  }

  keyDownHandler(e) {
    if (e.keyCode === this.playerKeys.left) {
      this.leftPressed = true;
    } else if (e.keyCode === this.playerKeys.right) {
      this.rightPressed = true;
    } else if (e.keyCode === this.playerKeys.action && !game.hero.isFlying) {
      game.hero.gravitySpeed = -game.hero.gravitySpeed;
      game.hero.isFlying = true;
      game.hero.isRotating = true;
      game.enemies.forEach(enemy => {
        enemy.gravitySpeed = -Math.sign(enemy.gravitySpeed);
        enemy.isFlying = true;
        enemy.isRotating = true;
        enemy.speed = -enemy.speed;
      });
    }
  }

  keyUpHandler(e) {
    if (e.keyCode === this.playerKeys.right) {
      this.rightPressed = false;
    } else if (e.keyCode === this.playerKeys.left) {
      this.leftPressed = false;
    }
  }

  controller(character, secondsPassed) {
    if (this.rightPressed) {
      character.x += character.speed * secondsPassed;
      if (!character.isRotating)
        character.isLookingLeft = character.gravitySpeed > 0 ? 0 : 1;
      character.activeSprite++;
    } else if (this.leftPressed) {
      character.x -= character.speed * secondsPassed;
      if (!character.isRotating)
        character.isLookingLeft = character.gravitySpeed < 0 ? 0 : 1;
      character.activeSprite++;
    } else {
      character.activeSprite = 0;
    }
    game.collision(character);
  }
}
