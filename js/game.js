const fonAudio            = new Audio('sound/sonic1.wav');
const reloadAudio         = new Audio('sound/fire/reload.wav');
const menusAudio          = [new Audio('sound/menu/menu1.wav'),new Audio('sound/menu/menu2.wav'),new Audio('sound/menu/menu3.wav')];
const tauntsAudio         = [new Audio('sound/taunts/taunt_1.wav'),new Audio('sound/taunts/taunt_2.wav'),new Audio('sound/taunts/taunt_3.wav'),new Audio('sound/taunts/taunt_4.wav'),new Audio('sound/taunts/taunt_5.wav')];
const shotsAudio          = [new Audio('sound/fire/bfg_fire.wav'),new Audio('sound/fire/grenlf1a.wav'),new Audio('sound/fire/plasmx1a.wav'),new Audio('sound/fire/rocklf1a.wav')];
const criticalAudio       = [new Audio('sound/items/damage3.wav'),new Audio('sound/items/quaddamage.wav'),new Audio('sound/feedback/humiliation.wav'),new Audio('sound/feedback/impressive.wav'),new Audio('sound/feedback/excellent.wav'),new Audio('sound/feedback/perfect.wav')];
const blockAudio          = [new Audio('sound/items/protect.wav'),new Audio('sound/items/protect3.wav')];
const deathAudio          = new Audio('sound/feedback/sudden_death.wav');
const winAudio            = new Audio('sound/win/win.wav');
const nightmareAudio      = new Audio('sound/nightmare.wav');

const firstButton         = document.querySelector(".first-section__button");
const spaceField          = document.querySelector(".first-section__space-field");
const healthShipRed       = document.querySelector(".health-ship-red");
const healthShipBlue      = document.querySelector(".health-ship-blue");
const shipRed             = document.querySelector("#ship-red");
const shipBlue            = document.querySelector("#ship-blue");

const healthPointRed      = 23000;  // колличество жизней красного
const healthPointBlue     = 15000;  // колличество жизней синего
const damageShootingRed   = 2000;   // наносимый урон красного  
const damageShootingBlue  = 2500;   // наносимый урон синего  
const speedShootingRed    = 2500;   // частота стрельбы в MS красного
const speedShootingBlue   = 2000;   // частота стрельбы в MS синего
const chanceCriticalRed   = 50;     // шанс увеличить урон в ПРОЦЕНТАХ красного
const chanceCriticalBlue  = 70;     // шанс увеличить урон в ПРОЦЕНТАХ синего
const chanceBlockRed      = 60;     // шанс уменьшить урон в ПРОЦЕНТАХ ПО красному
const chanceBlockBlue     = 50;     // шанс уменьшить урон в ПРОЦЕНТАХ ПО синему
const sizeCriticalRed     = 2;      // в сколько раз увеличить урон красного
const sizeCriticalBlue    = 3;      // в сколько раз увеличить урон синего
const sizeBlockRed        = 4;      // в сколько раз уменьшить урон ПО красному
const sizeBlockBlue       = 3;      // в сколько раз уменьшить урон ПО синему
const chanceSuddenDeath   = 5;      // шанс внезапной смерти в ПРОЦЕНТАХ

firstButton.addEventListener("click", debounce(startGame, 3000));
firstButton.addEventListener("mouseenter", playMenu);
firstButton.addEventListener("mouseleave", playMenu);

