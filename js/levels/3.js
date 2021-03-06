game.levels.push({
  hero: new Hero(275, 250),
  enemies: [new Enemy(650, 250)],
  target: [720, 405],
  bricks: [
    [225, 200],
    [250, 200],
    [275, 200],
    [300, 200],
    [325, 200],
    [350, 200],
    [375, 200],
    [400, 200],
    [425, 200],
    [450, 200],
    [475, 200],
    [500, 200],
    [525, 200],
    [550, 200],
    [575, 200],

    [675, 200],
    [700, 200],
    [725, 200],
    [750, 200],

    [225, 450],
    [250, 450],
    [275, 450],
    [300, 450],
    [325, 450],
    [350, 450],
    [375, 450],
    [400, 450],
    [425, 450],

    [525, 450],
    [550, 450],
    [575, 450],
    [600, 450],
    [625, 450],
    [650, 450],
    [675, 450],
    [700, 450],
    [725, 450],
    [750, 450]
  ]
});

Utilities.loadLevel(game.levels.length); // load next level
