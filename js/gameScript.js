// "use strict";

var firstTime = true;
var canvas;
var stage;
var screen_width;
var screen_height;
var bmpAnimation;
var keys = {};

var imgsLoaded = 0;
var pauseMonster = true;
var walking = false;
var swap;

var imgMonsterARun = new Image();
var imgMonsterAIdle = new Image();
var imgRatRun = new Image();
var fireball = new Image();
var imgRatDeath = new Image();
var background = new Image();
var well = new Image();
var started = false;

var dead = false;
var ratDead = false;
var fireDead = true;
var firing = false;
var score = 0;
var highScore = 0;
var ratVx = 1;
var context;
var ratMoveAnimation;
var ratDeathAnimation;
var bmpAnimationIdle;
var bmpAnimationIdleR;
var fireAnimation;


if(firstTime){
window.onload = function(){
        dead = false;
        background.onload = handleImageLoad;
        background.onerror = handleImageError;
        background.src = "tile2.png";

        well.onload = handleImageLoad;
        well.onerror = handleImageError;
        well.src = "well.png";
        canvas = document.getElementById("testCanvas");
        stage = new createjs.Stage(canvas);
        context = canvas.getContext('2d');
        // grab canvas width and height for later calculations:
        // screen_width = canvas.width;
        // screen_height = canvas.height;

        // Make sure the image is loaded first otherwise nothing will draw.
        var bitmapBackground = new createjs.Bitmap(background);
        stage.addChild(bitmapBackground);

        var bitmapWell = new createjs.Bitmap(well);
        bitmapWell.x = 100;
        bitmapWell.y = 100;
        stage.addChild(bitmapWell);
        stage.update();
        context.stroke();
    createjs.Ticker.on("tick", tick);
    createjs.Ticker.off();
};

function resetStage(){
        stage.removeAllChildren();
        stage.update();
        canvas = document.getElementById("testCanvas");
        stage = new createjs.Stage(canvas);
        context = canvas.getContext('2d');
        // grab canvas width and height for later calculations:
        // screen_width = canvas.width;
        // screen_height = canvas.height;

        // Make sure the image is loaded first otherwise nothing will draw.
        var bitmapBackground = new createjs.Bitmap(background);
        stage.addChild(bitmapBackground);

        var bitmapWell = new createjs.Bitmap(well);
        bitmapWell.x = 100;
        bitmapWell.y = 100;
        context.clearRect(0, 0, canvas.width, canvas.height);
        stage.addChild(bitmapWell);
        stage.update();    
}


function reset() {
    document.getElementById("Dead").innerHTML= "";
    if(score >= highScore){
        // ratVx = 1;
        highScore = score;
        document.getElementById("highScore").innerHTML = highScore;
    }
    if(dead){
        dead = false;
        ratDead = false;
        // stage.update();        
        // init();
        // createjs.Ticker.off();
    }
    score = 0;
    document.getElementById("score").innerHTML = score;
    stage.removeAllChildren();
    createjs.Ticker.removeAllEventListeners();
    // stage.update();
    // context.clearRect(0, 0, canvas.width, canvas.height);
    window.onload();
}

function init() {
    if(dead){
        reset();
    }
    if(started){
        reset();
    }
    else{
        document.getElementById("Dead").innerHTML= "";
    ratVx = 1;
    this.document.onkeydown = keydown;
    this.document.onkeyup = keyup;
    started = true;
    // pauseMonster = false;
    swap = true;
    canvas = document.getElementById("testCanvas");

    imgMonsterARun.onload = handleImageLoad;
    imgMonsterARun.onerror = handleImageError;
    imgMonsterARun.src = "Run.png";

    imgMonsterAIdle.onload = handleImageLoad;
    imgMonsterAIdle.onerror = handleImageError;
    imgMonsterAIdle.src = "Idle.png";

    imgRatRun.onload = handleImageLoad;
    imgRatRun.onerror = handleImageError;
    imgRatRun.src = "rat-move.png";

    fireball.onload = handleImageLoad;
    fireball.onerror = handleImageError;
    fireball.src = "fireball_0.png";

    background.onload = handleImageLoad;
    background.onerror = handleImageError;
    background.src = "tile2.png";

    well.onload = handleImageLoad;
    well.onerror = handleImageError;
    well.src = "well.png";

    imgRatDeath.onload = handleImageLoad;
    imgRatDeath.onerror = handleImageError;
    imgRatDeath.src = "rat-dying.png";
    // else{
    stage.removeAllChildren();
    createjs.Ticker.removeAllEventListeners();
    createjs.Ticker.off();
    createjs.Ticker.on("tick", tick);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
}
    // }
};

function handleImageLoad(e) {
	// imgsLoaded++;
	// if(started){
    startGame();
	// };
}

function startGame() {
    // firstTime = false;
    ratVx = 1;
    // started = true;
	// create a new stage and point it at our canvas:
	stage = new createjs.Stage(canvas);
	var context = canvas.getContext('2d');
	// grab canvas width and height for later calculations:
	screen_width = canvas.width;
	screen_height = canvas.height;

    // Make sure the image is loaded first otherwise nothing will draw.
    var bitmapBackground = new createjs.Bitmap(background);
    stage.addChild(bitmapBackground);

    var bitmapWell = new createjs.Bitmap(well);
    bitmapWell.x = 100;
    bitmapWell.y = 100;
    stage.addChild(bitmapWell);
    // create spritesheet and assign the associated data.
	var spriteSheet = new createjs.SpriteSheet({
	    // image to use
	    "images": [imgMonsterARun], 
	    // width, height & registration point of each sprite
	    "frames": {"width": 64, "height": 64, "regX": 32, "regY": 32}, 
	    "animations": {	
		    "walk": [0, 9, "walk", 0.1]
	    }
    });

    var spriteSheetIdle = new createjs.SpriteSheet({
    	"images": [imgMonsterAIdle],
    	"frames": {"width": 64, "height": 64, "regX": 32, "regY": 32},
    	"animations": {
    		"idle": [0, 10, "idle", 0.05]
    	},
        "framerate": 60
    });
    var spriteSheetRat = new createjs.SpriteSheet({
        // image to use
        "images": [imgRatRun], 
        // width, height & registration point of each sprite
        "frames": {"width": 128, "height": 128, "regX": 100, "regY": 32},
        "animations": { 
            "walk": [0, 3, "walk", 0.05]
        }
    });

    var spriteSheetFire = new createjs.SpriteSheet({
        // image to use
        "images": [fireball], 
        // width, height & registration point of each sprite
        "frames": {"width": 64, "height": 64, "regX": 32, "regY": 32},
        "animations": { 
            "fire": [32, 39, "fire", 0.05]
        }
    });

    var spriteSheetRatDeath = new createjs.SpriteSheet({
        // image to use
        "images": [imgRatDeath], 
        // width, height & registration point of each sprite
        "frames": {"width": 128, "height": 128, "regX": 32, "regY": 32},
        "animations": { 
            "death": [0, 7, false, 0.05]
        }
    });

 //Alternatively use can also use the graphics property of the Shape class to renderer the same as above.
 // var shape = new createjs.Shape();
 // shape.graphics.beginFill("#ff0000").drawRect(100, 100, 100, 100);
 // shape.setBounds(100, 100, 100, 100);
 // stage.addChild(shape);
    // Test Box
    // var spriteBox = new createjs.SpriteSheet({
    //     "images": [box],
    //     "frames": {"width": 50, "height": 50, "regX": 100, "regY": 100},
    //     "animations": {
    //         "what": [0, 1, "what", 1]
    //     }
    // });

    // boxAnimation = new createjs.Sprite(spriteBox, "what");
    // boxAnimation.gotoAndPlay("what");
    // boxAnimation.x = 100;
    // boxAnimation.y = 100;
    // stage.addChild(boxAnimation);

	// createjs.SpriteSheetUtils.addFlippedFrames(spriteSheet, true, false, false);
	// spriteSheet.scaleX = -1;
	// spriteSheet.scaleY = -1;
    // create a BitmapAnimation instance to display and play back the sprite sheet:
	bmpAnimation = new createjs.Sprite(spriteSheet, "walk");
    ratMoveAnimation = new createjs.Sprite(spriteSheetRat, "walk");
    ratMoveAnimation.name = "testRat";
    // ratMoveAnimation.vX = 3;
    ratMoveAnimation.x = 500;
    ratMoveAnimation.y = 0;
    // ratMoveAnimation.scaleX = -1;
    ratMoveAnimation.rotation = -90;
    ratMoveAnimation.gotoAndPlay("walk");

    ratDeathAnimation = new createjs.Sprite(spriteSheetRatDeath, "death");
    ratDeathAnimation.name = "deathRat";
    ratDeathAnimation.rotation = -90;
    // ratDeathAnimation.gotoAndPlay("death");
    // start playing the first sequence:
    bmpAnimation.gotoAndPlay("walk"); 	//animate
	
    // set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
    // of animated rats if you disabled the shadow.
    // bmpAnimation.shadow = new createjs.Shadow("#454", 0, 5, 4);

    bmpAnimation.name = "monster1";
    bmpAnimation.direction = -90;
    bmpAnimation.vX = 3;
    bmpAnimation.x = 16;
    bmpAnimation.y = 32;
    bmpAnimation.scaleX = -1;


    bmpAnimationIdle = new createjs.Sprite(spriteSheetIdle, "idle");
    bmpAnimationIdle.name = "monster1Idle";
    bmpAnimationIdle.x = 16;
    bmpAnimationIdle.y = 32;

    bmpAnimationIdleR = new createjs.Sprite(spriteSheetIdle, "idle");
    bmpAnimationIdleR.name = "monster1Idle";
    bmpAnimationIdleR.x = 16;
    bmpAnimationIdleR.y = 32;
    // have each monster start at a specific frame
    bmpAnimation.currentFrame = 0;
    stage.addChild(bmpAnimationIdle);
	stage.addChild(ratMoveAnimation);

    fireAnimation = new createjs.Sprite(spriteSheetFire, "fire");
    fireAnimation.name = "fireBall";
    fireAnimation.x = bmpAnimation.x;
    fireAnimation.y = bmpAnimation.y;
    fireAnimation.currentFrame = 32;
    // we want to do some work before we update the canvas,
    // otherwise we could use Ticker.addListener(stage);
    // createjs.Ticker.addEventListener(window, tick);
    if(started){
    createjs.Ticker.on("tick", tick);
    // createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
    }
}

var left;
var right;

//called if there is an error loading the image (usually due to a 404)
function handleImageError(e) {
	console.log("Error Loading Image : " + e.target.src);
}

function reverse(){
    swap = false;
    // console.log("Got Called!", bmpAnimation.direction);
        createjs.Ticker.off("tick", tick);
            pauseMonster = false;
            bmpAnimationIdle.gotoAndStop("idle");
            stage.removeChild(bmpAnimationIdle);
            bmpAnimation.gotoAndPlay("walk");
            stage.addChild(bmpAnimation);
            if(right){
                bmpAnimation.direction = -90;
            }
            if(left){
                bmpAnimation.direction = 90;
            }
            // console.log(pauseMonster);
        // bmpAnimation.x = bmpAnimationIdle.x;
        // return pauseMonster;

}

function makeRat(){
    var spriteSheetRat = new createjs.SpriteSheet({
        // image to use
        "images": [imgRatRun], 
        // width, height & registration point of each sprite
        "frames": {"width": 128, "height": 128, "regX": 100, "regY": 100},
        "animations": { 
            "walk": [0, 3, "walk", 0.05]
        }
    });
    var rando = Math.floor(Math.random() * 250) + 1;
    console.log(rando);

    ratMoveAnimation = new createjs.Sprite(spriteSheetRat, "walk");
    ratMoveAnimation.name = "testRat";
    // ratMoveAnimation.vX = 3;
    ratMoveAnimation.x = 500;
    ratMoveAnimation.y = rando;
    // ratMoveAnimation.scaleX = -1;
    ratMoveAnimation.rotation = -90;
    ratMoveAnimation.gotoAndPlay("walk");
    stage.addChild(ratMoveAnimation);
}

function fire(e){
        if(!firing){
            fireDead = false;
            fireAnimation.y = bmpAnimation.y;
            fireAnimation.x = bmpAnimation.x;
            fireAnimation.gotoAndPlay("fire");
            stage.addChild(fireAnimation);
        }
    }
function keydown(event) {
    walking = true;
    pauseMonster = false;
    keys[event.keyCode] = true;
    bmpAnimationIdle.gotoAndStop("idle");
    stage.removeChild(bmpAnimationIdle);
    bmpAnimation.gotoAndPlay("walk");
    stage.addChild(bmpAnimation);
    pauseMonster = false;
}

function keyup(event) {
    walking = false;
    pauseMonster = true;
    bmpAnimation.gotoAndStop("walk");
    stage.removeChild(bmpAnimation);
    bmpAnimationIdle.gotoAndPlay("idle");
    stage.addChild(bmpAnimationIdle);
    pauseMonster = true;
    delete keys[event.keyCode];
}
function tick() {
if(!dead){
    if (keys[37]){
        walking = true;
                bmpAnimation.scaleX = 1;
                bmpAnimation.direction = -90;
                if(bmpAnimation.x < 26){

                }
                else if(bmpAnimation.x > 219 && bmpAnimation.x < 223 && bmpAnimation.y > 67 && bmpAnimation.y < 227){
                    // console.log("here");
                }  
                else{
                    bmpAnimation.x -= 1;
                    bmpAnimationIdle.x = bmpAnimation.x;
                }
    }
    if (keys[38]){
        walking = true;
                if(bmpAnimation.y < 24){

                }
                else if(bmpAnimation.x > 81 && bmpAnimation.x < 221 && bmpAnimation.y > 220 && bmpAnimation.y < 228){
                    // console.log("here");
                }    
                else{
                    bmpAnimation.y -= 1;
                    bmpAnimationIdle.y = bmpAnimation.y;
                }
    }
    if (keys[39]){
        walking = true;
                bmpAnimation.scaleX = -1;
                bmpAnimation.direction = 90;
                if(bmpAnimation.x >= screen_width - 20){

                }
                else if(bmpAnimation.x > 79 && bmpAnimation.x < 82 && bmpAnimation.y > 67 && bmpAnimation.y < 232){
                    // console.log("here");
                }    
                else{
                    bmpAnimation.x += 1;
                    bmpAnimationIdle.x = bmpAnimation.x;
                }
    }
    if (keys[40]){
        walking = true;
                if(bmpAnimation.y >= screen_height - 34){

                }
                else if(bmpAnimation.x > 81 && bmpAnimation.x < 221 && bmpAnimation.y > 60 && bmpAnimation.y < 68){
                    // console.log("here");
                }
                else{
                    bmpAnimation.y += 1;
                    bmpAnimationIdle.y = bmpAnimation.y;
                    // console.log("down");
                }
    }
    if(keys[17]){
        fire(event);
    }
// if(walking){
//     bmpAnimationIdle.gotoAndStop("idle");
//     stage.removeChild(bmpAnimationIdle);
//     bmpAnimation.gotoAndPlay("walk");
//     stage.addChild(bmpAnimation);
//     pauseMonster = false;
// }
// if(!walking){
//     bmpAnimation.gotoAndStop("walk");
//     stage.removeChild(bmpAnimation);
//     bmpAnimationIdle.gotoAndPlay("idle");
//     stage.addChild(bmpAnimationIdle);
//     pauseMonster = true;
//     }
}
        // else{

        // }
    // if(bmpAnimation.x <16 && pauseMonster == false && swap == true){
    //     right = false;
    //     left = true;
    //     pauseMonster = true;
    //     bmpAnimationIdle.x = bmpAnimation.x;
    //     // We've reached the left side of our screen
    //     // We need to walk right now
    //     bmpAnimation.gotoAndStop("walk");
    //     stage.removeChild(bmpAnimation);
    //     bmpAnimationIdle.gotoAndPlay("idle");
    //     stage.addChild(bmpAnimationIdle);
    //     setTimeout(function(){
    //     reverse();
    //     }, 3000);
    // }
    // Hit testing the screen width, otherwise our sprite would disappear
    // if (bmpAnimation.x >= screen_width - 16 && pauseMonster == false && swap == true) {
    //     right = true;
    //     left = false;
    //     pauseMonster = true;
    // 	bmpAnimationIdle.x = bmpAnimation.x;
    //     // We've reached the right side of our screen
    //     // We need to walk left now to go back to our initial position
    //     bmpAnimation.gotoAndStop("walk");
    //     stage.removeChild(bmpAnimation);
    //     bmpAnimationIdle.gotoAndPlay("idle");
    //     stage.addChild(bmpAnimationIdle);
    //     setTimeout(function(){
    //     reverse();
    //     }, 3000);
    // }

        // Moving the sprite based on the direction & the speed
        // if (bmpAnimation.direction == 90 && pauseMonster == false) {
        //     // pauseMonster = false;
        // 	bmpAnimation.scaleX = -1;
        //     bmpAnimation.x += bmpAnimation.vX;
        //     swap = true;
        // }
        // if (bmpAnimation.direction == -90 && pauseMonster == false) {
        //     // pauseMonster = false;
        // 	bmpAnimation.scaleX = 1;
        //     bmpAnimation.x -= bmpAnimation.vX;
        //     swap = true;
        // }\
    // function move(e){
    //     if(!dead){
    //         // fireAnimation.y = bmpAnimation.y;
    //         if(!walking){
    //             bmpAnimationIdle.gotoAndStop("idle");
    //             stage.removeChild(bmpAnimationIdle);
    //             bmpAnimation.gotoAndPlay("walk");
    //             stage.addChild(bmpAnimation);
    //             walking = true;
    //             pauseMonster = false;
    //         }
    //         // alert(e.keyCode);
    //         // if (xPos == canvas.width - 50 && yPos == canvas.height - 50){
    //         //     alert("Reached bottom corner!");
    //         // }
    //         // if (e.keyCode == 39){
    //         //     bmpAnimation.scaleX = -1;
    //         //     bmpAnimation.direction = 90;
    //         //     if(bmpAnimation.x >= screen_width - 20){

    //         //     }
    //         //     if(bmpAnimation.x > 79 && bmpAnimation.x < 82 && bmpAnimation.y > 67 && bmpAnimation.y < 232){
    //         //         // console.log("here");
    //         //     }    
    //         //     else{
    //         //         bmpAnimation.x += 5;
    //         //         bmpAnimationIdle.x = bmpAnimation.x;
    //         //     }
    //         // }
    //         // if (e.keyCode == 37){
    //         //     bmpAnimation.scaleX = 1;
    //         //     bmpAnimation.direction = -90;
    //         //     if(bmpAnimation.x < 26){

    //         //     }
    //         //     if(bmpAnimation.x > 219 && bmpAnimation.x < 223 && bmpAnimation.y > 67 && bmpAnimation.y < 227){
    //         //         // console.log("here");
    //         //     }  
    //         //     else{
    //         //         bmpAnimation.x -= 5;
    //         //         bmpAnimationIdle.x = bmpAnimation.x;
    //         //     }
    //         // }
    //         // if (e.keyCode == 38){
    //         //     if(bmpAnimation.y < 24){

    //         //     }
    //         //     if(bmpAnimation.x > 81 && bmpAnimation.x < 221 && bmpAnimation.y > 220 && bmpAnimation.y < 228){
    //         //         // console.log("here");
    //         //     }    
    //         //     else{
    //         //         bmpAnimation.y -= 5;
    //         //         bmpAnimationIdle.y = bmpAnimation.y;
    //         //     }
    //         // }
    //         // if (e.keyCode == 40){
    //         //     if(bmpAnimation.y >= screen_height - 34){

    //         //     }
    //         //     if(bmpAnimation.x > 81 && bmpAnimation.x < 221 && bmpAnimation.y > 60 && bmpAnimation.y < 68){
    //         //         // console.log("here");
    //         //     }
    //         //     else{
    //         //         bmpAnimation.y += 5;
    //         //         bmpAnimationIdle.y = bmpAnimation.y;
    //         //         // console.log("down");
    //         //     }
    //         // }
    //     }
    // }
        // function unPause(e){
        //     pauseMonster = true;
        //     walking = false;
        //     bmpAnimation.gotoAndStop("walk");
        //     stage.removeChild(bmpAnimation);
        //     bmpAnimationIdle.gotoAndPlay("idle");
        //     stage.addChild(bmpAnimationIdle);
        // }
        // function check(e){
        //     if(e.keyCode == 17){
        //         fire(e);
        //     }
        //     else{
        //         move(e);
        //     }
        // }
        // document.onkeydown = check;
        // // document.onkeydown = fire;
        // document.onkeyup = unPause;

        if(!dead && !ratDead){
            ratMoveAnimation.x -= ratVx;
        }
        if(ratMoveAnimation.x <= 36){
            if(score > 0){
                score -= 25;
                document.getElementById("score").innerHTML= score;
            }
            // ratMoveAnimation.x = 600;
            // ratMoveAnimation.y = 600;
            ratDead = true;
            ratMoveAnimation.gotoAndStop("walk");
            stage.removeChild(ratMoveAnimation);
        }
        if(ratDead){
            ratDead = false;
            ratMoveAnimation.gotoAndStop("walk");
            stage.removeChild(ratMoveAnimation);
            if(!dead && ratMoveAnimation.x >= 56){
            ratDeathAnimation.x = ratMoveAnimation.x - 36;
            ratDeathAnimation.y = ratMoveAnimation.y + 70;
            ratDeathAnimation.gotoAndPlay("death");
            stage.addChild(ratDeathAnimation);
            }
            if(score % 100 === 0 && score !== 0){
                ratVx += 0.05;
            }
            makeRat();
        }
        if(!fireDead){
            firing = true;
            fireAnimation.x += 1;
        }
        if(fireAnimation.x >= screen_width){
            fireAnimation.gotoAndStop("fire");
            stage.removeChild(fireAnimation);
            fireDead = true;
            firing = false;
        }
        // rect1.x < rect2.x + rect2.w &&
        // rect1.x + rect1.w > rect2.x &&
        // rect1.y < rect2.y + rect2.h &&
        // rect1.h + rect1.y > rect2.y
        // if(ratMoveAnimation.x - 64 < bmpAnimation.x && ratMoveAnimation.y +64 < bmpAnimation.y){
        var mummyX = bmpAnimation.x + 32;
        var ratX = ratMoveAnimation.x + 64;
        var mummyY = bmpAnimation.y + 32;
        var ratY = ratMoveAnimation.y + 64;
        // if(bmpAnimation.x < ratMoveAnimation.x + 128 && bmpAnimation.x + 64 > ratMoveAnimation.x && bmpAnimation.y < ratMoveAnimation.y + 128 && bmpAnimation.y + 64 > ratMoveAnimation.y){
        //     dead = true;
        //     bmpAnimationIdle.gotoAndStop("idle");
        //     stage.removeChild(bmpAnimationIdle);
        //     bmpAnimation.gotoAndStop("walk");
        //     stage.removeChild(bmpAnimation);
        // }
        // Player Collision Detection
        if(bmpAnimation.x < ratMoveAnimation.x + 8 && bmpAnimation.x + 32 > ratMoveAnimation.x && bmpAnimation.y < ratMoveAnimation.y + 60 && bmpAnimation.y + 64 > ratMoveAnimation.y + 60){
            // console.log("got got");
            if(score >= highScore){
                highScore = score;
                document.getElementById("highScore").innerHTML = highScore;
            }
            if(started){
            dead = true;
            score -= 25;
            }
            if(dead && started){
                document.getElementById("Dead").innerHTML = "You have died!  Click Start to play again!";
                bmpAnimationIdle.gotoAndStop("idle");
                stage.removeChild(bmpAnimationIdle);
                bmpAnimation.gotoAndStop("walk");
                stage.removeChild(bmpAnimation);
                stage.update();
                createjs.Ticker.off();
            }
        }
        // Fireball Collision Detection
        if(fireAnimation.x < ratMoveAnimation.x + 8 && fireAnimation.x + 32 > ratMoveAnimation.x && fireAnimation.y < ratMoveAnimation.y + 60 && fireAnimation.y + 64 > ratMoveAnimation.y + 60 && firing){
            // console.log("got got");
            score += 25;
            document.getElementById("score").innerHTML= score;
            ratDead = true;
            firing = false;
            fireDead = true;
            fireAnimation.gotoAndStop("fire");
            stage.removeChild(fireAnimation);
            ratMoveAnimation.gotoAndStop("walk");
            stage.removeChild(ratMoveAnimation);
        }
    // update the stage:
    stage.update();
}
// firstTime = false;
}
