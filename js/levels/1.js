game.levels.push({
  hero: new Hero(170, 200),
  enemies: [],
  target: [855, 497],
  bricks: [
    [250, 100],
    [275, 100],
    [300, 100],
    [325, 100],
    [350, 100],
    [375, 100],
    [400, 100],
    [425, 100],

    [550, 100],
    [575, 100],
    [600, 100],
    [625, 100],
    [650, 100],
    [675, 100],
    [700, 100],
    [725, 100],

    [100, 542],
    [125, 542],
    [150, 542],
    [175, 542],
    [200, 542],
    [225, 542],
    [250, 542],
    [275, 542],

    [400, 542],
    [425, 542],
    [450, 542],
    [475, 542],
    [500, 542],
    [525, 542],
    [550, 542],
    [575, 542],

    [700, 542],
    [725, 542],
    [750, 542],
    [775, 542],
    [800, 542],
    [825, 542],
    [850, 542],
    [875, 542]
  ]
});

Utilities.loadLevel(game.levels.length); // load next level