function startGame(){
  showSpaceShip();
  startShooting();
  playFonMusic();
}
function showSpaceShip(){
  firstButton.style.transform = 'scale(0)';
  shipRed.style.transform = 'translate(-10%, -50%) scale(1)';
  shipBlue.style.transform = 'translate(10%, -50%) scale(1)';
  healthShipRed.innerHTML = `${healthPointRed} HP`;
  healthShipBlue.innerHTML = `${healthPointBlue} HP`;
}
function startShooting(){
  window.shootingRed = setInterval(function(){shotAction('red')}, speedShootingRed);
  window.shootingBlue = setInterval(function(){shotAction('blue')}, speedShootingBlue);
}
function shotAction(typeShip){
  let shot = document.createElement("div");
  let rotate = document.createElement("div");
  rotate.classList.add(`rotate-shot-${typeShip}`);
  shot.classList.add("shot");
  shot.classList.add(`${typeShip}-shot`);

  shot.appendChild(rotate);
  spaceField.appendChild(shot);
  if(typeShip == 'red'){
    shot.style.top = `${shipRed.offsetTop}px`;
  }else{
    shot.style.top = `${shipBlue.offsetTop}px`;
  };
  shot.classList.add(`action-shot-${typeShip}`);
  checkShot(shot);
  playShots();
}
function checkShot(shot){
  let damageFlag = false;

  let check = setInterval(function(){
    if(!damageFlag && shot.classList.contains('red-shot') && shot.offsetTop + 20 > shipBlue.offsetTop-60 && shot.offsetTop < shipBlue.offsetTop+60 - 20 && shot.offsetLeft + 20 > shipBlue.offsetLeft){
      damageFlag = true;
      reliazeDamage(shot);
      removeShot(shot);
      checkShip();
      clearInterval(check);
    }
    if(!damageFlag && shot.classList.contains('blue-shot') && shot.offsetTop + 20 > shipRed.offsetTop-60 && shot.offsetTop < shipRed.offsetTop+60 - 20 && shot.offsetLeft < shipRed.offsetLeft + 120){
      damageFlag = true;
      reliazeDamage(shot);
      removeShot(shot);
      checkShip();
      clearInterval(check);
    }
    if(shot.offsetLeft > window.innerWidth+20 || shot.offsetLeft < 0 + 20){
      removeShot(shot);
      clearInterval(check);
    }
  }, 100);
}
function removeShot(shot){
  shot.classList.add("shot-out");
  shot.remove();
  document.querySelectorAll('.shot-out').forEach(function(e){e.remove()});
}


let healthCurrentRed = healthPointRed;
let healthCurrentBlue = healthPointBlue;  
function reliazeDamage(shot){
  if(shot.classList.contains('red-shot')){
    let summerDamageRed = Math.round(damageShootingRed * criticalDamage(shot, chanceCriticalRed, sizeCriticalRed) / blockDamage(shot, chanceBlockBlue, sizeBlockBlue));
    healthCurrentBlue = healthCurrentBlue - summerDamageRed;
    document.querySelector(".health-ship-blue").innerHTML = `${healthCurrentBlue} HP`;
    shipBlue.style.borderLeft = `${healthCurrentBlue/healthPointBlue*20}px solid rgba(0,0,255, .5)`;    
  }
  if(shot.classList.contains('blue-shot')){
    let summerDamageBlue = Math.round(damageShootingBlue * criticalDamage(shot, chanceCriticalBlue, sizeCriticalBlue) / blockDamage(shot, chanceBlockRed, sizeBlockRed));
    healthCurrentRed = healthCurrentRed - summerDamageBlue;
    document.querySelector(".health-ship-red").innerHTML = `${healthCurrentRed} HP`;
    shipRed.style.borderRight = `${healthCurrentRed/healthPointRed*20}px solid rgba(255,0,0, .5)`;
  }
}
function criticalDamage(shot, chanceCritical, sizeCritical) {
  if(chanceCritical >= randomInteger(1,100)){
    if(shot.classList.contains('red-shot')){
        const sb = document.querySelector('.critical-ship-blue');
        sb.classList.add('animate-critical');
        setTimeout(function(){sb.classList.remove('animate-critical')}, 2000)
      if(!suddenDeath(shot, chanceSuddenDeath)){
        playCriticalDamage();
        return sizeCritical;
      }else return 1000;
    }
    if(shot.classList.contains('blue-shot')){
        const sr = document.querySelector('.critical-ship-red');
        sr.classList.add('animate-critical');
        setTimeout(function(){sr.classList.remove('animate-critical')}, 2000)
      if(!suddenDeath(shot, chanceSuddenDeath)){
        playCriticalDamage();
        return sizeCritical;
      }else return 1000;
    }
  }else return 1;
}
function blockDamage(shot, chanceBlock, sizeBlocking) {
  if(chanceBlock >= randomInteger(1,100)){
    if(shot.classList.contains('red-shot')){
      const sb = document.querySelector('.block-ship-blue');
      sb.classList.add('animate-block');
      setTimeout(function(){sb.classList.remove('animate-block')}, 2000)
      playBlockDamage();
      return sizeBlocking;
    }
    if(shot.classList.contains('blue-shot')){
      const sr = document.querySelector('.block-ship-red');
      sr.classList.add('animate-block');
      setTimeout(function(){sr.classList.remove('animate-block')}, 2000)
      playBlockDamage();
      return sizeBlocking;
    }
  }else return 1;
}
function suddenDeath(shot, chanceSuddenDeath){
  if (chanceSuddenDeath >= randomInteger(1,100)) { 
      playSuddenDeath();
    if(shot.classList.contains('red-shot')){
      healthCurrentBlue = -1;
      checkShip();
      return true;
    }
    if(shot.classList.contains('blue-shot')){
      healthCurrentRed = -1;
      checkShip();
      return true;
    }
  } else return false;
}
function checkShip(){
  if(healthCurrentRed <= 0){
    shipRed.style.opacity = '0';
    document.querySelector(".health-ship-red").innerHTML = '0 HP';
    shipRed.style.borderRight = 'none';
    stopGame();
  }
  if(healthCurrentBlue <= 0){
    shipBlue.style.opacity = '0';
    document.querySelector(".health-ship-blue").innerHTML = '0 HP';
    shipBlue.style.borderRight = 'none';
    stopGame();
  }
}
let flagDeath = false;
function stopGame(){
  fonAudio.volume = 0;
  setTimeout(function(){document.querySelectorAll('.shot').forEach(function(e){e.remove()})}, 2000);
  clearInterval(window.shootingRed);
  clearInterval(window.shootingBlue);
  if(!flagDeath){
    playWin();
    setTimeout(function(){playTaunt()}, 1000);
    setTimeout(function(){playNightmare()}, 18000);
    flagDeath = true;    
  }
}

