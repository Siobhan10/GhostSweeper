let backPicture;
let trashCanPicture;
let ghostBossPicture;
let ghostLesserPicture;
let ghost1Picture;
let ghost2Picture;
let ghost3Picture;
let ghost4Picture;
let startMusic;
let hitMusic;
let captueMusic;
let soeMusic;
let tomMusic;

let score = 0;
let lives = 3;
let bossCount=0;
let lifeEffect=0;
let endGame=300;  // count down to allow restart
let ghosts = [];
let firstRun=true;
let snowX=[];
let snowY=[];


let scoreDisp;
let livesDisp;
let commentDisp;

const trashCanX = 50;
const trashCanY = 290;

function preload() {
  backPicture = loadImage("pix.jpg");
  trashCanPicture = loadImage("trash.png");
  ghostBossPicture = loadImage("ghostBoss.png");
  ghostLesserPicture = loadImage("ghostLesser.png");
  hitMusic=loadSound("ghost.mp3");
  startMusic=loadSound("ghost1.mp3");
  captueMusic=loadSound("fall.mp3");
  soeMusic=loadSound("soe.mp3");
  tomMusic=loadSound("tom.mp3");
}

function setup() {
  createCanvas(640, 360,WEBGL);
  scoreDisp = createP().id("score");
  livesDisp = createP().id("lives");
  commentDisp=createP();
  ghost1Picture = ghostLesserPicture.get(0, 0, 72, 79);
  ghost2Picture = ghostLesserPicture.get(0, 105, 72, 79);
  ghost3Picture = ghostLesserPicture.get(0, 210, 72, 79);
  ghost4Picture = ghostLesserPicture.get(0, 315, 72, 79);
  for (let i = 0; i < 10; i++) ghosts[i] = new Ghost();
  for (let i = 0; i<200;i++){
	  snowX[i]=random(-5,645);
	  snowY[i]=random(-5,365);
  }
  captueMusic.playMode('restart');
  background(0);
}

