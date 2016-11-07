/*global Phaser*/


var game = new Phaser.Game(800, 600, Phaser.AUTO, '');
var game_state = {};


game_state.main = function() {};
game_state.main.prototype = {


    preload: function() {

        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    },


    create: function() {
        //We're gonna use physics so enable the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // A  simple background for our game
        game.add.sprite(0, 0, 'sky');
        game.add.sprite(0, 0, 'star');

        // The platforms group contains the ground and the 2 ledges we can jump
        this.platforms = game.add.group();
        //We will enable physics for any object that is greated in this group
        this.platforms.enableBody = true;


        // Here we create the ground.
        var ground = this.platforms.create(0, game.world.height - 64, 'ground');
        // Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);
        // This stops it from falling away when you jump on it
        ground.body.immovable = true;

        // Two ledges
        var ledge = this.platforms.create(88, 300, 'ground');
        ledge.body.immovable = true;
        
        var ledge2 = this.platforms.create(40, 400, 'ground');
        ledge2.body.immovable = true;

        //this is the player and it's settings
        this.player = game.add.sprite(32, game.world.height - 150, 'dude');
            //Enable physics on the player
        game.physics.arcade.enable(this.player);
        //Player physics properties. Give the little guy a straight bounce
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 200;
        this.player.body.collideWorldBounds = true;

        // Our two animations, walking left and right
        this.player.animations.add('left', [0, 1, 2, 3, ], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        //collide player and the platforms
        game.physics.arcade.collide(this.player, this.platforms);
        //Our Controls
        this.cursors = game.input.keyboard.createCursorKeys();

        //Finally some this.stars to collect
        this.stars = game.add.group();
        //Enable Physics for any star that is created in this group
        this.stars.enableBody = true;
        //Here we will create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++) {
            //Create stars inside of the 'this.star' group
            var star = this.stars.create(i * 70, 0, 'star');
                //Let gravity do it's thing
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
            star.body.gravity.y = 100;
        }

        // score
        this.score= 0
        this.scoreText = game.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });

    },

    update: function() {
        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.stars, this.platforms);
        // reset the this.players velocity (movement)
        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown) {
            // Move to the left
            this.player.animations.play('left');
             this.player.body.velocity.x = -150;
            this.player.animations.play('left');

            // Move to the right
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');

        }
        else {
            //Stand Still
            this.player.frame = 4;

        }
        //Allow this player to jump if they are touching the ground
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -350;

        }
        game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
    },

    //Checks to see if the this.player overlaps with any of the this.stars, if he does call the collectStar function

    collectStar: function(player, star) {
        //Removes the star from the screen
        star.kill();
        this.score++;
        this.scoreText.text = 'score: ' + this.score;
    }
};

game.state.add('main', game_state.main);
game.state.start('main');