function playFonMusic(){
  fonAudio.currentTime = 30.5;
  fonAudio.volume = 1;
  fonAudio.play();
}
function playCriticalDamage(){
  criticalAudio.forEach(function(e){e.currentTime = 0; e.volume = 0.9})
  criticalAudio[randomInteger(0, criticalAudio.length-1)].play();
}
function playBlockDamage(){
  blockAudio.forEach(function(e){e.currentTime = 0; e.volume = 0.9})
  blockAudio[randomInteger(0, blockAudio.length-1)].play();
}
function playShots(){
  shotsAudio.forEach(function(e){e.currentTime = 0; e.volume = 0.9})
  reloadAudio.play()
  setTimeout(function(){shotsAudio[randomInteger(0, shotsAudio.length-1)].play()}, 100);
}
function playTaunt(){
  tauntsAudio.forEach(function(e){e.currentTime = 0; e.volume = 1})
  tauntsAudio[randomInteger(0, tauntsAudio.length-1)].play();
}
function playSuddenDeath(){
  deathAudio.volume = 1;
  deathAudio.currentTime = 0;
  deathAudio.play();
}
function playWin(){
  winAudio.volume = 1;
  winAudio.currentTime = 0;
  winAudio.play();
}
function playNightmare(){
  nightmareAudio.volume = 1;
  nightmareAudio.currentTime = 0;
  nightmareAudio.play();
}
function playMenu(){
  menusAudio.forEach(function(e){e.currentTime = 0; e.volume = 1})
  menusAudio[randomInteger(0, menusAudio.length-1)].play();
}


// повтор дорожки циклично
// let audio_file = new Audio('whatever.mp3')
// audio_file.addEventListener('timeupdate', function(){
//   let buffer = .44
//   if(this.currentTime > this.duration - buffer){
//       this.currentTime = 0
//       this.play()
//   }}, false);


const ships = shipsConfig;
console.log(ships.red);
