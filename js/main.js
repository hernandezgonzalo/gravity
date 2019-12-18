Utilities.loadLevel(0);

if (!!window.chrome) Utilities.loadImages(startGame);
else startGame();

function startGame() {
  window.onload = function() {
    game.init();
  };
}
