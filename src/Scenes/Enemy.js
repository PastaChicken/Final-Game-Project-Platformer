

class Crow extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.anims.play('bird_idle');
       // this.body.allowGravity(false);
       //        this.physics.add.collider(my.sprite.player.getPlayer(), this.platformLayer);

       scene.physics.add.collider(this, scene.platformLayer);
       scene.physics.world.enableBody(this);
       this.body.setSize(16, 16);
       this.x = x;
       this.y = y;
       this.setOffset(55, 65);
//        this.player.body.setOffset(20, 45);

    }

    preUpdate(time, delta) {
        //have it do the scenes update then our own?
        super.preUpdate(time, delta);
        


    }
}

//class Player extends Phaser.Physics.Arcade.Sprite