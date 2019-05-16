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
    //  debug: true,
      gravity: { y: 0 }
    }
  }
};

var cursors;
var game = new Phaser.Game(config);
this.pacman = null;
const dirs = {
    UP: 12,
    DOWN: 11,
    LEFT: 13,
    RIGHT: 14
}
var chosenDir = null;

function preload() {
  this.load.tilemapTiledJSON("map", "../assets/pacman-map.json");

  this.load.image("pacman-tiles", "../assets/pacman-tiles.png");
  this.load.spritesheet("pacman", "../assets/pacman.png", {
    frameWidth: 32,
    frameHeight: 32
  });
  this.load.spritesheet("ghosts", "../assets/ghosts32.png", {
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

  //Adding ghost sprites

  this.ghost1 = this.physics.add.sprite(24, 40, "ghosts", 0);
  this.ghost2 = this.physics.add.sprite(216, 232, "ghosts", 0);
  this.ghost3 = this.physics.add.sprite(216, 232, "ghosts", 0);
  this.ghost4 = this.physics.add.sprite(216, 232, "ghosts", 0);

  //Animate ghosts
  this.anims.create({
    key: "ghostyblue",
    repeat: -1,
    frameRate: 3,
    frames: this.anims.generateFrameNames("ghosts", { start: 0, end: 3 })
  });
  this.ghost1.play("ghostyblue");
    
  this.anims.create({
    key: "ghostyellow",
    repeat: -1,
    frameRate: 2,
    frames: this.anims.generateFrameNames("ghosts", { start: 4, end: 7 })
  });
  this.ghost2.play("ghostyellow");

  this.anims.create({
    key: "ghostpink",
    repeat: -1,
    frameRate: 5,
    frames: this.anims.generateFrameNames("ghosts", { start: 8, end: 11 })
  });
  this.ghost3.play("ghostpink");

  this.anims.create({
    key: "ghostred",
    repeat: -1,
    frameRate: 3,
    frames: this.anims.generateFrameNames("ghosts", { start: 12, end: 15 })
  });
  this.ghost4.play("ghostred");

  this.ghosts = this.physics.add.group([this.ghost1, this.ghost2, this.ghost3, this.ghost4]);
  this.ghosts.children.iterate(function(ghost){
    ghost.body.setSize(16,16,true);
  });
  //Collision detection for ghosts
  this.physics.add.collider(this.ghosts, this.layer);

  var configDot = {
    key: "dot"
  };

  this.dots = this.map.createFromTiles(7, 14, configDot);
  for (var i = 0; i < this.dots.length; i++) {
    this.dots[i].x += 8;
    this.dots[i].y += 8;
  }

  this.map.setCollisionByExclusion([14], true, false, this.layer);

  this.anims.create({
    key: "munch",
    repeat: -1,
    frameRate: 7,
    frames: this.anims.generateFrameNames("pacman", { start: 0, end: 3 })
  });
  this.pacman.play("munch");

  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(this.pacman, this.layer);
  this.pacman.body.setSize(16, 16, true);
  this.pacman.body.setCollideWorldBounds(true);
}

function update() {
  // Horizontal movement
  this.physics.overlap(this.pacman, this.ghosts, killPacman, null, this);
    this.ghosts.children.iterate(function(ghost) {
        if(Math.round(ghost.body.x) % 16 === 0 && (Math.round(ghost.body.y) % 16 === 0)){
            var ghostDir = checkDirection(ghost, this.map);
            moveGhost(ghost, ghostDir);
        }
    }, this);

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

function moveGhost(ghost, dir){
    ghost.body.x = Math.round(ghost.body.x);
    ghost.body.y = Math.round(ghost.body.y);
    ghost.x = Math.round(ghost.x);
    ghost.y = Math.round(ghost.y);
    var possMoves = [];
    chosenDir = null;
    for(var i = 0; i < 4; i++){
        if(dir[i] !== null){
            possMoves.push(dir[i]);
        }
    }

    if(possMoves.length === 1){
        chosenDir = possMoves[0];
    } else {
        var i = Phaser.Math.Between(0, possMoves.length - 1);
        chosenDir = possMoves[i];
    }
    
    if(chosenDir === dirs.UP){
        ghost.setVelocityY(-100);
        ghost.setVelocityX(0);
    } else if(chosenDir === dirs.DOWN){
        ghost.setVelocityY(100);
        ghost.setVelocityX(0);
    } else if(chosenDir === dirs.LEFT){
        ghost.setVelocityY(0);
        ghost.setVelocityX(-100);
    } else if(chosenDir === dirs.RIGHT){
        ghost.setVelocityY(0);
        ghost.setVelocityX(100);
    }
}

function checkDirection(sprite, map){
    var tile = map.getTileAtWorldXY(sprite.x, sprite.y, this.layer);
    var dir = [null, null, null, null];
    var dirr = [dirs.DOWN, dirs.UP, dirs.RIGHT, dirs.LEFT];
    dir[0] = map.getTileAt(tile.x, tile.y + 1, this.layer);
    dir[1] = map.getTileAt(tile.x, tile.y - 1, this.layer);
    dir[2] = map.getTileAt(tile.x + 1, tile.y, this.layer);
    dir[3] = map.getTileAt(tile.x - 1, tile.y, this.layer);
    
    var numOfWalls = 0;
    for(var i = 0; i < 4; i++){
        if(dir[i].index !== 14){
            dir[i] = null;
            dirr[i] = null;
            numOfWalls++;
        }
    }
    if(numOfWalls !== 3){
        if(dir[0] !== null && sprite.body.facing === dirs.DOWN){
            dir[0] = null;
            dirr[0] = null;
        } else if(dir[1] !== null && sprite.body.facing === dirs.UP){
            dir[1] = null;
            dirr[1] = null;
        } else if(dir[2] !== null && sprite.body.facing === dirs.LEFT) {
            dir[2] = null;
            dirr[2] = null;
        } else if(dir[3] !== null && sprite.body.facing === dirs.RIGHT){
            dir[3] = null;
            dirr[3] = null;
        }
    }
    return dirr;
}

function killPacman(pacman, ghost){
   console.log("DEAD"); 
   pacman.visible = false;
}
