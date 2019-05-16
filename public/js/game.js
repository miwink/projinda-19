var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: "arcade",
    arcade: {
      //debug: true,
      gravity: { y: 0 }
      //enableBody: {}
    }
  }
};

var cursors;
var score = 0;
var game = new Phaser.Game(config);
this.pacman = null;

function preload() {
  this.load.tilemapTiledJSON("map", "../assets/pacman-map.json");

  this.load.image("pacman-tiles", "../assets/pacman-tiles.png");
  this.load.spritesheet("pacman", "../assets/pacman.png", {
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

  this.pacman = this.physics.add.sprite(225, 280, "pacman", 0);
  this.pacman.body.setSize(16, 16, true);
  this.pacman.body.setCollideWorldBounds(true);
  this.anims.create({
    key: "munch",
    repeat: -1,
    frameRate: 7,
    frames: this.anims.generateFrameNames("pacman", { start: 0, end: 3 })
  });
  this.pacman.play("munch");

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
  /* 
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.map.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
    */
}

function update() {
  // Horizontal movement
  this.physics.overlap(this.pacman, this.dotss, eatDots, null, this);

  if (cursors.left.isDown) {
    this.pacman.body.setVelocityX(-100);
    this.pacman.angle = 180;
  } else if (cursors.right.isDown) {
    this.pacman.body.setVelocityX(100);
    this.pacman.angle = 0;
  }

  // Vertical movement
  else if (cursors.up.isDown) {
    this.pacman.body.setVelocityY(-100);
    this.pacman.angle = 270;
  } else if (cursors.down.isDown) {
    this.pacman.body.setVelocityY(100);
    this.pacman.angle = 90;
  }
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
  console.log(score.toString());
}

function updateScoreBoard() {}
