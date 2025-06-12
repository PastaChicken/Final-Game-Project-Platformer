class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.physics.world.gravity.y = 1500;
        this.camera = this.cameras.main;
        this.backgroundx = 16 * 80;
        this.backgroundy = 16 * 20;
        this.SCALE = 2.81;
        this.walkJuice;
        this.jumpJuice;
        this.endZone = false;
        this.keyE;
        this.score = 0;
        this.keys = this.input.keyboard.addKeys('W, S, A, D, Z, C');
        this.timer;

        
    }

    create() {

        /* 
        
        */
        // Create a new tilemap game object which uses 16x16 pixel tiles, and is
        // 80 tiles wide and 20 tiles tall.
        this.map = this.add.tilemap("monochrome_level_1", 16, 16, 80, 20);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("MonoChrome-Tileset", "monochrome");

        // Create a layer
        this.platformLayer = this.map.createLayer("Platform-Layer", this.tileset, 0, 0);
      //  this.platformLayer.setScale(2.0);
       

        // Make it collidable
        this.platformLayer.setCollisionByProperty({
            collide: true
        });

        
        //=========== *A pathfinder==============
        this.finder = new EasyStar.js();
        //=======================================

        this.keyE = this.input.keyboard.addKey("E");


        //===================particles for player=======================
        this.walkJuice = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],

            random: true,
            scale: {start: 0.015, end: 0.05},
            maxAliveParticles: 10,

            lifespan: 200,
           gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        this.jumpJuice = this.add.particles(0, 0, "kenny-particles", {
            frame: {frames: ['circle_01.png', 'circle_04.png'], cycle: true},
            scaleY: 0.025,
            lifespan: 100,
            //advance: 8,
            delay: 50,
            random: false,
            //speed: 150,
            duration: 200,
            quality: 1,
            blendMode: 'ADD',
            frequency: 50,
            alpha: {start: 1, end: 0.1}, 
            scaleX: {start: 0.05, end: 0.2},


        });
        //============CheckPoint code===============================

        this.endGoal1 = this.map.createFromObjects("Objects", {
            name: "EndGoal1",
            key: "monoChrome_sheet",
            frame: 52,
            scale: 2.0,
        });
        this.endGoal2 = this.map.createFromObjects("Objects", {
            name: "EndGoal2",
            key: "monoChrome_sheet",
            frame: 32,
            scale: 2.0,
        });

        this.endGoal3 = this.map.createFromObjects("Objects", {
            name: "EndGoal3",
            key: "monoChrome_sheet",
            frame: 12,
            scale: 2.0,
        });

        
    
        this.physics.world.enable(this.endGoal1, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.endGoal2, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.endGoal3, Phaser.Physics.Arcade.STATIC_BODY);


        this.endGoalGroup = this.add.group(this.endGoal1);
        this.endGoalGroup2 = this.add.group(this.endGoal2);
        this.endGoalGroup3 = this.add.group(this.endGoal3);

        this.arrGroup = [this.endGoalGroup, this.endGoalGroup2, this.endGoalGroup3];

        //========================Gems================================

        this.gems = this.map.createFromObjects("Objects", {
            name: "Gems",
            key: "monoChrome_sheet",
            frame: 62
        });


        this.gemGroup = this.add.group(this.gems);

        this.physics.world.enable(this.gemGroup, Phaser.Physics.Arcade.STATIC_BODY);


        this.gemSparkle = this.add.particles(0, 0, "kenny-particles", {

            frame: { frames: ['star_01.png','star_02.png','star_03.png','star_04.png','star_05.png','star_06.png','star_07.png','star_08.png', 'star_09.png'], cycle: true},
            scale: 0.1,
            lifespan: 100,
            //advance: 8,
            delay: 50,
            random: false,
            //speed: 150,
            duration: 500,
            quality: 8,
            blendMode: 'ADD',
            frequency: 50,


            alpha: {start:1, end: 0.5}
           })

           this.gemSparkle.stop();
    

        //=========================================================

       

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        //create sprite player from Player class function
         my.sprite.player = new Player(this, game.config.width/30 - 20, game.config.height/6,
            "player_character", "PlayerIdle0.png", cursors, this.walkJuice, this.jumpJuice);


            //dont know why but creates 2 so make this one invisible use getPlayer() for class one
        my.sprite.player.visible = false;

      
        //===================bird spawns mechanics===========================
        const birds = this.physics.add.group({
            classType: Crow,
        });

        birds.get(game.config.width/30 + 80, game.config.height/6, "bird_Idle");
        birds.get(game.config.width/30 + 150, game.config.height/6, "bird_Idle");
        birds.get(500, 200, "bird_Idle");
        birds.get(700, 200, "bird_Idle");
        birds.get(1100, 200, "bird_Idle");
        //=======================================================================

        
        this.physics.add.collider(my.sprite.player.getPlayer(), this.platformLayer);


        //add collision detection for checkpoint end of the level to move to next level or quit
        for(let group of this.arrGroup) {
            this.physics.add.overlap(my.sprite.player.getPlayer(), group, (obj1, obj2) => {
                //win condition
                this.setEndpoint();
        
            });
        }
        
        

        //allow gems to be picked up
        this.physics.add.overlap(my.sprite.player.getPlayer(), this.gemGroup, (obj1, obj2) => {
            obj2.destroy(); // gem
            this.addScore(); //function to add to score value
            this.gemSparkle.startFollow(obj2, my.sprite.player.getPlayer().displayWidth/2-35, my.sprite.player.getPlayer().displayHeight/2-30, false);
            this.gemSparkle.start();
            this.sound.play('coinSFX');

        });


        // debug key listener (assigned to D key) 
        //======================for testing=================================
        /*
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
        */
        //======================for testing=================================

      
        this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()


        //camera details for level
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels * 2, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player.getPlayer(), true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        //used for testing purposes on command to see functions with potential paramters really useful
        window.scene = this;

        this.titleText = this.add.text(475,300, "Score: ", {
            fontSize: 16
        
        });

        this.titleText.setScrollFactor(0);


        // collision with sword swing and birds
        this.physics.add.overlap(my.sprite.player.getSwordSprite(), birds, (obj1, obj2) => {
            obj2.destroy();
        });

        //collistion with player and birds restart player at spawn for a little challenge
        this.physics.add.overlap(my.sprite.player.getPlayer(), birds, (obj1, obj2) => {
            my.sprite.player.resetPlayer();

        });

        



       

    }

    update() {
        //run player movement
        my.sprite.player.update();

        //end of level condition
        if(Phaser.Input.Keyboard.JustDown(this.keyE) && this.endZone) {
            this.scene.start("platformerscene2");
            this.endZone = false;
        }

        
        
//scoreText.scrollFactorX
    }

    //once player reaches the end of level (changed to false upon falling after getting checkpoint)
    setEndpoint() {
        this.endZone = true;
    }

    addScore() {
        this.score += 1;
        this.titleText.setText("Score: " + this.score);

    }

    onTimerComplete() {
        console.log('timer has finished!');
      }

    
}