function draw() {
  translate(-width/2,-height/2,0);
  if(firstRun){
	  image(ghost1Picture,random(-20,600),random(-20,320));
	  commentDisp.html("Click to Play");
	  if(mouseIsPressed){
		   firstRun=false;
		   commentDisp.html("");
		   startMusic.play();
	  }	   
	  return;
  }	  
  if(bossCount>=13){
	if(!tomMusic.isPlaying()){
		 tomMusic.play();
		 commentDisp.html("YOU WIN!!! Fortune favours the Ghost Sweeper.");
	}	 
	image(backPicture,0,0); 
	noStroke();
	fill(255);
	for(let i=0;i<snowX.length;i++){
		snowY[i]+=1;
		if(snowY[i]>365){
			snowY[i]=-5;
			snowX[i]=random(-5,644);
		}
		circle(snowX[i],snowY[i],5);
	}		
	return;  
  }	 
  if(lives<=0){	
	 if(endGame===300){
		 livesDisp.html("0");
		 commentDisp.html("Too bad, try again Ghost Sweeper.");
		 startMusic.stop();
		 soeMusic.play();
	 }	 
	 if(endGame!=0){
		 endGame--;
		  stroke(0);
	      fill("red");
	      circle(random(640),random(360),5);
		 return;
	 }else{
		 commentDisp.html("Click to play again.");
		 if(mouseIsPressed){
			 soeMusic.stop();
			 score = 0;
			 lives = 3;
			 bossCount=0;
		     lifeEffect=0;
			 endGame=300;
			 for(let i=0;i<ghosts.length;i++){
				 ghosts[i].active=false;
			 }
			 startMusic.play();
			 commentDisp.html("");
		 }
		 return;
	 }
  }
  image(backPicture,0,0);  
  image(trashCanPicture, 20, 290);
  if(lifeEffect!==0){
	  lifeEffect--;
	  fill("red");
	  rect(0,0,640,360);
  }
  if ((frameCount & 15) === 0) {
    scoreDisp.html("Score: " + score);
    livesDisp.html("Lives: " + lives);
  }
  if ((frameCount & 31) === 0) { // try to make a new ghost
    let stage = 0;
    if (score > 7000) stage = 1;
    if (score > 15000) stage = 2;
    if (score > 49000) stage = 3;
    if (score > 99999) stage = 4;
    if (random() < (stage + 1) * 0.2) {
      for (let i = 0; i < ghosts.length; i++) {
        if (ghosts[i].active === false) {
          ghosts[i].active = true;
          ghosts[i].startZ = 30 * stage;
          ghosts[i].z = ghosts[i].startZ;
          switch (int(random(stage + 1))) {
            case 0:
              ghosts[i].points = 50 + stage * 100;
              ghosts[i].img = ghost3Picture;
              break;
            case 1:
              ghosts[i].points = 100 + stage * 150;
              ghosts[i].img = ghost1Picture;
              break;
            case 2:
              ghosts[i].points = 250 + stage * 50;
              ghosts[i].img = ghost4Picture;
              break;
            case 3:
              ghosts[i].points = 700 + stage * 250;
              ghosts[i].img = ghost2Picture;
              break;
            case 4:
              ghosts[i].points = 30000;
              ghosts[i].img = ghostBossPicture;
              break;
          }
          switch (int(random(stage + 1))) {
            case 0:
              ghosts[i].x = random(200, 340);
              ghosts[i].y = random(55, 180);
              break;
            case 1:
              ghosts[i].x = random(530, 630);
              ghosts[i].y = random(40, 200);
              break;
            case 2:
              ghosts[i].x = random(350, 440);
              ghosts[i].y = random(110, 220);
              break;
            case 3:
              ghosts[i].x = random(530, 630);
              ghosts[i].y = random(40, 200);
              break;
            case 4:
              ghosts[i].x = random(90, 410);
              ghosts[i].y = random(30, 300);
              break;
          }
          let destX = random(20, 600);
          let destY= random(100, 340);
          ghosts[i].dX=(destX-ghosts[i].x)/(255-ghosts[i].startZ);
          ghosts[i].dY=(destY-ghosts[i].y)/(255-ghosts[i].startZ);
          break;
        }
      }
    }
  }
  ghosts.sort(function(a, b) {
    return b.z - a.z
  });
  for (let i = 0; i < ghosts.length; i++) {
    if (!ghosts[i].active) continue;
    if(ghosts[i].latch){
		ghosts[i].x=mouseX;
		ghosts[i].y=mouseY;
	}
    let sz = ghosts[i].startZ;
    ghosts[i].z+=1;
    if(ghosts[i].z===255){
      lives--;
      lifeEffect=30;
      hitMusic.play(); 
      ghosts[i].active=false;
      continue;
    }
    ghosts[i].x+=ghosts[i].dX;
    ghosts[i].y+=ghosts[i].dY;
    let currentSize=1.5*ghosts[i].z/255;
    let percentDone = (ghosts[i].z - sz)/ (255 - sz);
    let displayX=ghosts[i].x-35*currentSize;
    let displayY=ghosts[i].y-45*currentSize;
    tint(255,254*percentDone);
    image(ghosts[i].img, displayX, displayY,70*currentSize,90*currentSize);
    if(dist(mouseX,mouseY,ghosts[i].x,ghosts[i].y)<70*currentSize){
		ghosts[i].latch=true;
	}
	if(dist(trashCanX,trashCanY,ghosts[i].x,ghosts[i].y)<50){
		ghosts[i].active=false;
		ghosts[i].latch=false;
		score+=ghosts[i].points+(255-ghosts[i].z);
		captueMusic.play();
		if(ghosts[i].img==ghostBossPicture){
			bossCount+=1;
		}
	}
  }
}

class Ghost {
  constructor() {
    this.points = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.dX = 0;
    this.dY = 0;
    this.startZ = 0;
    this.img = null;
    this.active = false;
    this.latch=false;
  }
}
