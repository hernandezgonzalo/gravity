class Level {
  constructor(bricks) {
    this.bricks = bricks;
    this.brickSize = 20; // size of the bricks in pixeles
    this.brick = new Image();
    this.brick.src = "./img/brick.png";
  }
  drawBricks() {
    this.bricks.forEach(location => {
      ctx.drawImage(
        this.brick,
        location[0],
        location[1],
        this.brickSize,
        this.brickSize
      );
    });
  }
}

var level = new Level([
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

  [200, 440],
  [220, 440],
  [240, 440],
  [260, 440],
  [280, 440],

  [200, 460],
  [200, 480],
  [200, 500],
  [200, 520],
  [200, 540],
  [200, 560],

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

  [100, 560],

  [460, 580],
  [480, 580],
  [500, 580],
  [520, 580],
  [540, 580],
  [560, 580],
  [580, 580],
  [600, 580]
]);
