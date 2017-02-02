// define some constants
var Constants = {
    rowCount: 6,
    colCount: 5,
    rowHeight: 84,
    colWidth: 101,
    enemyMaxSpeed: 4
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.reset();
};

// enemy count
// you can set it to control how many enemies to show.
Enemy.count = 4;

// init position
Enemy.initPos = {
    x: -Constants.colWidth,
    y: 58
};

// reset enemy state
Enemy.prototype.reset = function() {
    this.rowIndex = Math.floor(Math.random() * 10) % 3 + 1;
    this.x = Enemy.initPos.x;
    this.y = Enemy.initPos.y + (this.rowIndex - 1) * Constants.rowHeight;
    this.v = Math.floor(Math.random() * 10) % Constants.enemyMaxSpeed + 1;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.v * (dt / (1 / 60));
    if (this.x >= ctx.canvas.width) {
        this.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.reset();
};

// init position
Player.initPos = {
    rowIndex: 4,
    colIndex: 2
};

// reset the player state
Player.prototype.reset = function() {
    this.rowIndex = Player.initPos.rowIndex;
    this.colIndex = Player.initPos.colIndex;
};

// update the player's position
Player.prototype.update = function() {
    this.x = this.colIndex * Constants.colWidth;
    this.y = this.rowIndex * Constants.rowHeight - 12;
};

// render the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// handle the player's moving
Player.prototype.handleInput = function(to) {
    switch (to) {
        case 'left':
        this.colIndex>0 && this.colIndex--;
        break;
        case 'right':
        this.colIndex<Constants.colCount-1 && this.colIndex++;
        break;
        case 'up':
        this.rowIndex>0 && this.rowIndex--;
        break;
        case 'down':
        this.rowIndex<Constants.rowCount-1 && this.rowIndex++;
        break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i=0; i<Enemy.count; i++) {
    allEnemies.push(new Enemy());
}

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// check collisions
function checkCollisions() {
    if (player.rowIndex === 0) {
        return game.win();
    }
    for (var i=0; i<allEnemies.length; i++) {
        var enemy = allEnemies[i];
        var collisionLeft = (player.colIndex - 0.5) * Constants.colWidth;
        var collisionRight = (player.colIndex + 0.5) * Constants.colWidth;
        if (enemy.rowIndex === player.rowIndex && enemy.x > collisionLeft && enemy.x < collisionRight) {
            return game.fail();
        }
    };
}

// game controller
var game = {
    win: function() {
        this.showTip('win');
        player.reset();
    },
    fail: function() {
        this.showTip('fail');
        player.reset();
    },
    showTip: function(which) {
        var tipDiv = document.getElementById(which);
        tipDiv.style.display = 'block';
        setTimeout(function() {
            tipDiv.style.display = 'none';
        }, 1500);
    }
};