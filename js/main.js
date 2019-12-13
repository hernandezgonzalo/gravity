window.onload = function() {
  game.init();
};

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null
    ? 0
    : parseInt(decodeURIComponent(results[1].replace(/\+/g, " ")));
}
