class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 65;
    this.h = 51;
    this.gravitySpeed = 1; // the highest is +-10
    this.isFlying = true;
    this.isRotating = false;
    this.isLookingLeft = 0; // defines the row of the sprite sheet
    this.image = new Image();
    this.sprites = 19;
    this.activeSprite = 0;
    this.margin = 25; // margin to fall down when the feet are not in the floor
    this.alive = true;
  }

  draw(ctx) {
    if (this.activeSprite === this.sprites) this.activeSprite = 1;
    let sx = this.w * Math.floor(this.activeSprite);
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
  }
}

class Hero extends Character {
  constructor(x, y) {
    super(x, y);
    this.image.src = "./img/hero-sprites.png";
    this.speed = 200; // horizontal speed
  }
}

class Enemy extends Character {
  constructor(x, y) {
    super(x, y);
    this.image.src = "./img/enemy-sprites.png";
    this.speed = 100; // horizontal speed
  }

  walk(secondsPassed) {
    if (!this.isFlying) {
      this.x += this.speed * secondsPassed;
      this.activeSprite += 0.5; // slow down the animation
      if (this.activeSprite === this.sprites) this.activeSprite = 1;
      if (game.collision(this)) this.speed = -this.speed;
      if (!this.isRotating) {
        if (this.speed > 0) {
          this.isLookingLeft = this.gravitySpeed > 0 ? 0 : 1;
        } else {
          this.isLookingLeft = this.gravitySpeed < 0 ? 0 : 1;
        }
      }
    } else {
      this.activeSprite = 0;
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

class Cloud {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.image = new Image();
    this.image.src = "./img/cloud.png";
    this.maxWidth = 200;
    this.maxHeight = 150;
    this.minSpeed = 5;
    this.maxSpeed = 15;
    this.create();
  }

  create(outOfBounds = false) {
    if (outOfBounds) this.x = this.canvas.width;
    else this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * (this.canvas.height / 3);
    this.width = Math.random() * (this.maxWidth / 2) + this.maxWidth / 2;
    this.height = (this.maxHeight / this.maxWidth) * this.width;
    this.speed =
      Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
  }

  update(secondsPassed) {
    this.x -= this.speed * secondsPassed;
    if (this.x + this.width < 0) this.create(true);
    this.draw();
  }

  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = 0.75;
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.ctx.restore();
  }
}

class Bubble {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.minSize = 3;
    this.maxSize = 9;
    this.create();
  }

  create(outOfBounds = false) {
    let randomN = Math.random() * 0.7 + 0.3;
    this.maxSpeed = randomN * 30;
    this.opacity = randomN * 0.5;
    this.opacitySpeed = randomN * -0.003;
    this.maxOpacity = this.opacity;
    this.size = randomN * (this.maxSize - this.minSize) + this.minSize;
    if (outOfBounds)
      if (this.speed > 0) {
        this.y = -this.size;
        this.speed = 1;
      } else {
        this.y = this.canvas.height * 0.6;
        this.speed = -1;
      }
    else {
      this.y = Math.random() * (this.canvas.height / 2);
      this.speed = 1;
    }
    this.x = Math.random() * this.canvas.width;
  }

  update(secondsPassed, gravity) {
    let gravitySpeed = gravity === 0 ? 0 : gravity > 0 ? 0.5 : -0.5;
    this.speed += gravitySpeed;
    if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;
    else if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    this.y += this.speed * secondsPassed;
    if (this.y > this.canvas.height * 0.6 || this.y + this.size < 0)
      this.create(true);
    this.opacity += this.opacitySpeed;
    if (this.opacity <= 0 || this.opacity > this.maxOpacity) {
      this.opacitySpeed = -this.opacitySpeed;
      this.opacity += this.opacitySpeed;
    }
    this.draw();
  }

  draw() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);

    this.ctx.fillStyle = "white";
    this.ctx.globalAlpha = this.opacity;
    this.ctx.fill();

    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = this.size;
    this.ctx.globalAlpha = 0.1;
    this.ctx.stroke();

    this.ctx.restore();
  }
}

class Score {
  constructor() {
    this.targetsImg = new Image();
    this.targetsImg.src = "./img/score-targets.png";
    this.deathsImg = new Image();
    this.deathsImg.src = "./img/score-deaths.png";
    this.muteImg = new Image();
    this.muteImg.src = "./img/score-mute.png";
  }

  draw(ctx, targets, deaths, mute) {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.drawImage(this.targetsImg, 10, 10, 30, 30);
    ctx.drawImage(this.deathsImg, 90, 10, 30, 30);
    if (mute) ctx.drawImage(this.muteImg, 960, 10, 30, 30);
    ctx.font = "40px Kenney High Square";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(targets, 50, 17);
    ctx.fillText(deaths, 130, 17);
    ctx.restore();
  }
}

class Transition {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.opacity = 1;
    this.speed = 100;
    this.direction = -1;
    this.isFadingOut = false;
  }

  draw(secondsPassed) {
    this.opacity += (this.speed * this.direction * secondsPassed) / 100;
    if (this.opacity < 0) this.opacity = 0;
    else if (this.opacity > 1) this.opacity = 1;
    if (this.opacity > 0 && this.opacity <= 1) {
      this.ctx.save();
      this.ctx.globalAlpha = this.opacity;
      this.ctx.fillStyle = "#175894";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.restore();
    }
  }
}
