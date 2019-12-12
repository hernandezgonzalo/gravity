class Level {
  constructor(data) {
    this.hero = data.hero;
    this.enemies = data.enemies;
    this.targetPos = data.target;
    this.targetSize = 40;
    this.target = new Image();
    this.target.src = "./img/target.png";
    this.targetSprites = 16;
    this.targetOpacity = 1;
    this.activeTargetSprite = 0;
    this.bricks = data.bricks;
    this.brickSize = 25; // size of the bricks in pixeles
    this.brick = new Image();
    this.brick.src = "./img/brick.png";
    this.explosive = new Image();
    this.explosive.src = "./img/explosive.png";
    this.levelFinished = false;
    this.resetLevel = false;
  }

  drawBricks(ctx) {
    this.bricks.forEach(brick => {
      if (!brick[2]) {
        ctx.drawImage(
          this.brick,
          brick[0],
          brick[1],
          this.brickSize,
          this.brickSize
        );
      } else {
        ctx.drawImage(
          this.explosive,
          brick[0],
          brick[1],
          this.brickSize,
          this.brickSize
        );
      }
    });
  }

  drawTarget(ctx, secondsPassed) {
    ctx.save();
    this.activeTargetSprite += 0.25;
    if (this.activeTargetSprite === this.targetSprites)
      this.activeTargetSprite = 0;
    if (this.levelFinished) this.targetOpacity -= secondsPassed * 3;
    //console.log(this.targetOpacity);
    ctx.globalAlpha = this.targetOpacity > 0 ? this.targetOpacity : 0;
    ctx.drawImage(
      this.target,
      this.targetSize * Math.floor(this.activeTargetSprite),
      0,
      this.targetSize,
      this.targetSize,
      this.targetPos[0],
      this.targetPos[1],
      this.targetSize,
      this.targetSize
    );
    ctx.restore();
  }
}

var levels = [
  {
    // intro
    hero: new Hero(275, 449),
    enemies: [],
    target: [680, 455],
    bricks: [
      [200, 500],
      [225, 500],
      [250, 500],
      [275, 500],
      [300, 500],
      [325, 500],
      [350, 500],
      [375, 500],
      [400, 500],
      [425, 500],
      [450, 500],
      [475, 500],
      [500, 500],
      [525, 500],
      [550, 500],
      [575, 500],
      [600, 500],
      [625, 500],
      [650, 500],
      [675, 500],
      [700, 500],
      [725, 500],
      [750, 500],
      [775, 500]
    ]
  },
  {
    // level 1
    hero: new Hero(380, 80),
    enemies: [new Enemy(550, 100), new Enemy(120, 100)],
    target: [640, 555],
    bricks: [
      [225, 0],
      [250, 0],
      [275, 0],
      [300, 0],
      [325, 0],
      [350, 0],
      [375, 0],
      [400, 0],
      [425, 0],
      [450, 0],
      [475, 0],
      [500, 0, true],
      [525, 0, true],
      [550, 0, true],
      [575, 0],

      [200, 150],
      [225, 150],
      [250, 175],
      [275, 175],
      [300, 200],
      [325, 200],

      [200, 425],
      [225, 425],
      [250, 425],
      [275, 425],
      [300, 425],

      [400, 425],
      [425, 425],
      [450, 425],

      [200, 450],
      [200, 475],
      [200, 500],
      [200, 525],
      [200, 550],
      [200, 575],

      [75, 600],
      [100, 600],
      [125, 600],
      [150, 600],
      [175, 600],
      [200, 600],
      [225, 600],
      [250, 600],
      [275, 600],
      [300, 600],
      [325, 600],
      [350, 600],
      [375, 600],
      [400, 600],
      [425, 600],

      [75, 575],
      [100, 575],

      [500, 600],
      [525, 600],
      [550, 600],
      [575, 600],
      [600, 600],
      [625, 600],
      [650, 600],
      [675, 600],
      [700, 600],
      [725, 600],
      [750, 600],
      [775, 600, true],
      [800, 600, true]
    ]
  },
  {
    // level 2
    hero: new Hero(420, 200),
    enemies: [],
    target: [900, 597],
    bricks: [
      [250, 0],
      [275, 0],
      [300, 0],
      [325, 0],
      [350, 0],
      [375, 0],
      [400, 0],
      [425, 0],
      [450, 0],
      [475, 0],
      [500, 0],
      [525, 0],
      [550, 0],
      [575, 0],
      [600, 0],
      [625, 0],
      [650, 0],
      [675, 0],
      [700, 0],
      [725, 0],
      [750, 0],
      [775, 0],
      [800, 0],
      [825, 0],

      [0, 642],
      [25, 642],
      [50, 642],
      [75, 642],
      [100, 642],
      [125, 642],
      [150, 642],
      [175, 642],
      [200, 642],
      [225, 642],
      [250, 642],
      [275, 642],
      [300, 642],
      [325, 642],
      [350, 642],
      [375, 642],
      [400, 642],
      [425, 642],
      [450, 642],
      [475, 642],
      [500, 642],
      [525, 642],
      [550, 642],
      [575, 642],
      [600, 642],
      [625, 642],
      [650, 642],
      [675, 642],
      [700, 642],
      [725, 642],
      [750, 642],
      [775, 642],
      [800, 642],
      [825, 642],
      [850, 642],
      [875, 642],
      [900, 642],
      [925, 642],
      [950, 642],
      [975, 642]
    ]
  }
];
