/*
 * Galaxer Game
 * Space shooter game based on Galaga
 * By Damon Jensen
*/

//Fonts
let fontFredokaOneRegular;
let fontNunitoRegular;
let fontNunitoBold;
let fontNunitoExtraBold;

//Spaceship
let spaceship;
let spaceshipRight;
let spaceshipLeft;

//Screens
const LOADING = 0;
const MAIN_MENU = 1;
const PLAY = 2;
const LEADERBOARD = 3;
const DIFFICULTY = 4;
const GAMEOVER = 5;
let currentScreen = LOADING;

//Game State
let gameStarted = false;
let levelStarted = false;

//Difficulties
const EASY = 1;
const NORMAL = 2;
const HARD = 3;
let difficulty = HARD;

//Leaderboard
let leaderboardCollection;
let name;
let nameInput;
let nameSubmit;

//Current Game
let level;
let lives;
let score;
let highScore;

//Sounds
let shootSound;
let gameMusic;
let spaceshipExplode;
let levelComplete;

//Laser
let laser;
let laserGroup;

//Enemies
let enemyGroup;
let enemyLaserImage;
let enemyLaserGroup
let enemyInfo = [];
let enemy1_1Image;
let enemy1_2Image;
let enemyOffset;
let enemyOffsetDirection = 1;

//Background
let backgroundStars = [];

let sampleVideo;

class backgroundStar {
  constructor(x, y, colour, countdownSpeed, down) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.countdownSpeed = countdownSpeed;
    this.down = down;
  }

  displayStar() {
    stroke(this.colour);
    point(this.x, this.y);
  }

  twinkle() {
    if (this.colour >= 255) {
      this.down = true;
    } else if (this.colour <= 0) {
      this.down = false;
    }

    if (this.down) {
      this.colour -= this.countdownSpeed;
    } else {
      this.colour += this.countdownSpeed;
    }
  }
}

function setup() {
  createCanvas(750, 950);

  // Create background stars
  for (let i = 0; i < 1000; i++) {
    backgroundStars[i] = new backgroundStar(random(width), random(height), random(255), random(0.1, 3), random(1));
  }

  sampleVideo = createVideo('assets/sample.mp4');
  sampleVideo.hide();

  nameInput = createInput('');
  nameInput.size(200);
  nameInput.position(width / 2 - 90, height / 2);
  nameInput.hide();

  nameSubmit = createButton('Submit');
  nameSubmit.position(width / 2 - 20, height / 2 + 30);
  nameSubmit.mousePressed(submitName);
  nameSubmit.hide();

  gameLogoImage.resize(600, 0);
  enemy1_1Image.resize(50, 0);
  enemy1_2Image.resize(50, 0);

  shootSound.setVolume(0.8);
  gameMusic.setVolume(0.2);
  spaceshipExplode.setVolume(0.6);
  levelComplete.setVolume(0.4);

  laserGroup = new Group();
  enemyGroup = new Group();
  enemyLaserGroup = new Group();
}

function preload() {

  fontFredokaOneRegular = loadFont('assets/FredokaOne-Regular.ttf');
  fontNunitoRegular = loadFont('assets/Nunito-Regular.ttf');
  fontNunitoBold = loadFont('assets/Nunito-Bold.ttf');
  fontNunitoExtraBold = loadFont('assets/Nunito-ExtraBold.ttf');

  leaderboardCollection = loadJSON("leaderboard.json");

  gameLogoImage = loadImage('img/GalaxerLogo2FullSize.png');
  spaceshipImage = loadImage('sprites/spaceship/ss.png');
  laserImage = loadImage('sprites/laser/laser.png');
  enemyLaserImage = loadImage('sprites/laser/laserEnemy.png');
  spaceshipRight = loadAnimation('sprites/spaceship/ssRight000.png', 'sprites/spaceship/ssRight006.png');
  spaceshipLeft = loadAnimation('sprites/spaceship/ssLeft000.png', 'sprites/spaceship/ssLeft006.png');

  enemy1_1Image = loadImage('sprites/enemies/enemy1-1.png');
  enemy1_2Image = loadImage('sprites/enemies/enemy1-2.png');

  shootSound = loadSound('sounds/shoot.wav');
  gameMusic = loadSound('sounds/Fields of Ice.mp3');
  spaceshipExplode = loadSound('sounds/spaceshipExplode.wav');
  levelComplete = loadSound('sounds/levelComplete.wav');
  
}

