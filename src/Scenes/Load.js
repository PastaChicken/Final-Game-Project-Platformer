class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        this.load.atlas("player_character", "PlayerAnimations/PlayerAnimations.png", "PlayerAnimations/PlayerAnimations.json");

        //Load enemy spritesheets
        this.load.atlas("bird_Idle", "BirdEnemy/birdIdleLeft.png", "BirdEnemy/birdIdleLeft.json");
        this.load.atlas("bird_Animations", "BirdEnemy/BirdAnimations.png", "BirdEnemy/BirdAnimations.json");

        // Load tilemap information
        this.load.image("monochrome", "monochrome_tilemap_packed.png");     // Packed tilemap
        this.load.tilemapTiledJSON("monochrome_level_1", "monochrome_level_1.tmj");   // Tilemap in JSON
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        this.load.multiatlas("slice-particles", "SwordSlice.json"); //slice animation as multiatlas

        this.load.spritesheet("monoChrome_sheet", "monochrome_tilemap_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.tilemapTiledJSON("monochrome_level_2", "platformer-level-2.tmj");

        this.load.image("menu screen", "Platformerlicious.png")

        this.load.audio('jumpSFX', 'Jump.wav');
        this.load.audio('sliceSFX', 'sliceUpdated.wav');
        this.load.audio('coinSFX', 'coin.wav');
        this.load.audio('fallSFX', 'GoofyYell.wav');
         
    }

    create() {
        
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

        //animation used to attack enemies
        this.anims.create({
            key: 'slice',
           // type: "frames",
            frames: this.anims.generateFrameNames('slice-particles', {
                prefix: "File",
                start: 1,
                end: 6,
                suffix: ".png",
                zeroPad: 4
            }),
           // frameRate: 23,
            repeat: 0,
            delay: 700,


            showOnStart: true,
            hideOnComplete: true,
            showBeforeDelay: true,
           // repeatDelay: 1,
          //  duration: 700,





        });
        //creating Bird Animations

        this.anims.create({
            key: 'bird_idle',
            type: "frames",
            frames: this.anims.generateFrameNames('bird_Idle', {
                prefix: "birdspitesheet",
                start: 1,
                end: 4,
                suffix:".png",
            }),
            frameRate: 2,
            repeat: -1
        })

        this.anims.create({
            key: 'bird_Lift',
            type: "frames",
            frames: this.anims.generateFrameNames('bird_Animations', {
                prefix: "BirdLift",
                start: 6,
                end: 11,
                suffix:".png",
                zeroPad:3
            }),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: 'bird_Attack',
            type: "frames",
            frames: this.anims.generateFrameNames('bird_Animations', {
                prefix: "BirdAttack",
                start: 6,
                end: 11,
                suffix:".png",
                zeroPad:2
            }),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: 'bird_Move',
            type: "frames",
            frames: this.anims.generateFrameNames('bird_Animations', {
                prefix: "BirdMove",
                start: 6,
                end: 11,
                suffix:".png",
                zeroPad:2
            }),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: 'player_run',
            type: "frames",
            frames: this.anims.generateFrameNames('player_character', {
                prefix: "PlayerRun",
                start: 0,
                end: 5,
                suffix:".png",
               // zeroPad:2
            }),
            frameRate: 6,
        })

        this.anims.create({
            key: 'player_idle',
            type: "frames",
            frames: this.anims.generateFrameNames('player_character', {
                prefix: "PlayerIdle",
                start: 0,
                end: 8,
                suffix:".png",
               // zeroPad:2
            }),
            frameRate: 6,
        })

        this.anims.create({
            key: 'player_attack',
            type: "frames",
            frames: this.anims.generateFrameNames('player_character', {
                prefix: "PlayerAttack",
                start: 0,
                end: 11,
                suffix:".png",
               // zeroPad:2
            }),
            frameRate: 12,
        })



        
        //shift option a to comment out highlighted code
        /* this.anims.createFromAseprite({
            key: 'run',
            tags: 'NightBorne-Sheet.json',
            target: 'NightBorne-Sheet-sheet.png'
        }); */
        
        
         

         // ...and pass to the next Scene
         this.scene.start("menuScene");
         
    }
    

    // Never get here since a new scene is started in create()
    update() {
    }
}