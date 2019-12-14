const game = {
  canvas: undefined,
  ctx: undefined,
  gravityForce: 80,
  cloudsN: 3,
  bubblesN: 30,

  init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.start();
  },

  start() {
    this.transition = new Transition(this.ctx, this.canvas);
    this.keyboard = new Keyboard(this);
    this.sound = new Sound(this);
    this.score = new Score();
    this.intro = new Intro(this.ctx, this.canvas);
    this.levelN = getParameterByName("level");
    this.deaths = 0;

    this.reset();

    let oldTimeStamp = 0;
    let gameLoop = timeStamp => {
      let secondsPassed = (timeStamp - oldTimeStamp) / 1000;
      if (secondsPassed > 0.2) secondsPassed = 0.2; // fixes the game crashes when requestAnimationFrame pauses in the background
      oldTimeStamp = timeStamp;

      // game loop
      this.sky.draw(this.ctx, this.canvas);
      if (this.levelN !== 0) {
        this.bubbles.forEach(bubble => {
          bubble.update(secondsPassed, this.hero.gravitySpeed);
        });
        this.clouds.forEach(cloud => {
          cloud.update(secondsPassed);
        });
      }
      this.backgrounds.forEach(background => {
        background.draw(this.ctx, this.canvas, this.hero);
      });
      this.level.drawBricks(this.ctx);
      this.level.drawTarget(this.ctx, secondsPassed);
      this.keyboard.controller(this.hero, secondsPassed);
      if (this.levelN !== 0)
        this.score.draw(
          this.ctx,
          this.levelN - 1,
          this.deaths,
          this.sound.mute
        );
      this.update(this.hero, secondsPassed);
      this.enemies.forEach(enemy => {
        if (enemy.alive) {
          enemy.walk(secondsPassed);
          this.update(enemy, secondsPassed);
        }
      });
      this.enemyCollision();
      if (!this.hero.alive && !this.level.levelFinished)
        this.level.resetLevel = true;
      if (this.targetCompleted() && this.hero.alive) {
        if (!this.level.levelFinished) this.sound.targetPlay();
        this.level.levelFinished = true;
      }
      if (this.levelN === 0) this.intro.run(secondsPassed);
      this.screenTransition(secondsPassed);

      window.requestAnimationFrame(gameLoop);
    };
    window.requestAnimationFrame(gameLoop);
  },

  screenTransition(secondsPassed) {
    this.transition.direction = -1; // fade in transition

    if (this.level.levelFinished || this.level.resetLevel) {
      this.transition.direction = 1; // fade out transition
      this.transition.isFadingOut = this.transition.opacity < 1 ? true : false;
      if (!this.transition.isFadingOut) {
        if (this.level.levelFinished && !this.level.resetLevel) this.levelN++;
        else if (this.level.resetLevel && this.levelN !== 0) this.deaths++;
        this.reset();
      }
    }

    this.transition.draw(secondsPassed);
  },

  reset() {
    // level creation
    if (levels[this.levelN] === undefined) this.levelN = 0;
    if (this.levelN === 0) {
      this.deaths = 0;
      this.intro.reset();
    }
    if (this.levelN > 0 && !this.sound.mute) this.sound.init();
    this.level = new Level(levels[this.levelN]);

    // background creation
    this.sky = new Sky();
    this.backgrounds = [];
    this.backgrounds.push(new Background("./img/bg-back.png", 1050, 700));
    this.backgrounds.push(new Background("./img/bg-mid.png", 1100, 733));
    this.backgrounds.push(new Background("./img/bg-front.png", 1150, 767));

    // bubbles creation
    this.bubbles = [];
    for (let i = 0; i < this.bubblesN; i++)
      this.bubbles.push(new Bubble(this.canvas, this.ctx));

    // clouds creation
    this.clouds = [];
    for (let i = 0; i < this.cloudsN; i++)
      this.clouds.push(new Cloud(this.canvas, this.ctx));

    // characters creation
    this.hero = Object.assign(new Hero(), this.level.hero);
    this.hero.alive = true;
    this.enemies = [];
    this.level.enemies.forEach(enemy => {
      this.enemies.push(Object.assign(new Enemy(), enemy));
    });
  },

  update(character, secondsPassed) {
    this.ctx.save();
    this.gravity(character, secondsPassed);
    this.collision(character);
    this.rotation(character);
    character.draw(this.ctx);
    this.ctx.restore();
  },

  rotation(character) {
    let rotate = degrees => {
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
          let maxRebound = brick[0] + this.level.brickSize + 1;
          if (character.x + 5 <= maxRebound) character.x = character.x + 5;
          else character.x = maxRebound;
          sideCollision = true;
          if (brick[2]) explosiveBrick = true;
        }
        // check if the character is colliding with the left side of a brick
        else if (
          character.x + character.w >= brick[0] &&
          character.x < brick[0] + this.level.brickSize
        ) {
          let maxRebound = brick[0] - character.w - 1;
          if (character.x - 5 >= maxRebound) character.x = character.x - 5;
          else character.x = maxRebound;
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
          character.y + character.h < brick[1] + this.level.brickSize &&
          character.gravitySpeed > 0
        ) {
          character.y = brick[1] - character.h;
          character.isFlying = false;
          character.gravitySpeed = 1;
          if (brick[2]) explosiveBrick = true;
        }
        // check if the character is colliding with the bottom of a brick
        if (
          character.y <= brick[1] + this.level.brickSize &&
          character.y > brick[1] &&
          character.gravitySpeed < 0
        ) {
          character.y = brick[1] + this.level.brickSize;
          character.isFlying = false;
          character.gravitySpeed = -1;
          if (brick[2]) explosiveBrick = true;
        }
      }

      // check if the enemy is going to fall and avoid it
      if (
        (character.speed < 0 &&
          character.x + character.margin >= brick[0] &&
          character.x + character.margin - this.level.brickSize <=
            brick[0] + this.level.brickSize) ||
        (character.speed > 0 &&
          character.x + character.w - character.margin + this.level.brickSize >=
            brick[0] &&
          character.x + character.w - character.margin <=
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

    if (character.y + character.h < 0 || character.y > this.canvas.height) {
      if (
        character instanceof Hero &&
        this.hero.alive &&
        !this.level.levelFinished
      )
        this.sound.deathPlay();
      character.alive = false;
    }
    if (
      character instanceof Hero &&
      character.alive &&
      explosiveBrick &&
      !this.level.levelFinished
    ) {
      this.sound.deathPlay();
      character.alive = false;
    }
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
          enemy.y + enemy.h - m > this.hero.y + m
      )
    ) {
      if (this.hero.alive && !this.level.levelFinished) this.sound.deathPlay();
      this.hero.alive = false;
    }
  },

  targetCompleted() {
    let m = this.hero.margin / 2;
    return (
      this.hero.x + this.hero.w - m > this.level.targetPos[0] &&
      this.level.targetPos[0] + this.level.targetSize > this.hero.x + m &&
      this.hero.y + this.hero.h - m > this.level.targetPos[1] &&
      this.level.targetPos[1] + this.level.targetSize > this.hero.y + m
    );
  }
};
