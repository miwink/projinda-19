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
  //this.load.image("dot", "../assets/dot.png");
  //this.load.spritesheet("pacman", "../assets/pacman.png");
}

function create() {
  this.map = this.add.tilemap("map");
  this.tileset = this.map.addTilesetImage("pacman-tiles", "pacman-tiles");
  this.layer = this.map.createDynamicLayer("Pacman", this.tileset);
  //this.dots = this.add.physicsGroup();
  //this.map.createFromTile(7, this.safetile, "dot", this.layer, this.dot);
}

function update() {}