// Draw appropriate screen
function draw() {
  background(10)
  switch(currentScreen) {
    case LOADING:
      drawLoadingScreen();
      break;
    case MAIN_MENU:
      if (!gameMusic.isPlaying()) {
        gameMusic.play();
      }
      for (let i = 0; i < backgroundStars.length; i++) {
        backgroundStars[i].twinkle();
        backgroundStars[i].displayStar();
      }
      drawMainMenuScreen();
      break;
    case PLAY:
      if (gameMusic.isPlaying()) {
        gameMusic.stop();
      }
      for (let i = 0; i < backgroundStars.length; i++) {
        backgroundStars[i].twinkle();
        backgroundStars[i].displayStar();
      }
      drawPlayScreen();
      break;
    case LEADERBOARD:
      if (!gameMusic.isPlaying()) {
        gameMusic.play();
      }
      drawLeaderboardScreen();
      break;
    case DIFFICULTY:
      if (!gameMusic.isPlaying()) {
        gameMusic.play();
      }
      for (let i = 0; i < backgroundStars.length; i++) {
        backgroundStars[i].twinkle();
        backgroundStars[i].displayStar();
      }
      drawDifficultyScreen();
      break;
    case GAMEOVER:
      for (let i = 0; i < backgroundStars.length; i++) {
        backgroundStars[i].twinkle();
        backgroundStars[i].displayStar();
      }
      drawGameOverScreen();
      break;
  }
}

// Detect screen clicked
function mousePressed() {
  switch(currentScreen) {
    case MAIN_MENU:
      mainMenuClicked();
      break;
    case LEADERBOARD:
      leaderboardClicked();
      break;
    case DIFFICULTY:
      difficultyClicked();
      break;
  }
}

// Gets spacebar pressed input to trigger laser
function keyPressed() {
  switch(currentScreen) {
    case PLAY:
      if (key == ' ') {
        createLaser();
      }
  }
}

/*
 * * * * * * * * * * * * * * *
 * DISPLAYING LOADING SCREEN
 * * * * * * * * * * * * * * *
 */

function drawLoadingScreen() {
  if (frameCount == 240) {
    currentScreen = MAIN_MENU;
  }
  fill(220);
  arc(width / 2, height / 2, 100, 100, 0, (frameCount * 3) / 360 * PI);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(220);
  text('Loading...', width / 2, height / 2 + 100);
}

/*
 * * * * * * * * * * * * *
 * DISPLAYING MAIN MENU
 * * * * * * * * * * * * *
 */

function drawMainMenuScreen() {
  stroke(0);
  textSize(24);
  fill(220);
  textFont(fontNunitoExtraBold);
  textAlign(CENTER, CENTER);
  // Animate menu from bottom
  if (frameCount < 540) {
    image(gameLogoImage, width / 2 - gameLogoImage.width / 2, height - map(frameCount, 240, 540, 150, 850));
    text('PLAY GAME', width / 2, height - map(frameCount, 240, 540, -300, 350));
    text('LEADERBOARD', width / 2, height - map(frameCount, 240, 540, -350, 300));
  } else {
    image(gameLogoImage, width / 2 - gameLogoImage.width / 2, height - 850);

    sampleVideo.loop();
    image(sampleVideo, width / 2 - 141, 200, 283, 360);

    // Highlight hovering over
    if (mouseX >= 300 && mouseX <= 450 && mouseY >= 585 && mouseY <= 615) {
      fill(255);
    } else {
      fill(220);
    }
    text('PLAY GAME', width / 2, height - 350);

    if (mouseX >= 275 && mouseX <= 475 && mouseY >= 630 && mouseY <= 665) {
      fill(255);
    } else {
      fill(220);
    }
    text('LEADERBOARD', width / 2, height - 300);
  }
}

// Checks where player clicked on menu screen
function mainMenuClicked() {
  if (frameCount > 540) {
    if (mouseX >= 300 && mouseX <= 450 && mouseY >= 585 && mouseY <= 615) {
      sampleVideo.stop();
      currentScreen = DIFFICULTY;
    }
    if (mouseX >= 275 && mouseX <= 475 && mouseY >= 630 && mouseY <= 665) {
      sampleVideo.stop();
      currentScreen = LEADERBOARD;
    }
  }
}

/*
 * * * * * * * * * * * * *
 * DISPLAYING LEADERBOARD
 * * * * * * * * * * * * *
 */

