Utilities.loadLevel(0);

if (!!window.chrome && navigator.platform != "Win32")
  Utilities.loadImages(startGame);
else startGame();

function startGame() {
  window.onload = function() {
    game.init();
  };
}
