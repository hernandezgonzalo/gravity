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
    this.brickSize = 20; // size of the bricks in pixeles
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
    hero: new Hero(280, 449),
    enemies: [],
    target: [680, 450],
    bricks: [
      [200, 500],
      [220, 500],
      [240, 500],
      [260, 500],
      [280, 500],
      [300, 500],
      [320, 500],
      [340, 500],
      [360, 500],
      [380, 500],
      [400, 500],
      [420, 500],
      [440, 500],
      [460, 500],
      [480, 500],
      [500, 500],
      [520, 500],
      [540, 500],
      [560, 500],
      [580, 500],
      [600, 500],
      [620, 500],
      [640, 500],
      [660, 500],
      [680, 500],
      [700, 500],
      [720, 500],
      [740, 500],
      [760, 500],
      [780, 500]
    ]
  },
  {
    // level 1
    hero: new Hero(280, 80),
    enemies: [new Enemy(550, 100), new Enemy(150, 100)],
    target: [640, 540],
    bricks: [
      [60, 0],
      [80, 0],
      [100, 0],
      [120, 0],
      [140, 0, true],
      [160, 0],
      [180, 0],
      [200, 0],
      [220, 0],
      [240, 0],
      [260, 0],
      [280, 0],
      [300, 0],
      [320, 0],
      [340, 0],
      [360, 0],
      [380, 0],
      [400, 0],
      [420, 0],
      [440, 0, true],
      [460, 0, true],
      [480, 0, true],
      [500, 0],

      [200, 140],
      [220, 140],
      [240, 160],
      [260, 160],
      [280, 180],
      [300, 180],

      [200, 440],
      [220, 440],
      [240, 440],
      [260, 440],
      [280, 440],

      [380, 440],
      [400, 440],
      [420, 440],

      [200, 460],
      [200, 480],
      [200, 500],
      [200, 520],
      [200, 540],
      [200, 560],

      [80, 580],
      [100, 580],
      [120, 580],
      [140, 580],
      [160, 580],
      [180, 580],
      [200, 580],
      [220, 580],
      [240, 580],
      [260, 580],
      [280, 580],
      [300, 580],
      [320, 580],
      [340, 580],
      [360, 580],

      [80, 560],
      [100, 560],

      [460, 580],
      [480, 580],
      [500, 580],
      [520, 580],
      [540, 580],
      [560, 580],
      [580, 580],
      [600, 580],
      [620, 580],
      [640, 580],
      [660, 580],
      [680, 580, true],
      [700, 580, true]
    ]
  },
  {
    // level 2
    hero: new Hero(420, 200),
    enemies: [],
    target: [640, 540],
    bricks: [
      [0, 0],
      [20, 0],
      [40, 0],
      [60, 0],
      [80, 0],
      [100, 0],
      [120, 0],
      [140, 0],
      [160, 0],
      [180, 0],
      [200, 0],
      [220, 0],
      [240, 0],
      [260, 0],
      [280, 0],
      [300, 0],
      [320, 0],
      [340, 0],
      [360, 0],
      [380, 0],
      [400, 0],
      [420, 0],
      [440, 0],
      [460, 0],
      [480, 0],
      [500, 0],
      [520, 0],
      [540, 0],
      [560, 0],
      [580, 0],
      [600, 0],
      [620, 0],
      [640, 0],
      [660, 0],
      [680, 0],
      [700, 0],
      [720, 0],
      [740, 0],
      [760, 0],
      [780, 0],
      [800, 0],
      [820, 0],
      [840, 0],
      [860, 0],
      [880, 0],

      [0, 580],
      [20, 580],
      [40, 580],
      [60, 580],
      [80, 580],
      [100, 580],
      [120, 580],
      [140, 580],
      [160, 580],
      [180, 580],
      [200, 580],
      [220, 580],
      [240, 580],
      [260, 580],
      [280, 580],
      [300, 580],
      [320, 580],
      [340, 580],
      [360, 580],
      [380, 580],
      [400, 580],
      [420, 580],
      [440, 580],
      [460, 580],
      [480, 580],
      [500, 580],
      [520, 580],
      [540, 580],
      [560, 580],
      [580, 580],
      [600, 580],
      [620, 580],
      [640, 580]
    ]
  }
];