function drawLeaderboardScreen() {
  stroke(0);
  textSize(24);
  textFont(fontNunitoExtraBold);
  textAlign(LEFT, TOP);

  // Highlight hovering over
  if (mouseX >= 0 && mouseX <= 80 && mouseY >= 0 && mouseY <= 30) {
    fill(255);
  } else {
    fill(220);
  }
  text('BACK', 5, 5);

  fill(220);
  textSize(48);

  textAlign(CENTER, CENTER);
  textFont(fontFredokaOneRegular);
  text('LEADERBOARD', width / 2, 200);

  textSize(28);
  textFont(fontNunitoBold);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < 10; i++) {
    text(i + 1 + '. ' + leaderboardCollection.leaderboard[i].name + ' - ' + leaderboardCollection.leaderboard[i].score + ' - ' + leaderboardCollection.leaderboard[i].date, width / 2, 275 + i * 40);
  }
}

// Checks where player clicked on leaderboard screen
function leaderboardClicked() {
  if (mouseX >= 0 && mouseX <= 80 && mouseY >= 0 && mouseY <= 30) {
    currentScreen = MAIN_MENU;
  }
}

/*
 * * * * * * * * * * * * *
 * SELECTING DIFFICULTY
 * * * * * * * * * * * * *
 */

function drawDifficultyScreen() {

  image(gameLogoImage, width / 2 - gameLogoImage.width / 2, height - 850);

  strokeWeight(1);
  stroke(0);
  textSize(24);
  fill(220);
  textFont(fontNunitoExtraBold);
  textAlign(LEFT, TOP);

  // Highlight hovering over
  if (mouseX >= 0 && mouseX <= 80 && mouseY >= 0 && mouseY <= 30) {
    fill(255);
  } else {
    fill(220);
  }
  text('BACK', 5, 5);

  textAlign(CENTER, CENTER);

  if (mouseX >= 300 && mouseX <= 450 && mouseY >= 532 && mouseY <= 567) {
    fill(255);
  } else {
    fill(220);
  }
  text('EASY', width / 2, height - 400);

  if (mouseX >= 300 && mouseX <= 450 && mouseY >= 581 && mouseY <= 616) {
    fill(255);
  } else {
    fill(220);
  }
  text('NORMAL', width / 2, height - 350);

  if (mouseX >= 300 && mouseX <= 450 && mouseY >= 630 && mouseY <= 665) {
    fill(255);
  } else {
    fill(220);
  }
  text('HARD', width / 2, height - 300);
}

// Checks where player clicked on difficulty screen
function difficultyClicked() {
  if (mouseX >= 300 && mouseX <= 450 && mouseY >= 532 && mouseY <= 567) {
    difficulty = EASY;
    currentScreen = PLAY;
  } else if (mouseX >= 300 && mouseX <= 450 && mouseY >= 581 && mouseY <= 616) {
    difficulty = NORMAL;
    currentScreen = PLAY;
  } else if (mouseX >= 300 && mouseX <= 450 && mouseY >= 630 && mouseY <= 665) {
    difficulty = HARD;
    currentScreen = PLAY;
  } else if (mouseX >= 0 && mouseX <= 80 && mouseY >= 0 && mouseY <= 30) {
    currentScreen = MAIN_MENU;
  }
}

/*
 * * * * * * * * *
 * MAIN GAME
 * * * * * * * * *
 */

function gameSetup() {
  // Create spaceship and add all assets
  spaceship = createSprite(width / 2, height - 75, 75, 75);
  spaceship.addImage(spaceshipImage);
  spaceship.addAnimation('left', spaceshipLeft);
  spaceship.addAnimation('right', spaceshipRight);
  spaceship.setCollider("rectangle", 0, -2, 40, 50);
  spaceship.position.x = width / 2;

  createEnemies();
  
  // Set default game values
  score = 0;
  lives = 2;
  level = 1;
  enemyOffset = 0;
  gameStarted = true;
  levelStarted = true;
}

// Reset enemy position and create new enemies at end of round
function levelSetup() {
  enemyOffset = 0;
  level++;
  createEnemies();
  levelStarted = true;
}

function drawPlayScreen() {
  if (!gameStarted) {
    gameSetup();
  } else if (!levelStarted) {
    levelSetup();
  }
  stroke(0);
  drawSprites();
  checkControl();
  drawGameDetails();
  drawLasers();
  drawEnemies();
  drawEnemiesLasers();
}

