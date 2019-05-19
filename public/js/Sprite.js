class Sprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key, frame){
        console.log(scene.constructor.name);
        var sprite = super(scene, x, y, key, frame);
        this.scene = scene;
        this.world = this.scene.physics.world;
        this.sys = this.scene.sys;

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);
        this.world.enableBody(sprite, 0);
        sprite.body.setSize(16, 16, true);
        //sprite.body.setCollideWorldBounds(true);
        //return sprite;
    }
}
