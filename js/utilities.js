class Utilities {
  static getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results === null
      ? 0
      : parseInt(decodeURIComponent(results[1].replace(/\+/g, " ")));
  }

  // asynchronously load the JavaScript files that contains the levels
  static loadLevel(level) {
    let ref = document.getElementsByTagName("script")[0];
    let script = document.createElement("script");
    script.setAttribute("id", `level${level}`);
    script.src = `./js/levels/${level}.js`;
    ref.parentNode.insertBefore(script, ref);
    let insertedScript = document.getElementById(`level${level}`);
    insertedScript.parentNode.removeChild(insertedScript);
  }
}
