# Gravity

Gravity is a platform game developed with pure JavaScript as a project for Ironhack. You can play [here](https://hernandezgonzalo.github.io/gravity/). And you better use Chrome 🤪

## Goal

Our friendly hero has to catch all the stars, going from one platform to another overcoming obstacles by changing gravity.

## Enemies and obstacles

You will find several hazards in your way. Of course, avoiding falling off the platforms will be the main challenge you face. But be careful with the yellow bricks. It is better not to touch them. Finally, although they are not too smart, the enemies will try to prevent you from reaching your goal. Remember that if you change gravity it also affects them. You can not kill them, but you can make them disappear outside the screen limits.

## Controls

You can control our hero with the **arrow keys**. Also, you can use the **Z key** to change gravity regardless of whether the character is on the floor or on the ceiling. And if you need to turn off the music, just press the **M key**.

## Features

- **Images preloader** that shows the real percentage of images loaded before the game starts.
- **Parallax background** (the mountains move horizontally and vertically according to the position of the hero, at different speeds to simulate depth).
- **Clouds** are generated with a random size and speed.
- **Background circles** are generated with a random size, speed and opacity, and are affected by gravity changes in every moment.
- **Scoreboard** showing the number of stars caught and times you have died.

## Levels

Levels are separated into individual JS files that are asynchronously loaded. This kind of file contains and object with all the information needed for that level: a hero object, enemies objects (if any), target and bricks positions. If you wish to create a new level, just write a new JS file with the following syntax.

```javascript
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
    [375, 200, true],
    [400, 200, true],
    [425, 200, true],
    [450, 200],
    [475, 200],
    [500, 200],
    [525, 200],
    [550, 200],
    [575, 200]
  ]
});
```

In order to allocate the position of a brick, keep in mind that its size is 25 pixels, and the screen dimensions are 1000 x 667 pixels. To put a yellow brick, the third value of the array must be "true".

Enjoy! 👾

![Gravity game showcase](https://user-images.githubusercontent.com/54455748/71007489-60b17c00-20e7-11ea-9f73-0fbe2f7100c9.gif)
