class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, frame, cursors, particles, jumpParticles) {
        super(scene, x, y, texture, frame);
       
        this.ACCELERATION = 250;
        this.DECELERATION = 1000; //used for quick turn around when pressing opposite movement key
        this.DRAG = 3000;
        this.JUMP_VELOCITY = -450;
        this.MAX_SPEED = 600;
        this.x = x;
        this.y = y;
        this.SCALE = .8;

        this.player = scene.physics.add.sprite(x, y, texture, frame);
        this.player.setScale(this.SCALE);
        this.cursors = cursors;
        this.doubleJump = true;
        this.particles = particles;
        this.jumpParticles = jumpParticles;
        this.PARTICLE_VELOCITY = 50;
        this.keyC = scene.input.keyboard.addKey("C");
        this.swordSwing = scene.physics.add.sprite(x, y, 'slice-particles', 'File0001.png').setVisible(false);
        this.swordSwing.body.allowGravity = false; 
        this.swordSwing.body.setEnable(false);
        this.swordSwing.setScale(.3);
        this.player.setSize(32,20);
        this.player.body.setOffset(20, 45);
        this.swordSwing.setSize(512,128);
        this.boolSwing = false;
        this.activeHitbox;
        this.inactiveHitbox;
        this.clickSound = scene.sound.add('sliceSFX', {volume: 0.3});
        this.respawnDelay;
        this.respawnSound = scene.sound.add('fallSFX', {volume: 0.2});



        scene.add.existing(this);

        return this;
    }

    getPlayer() {
        return this.player;
    }
    getSwordSprite() {
        return this.swordSwing;
    }

    update() {

        //player movement left
        if(cursors.left.isDown && !this.boolSwing) {
            this.player.setFlip(true, false);

            this.swordSwing.setFlip(true, false);

            this.player.anims.play('player_run', true);
            if(this.player.body.velocity.x > 0) {
                this.player.body.setAccelerationX(-(this.ACCELERATION + this.DECELERATION));
            } else {
                this.player.body.setAccelerationX(-this.ACCELERATION);

                if(this.player.body.velocity.x < -this.MAX_SPEED) {
                    this.player.body.velocity.x = -this.MAX_SPEED;

                }

            }
            
            //juice stuff
            this.player.setAngle(-5);
            this.particles.startFollow(this.player, this.player.displayWidth/2 - 20, this.player.displayHeight/2 - 10, false);

            this.particles.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (this.player.body.blocked.down) {

                this.particles.start();

            }

        } 
        //player movement right
        else if(cursors.right.isDown && !this.boolSwing) {

            this.player.resetFlip();
            this.swordSwing.resetFlip();

            this.player.anims.play('player_run', true);

            if(this.player.body.velocity.x < 0) {
                this.player.body.setAccelerationX((this.ACCELERATION + this.DECELERATION));
            } else {
                this.player.body.setAccelerationX(this.ACCELERATION);

                if(this.player.body.velocity.x > this.MAX_SPEED) {
                    this.player.body.velocity.x = this.MAX_SPEED;
                }

            }
            
            //juice stuff
            this.player.setAngle(5);
            this.particles.startFollow(this.player, this.player.displayWidth/2-45, this.player.displayHeight/2 - 10, false);

            this.particles.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (this.player.body.blocked.down) {

                this.particles.start();

            }

        } 

        //idle
        else {

            this.player.body.setAccelerationX(0);
            this.player.body.setDragX(this.DRAG);

            this.swordSwing.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
                this.resetAnimation();
            }, this);
            
            if(this.boolSwing) { //allow player to move again

            this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
                this.playIdle();
            }, this);
        }
         else {
            this.player.anims.play('player_idle', true);
         }
            //juice stuff
            
            this.particles.stop();

            this.player.setAngle(0);
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        
        if(!this.player.body.blocked.down) {
            //this.player.anims.play('jump');
            this.player.setScale(this.SCALE);
            this.particles.stop();

        }

        if(this.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up) && !this.boolSwing) {
            this.jumpParticles.emitParticleAt(this.player.x , this.player.y + 20);
            this.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.doubleJump = true;
            this.player.setScale(this.SCALE * 1.2, this.SCALE);
            scene.sound.play('jumpSFX');
            

           
            
        }

        //double jump
        if(!this.player.body.blocked.down && this.doubleJump && Phaser.Input.Keyboard.JustDown(cursors.up) && !this.boolSwing) {
            if(this.player.body.velocity.y < this.JUMP_VELOCITY) {
                this.player.body.setVelocityY(this.JUMP_VELOCITY + this.player.body.velocity.y);
            } else {
                this.player.body.setVelocityY(this.JUMP_VELOCITY);

            }

            this.doubleJump = false;
            //jump juice!
            this.jumpParticles.emitParticleAt(this.player.x, this.player.y + 20);
            scene.sound.play('jumpSFX');

        }

        if(this.player.body.blocked.down) {
            this.doubleJump = true;

        }
        

        if(this.player.body.y > 500) {
            if (!this.respawnSound.isPlaying) {
                this.respawnSound.play(); // Stop if the sound is already playing
            }
        }

        
        if(this.player.body.y > 700) {
            //reset player to start
            
           // this.respawnSound.play();
            this.respawnDelay = scene.time.addEvent({
                callback: this.respawnPlayer,
                callbackScope: this,

                delay: 1500,
            });
            this.player.body.x = this.x;
            this.player.body.y = this.y;
            this.player.setVisible(false);
            this.boolSwing = true;
            

        }


        if(Phaser.Input.Keyboard.JustDown(this.keyC)) {
            this.swingFunction();

        }
            
        this.swordSwing.setX(this.player.x);
        this.swordSwing.setY(this.player.y);

    }

    
    playIdle() {
        this.player.anims.play('player_idle', true);
        this.boolSwing = false;
    }

    resetAnimation() {
        this.swordSwing.anims.stop();
    }

    swingFunction() {
        this.swordSwing.anims.play('slice', true);
        this.player.anims.play("player_attack", true);
        
        if(! this.boolSwing) {
            this.activeHitbox = scene.time.addEvent({
                callback: this.enableHitbox,
                callbackScope: this,

                delay: 700,
            });
        }
            this.boolSwing = true;
          
    }

    enableHitbox() {
        this.swordSwing.body.setEnable(true);
        if (this.clickSound && this.clickSound.isPlaying) {
            this.clickSound.stop(); // Stop if the sound is already playing
        }
        this.clickSound.play();
       
        this.inactiveHitbox = scene.time.addEvent({
            callback: this.disableHitbox,
            callbackScope: this,
            delay: 200,
        });
       

    }
    disableHitbox() {
        this.swordSwing.body.setEnable(false);


    }

    resetPlayer() {
        this.player.body.x = this.x;
        this.player.body.y = this.y;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        scene.endZone = false;
        this.doubleJump = true;
        this.player.setVisible(true);
    }

    respawnPlayer() {
        this.resetPlayer();
    }



}