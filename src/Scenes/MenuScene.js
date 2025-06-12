class MenuScene extends Phaser.Scene{
    constructor() {
        super("menuScene");
        this.keyEnter;
    }

    create() {
        let menuscreen = this.add.image(0, 0, "menu screen").setOrigin(0);
        menuscreen.setScale(2);

        this.keyEnter = this.input.keyboard.addKey("ENTER");

        this.titleText = this.add.text(500, 400, "Press ENTER to Start", {
            fontSize:72,
        });

        this.userHelp = this.add.text(100, 300, "Tutorial: Use Arrow Keys to move", {
            fontSize:32,
        });

        this.userHelp1 = this.add.text(450, 600, "Press E at\n checkpoint", {
            fontSize:32,
        });

        this.userHelp2 = this.add.text(800, 600, "Press C at\n to unalive\n the crows", {
            fontSize:32,
        });

        this.titleText.textTween = this.tweens.add({
            targets: this.titleText,
            duration:1000,
            repeat: -1,
            yoyo: true,
            alpha:0
        })
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
            this.scene.start("platformerScene");
        }
        
    }
}