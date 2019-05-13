//var Phaser = require("phaser");

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.tilemapTiledJSON("map", "../assets/pacman-map.json");
  this.load.image("tiles", "../assets/tiles.png");
  this.load.image("pacman-tiles", "../assets/pacman-tiles.png");
  // this.load.image("pacman", "../assets/pacman.png");
  //this.load.image("dot", "../assets/dot.png");
  this.load.spritesheet("pacman", "../assets/pacman.png", {
    frameWidth: 32,
    frameHeight: 32
  });
}

function create() {
  this.map = this.add.tilemap("map");
  this.tileset = this.map.addTilesetImage("pacman-tiles", "pacman-tiles");
  this.layer = this.map.createDynamicLayer("Pacman", this.tileset);

  const pacman = this.add.sprite(23, 23, "pacman", 0);
  this.anims.create({
    key: "munch",
    repeat: -1,
    frameRate: 7,
    frames: this.anims.generateFrameNames("pacman", { start: 0, end: 3 })
  });
  pacman.play("munch");

  //this.dots = this.add.physicsGroup();
  //this.map.createFromTile(7, this.safetile, "dot", this.layer, this.dot);
}

function update() {}
