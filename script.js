// global constants
const clueHoldTime = 500; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 500; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [1, 2, 6, 3, 2, 5, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;
var time = 30;
var timeleft = 0;
var timer;
var mistakes = 0;
var totalmistakes = 3;

function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  mistakes=totalmistakes
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  document.getElementById("countdown").innnerHTML = timeleft + "seconds";
  document.getElementById("guessesleft").innerHTML= mistakes; timeleft=time;
  playClueSequence();

  timeleft = time;
  timer = setInterval(function () {
    if (timeleft <= 0) {
      clearInterval(timer);
      document.getElementById("countdown").innerHTML = "Game Over !";
      loseGame();
    } else {
      document.getElementById("countdown").innerHTML = timeleft + " seconds";
      timeleft -= 1;
    }
  }, 500);
}

  
function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  clearInterval(timer);
}

//Sound Synthesis Functions
const freqMap = {
  1: 300,
  2: 330,
  3: 392,
  4: 440,
  5: 222,
  6: 290,
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

//play a single clue
function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}
function winGame() {
  clearInterval(timer);
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

   if (btn != pattern[guessCounter]) {
    // totalMistakes guesses incorrect --> lose
    if (mistakes == 1) {
      mistakes--;
      document.getElementById("guessesleft").innerHTML = mistakes;
      loseGame();
    } else {
      mistakes--;
      document.getElementById("guessesleft").innerHTML = mistakes;
      progress++;
      timeleft = time;
      playClueSequence();
      
    }
  } else {
    if (guessCounter != progress) {
      guessCounter++;
    } else {
      if (guessCounter != pattern.length - 1) {
        progress++;
        playClueSequence();
        timeleft = time;
      } else {
        winGame();
      }
    }
  }
}
