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
    this.brickSize = 25; // size of the bricks in pixels
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
  // level 0
  {
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
  // level 1
  {
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
  // level 2
  {
    hero: new Hero(170, 200),
    enemies: [],
    target: [1900, 597],
    bricks: [
      [250, 100],
      [275, 100],
      [300, 100],
      [325, 100],
      [350, 100],
      [375, 100],
      [400, 100],
      [425, 100],

      [550, 100],
      [575, 100],
      [600, 100],
      [625, 100],
      [650, 100],
      [675, 100],
      [700, 100],
      [725, 100],

      [100, 542],
      [125, 542],
      [150, 542],
      [175, 542],
      [200, 542],
      [225, 542],
      [250, 542],
      [275, 542],

      [400, 542],
      [425, 542],
      [450, 542],
      [475, 542],
      [500, 542],
      [525, 542],
      [550, 542],
      [575, 542],

      [700, 542],
      [725, 542],
      [750, 542],
      [775, 542],
      [800, 542],
      [825, 542],
      [850, 542],
      [875, 542]
    ]
  },
  // level 3
  {
    hero: new Hero(65, 200),
    enemies: [],
    target: [1900, 597],
    bricks: [
      [50, 600],
      [75, 600],
      [100, 600],
      [125, 600],

      [200, 325],
      [225, 325],
      [250, 325],
      [275, 325],

      [275, 350],
      [275, 375],
      [275, 400],
      [275, 425],
      [275, 450],

      [275, 600],
      [300, 600],
      [325, 600],
      [350, 600],
      [375, 600],
      [400, 600],

      [425, 225, true],
      [425, 250, true],
      [425, 275],
      [425, 300],
      [425, 325],
      [425, 350],
      [425, 375],
      [425, 400],
      [425, 425],
      [425, 450],

      [450, 450, true],
      [475, 450, true],

      [425, 50],
      [450, 50],
      [475, 50],
      [500, 50],
      [525, 50],
      [550, 50],
      [575, 50, true],
      [600, 50, true],

      [575, 600],
      [600, 600],
      [625, 600],
      [650, 600],
      [675, 600],

      [700, 300],
      [725, 300],
      [750, 300],
      [775, 300],
      [800, 300]
    ]
  }
];
