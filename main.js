enchant(); //the magic words that start enchant.js
//Stage Variables
var moveSpeed = 4;
var health = 5;
var stgWidth = 320;
var stgHeight = 320;


//02 Player Class
Player = Class.create(Sprite, {
    initialize: function () {
        Sprite.call(this, 16, 16);
        this.image = game.assets['icon0.png'];
        this.x = stgWidth / 2;
        this.y = stgHeight / 2;
        this.frame = 44;
        this.health = 4;
        //03 Bind Keys
        game.keybind(65, 'left');
        game.keybind(68, 'right');
        game.keybind(87, 'up');
        game.keybind(83, 'down');
        //04 Mouse Variables
        this.tx = this.x;
        this.ty = this.y;
    },

    onenterframe: function () {

        //03 Player Controls
        if (game.input.left && !game.input.right) {
            this.tx = this.x -= moveSpeed;
        } else if (game.input.right && !game.input.left) {
            this.tx = this.x += moveSpeed;
        }

        if (game.input.up && !game.input.down) {
            this.ty = this.y -= moveSpeed;
        } else if (game.input.down && !game.input.up) {
            this.ty = this.y += moveSpeed;
        }
        //04 Mouse Update
        this.x += (this.tx - this.x) / 4;
        this.y += (this.ty - this.y) / 4;
    }
});

//05 Gem Class
Gem = Class.create(Sprite, {
    initialize: function () {
        Sprite.call(this, 16, 16);
        this.image = game.assets['diamond-sheet.png'];
        this.x = Math.random() * (stgWidth - 16);
        this.y = Math.random() * (stgWidth - 16);
        if (this.y < 50) {
            this.y = 50;
        }
        this.frame = 0;
    },

    onenterframe: function () {
        if (this.age % 2 === 0) {
            if (this.frame == 5) {
                this.frame = 0;
            } else {
                this.frame++;
            }
        }
        //Rotating using scaleX
        this.scaleX = Math.sin(this.age * .1);
        //07 Collision Check
        if (this.intersect(player)) {
            gem = new Gem();
            game.rootScene.addChild(gem);
            game.score += 100;
            game.rootScene.removeChild(this);
        }
    }
});

//08 Bomb Class
Bomb = Class.create(Sprite, {
    initialize: function () {
        Sprite.call(this, 16, 16);
        this.image = game.assets['icon0.png'];
        this.x = Math.random() * (stgWidth - 16);
        this.y = Math.random() * (stgHeight - 16); //Account for the bottom part
        if (this.y < 50) {
            this.y = 50;
        }

        this.frame = 24;
    },

    onenterframe: function () {
        if (this.age === 60) {
            game.rootScene.removeChild(this);
        }

        if (this.intersect(player)) {
            player.health--;
            game.rootScene.removeChild(this);
            console.log("ouch!");
        }

        if (this.age % 10 === 0) {
            if (this.frame === 25) {
                this.frame = 24;
            } else {
                this.frame++;
            }
        }
    }

});


//Begin game code
window.onload = function () {
    game = new Game(stgWidth, stgHeight);
    //Preload images
    //Any resources not preloaded will not appear
    game.preload('icon0.png', 'diamond-sheet.png', 'bg.png');

    game.onload = function () { //Prepares the game
        //01 Add Background
        bg = new Sprite(stgWidth, stgHeight);
        bg.image = game.assets['bg.png'];
        game.rootScene.addChild(bg);
        //02 Add Player
        player = new Player();
        game.rootScene.addChild(player);
        //05 Add Gem
        gem = new Gem();
        game.rootScene.addChild(gem);
        //06 Create Label
        game.score = 0;
        scoreLabel = new Label("Score: ");
        scoreLabel.addEventListener('enterframe', function () {
            this.text = "Score: " + game.score;
        });
        scoreLabel.x = 0;
        scoreLabel.color = "white";
        game.rootScene.addChild(scoreLabel);
        //08 Health Label
        healthLabel = new Label("Health: ")
        healthLabel.addEventListener('enterframe', function () {
            this.text = "Health: " + player.health;

            if (player.health <= 2) {
                this.color = "red";
            }
        });
        healthLabel.color = "white";
        healthLabel.x = 6 * stgWidth / 8;
        game.rootScene.addChild(healthLabel);
        //04 Touch Listener
        game.rootScene.addEventListener('touchend', function (e) {
            player.tx = e.x - 16;
            player.ty = e.y - 16;
        });
        //Game Condition Check
        game.rootScene.addEventListener('enterframe', function () {
            //08 Game Over
            if (player.health <= 0) {
                game.end();
            }
            //08 Make Bomb Generator
            if (player.age % 30 === 0) {
                bomb = new Bomb();
                game.rootScene.addChild(bomb);
            }
        });

    }
    game.start(); //Begin the game
}