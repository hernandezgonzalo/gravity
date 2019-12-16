game.levels.push({
  hero: new Hero(65, 200),
  enemies: [],
  target: [900, 100],
  bricks: [
    [50, 600],
    [75, 600],
    [100, 600],
    [125, 600],

    [200, 325],
    [225, 325],
    [250, 325],
    [275, 325],

    [275, 350],
    [275, 375],
    [275, 400],
    [275, 425],
    [275, 450],

    [275, 600],
    [300, 600],
    [325, 600],
    [350, 600],
    [375, 600],
    [400, 600],

    [425, 225, true],
    [425, 250, true],
    [425, 275],
    [425, 300],
    [425, 325],
    [425, 350],
    [425, 375],
    [425, 400],
    [425, 425],
    [425, 450],

    [450, 450, true],
    [475, 450, true],

    [425, 50],
    [450, 50],
    [475, 50],
    [500, 50],
    [525, 50],
    [550, 50],
    [575, 50, true],
    [600, 50, true],

    [575, 300],
    [600, 300],
    [650, 345],
    [675, 345],
    [725, 390],
    [750, 390],

    [800, 600],
    [825, 600],
    [850, 600],
    [875, 600]
  ]
});

Utilities.loadLevel(game.levels.length); // load next level
