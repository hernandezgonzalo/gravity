const game = {
  canvas: undefined,
  ctx: undefined,
  levels: [],
  gravityForce: 80,
  cloudsN: 3,
  bubblesN: 30,

  init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.start();
  },

  start() {
    this.physics = new Physics();
    this.transition = new Transition(this.ctx, this.canvas);
    this.keyboard = new Keyboard(this);
    this.sound = new Sound(this);
    this.score = new Score();
    this.intro = new Intro(this.ctx, this.canvas);
    this.levelN = Utilities.getParameterByName("level");
    this.deaths = 0;

    this.reset();

    let oldTimeStamp = 0;
    let gameLoop = (timeStamp = 0) => {
      let secondsPassed = (timeStamp - oldTimeStamp) / 1000;
      if (secondsPassed > 0.2) secondsPassed = 0.2; // fixes the game crashes when requestAnimationFrame pauses in the background
      oldTimeStamp = timeStamp;

      // game loop
      this.sky.draw(this.ctx, this.canvas);
      /*if (this.levelN !== 0) {
        this.bubbles.forEach(bubble => {
          bubble.update(secondsPassed, this.hero.gravitySpeed);
        });
        this.clouds.forEach(cloud => {
          cloud.update(secondsPassed);
        });
      }
      this.backgrounds.forEach(background => {
        background.draw(this.ctx, this.canvas, this.hero);
      });*/
      this.level.drawBricks(this.ctx);
      this.level.drawTarget(this.ctx, secondsPassed);
      this.keyboard.controller(this.hero, secondsPassed);
      /*if (this.levelN !== 0)
        this.score.draw(
          this.ctx,
          this.levelN - 1,
          this.deaths,
          this.sound.mute
        );*/
      this.update(this.hero, secondsPassed);
      this.enemies.forEach(enemy => {
        if (enemy.alive) {
          enemy.walk(this, secondsPassed);
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
      /*if (this.levelN === 0) this.intro.run(secondsPassed);*/
      this.screenTransition(secondsPassed);

      window.requestAnimationFrame(gameLoop);
    };
    gameLoop();
  },

  update(character, secondsPassed) {
    this.ctx.save();
    this.physics.gravity(character, this.gravityForce, secondsPassed);
    this.physics.collision(this, character);
    this.physics.rotation(this.ctx, character);
    character.draw(this.ctx);
    this.ctx.restore();
  },

  reset() {
    // level creation
    if (this.levels[this.levelN] === undefined) this.levelN = 0;
    if (this.levelN === 0) {
      this.deaths = 0;
      this.intro.reset();
    }
    if (this.levelN > 0 && !this.sound.mute) this.sound.init();
    this.level = new Level(this.levels[this.levelN]);

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
  }
};
