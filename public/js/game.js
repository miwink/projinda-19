//var Phaser = require("phaser");

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
        default: 'arcade',
        arcade: {
            gravity: { y: 0},
            enableBody: {}
        }
    }

};

var cursors;
var game = new Phaser.Game(config);

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

    pacman = this.add.sprite(23, 23, "pacman", 0).setOrigin(0.5);

    var config = {
        key: 'dot',
        x: 1,
        y: 1
    }; 

    this.dots = this.map.createFromTiles(7, 14, config);

    this.map.setCollisionByExclusion([14], true, false, this.layer);
    //this.map.setCollisionBetween(0,13);

    this.anims.create({
        key: "munch",
        repeat: -1,
        frameRate: 7,
        frames: this.anims.generateFrameNames("pacman", { start: 0, end: 3 })
    });
    pacman.play("munch");

    cursors = this.input.keyboard.createCursorKeys();

  //this.dots = this.add.physicsGroup();
  //this.map.createFromTile(7, this.safetile, "dot", this.layer, this.dot);
    this.physics.add.collider(pacman, this.layer);

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.map.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
}

function update() {
    if (cursors.up.isDown) {
        pacman.y--;
        pacman.angle = 270;
    }
    if (cursors.down.isDown) {
        pacman.y++;
        pacman.angle = 90;
    }
    if (cursors.left.isDown) {
        pacman.x--;
        pacman.angle = 180;
    }
    if (cursors.right.isDown) {
        pacman.x++;
        pacman.angle = 0;
    }
}
