class Physics {
  rotation(ctx, character) {
    let rotate = degrees => {
      let xTranslate = character.x + character.w / 2;
      let yTranslate = character.y + character.h / 2;
      ctx.translate(xTranslate, yTranslate);
      ctx.rotate((Math.PI / 180) * degrees);
      ctx.translate(-xTranslate, -yTranslate);
    };

    // rotate when gravity changes
    if (character.isRotating) {
      if (character.gravitySpeed > -5 && character.gravitySpeed < 0) {
        let degrees = (character.gravitySpeed + 1) * 45;
        if (character.isLookingLeft) degrees = -degrees;
        rotate(degrees);
      } else if (character.gravitySpeed < 5 && character.gravitySpeed > 0) {
        let degrees = (character.gravitySpeed - 1) * 45 - 180;
        if (!character.isLookingLeft) degrees = -degrees;
        rotate(degrees);
      } else if (character.gravitySpeed < 0) {
        rotate(-180);
        character.isRotating = false;
      } else {
        rotate(0);
        character.isRotating = false;
      }
    } else if (character.gravitySpeed < 0) {
      rotate(180); // when the character is upside down
    }
  }

  gravity(character, gravityForce, secondsPassed) {
    // acceleration effect when it starts to fly
    if (character.gravitySpeed > -10 && character.gravitySpeed < 10) {
      character.gravitySpeed *= 1.1;
    } else if (character.gravitySpeed < -10) {
      character.gravitySpeed = -10;
    } else if (character.gravitySpeed > 10) {
      character.gravitySpeed = 10;
    }

    character.y += character.gravitySpeed * secondsPassed * gravityForce;

    // when the character falls down from a platform
    if (character.gravitySpeed > 1 || character.gravitySpeed < -1)
      character.isFlying = true;
  }

  collision(game, character) {
    let canvas = game.canvas;
    let hero = game.hero;
    let level = game.level;
    let sound = game.sound;
    let sideCollision = false; // for enemies
    let fallDown = true; // for enemies
    let explosiveBrick = false; // for hero

    level.bricks.forEach(brick => {
      if (
        character.y <= brick[1] &&
        character.y + character.h >= brick[1] + level.brickSize
      ) {
        // check if the character is colliding with the right side of a brick
        if (
          character.x < brick[0] + level.brickSize &&
          character.x > brick[0]
        ) {
          let maxRebound = brick[0] + level.brickSize + 1;
          if (character.x + 5 <= maxRebound) character.x = character.x + 5;
          else character.x = maxRebound;
          sideCollision = true;
          if (brick[2]) explosiveBrick = true;
        }
        // check if the character is colliding with the left side of a brick
        else if (
          character.x + character.w >= brick[0] &&
          character.x < brick[0] + level.brickSize
        ) {
          let maxRebound = brick[0] - character.w - 1;
          if (character.x - 5 >= maxRebound) character.x = character.x - 5;
          else character.x = maxRebound;
          sideCollision = true;
          if (brick[2]) explosiveBrick = true;
        }
      }

      if (
        (character.x + character.margin >= brick[0] &&
          character.x + character.margin <= brick[0] + level.brickSize) ||
        (character.x + character.w - character.margin >= brick[0] &&
          character.x + character.w - character.margin <=
            brick[0] + level.brickSize)
      ) {
        // check if the character is colliding with the top of a brick
        if (
          character.y + character.h >= brick[1] &&
          character.y + character.h < brick[1] + level.brickSize &&
          character.gravitySpeed > 0
        ) {
          character.y = brick[1] - character.h;
          character.isFlying = false;
          character.gravitySpeed = 1;
          if (brick[2]) explosiveBrick = true;
        }
        // check if the character is colliding with the bottom of a brick
        if (
          character.y <= brick[1] + level.brickSize &&
          character.y > brick[1] &&
          character.gravitySpeed < 0
        ) {
          character.y = brick[1] + level.brickSize;
          character.isFlying = false;
          character.gravitySpeed = -1;
          if (brick[2]) explosiveBrick = true;
        }
      }

      // check if the enemy is going to fall and avoid it
      if (
        (character.speed < 0 &&
          character.x + character.margin >= brick[0] &&
          character.x + character.margin - level.brickSize <=
            brick[0] + level.brickSize) ||
        (character.speed > 0 &&
          character.x + character.w - character.margin + level.brickSize >=
            brick[0] &&
          character.x + character.w - character.margin <=
            brick[0] + level.brickSize)
      ) {
        if (
          (character.gravitySpeed > 0 &&
            character.y + character.h >= brick[1] &&
            character.y + character.h < brick[1] + level.brickSize) ||
          (character.gravitySpeed < 0 &&
            character.y <= brick[1] + level.brickSize &&
            character.y > brick[1])
        )
          fallDown = false;
      }
    });

    if (character.y + character.h < 0 || character.y > canvas.height) {
      if (character instanceof Hero && hero.alive && !level.levelFinished)
        sound.deathPlay();
      character.alive = false;
    }
    if (
      character instanceof Hero &&
      character.alive &&
      explosiveBrick &&
      !level.levelFinished
    ) {
      sound.deathPlay();
      character.alive = false;
    }
    if (character instanceof Enemy) return sideCollision || fallDown;
  }

  enemyCollision(game) {
    let hero = game.hero;
    let enemies = game.enemies;
    let level = game.level;
    let sound = game.sound;
    let m = hero.margin / 2; //character collision margin

    if (
      enemies.some(
        enemy =>
          hero.x + hero.w - m > enemy.x + m &&
          enemy.x + enemy.w - m > hero.x + m &&
          hero.y + hero.h - m > enemy.y + m &&
          enemy.y + enemy.h - m > hero.y + m
      )
    ) {
      if (hero.alive && !level.levelFinished) sound.deathPlay();
      hero.alive = false;
    }
  }
}
