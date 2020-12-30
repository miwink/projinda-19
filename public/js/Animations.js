function loadAnims(anims) {
  anims.create({
    key: "munch",
    repeat: -1,
    frameRate: 7,
    frames: anims.generateFrameNames("pacman", { start: 0, end: 3 })
  });

  anims.create({
    key: "ghostyblue",
    repeat: -1,
    frameRate: 2,
    frames: anims.generateFrameNames("ghosts", { start: 0, end: 3 })
  });

  anims.create({
    key: "ghostyellow",
    repeat: -1,
    frameRate: 2,
    frames: anims.generateFrameNames("ghosts", { start: 4, end: 7 })
  });

  anims.create({
    key: "ghostpink",
    repeat: -1,
    frameRate: 2,
    frames: anims.generateFrameNames("ghosts", { start: 8, end: 11 })
  });

  anims.create({
    key: "ghostred",
    repeat: -1,
    frameRate: 2,
    frames: anims.generateFrameNames("ghosts", { start: 12, end: 15 })
  });
}
