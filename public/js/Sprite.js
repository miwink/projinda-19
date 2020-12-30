class Sprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, frame) {
    super(scene, x, y, key, frame);
    //this.scene = scene;
    //this.world = this.scene.physics.world;
    //this.sys = this.scene.sys;
    var sys = scene.sys;
    var world = scene.physics.world;

    this.map = null;

    sys.displayList.add(this);
    sys.updateList.add(this);
    world.enableBody(this, 0);
    this.body.setSize(16, 16, true);
    //this.body.setCollideWorldBounds(true);
    this.defaultVel = 100;
    this.body.facing = dirs.UP;
    this.direction;
    this.auto = true;
  }

  setMap(map) {
    this.map = map;
  }

  setDefaultVelocity(velocity) {
    this.defaultVel = velocity;
  }

  checkDirections() {
    var tile = this.map.getTileAtWorldXY(this.body.x, this.body.y);
    var dir = [null, null, null, null];
    var dirr = [dirs.DOWN, dirs.UP, dirs.RIGHT, dirs.LEFT];
    dir[0] = this.map.getTileAt(tile.x, tile.y + 1);
    dir[1] = this.map.getTileAt(tile.x, tile.y - 1);
    dir[2] = this.map.getTileAt(tile.x + 1, tile.y);
    dir[3] = this.map.getTileAt(tile.x - 1, tile.y);

    for (var i = 0; i < 4; i++) {
      if (dir[i].index !== 14) {
        dirr[i] = null;
      }
    }
    /*if (numOfWalls !== 3) {
      if (this.body.facing === dirs.DOWN) {
        dirr[0] = null;
      } else if (this.body.facing === dirs.UP) {
        dirr[1] = null;
      } else if (this.body.facing === dirs.LEFT) {
        dirr[2] = null;
      } else if (this.body.facing === dirs.RIGHT) {
        dirr[3] = null;
      }
    }*/

    var possMoves = [];
    for (var i = 0; i < 4; i++) {
      if (dirr[i] !== null) {
        possMoves.push(dirr[i]);
      }
    }

    return possMoves;
  }

  move() {
    const possibleMoves = this.checkDirections();

    if (this.auto) {
      if (possibleMoves.length === 1) {
        this.direction = possibleMoves[0];
      } else {
        do {
          const i = Phaser.Math.Between(0, possibleMoves.length - 1);
          this.direction = possibleMoves[i];
        } while (
          this.direction === this.getOppositeDirection(this.body.facing)
        );
      }
    } else {
      if (possibleMoves.length > 2) {
        //console.log(possibleMoves);
      }
      if (!possibleMoves.includes(this.direction)) {
        return;
      }
    }

    if (this.direction === dirs.UP) {
      this.setVelocityY(-this.defaultVel);
      this.setVelocityX(0);
      if (!this.auto) {
        this.angle = 270;
      }
    } else if (this.direction === dirs.DOWN) {
      this.setVelocityY(this.defaultVel);
      this.setVelocityX(0);
      if (!this.auto) {
        this.angle = 90;
      }
    } else if (this.direction === dirs.LEFT) {
      this.setVelocityY(0);
      this.setVelocityX(-this.defaultVel);
      if (!this.auto) {
        this.angle = 180;
      }
    } else if (this.direction === dirs.RIGHT) {
      this.setVelocityY(0);
      this.setVelocityX(this.defaultVel);
      if (!this.auto) {
        this.angle = 0;
      }
    }
  }

  moveUp() {
    //    this.setVisible(false);
  }

  getOppositeDirection(direction) {
    if (direction === dirs.DOWN) {
      return dirs.UP;
    } else if (direction === dirs.UP) {
      return dirs.DOWN;
    } else if (direction === dirs.LEFT) {
      return dirs.RIGHT;
    } else if (direction === dirs.RIGHT) {
      return dirs.LEFT;
    }
    return null;
  }
}
