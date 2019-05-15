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
  this.map = this.add.tilemap("map");
  this.tileset = this.map.addTilesetImage("pacman-tiles", "pacman-tiles");
  this.layer = this.map.createDynamicLayer("Pacman", this.tileset);

  this.pacman = this.physics.add.sprite(225, 280, "pacman", 0); //.setOrigin(0.5);

  var configDot = {
    key: "dot",
    x: 0.5,
    y: 0.5
  };

  this.dots = this.map.createFromTiles(7, 14, configDot);

  this.map.setCollisionByExclusion([14], true, false, this.layer);
  //this.map.setCollisionBetween(0,13);

  this.anims.create({
    key: "munch",
    repeat: -1,
    frameRate: 7,
    frames: this.anims.generateFrameNames("pacman", { start: 0, end: 3 })
  });
  this.pacman.play("munch");

  cursors = this.input.keyboard.createCursorKeys();

  //this.dots = this.add.physicsGroup();
  this.physics.add.collider(this.pacman, this.layer);
  //this.pacman.body.setEnable();
  this.pacman.body.setSize(16, 16, true);
  this.pacman.body.setCollideWorldBounds(true);

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
  } else {
  }
}
