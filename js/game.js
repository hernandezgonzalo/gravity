const game = {
  canvas: undefined,
  ctx: undefined,
  gravityForce: 80,

  init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.start();
  },

  start() {
    this.keyboard = new Keyboard();
    this.reset();

    let oldTimeStamp = 0;
    let gameLoop = timeStamp => {
      let secondsPassed = (timeStamp - oldTimeStamp) / 1000;
      if (secondsPassed > 0.2) secondsPassed = 0.2; // fixes the game crashes when requestAnimationFrame pauses in the background
      oldTimeStamp = timeStamp;

      // game loop
      this.sky.draw(this.ctx, this.canvas);
      this.backgrounds.forEach(bg => {
        bg.draw(this.ctx, this.canvas, this.hero);
      });
      this.level.drawBricks(this.ctx);
      this.keyboard.controller(this.hero, secondsPassed);
      this.update(this.hero, secondsPassed);
      this.enemies.forEach(enemy => {
        if (enemy.alive) {
          enemy.walk(secondsPassed);
          this.update(enemy, secondsPassed);
        }
      });
      this.enemyCollision();
      if (!this.hero.alive) this.reset();

      window.requestAnimationFrame(gameLoop);
    };
    window.requestAnimationFrame(gameLoop);
  },

  reset() {
    this.sky = new Sky();

    //level creation
    this.level = new Level(level[0]);

    // characters creation
    this.hero = Object.assign(new Hero(), this.level.hero);
    this.hero.alive = true;
    this.enemies = [];
    this.level.enemies.forEach(enemy => {
      this.enemies.push(Object.assign(new Enemy(), enemy));
    });

    // background creation
    this.backgrounds = [];
    this.backgrounds.push(new Background("./img/bg-back.png", 950, 633));
    this.backgrounds.push(new Background("./img/bg-mid.png", 1000, 667));
    this.backgrounds.push(new Background("./img/bg-front.png", 1050, 700));
  },

  update(character, secondsPassed) {
    this.rotation(character);
    this.gravity(character, secondsPassed);
    this.collision(character);
    character.draw(this.ctx);
  },

  rotation(character) {
    let rotate = degrees => {
      this.ctx.save();
      let xTranslate = character.x + character.w / 2;
      let yTranslate = character.y + character.h / 2;
      this.ctx.translate(xTranslate, yTranslate);
      this.ctx.rotate((Math.PI / 180) * degrees);
      this.ctx.translate(-xTranslate, -yTranslate);
    };

    // rotate when gravity changes
    if (character.isRotating) {
      if (character.gravitySpeed > -5 && character.gravitySpeed < 0) {
        let degrees = (character.gravitySpeed + 1) * 45;
        if (character.isLookingLeft) degrees = -degrees;
        rotate(degrees);
      } else if (character.gravitySpeed < 5 && character.gravitySpeed > 0) {
        let degrees = (character.gravitySpeed - 1) * 45 - 180;
        if (!character.isLookingLeft) degrees = -degrees;
        rotate(degrees);
      } else if (character.gravitySpeed < 0) {
        rotate(-180);
        character.isRotating = false;
      } else {
        rotate(0);
        character.isRotating = false;
      }
    } else if (character.gravitySpeed < 0) {
      rotate(180); // when the character is upside down
    }
  },

  gravity(character, secondsPassed) {
    // acceleration effect when it starts to fly
    if (character.gravitySpeed > -10 && character.gravitySpeed < 10) {
      character.gravitySpeed *= 1.1;
    } else if (character.gravitySpeed < -10) {
      character.gravitySpeed = -10;
    } else if (character.gravitySpeed > 10) {
      character.gravitySpeed = 10;
    }

    character.y += character.gravitySpeed * secondsPassed * this.gravityForce;

    // when the character falls down from a platform
    if (character.gravitySpeed > 1 || character.gravitySpeed < -1)
      character.isFlying = true;
  },

  collision(character) {
    let sideCollision = false; // for enemies
    let fallDown = true; // for enemies
    let explosiveBrick = false; // for hero

    this.level.bricks.forEach(brick => {
      if (
        character.y <= brick[1] &&
        character.y + character.h >= brick[1] + this.level.brickSize
      ) {
        // check if the character is colliding with the right side of a brick
        if (
          character.x < brick[0] + this.level.brickSize &&
          character.x > brick[0]
        ) {
          character.x = brick[0] + this.level.brickSize + 1;
          sideCollision = true;
          if (brick[2]) explosiveBrick = true;
        }
        // check if the character is colliding with the left side of a brick
        if (
          character.x + character.w >= brick[0] &&
          character.x < brick[0] + this.level.brickSize
        ) {
          character.x = brick[0] - character.w - 1;
          sideCollision = true;
          if (brick[2]) explosiveBrick = true;
        }
      }

      if (
        (character.x + character.margin >= brick[0] &&
          character.x + character.margin <= brick[0] + this.level.brickSize) ||
        (character.x + character.w - character.margin >= brick[0] &&
          character.x + character.w - character.margin <=
            brick[0] + this.level.brickSize)
      ) {
        // check if the character is colliding with the top of a brick
        if (
          character.y + character.h >= brick[1] &&
          character.y + character.h < brick[1] + this.level.brickSize
        ) {
          if (character.gravitySpeed > 0) {
            character.y = brick[1] - character.h;
            character.isFlying = false;
            character.gravitySpeed = 1;
            if (brick[2]) explosiveBrick = true;
          }
        }
        // check if the character is colliding with the bottom of a brick
        if (
          character.y <= brick[1] + this.level.brickSize &&
          character.y > brick[1]
        ) {
          if (character.gravitySpeed < 0) {
            character.y = brick[1] + this.level.brickSize;
            character.isFlying = false;
            character.gravitySpeed = -1;
            if (brick[2]) explosiveBrick = true;
          }
        }
      }

      // check if the enemy is going to fall and avoid it
      if (
        (character.speed < 0 &&
          character.x + character.margin - this.level.brickSize >= brick[0] &&
          character.x + character.margin - this.level.brickSize <=
            brick[0] + this.level.brickSize) ||
        (character.speed > 0 &&
          character.x + character.w - character.margin + this.level.brickSize >=
            brick[0] &&
          character.x + character.w - character.margin + this.level.brickSize <=
            brick[0] + this.level.brickSize)
      ) {
        if (
          (character.gravitySpeed > 0 &&
            character.y + character.h >= brick[1] &&
            character.y + character.h < brick[1] + this.level.brickSize) ||
          (character.gravitySpeed < 0 &&
            character.y <= brick[1] + this.level.brickSize &&
            character.y > brick[1])
        )
          fallDown = false;
      }
    });

    if (character.y + character.h < 0 || character.y > this.canvas.height)
      character.alive = false;
    if (character instanceof Hero && explosiveBrick) character.alive = false;
    if (character instanceof Enemy) return sideCollision || fallDown;
  },

  enemyCollision() {
    let m = this.hero.margin / 2; //character collision margin
    if (
      this.enemies.some(
        enemy =>
          this.hero.x + this.hero.w - m > enemy.x + m &&
          enemy.x + enemy.w - m > this.hero.x + m &&
          this.hero.y + this.hero.h - m > enemy.y + m &&
          enemy.y + enemy.h - m * 2 > this.hero.y + m * 2
      )
    )
      this.hero.alive = false;
  }
};
