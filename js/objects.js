class Character {
  constructor(x, y, width, height, image, sprites) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.gravityAcc = 1;
    this.isFlying = true;
    this.isRotating = false;
    this.isLookingLeft = 0; // defines the row of the sprite sheet
    this.image = new Image();
    this.image.src = image;
    this.sprites = sprites;
    this.activeSprite = 0;
  }
  draw() {
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
  constructor(x, y, width, height, image, sprites) {
    super(x, y, width, height, image, sprites);
    this.speed = 200; // horizontal speed
  }
}

class Enemy extends Character {
  constructor(x, y, width, height, image, sprites) {
    super(x, y, width, height, image, sprites);
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
      if (collision(this)) this.speed = -this.speed;
      if (!this.isRotating) {
        if (this.speed > 0) {
          this.isLookingLeft = this.gravityAcc > 0 ? 0 : 1;
        } else {
          this.isLookingLeft = this.gravityAcc < 0 ? 0 : 1;
        }
      }
    }
  }
}