/*
* Check controls for spaceship control
* Swap spaceship animation accordingly
*/
function checkControl() {
  if (keyIsDown(LEFT_ARROW) && keyIsDown(RIGHT_ARROW)) {
    spaceship.setSpeed(0);
    if (spaceship.animation.getFrame() != 0) {
      spaceship.animation.previousFrame();
    }
  } else if (keyIsDown(LEFT_ARROW)) {
    if (spaceship.position.x <= 40) {
      spaceship.setSpeed(0);
    } else {
      spaceship.setSpeed(5, 180);
    }
    if (spaceship.animation.getFrame() != 0 && spaceship.getAnimationLabel() != 'left') {
      spaceship.animation.previousFrame();
    } else {
      spaceship.changeAnimation('left');
      spaceship.animation.stop();
      if (spaceship.animation.getFrame() != spaceship.animation.getLastFrame()) {
        spaceship.animation.nextFrame();
      }
    }
  } else if (keyIsDown(RIGHT_ARROW)) {
    if (spaceship.position.x >= 710) {
      spaceship.setSpeed(0);
    } else {
      spaceship.setSpeed(5, 0);
    }
    if (spaceship.animation.getFrame() != 0 && spaceship.getAnimationLabel() != 'right') {
      spaceship.animation.previousFrame();
    } else {
      spaceship.animation.goToFrame(0);
      spaceship.changeAnimation('right');
      spaceship.animation.stop();
      if (spaceship.animation.getFrame() != spaceship.animation.getLastFrame()) {
        spaceship.animation.nextFrame();
      }
    }
  } else {
    spaceship.setSpeed(0);
    if (spaceship.animation.getFrame() != 0) {
      spaceship.animation.previousFrame();
    }
  }
}

// Displays all current game details
function drawGameDetails() {
  textSize(24);
  fill('rgb(255, 0, 0)');
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('SCORE', 100, 5);
  text('HIGH SCORE', width / 2, 5);
  textAlign(LEFT, BOTTOM);
  text('LIVES: ' + lives, 5, height - 5);
  textAlign(RIGHT, BOTTOM);
  text('LEVEL: ' + level, width - 5, height - 5);

  highScore = leaderboardCollection.leaderboard[0].score;
  fill(220);
  textAlign(CENTER, TOP);
  text(highScore, width / 2, 30);
  if (score > highScore) {
    highScore = score;
  }
  text(score, 100, 30);
}

// Creates friendly laser
function createLaser() {
  if (laserGroup.size() < 10) {
    shootSound.play();
    laserGroup.add(createSprite(spaceship.position.x - 2, height - 100, 75, 75));
    laserGroup.get(laserGroup.size() - 1).setCollider("rectangle", 0, 0, 6, 20);
    laserGroup.get(laserGroup.size() - 1).addImage(laserImage);
    laserGroup.get(laserGroup.size() - 1).setSpeed(10, 270);
  }  
}

// Draws all current lasers, removes all off screen lasers and checks for overlap of enemy
function drawLasers() {
  for (let i = 0; i < laserGroup.size(); i++) {
    // Remove off screen laser
    if (laserGroup.get(i).position.y < -20) {
      laserGroup.get(i).remove();
    } else {
      // Check if collided
      laserGroup.get(i).overlap(enemyGroup, hitEnemy);
    }
  }
}

// Create all enemies
function createEnemies() {
  for (let i = 1; i < 5; i++) {
    for (let u = 0; u < 8; u++) {
      enemyGroup.add(createSprite(75 * u + 110, 350 - (50 * i), 40, 40))
      enemyGroup.get(enemyGroup.size() - 1).addImage('2-health', enemy1_2Image);
      enemyGroup.get(enemyGroup.size() - 1).addImage('1-health', enemy1_1Image);
      enemyInfo.push({health: 2, value: 100 * i});
    }
  }
}

