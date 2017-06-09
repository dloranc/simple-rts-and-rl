import Unit from './Unit.js'

export default class UnitManager {
  constructor (game) {
    this.units = [];
    this.sprites = game.add.group();
  }

  add (unit) {
    if (unit instanceof Unit) {
      this.units.push(unit);
    }
  }

  preload () {
    for (let unit of this.units) {
      game.load.image(unit.getName, 'assets/sprites/' + unit.getName + '.png');
    }

    game.load.image('healthbar', 'assets/sprites/health_bar.png');
  }

  create () {
    for (let unit of this.units) {
      let sprite = this.sprites.create(unit.position.x, unit.position.y, unit.getName);
      sprite.pivot.x = sprite.width * .5;
      sprite.pivot.y = sprite.height * .5;

      unit.sprite = sprite;

      let healthBar = game.make.sprite(0, -10, 'healthbar');
      healthBar.width = sprite.width;
      unit.sprite.addChild(healthBar);

      unit.healthBar = healthBar;
    }

    game.physics.arcade.enable(this.sprites);

    this.sprites.setAll('body.collideWorldBounds', true);
    this.sprites.setAll('body.bounce.x', 0);
    this.sprites.setAll('body.bounce.y', 0);
    this.sprites.setAll('body.minBounceVelocity', 0);

    for (let unit of this.units) {
      unit.sprite.body.setCircle(unit.sprite.width / 2);
    }
  }

  get getUnits () {
    return this.units;
  }

  get getEnemyUnits () {
    let units = [];

    for (let unit of this.units) {
      if (!unit.isPlayer) {
        units.push(unit);
      }
    }

    return units;
  }

  get getPlayerUnits () {
    let units = [];

    for (let unit of this.units) {
      if (unit.isPlayer) {
        units.push(unit);
      }
    }

    return units;
  }

  get getSprites () {
    let sprites = [];

    for (let unit of this.units) {
      sprites.push(unit.sprite);
    }

    return sprites;
  }

  updateHealthBars () {
    for (let unit of this.units) {
      const lifePercentage = unit.life / unit.maxLife;
      unit.healthBar.width = unit.sprite.width * lifePercentage;
    }
  }

  moveEnemyUnits () {
    let playerUnits = this.getPlayerUnits;
    let enemyUnits = this.getEnemyUnits;

    let distanceToNearest = Number.MAX_SAFE_INTEGER;
    let indexNearest = 0;
    let index = 0;

    for (let unit of playerUnits) {
      let distance = game.physics.arcade.distanceToXY(unit.sprite, enemyUnits[0].sprite.x, enemyUnits[0].sprite.y);

      if (distance < distanceToNearest) {
        distanceToNearest = distance;
        indexNearest = index;
      }

      index++;
    }

    for (let enemyUnit of enemyUnits) {
      const distance = game.physics.arcade.distanceToXY(enemyUnit.sprite, playerUnits[indexNearest].sprite.x, playerUnits[indexNearest].sprite.y);
      const maxDistance = (playerUnits[indexNearest].sprite.width / 2 + enemyUnit.sprite.width / 2) + 6

      if (distance > maxDistance) {
        game.physics.arcade.moveToXY(enemyUnit.sprite, playerUnits[indexNearest].sprite.x, playerUnits[indexNearest].sprite.y, enemyUnit.speed);
      } else {
        enemyUnit.sprite.body.velocity.x = 0;
        enemyUnit.sprite.body.velocity.y = 0;
      }
    }
  }
}
