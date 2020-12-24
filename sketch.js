var PLAY = 1;
var END = 0;
var gameState =PLAY;

var player, player_running, player_collided,player_jumping;
var ground, invisibleGround, groundImage;

var fire1, fire2, fire3, firesGroup;

var grass1, grass2, grassGroup;


var score;

var gameOver, restart;

var candy1, candy2, candy3, candysGroup;

var jumpSound,dieSound,playSound;

  function preload() {

    player_running = loadAnimation("girl11-removebg-preview.png", "girl12-removebg-preview.png", "girl14-removebg-preview.png", "girl15-removebg-preview.png", "girl16-removebg-preview.png", "girl17-removebg-preview.png");

    player_collided = loadAnimation("girl11-removebg-preview.png");

    player_jumping = loadAnimation("girl11-removebg-preview.png");

    groundImage = loadImage("garden1.png");

    candy1 = loadImage("candy1-removebg-preview.png");
    candy2 = loadImage("download-removebg-preview.png");
    candy3 = loadImage("candy4-removebg-preview.png");

    fireImage= loadImage("fire3-removebg-preview.png");

    grass1 = loadImage("grass1-removebg-preview.png");
    grass2 = loadImage("grass2-removebg-preview.png");

    gameOverImage = loadImage("gameOver.png");
    restartImage = loadImage("restart.png");
    
    jumpSound=loadSound("jump.mp3");
    dieSound=loadSound("die.mp3");
    playSound=loadSound("music (2).mp3");

}

function setup() {

  createCanvas(500, 480);


    ground = createSprite(10, 150, 500, 500);
    ground.addImage("bg", groundImage);
    ground.velocityX =  -2;
    ground.x = ground.width / 2;

    player = createSprite(50, 350, 20, 50);
    player.addAnimation("running", player_running);
    player.addAnimation("collided",player_collided);
    player.addAnimation("jumping",player_jumping);
    player.scale = 0.3;

    gameOver = createSprite(300, 250);
    gameOver.addImage(gameOverImage);
    gameOver.scale = 0.6;

    restart = createSprite(300, 280);
    restart.addImage(restartImage);
    restart.scale = 0.6;

    gameOver.visible = false;
    restart.visible = false;


    invisibleGround = createSprite(0, 480, 500, 10);
    invisibleGround.visible = false;

    firesGroup = new Group();
    grassGroup = new Group();
    candysGroup = new Group();

    player.debug = false;
    player.setCollider("rectangle",0,0,70,300);

    score=0;

  
 playSound.loop();
  
  }

function draw() {
    background(100);

    drawSprites();

   if(frameCount<100){
     textSize(20);
     fill("black");
     text("Press Space to Jump",180,230);
   }
    textSize(30);
    fill("maroon");
    textFont("Brush Script MT");
    text("Catch Me If You Can", 130, 40);

    textSize(15);
    fill("black");
    textFont("Copperplate");
    text("SCORE:" + score, 400, 30);

    if (gameState === PLAY) {
       
     
      
      player.changeAnimation("running", player_running);

      gameOver.visible = false;
      restart.visible = false;

      ground.velocityX = -2;

      if (ground.x < 130) {
        ground.x = ground.width / 2;
      }

      if (keyDown("space") && player.y >=150 ) {
        player.velocityY = -10;
        
        player.changeAnimation("jumping",player_jumping);
        jumpSound.play();

      }
      if(keyDown("up")){
        player.y=player.y-20;
         jumpSound.play();
      }

      player.velocityY = player.velocityY + 0.8;


      spawnCandys();

      spawnFire();

      spawnGrass();

      if (player.isTouching(candysGroup)) {
         score=score+2;
       for(var i=0;i<candysGroup.length;i++){
         if(candysGroup.get(i).isTouching(player)){
           candysGroup.get(i).remove();
         }
       }
      }

    if (firesGroup.isTouching(player)) {

      gameState = END;
      dieSound.play();
      playSound.stop();
    } 
    }

    else if (gameState === END) {


      gameOver.visible = true;
      restart.visible = true;


      ground.velocityX = 0;
      player.velocityY = 0;

        player.changeAnimation("collided", player_collided);


      candysGroup.setLifetimeEach(-1);
      firesGroup.setLifetimeEach(-1);

      firesGroup.setVelocityXEach(0);
      candysGroup.setVelocityXEach(0);
      grassGroup.setVelocityXEach(0);

      if(mousePressedOver(restart)){
        reset();
      }
    }


    player.collide(invisibleGround);



}


function reset(){
  
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  
  candysGroup.destroyEach();
  grassGroup.destroyEach();
  firesGroup.destroyEach();
  score=0;
  playSound.play();
}

function spawnCandys() {

    if (frameCount % 200 === 0) {

      var candy = createSprite(500, 200, 20, 20);
      candy.velocityX = -2;

      candy.y = Math.round(random(180, 300));

      var rand = Math.round(random(1, 3));

      if (rand == 1) {
        candy.addImage(candy1);
      } else if (rand == 2) {
        candy.addImage(candy2);
      } else {
        candy.addImage(candy1);
      }


      candy.scale = 0.2;
      candy.lifetime = 250;
      candy.debug=false;

      candy.depth=player.depth;
      player.depth=player.depth+1;

      candysGroup.add(candy)
  }
}



function spawnGrass() {

    if (frameCount % 300 === 0) {

      var grass = createSprite(500, 435, 20, 20);
      grass.velocityX = -2;


      var rand = Math.round(random(1, 2));
      switch (rand) {

        case 1:
          grass.addImage(grass1);
          break;
        case 2:
          grass.addImage(grass2);
          break;

          deafult: break;
      }
      grass.scale = 0.8;
      grass.lifetime = 300;
      grassGroup.add(grass)
  }
}



function spawnFire() {

    if (frameCount % 80 === 0) {

      var fire = createSprite(500, 250, 20, 20);
      fire.velocityX = -12;
      fire.y = Math.round(random(200, 400));
       fire.addImage(fireImage);

      fire.scale = 0.15;
      fire.lifetime = 220;

      fire.debug=false;
      fire.setCollider("circle", 0, 0, 80);

      firesGroup.add(fire)

  }

}