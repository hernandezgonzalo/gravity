// asynchronously load the JavaScript files that contains the levels
const levelsToLoad = 3;
let ref = document.getElementsByTagName("script")[0];
for (let i = 0; i <= levelsToLoad; i++) {
  let script = document.createElement("script");
  script.src = `./js/levels/${i}.js`;
  ref.parentNode.insertBefore(script, ref);
}

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
