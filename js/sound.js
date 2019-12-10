class Sound {
  constructor() {
    this.music = new Audio("./audio/music.ogg");
    this.step = new Audio("./audio/step.wav");
    this.action = new Audio("./audio/action.wav");
    this.target = new Audio("./audio/target.wav");
    this.death = new Audio("./audio/death.wav");
  }

  init() {
    this.music.loop = true;
    this.music.play();
  }

  step() {
    this.step.play();
  }

  action() {
    this.action.play();
  }

  target() {
    this.target.play();
  }

  death() {
    this.death.play();
  }
}
