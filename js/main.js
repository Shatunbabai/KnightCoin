class mainGame extends Phaser.Scene {
    constructor() {
    super({ key: "mainGame", active: true });

    }
    preload() {
        //hero
        this.load.spritesheet('hero', 
        'img/mainChar.png',
        { frameWidth: 64, frameHeight: 64 }
        );

        //heroDeath
        this.load.spritesheet('death', 
        'img/deathChar.png',
        { frameWidth: 64, frameHeight: 64 }
        );

        //enemy
        this.load.spritesheet('enemy', 
        'img/details/lava_drop2_5.png',
        { frameWidth: 25, frameHeight: 25 }
        );


        //item
        this.load.spritesheet('coinDrop', 
        'img/item/coin.png',
        { frameWidth: 32, frameHeight: 32 }
        );

        //ground
        this.load.image('background', 'img/Background/Bright/Background.png');
        this.load.image('ground', 'img/ground/downGround.png');
        this.load.image('flyGround', 'img/ground/flyGround.png');
        this.load.image('flyGround2', 'img/ground/flyGround2.png');
        //detail
        this.load.image('torch1', 'img/details/torch2_1.png');
        this.load.image('torch2', 'img/details/torch2_2.png');
        this.load.image('torch3', 'img/details/torch2_3.png');
        this.load.image('torch4', 'img/details/torch2_4.png');
    }

    create() {
        
        //details
        this.anims.create({
            key: 'idle',
            frames: [
                { key: 'torch1', duration: 0 },
                { key: 'torch2', duration: 0 },
                { key: 'torch3', duration: 0 },
                { key: 'torch4', duration: 0 }
            ],
            frameRate: 10,
            repeat: -1
        });

        //background
        this.add.image(212, 384, 'background').setScale(1,1.5);

        //details
        this.add.sprite(100, 690, 'torch1').play('idle');
        this.add.sprite(300, 690, 'torch1').play('idle');

        //ground
        platforms = this.physics.add.staticGroup();
        platforms.create(215, 740, 'ground').setSize(452, 24);
        platforms.create(200, 600, 'flyGround').setSize(150, 30);
        platforms.create(50, 400, 'flyGround').setSize(150, 30);
        platforms.create(400, 300, 'flyGround').setSize(150, 30);
        platforms.create(100, 200, 'flyGround2').setSize(24, 34);

        //hero
        hero = this.physics.add.sprite(100, 450, 'hero');

        hero.body.setGravityY(300)
        hero.setBounce(0.2);
        hero.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('hero', { start: 117, end: 124 }),
            frameRate: 10,
            repeat: -1
        });
         
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'hero', frame: 130 } ],
            frameRate: 10
        });
         
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('hero', { start: 143, end: 150 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'deathC',
            frames: this.anims.generateFrameNumbers('death', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('coinDrop', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        //coin
        coin = this.physics.add.group({
            key: 'coinDrop',
            repeat: 11,
            setXY: { x: 10, y: 0, stepX: 35 }
        });

        coin.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        coin.children.iterate(coin => {
            coin.play('spin')
          })

        function collectCoin (hero, coins)
        {
            coins.disableBody(true, true);

            score += 1;
            scoreText.setText('Score: ' + score);

            if (coin.countActive(true) === 0)
            {
                coin.children.iterate(function (child) {
         
                    child.enableBody(true, child.x, 0, true, true);
         
                });
         
                var x = (hero.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
         
                let enemys = enemy.create(x, 16, 'enemy').setSize(10, 10);
                enemys.setBounce(1);
                enemys.setCollideWorldBounds(true);
                enemys.setVelocity(Phaser.Math.Between(-200, 200), 20);
         
            }
        }

        function enemyHit (hero, enemy)
        {            
            hero.setTint(0xff0000);
        
            hero.anims.play('deathC');
        
            health -= 1;
            healthText.setText('Health: ' + health);
        }

        this.physics.add.collider(hero, platforms);
        this.physics.add.collider(coin, platforms);
        enemy = this.physics.add.group()
        this.physics.add.collider(enemy, platforms);
        this.physics.add.collider(hero, enemy, enemyHit, null, this);
        this.physics.add.overlap(hero, coin, collectCoin, null, this);
        cursors = this.input.keyboard.createCursorKeys();

        //score
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#ffffff'});
        healthText = this.add.text(16, 40, 'Health: 3', { fontSize: '32px', fill: '#ffffff'});
    }

    update() {
        if (health === 0)
        {
            this.physics.pause();
            return;
        }

        if (cursors.left.isDown)
        {
            hero.setVelocityX(-160);
        
            hero.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            hero.setVelocityX(160);
        
            hero.anims.play('right', true);
        }
        else
        {
            hero.setVelocityX(0);
        
            hero.anims.play('turn');
        }

        if (cursors.up.isDown && hero.body.touching.down)
        {
            hero.setVelocityY(-500);
        }
        
    }
}

const config = {
    type: Phaser.AUTO,
    width: 425,
    height: 769,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [mainGame]
}

let hero;
let platforms;
let cursors;
let coin;
let score = 0;
let scoreText;
let enemy;
let gamerOver = false;
let health = 3;
let healthText

let game = new Phaser.Game(config);