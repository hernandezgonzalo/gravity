class Character {
  constructor(x, y, width, height, image, sprites) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.gravitySpeed = 1; // the highest is 10
    this.isFlying = true;
    this.isRotating = false;
    this.isLookingLeft = 0; // defines the row of the sprite sheet
    this.image = new Image();
    this.image.src = image;
    this.sprites = sprites;
    this.activeSprite = 0;
    this.margin = 25;
  }
  draw(ctx) {
    if (this.activeSprite === this.sprites) this.activeSprite = 1;
    let sx = this.w * this.activeSprite;
    let sy = this.h * this.isLookingLeft;
    ctx.drawImage(
      this.image,
      sx,
      sy,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.restore();
  }
}

class Hero extends Character {
  constructor(x, y, width, height, sprites) {
    super(x, y, width, height, "./img/hero-sprites.png", sprites);
    this.speed = 200; // horizontal speed
  }
}

class Enemy extends Character {
  constructor(x, y, width, height, sprites) {
    super(x, y, width, height, "./img/enemy-sprites.png", sprites);
    this.speed = 100; // horizontal speed
    this.spritePace = 0;
  }
  walk(secondsPassed) {
    if (!this.isFlying) {
      this.x += this.speed * secondsPassed;
      if (++this.spritePace === 2) {
        this.activeSprite++;
        this.spritePace = 0;
      }
      if (this.activeSprite === this.sprites) this.activeSprite = 1;
      if (game.collision(this)) this.speed = -this.speed;
      if (!this.isRotating) {
        if (this.speed > 0) {
          this.isLookingLeft = this.gravitySpeed > 0 ? 0 : 1;
        } else {
          this.isLookingLeft = this.gravitySpeed < 0 ? 0 : 1;
        }
      }
    }
  }
}

class Background {
  constructor(image, width, height) {
    this.image = new Image();
    this.image.src = image;
    this.width = width;
    this.height = height;
    this.sx = 0;
    this.sy = 0;
  }
  draw(ctx, canvas, hero) {
    this.calcPosition(canvas, hero);
    ctx.drawImage(
      this.image,
      this.sx,
      this.sy,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }
  calcPosition(canvas, hero) {
    // horizontal parallax effect
    this.sx =
      1 - ((hero.x + hero.w / 2) / canvas.width) * (canvas.width - this.width);
    if (this.sx < 0) this.sx = 0;
    else if (this.sx > this.width - canvas.width)
      this.sx = this.width - canvas.width;
    // vertical parallax effect
    this.sy =
      1 -
      ((hero.y + hero.h / 2) / canvas.height) * (canvas.height - this.height);
    if (this.sy < 0) this.sy = 0;
    else if (this.sy > this.height - canvas.height)
      this.sy = this.height - canvas.height;
  }
}

class Sky {
  constructor() {}
  draw(ctx, canvas) {
    var grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grd.addColorStop(0, "#4FC3F7");
    grd.addColorStop(1, "#84F4F4");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
