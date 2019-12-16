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

  static loadImages(callback, index = 0) {
    let imagesRoute = "./img/";
    let imagesName = [
      "bg-back.png",
      "bg-mid.png",
      "bg-front.png",
      "cloud.png",
      "explosive.png",
      "hero-sprites.png",
      "score-deaths.png",
      "score-targets.png",
      "brick.png",
      "enemy-sprites.png",
      "logo.svg",
      "score-mute.png",
      "target.png"
    ];

    let image = new Image();
    image.onload = () => {
      console.log(`Image ${index} ${imagesName[index]} loaded`);
      if (++index < imagesName.length) this.loadImages(callback, index);
      else callback();
    };
    image.src = imagesRoute + imagesName[index];

    return;
  }
}
