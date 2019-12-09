class Sound {
  constructor() {
    this.music = new Audio("./audio/music.ogg");
    this.action = new Audio("./audio/action.wav");
  }

  init() {
    this.music.loop = true;
    this.music.play();
  }
}
