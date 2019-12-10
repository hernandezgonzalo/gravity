class Intro {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.image = new Image();
    this.image.src = "./img/logo.svg";
    this.imageWidth = 500;
    this.imageHeight = 117;
    this.maxSpeed = 100;
  }

  reset() {
    this.speed = 10;
    this.bound = 10;
    this.y = -130;
    this.textOpacity = 0;
    this.textShow = false;
  }

  run(secondsPassed) {
    this.drawLogo(secondsPassed);
    if (this.bound < 0) this.textShow = true;
    if (this.textShow) this.drawText();
  }

  drawLogo(secondsPassed) {
    if (this.y > 135) this.bound = -2;
    if (this.y < 135) this.bound = 2;
    this.speed += this.bound;
    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;
    this.y += this.speed * secondsPassed;

    this.ctx.save();
    let xTranslate = this.canvas.width / 2;
    let yTranslate = this.y + this.imageHeight / 2;
    this.ctx.translate(xTranslate, yTranslate);
    this.ctx.rotate((Math.PI / 180) * (this.speed / 25));
    this.ctx.translate(-xTranslate, -yTranslate);
    this.ctx.drawImage(
      this.image,
      250,
      this.y,
      this.imageWidth,
      this.imageHeight
    );
    this.ctx.restore();
  }

  drawText() {
    this.ctx.save();
    this.ctx.globalAlpha =
      this.textOpacity < 100 ? ++this.textOpacity / 100 : 1;
    this.ctx.font = "18.5px Kenney Future";
    this.ctx.fillStyle = "#2A88DE";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "bottom";
    this.ctx.fillText(
      "A project for Ironhack by Gonzalo Hernández",
      this.canvas.width / 2,
      360
    );
    this.ctx.restore();
  }
}
