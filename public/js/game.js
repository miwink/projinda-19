var config = {
  type: Phaser.AUTO,
  //width: 800,
  //height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: "arcade",
    arcade: {
      //debug: true,
      gravity: { y: 0 },
      enableBody: {}
    }
  },
  scale: {
    width: "100%",
    height: "100%"
  }
};

var cursors;
var score = 0;
var game = new Phaser.Game(config);
const dirs = {
  UP: 11,
  DOWN: 12,
  LEFT: 13,
  RIGHT: 14
};
var chosenDir = null;

function preload() {
  this.load.tilemapTiledJSON("map", "../assets/pacman-map.json");

  this.load.image("pacman-tiles", "../assets/pacman-tiles.png");
  this.load.spritesheet("pacman", "../assets/pacman.png", {
    frameWidth: 32,
    frameHeight: 32
  });
  this.load.spritesheet("ghosts", "../assets/ghosts.png", {
    frameWidth: 32,
    frameHeight: 32
  });
  this.load.image("dot", "../assets/dot.png");
}

function create() {
  scoreText = this.add.text(550, 210, "score: 0", {
    fontSize: "32px",
    fill: "#ffffff"
  });
  this.map = this.add.tilemap("map");
  this.tileset = this.map.addTilesetImage("pacman-tiles", "pacman-tiles");
  this.layer = this.map.createDynamicLayer("Pacman", this.tileset);

  loadAnims(this.anims);
  this.pacman = new Sprite(this.scene.scene, 232, 280, "pacman");
  this.pacman.setMap(this.map);
  this.pacman.auto = false;
  this.pacman.play("munch");

  //Adding ghost sprites
  var ghostAnims = ["ghostyblue", "ghostyellow", "ghostpink", "ghostred"];
  var groupConfig = {
    classType: Sprite,
    setXY: {
      x: 216,
      y: 232
    },
    key: "ghosts",
    repeat: 3
  };
  this.ghosts = this.physics.add.group(groupConfig);
  var i = 0;
  this.ghosts.children.iterate(function(ghost) {
    ghost.play(ghostAnims[i]);
    i++;
    ghost.setMap(this.map);
  }, this);
  //Collision detection for ghosts
  this.physics.add.collider(this.ghosts, this.layer);

  var configDot = {
    key: "dot"
  };
  this.dots = this.map.createFromTiles(7, 14, configDot);
  for (var i = 0; i < this.dots.length; i++) {
    this.dots[i].x += 8;
    this.dots[i].y += 8;
    this.physics.add.existing(this.dots[i], false);
  }
  this.dotss = this.physics.add.group(this.dots);

  this.map.setCollisionByExclusion([14], true, false, this.layer);

  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(this.pacman, this.layer);

  const debugGraphics = this.add.graphics().setAlpha(0.75);

  this.map.renderDebug(debugGraphics, {
    tileColor: null, // Color of non-colliding tiles
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
  });
  //this.map.setCollision([1], true, true, this.layer, true);
}

function update() {
  //this.pacman.body.x = Math.round(this.pacman.body.x);
  //this.pacman.body.y = Math.round(this.pacman.body.y);

  this.physics.overlap(this.pacman, this.ghosts, killPacman, null, this);
  this.ghosts.children.iterate(function(ghost) {
    if (
      Math.round(ghost.body.x) % 16 <= 1 &&
      Math.round(ghost.body.y) % 16 <= 1
    ) {
      ghost.body.x = Math.round(ghost.body.x / 16) * 16;
      ghost.body.y = Math.round(ghost.body.y / 16) * 16;
      //var ghostDir = ghost.checkDirections();//checkDirection(ghost, this.map);
      //moveGhost(ghost, ghostDir);
      ghost.move();
    }
  }, this);

  this.physics.overlap(this.pacman, this.dotss, eatDots, null, this);

  const oldDirection = this.pacman.direction;
  // Horizontal movement
  if (cursors.left.isDown) {
    this.pacman.direction = dirs.LEFT;
  } else if (cursors.right.isDown) {
    this.pacman.direction = dirs.RIGHT;
  } else if (cursors.up.isDown) {
    this.pacman.direction = dirs.UP;
  } else if (cursors.down.isDown) {
    this.pacman.direction = dirs.DOWN;
  }

  if (this.input.keyboard.checkDown(cursors.up, 1000)) {
    console.log("Hello");
  }

  if (
    this.pacman.direction === this.pacman.getOppositeDirection(oldDirection)
  ) {
    this.pacman.move();
  } else if (
    Math.round(this.pacman.body.x) % 16 <= 1 &&
    Math.round(this.pacman.body.y) % 16 <= 1
  ) {
    this.pacman.body.x = Math.round(this.pacman.body.x / 16) * 16;
    this.pacman.body.y = Math.round(this.pacman.body.y / 16) * 16;
    this.pacman.move();
  }
}

function killPacman(pacman, ghost) {
  console.log("DEAD");
  pacman.visible = false;
}

function eatDots(pacman, dot) {
  if (dot.active) {
    score += 10;
    scoreText.setText("Score: " + score);
  }
  dot.body.setEnable(false);
  this.dotss.killAndHide(dot);
  if (this.dotss.countActive() === 0) {
    this.dotss.children.iterate(function(child) {
      child.setActive(true);
      child.setVisible(true);
      child.body.setEnable(true);
    });
  }
  //console.log(score.toString());
}
