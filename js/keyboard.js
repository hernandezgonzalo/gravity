class Keyboard {
  constructor(game) {
    this.game = game;
    this.playerKeys = {
      left: 37,
      right: 39,
      //up: 38,
      //down: 40,
      //action: 90,
      sound: 77
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
    } else if (
      (e.keyCode === this.playerKeys.action && !this.game.hero.isFlying) ||
      (e.keyCode === this.playerKeys.up &&
        !this.game.hero.isFlying &&
        this.game.hero.gravitySpeed > 0) ||
      (e.keyCode === this.playerKeys.down &&
        !this.game.hero.isFlying &&
        this.game.hero.gravitySpeed < 0)
    ) {
      if (this.isKeyboardActived()) this.doAction();
    }
  }

  keyUpHandler(e) {
    if (e.keyCode === this.playerKeys.left) this.leftPressed = false;
    else if (e.keyCode === this.playerKeys.right) this.rightPressed = false;
    else if (e.keyCode === this.playerKeys.sound) this.game.sound.toggleSound();
  }

  controller(character, secondsPassed) {
    if (this.isKeyboardActived()) {
      if (this.rightPressed) {
        character.x += character.speed * secondsPassed;
        if (!character.isRotating)
          character.isLookingLeft = character.gravitySpeed > 0 ? 0 : 1;
        character.activeSprite++;
        if (!character.isFlying) this.game.sound.stepPlay();
      } else if (this.leftPressed) {
        character.x -= character.speed * secondsPassed;
        if (!character.isRotating)
          character.isLookingLeft = character.gravitySpeed < 0 ? 0 : 1;
        character.activeSprite++;
        if (!character.isFlying) this.game.sound.stepPlay();
      } else {
        character.activeSprite = 0;
      }
    }
  }

  doAction() {
    this.game.hero.gravitySpeed = -this.game.hero.gravitySpeed;
    this.game.hero.isFlying = true;
    this.game.hero.isRotating = true;
    this.game.enemies.forEach(enemy => {
      enemy.gravitySpeed = -Math.sign(enemy.gravitySpeed);
      enemy.isFlying = true;
      enemy.isRotating = true;
      enemy.speed = -enemy.speed;
    });
    this.game.sound.actionPlay();
  }

  isKeyboardActived() {
    return this.game.hero.alive || this.game.level.levelFinished;
  }
}
