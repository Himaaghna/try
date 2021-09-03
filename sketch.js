var PLAY = 1;
var END = 0;
var gameState = PLAY;

var warrior, warrior_running;
var ground, invisibleGround, groundImage;

var obstaclesGroup,obstacle, enemy, wall ,tree, well;

var score;

var gameOverImg,restartImg;
var checkPointSound;


function preload(){
  warrior_running = loadAnimation("warrior.png1","warrior.png2");
  
  groundImage = loadImage("ground2.png");
  
  enemy = loadImage("enemy.png");
  wall = loadImage("wall.png");
  tree = loadImage("tree.png");
  well = loadImage("well.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  checkPointSound=loadSound("checkPoint.mp3")
  
}

function setup() {
  createCanvas(600, 200);
  
  warrior = createSprite(50,180,20,50);
  warrior.addAnimation("running", warrior_running);
  warrior.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  
  console.log("Hello" + 5);
  
  warrior.setCollider("circle",0,0,40);
  warrior.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(4+3*score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& warrior.y >= 100) {
        warrior.velocityY = -12;
       
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
  
    //spawn obstacles on the ground
    spawnObstacles();

    if (score> 0 &&score%100===0) {
      checkPointSound.play();
    }
    
    if(obstaclesGroup.isTouching(warrior)){
        gameState = END;
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      warrior.velocityY = 0
     
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
     obstaclesGroup.setVelocityXEach(0);
     
   }
  
 
  //stop trex from falling down
  warrior.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  
  drawSprites();
}


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  score = 0;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6*score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(enemy);
              break;
      case 2: obstacle.addImage(wall);
              break;
      case 3: obstacle.addImage(tree);
              break;
      case 4: obstacle.addImage(well);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}


