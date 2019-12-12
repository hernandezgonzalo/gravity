class Sound {
  constructor(game) {
    this.game = game;
    this.music = new Audio("./audio/music.ogg");
    this.step = new Audio("./audio/step.wav");
    this.action = new Audio("./audio/action.wav");
    this.target = new Audio("./audio/target.wav");
    this.death = new Audio("./audio/death.wav");
    this.mute = false;
  }

  init() {
    this.music.loop = true;
    if (!this.mute && this.game.levelN > 0) this.music.play();
  }

  toggleSound() {
    this.mute = !this.mute;
    if (this.mute) this.music.pause();
    else if (this.game.levelN > 0) this.music.play();
  }

  stepPlay() {
    if (!this.mute) this.step.play();
  }

  actionPlay() {
    if (!this.mute) this.action.play();
  }

  targetPlay() {
    if (!this.mute) this.target.play();
  }

  deathPlay() {
    if (!this.mute) this.death.play();
  }
}