/*
* Draws all current enemies
* If no enemies reset level and add 1000 points
* Move enemies at speed based on current level
*/
function drawEnemies() {
  if (enemyGroup.size() == 0) {
    levelComplete.play();
    score += 1000;
    laserGroup.removeSprites();
    enemyLaserGroup.removeSprites();
    levelStarted = false;
  } else {
    if (enemyOffsetDirection > 0) {
      for (let i = 0; i < enemyGroup.size(); i++) {
        enemyGroup.get(i).position.x += level * 0.1;
        createEnemyLaser(i);
      }
    } else {
      for (let i = 0; i < enemyGroup.size(); i++) {
        enemyGroup.get(i).position.x -= level * 0.1;
        createEnemyLaser(i);
      }
    }
    enemyOffset += enemyOffsetDirection * level * 0.1;
    if (enemyOffset > 50) {
      enemyOffsetDirection = -1;
    } else if (enemyOffset < -50) {
      enemyOffsetDirection = 1;
    }
  }
}

/* 
* When enemy hit remove laser
* Remove 1 health from enemy
* If enemy 0 health remove and add points
* Otherwise change picture
*/
function hitEnemy(laser, enemy) {
  laser.remove();
  enemyInfo[enemyGroup.indexOf(enemy)].health -= 1;
  if (enemyInfo[enemyGroup.indexOf(enemy)].health == 0) {
    score += enemyInfo[enemyGroup.indexOf(enemy)].value;
    enemyInfo.splice(enemyGroup.indexOf(enemy), 1);
    enemy.remove();
  } else if (enemyInfo[enemyGroup.indexOf(enemy)].health == 1) {
    enemy.changeImage('1-health');
  }
}

/*
* Creates enemy lasers at random intervals
* Angles laser in direction of spaceship
*/
function createEnemyLaser(i) {
  random = Math.random() * 500 * enemyGroup.size();
  if (random < level * difficulty) {
    enemyLaserGroup.add(createSprite(enemyGroup.get(i).position.x, enemyGroup.get(i).position.y), 30, 10);
    enemyLaserGroup.get(enemyLaserGroup.size() - 1).addImage(enemyLaserImage);
    enemyLaserGroup.get(enemyLaserGroup.size() - 1).setCollider("circle", -3, 0, 5);
    
    if (spaceship.position.x > enemyGroup.get(i).position.x) {
      angle = atan((abs(spaceship.position.x - enemyGroup.get(i).position.x) / 600)) * -180/PI + 90;
    } else {
      angle = atan((abs(spaceship.position.x - enemyGroup.get(i).position.x) / 600)) * 180/PI + 90;
    }
    enemyLaserGroup.get(enemyLaserGroup.size() - 1).setSpeed(5, angle);
    enemyLaserGroup.get(enemyLaserGroup.size() - 1).rotation = angle - 90;
  }
}

/*
* Draws all current enemy lasers
* Removes if outside screen
* Check if overlap spaceship
*/
function drawEnemiesLasers() {
  for (let i = 0; i < enemyLaserGroup.size(); i++) {
    if (enemyLaserGroup.get(i).position.y > height - 50) {
      enemyLaserGroup.get(i).remove();
    } else {
      enemyLaserGroup.get(i).overlap(spaceship, spaceshipHit);
    }
  }
}

/*
* When spaceshit hit clear all lasers from screen and reset position
* If out of lives end game
*/
function spaceshipHit(enemyLaser, spaceship) {
  enemyLaser.remove();
  spaceshipExplode.play();
  lives--;
  enemyLaserGroup.removeSprites();
  spaceship.position.x = width / 2;
  if (lives < 0) {
    gameStarted = false;
    spaceship.remove();
    spaceship = undefined;
    laserGroup.removeSprites();
    enemyGroup.removeSprites();
    currentScreen = GAMEOVER;
  }
}

// Get player's name for leaderboard screen
function drawGameOverScreen() {
  nameInput.show();
  nameSubmit.show();
  fill(250);

  textSize(28);
  textAlign(CENTER, CENTER);
  text('Player Name', width / 2, height / 2 - 30);

  textSize(64);
  textStyle(BOLD);

  text('GAME OVER', width / 2, 200);

}

// Gets name value
function submitName() {
  name = nameInput.value();
  nameInput.value('');
  nameInput.hide();
  nameSubmit.hide();
  checkLeaderboard();
  currentScreen = MAIN_MENU;
}

// Inserts score into leaderboard with player's name and gets current date
function checkLeaderboard() {
  for (let i = 0; i < 10; i++) {
    if (score > leaderboardCollection.leaderboard[i].score) {
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0');
      let yyyy = today.getFullYear();
      today = dd + '/' + mm + '/' + yyyy;
      leaderboardCollection.leaderboard.splice(i, 0, {"name": name, "score": score, "date": today});
      break;
    }
  }
}

