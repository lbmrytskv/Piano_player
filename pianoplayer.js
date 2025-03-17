//
const keys = ['c-key', 'd-key', 'e-key', 'f-key', 'g-key', 'a-key', 'b-key', 'high-c-key',
  'c-sharp-key', 'd-sharp-key', 'f-sharp-key', 'g-sharp-key', 'a-sharp-key'];
const notes = [];
keys.forEach(function(key) {
  notes.push(document.getElementById(key));
});


const songLines = [
  ['G', 'G', 'A', 'G', 'C', 'B'], 
  ['G', 'G', 'A', 'G', 'D', 'C'], 
  ['G', 'G', 'G', 'E', 'C', 'B', 'A'], 
  ['F', 'F', 'E', 'C', 'D', 'C']  
];


const textElements = [
  document.getElementById('word-one'),
  document.getElementById('word-two'),
  document.getElementById('word-three'),
  document.getElementById('word-four'),
  document.getElementById('word-five'),
  document.getElementById('word-six')
];


let currentLineIndex = 0;
let currentNoteIndex = 0;

//
const noteFrequencies = {
  'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63,
  'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00,
  'A#': 466.16, 'B': 493.88, 'high-C': 523.25
};


function playSynth(note) {
  if (!noteFrequencies[note]) return;

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(noteFrequencies[note], audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.5);
}


let enhancedKeyPlay = function(event) {
  let pressedKey = event.target.textContent.trim();

  playSynth(pressedKey); 

  if (pressedKey === songLines[currentLineIndex][currentNoteIndex]) {
    event.target.style.backgroundColor = 'green';

    if (textElements[currentNoteIndex]) {
      textElements[currentNoteIndex].style.backgroundColor = 'green';
    }

    currentNoteIndex++;

 
    if (currentNoteIndex >= songLines[currentLineIndex].length) {
      setTimeout(() => triggerNextLine(), 500);
    }
  } else {
    event.target.style.backgroundColor = 'red';
  }
};


let keyReturn = function(event) {
  event.target.style.backgroundColor = '';
};


notes.forEach(function(note) {
  note.addEventListener('mousedown', enhancedKeyPlay);
  note.addEventListener('mouseup', keyReturn);
});


function triggerNextLine() {
  currentNoteIndex = 0;
  currentLineIndex++;

  if (currentLineIndex < songLines.length) {
    textElements.forEach(el => el.style.backgroundColor = '');

    if (currentLineIndex === 1) nextOne.click();
    else if (currentLineIndex === 2) nextTwo.click();
    else if (currentLineIndex === 3) nextThree.click();
  } else {
    startOver.click(); 
  }
}


let nextOne = document.getElementById('first-next-line');
let nextTwo = document.getElementById('second-next-line');
let nextThree = document.getElementById('third-next-line');
let startOver = document.getElementById('fourth-next-line');


nextTwo.hidden = true;
nextThree.hidden = true;
startOver.hidden = true;

function changeLine(lineIndex) {
  currentLineIndex = lineIndex;
  currentNoteIndex = 0;
  textElements.forEach(el => el.style.backgroundColor = '');
}


nextOne.onclick = function() {
  nextTwo.hidden = false;
  nextOne.hidden = true;
  document.getElementById('letter-note-five').innerHTML = 'D';
  document.getElementById('letter-note-six').innerHTML = 'C';
  changeLine(1);
};

nextTwo.onclick = function() {
  nextThree.hidden = false;
  nextTwo.hidden = true;
  document.getElementById('word-five').innerHTML = 'DEAR';
  document.getElementById('word-six').innerHTML = 'FRI-';
  document.getElementById('letter-note-three').innerHTML = 'G';
  document.getElementById('letter-note-four').innerHTML = 'E';
  document.getElementById('letter-note-five').innerHTML = 'C';
  document.getElementById('letter-note-six').innerHTML = 'B';
  document.getElementById('column-optional').style.display = 'inline-block';
  changeLine(2);
};

nextThree.onclick = function() {
  startOver.hidden = false;
  nextThree.hidden = true;
  document.getElementById('word-one').innerHTML = 'HAP-';
  document.getElementById('word-two').innerHTML = 'PY';
  document.getElementById('word-three').innerHTML = 'BIRTH';
  document.getElementById('word-four').innerHTML = 'DAY';
  document.getElementById('word-five').innerHTML = 'TO';
  document.getElementById('word-six').innerHTML = 'YOU!';
  document.getElementById('letter-note-one').innerHTML = 'F';
  document.getElementById('letter-note-two').innerHTML = 'F';
  document.getElementById('letter-note-three').innerHTML = 'E';
  document.getElementById('letter-note-four').innerHTML = 'C';
  document.getElementById('letter-note-five').innerHTML = 'D';
  document.getElementById('letter-note-six').innerHTML = 'C';
  document.getElementById('column-optional').style.display = 'none';
  changeLine(3);
};


startOver.onclick = function() {
  nextOne.hidden = false;
  startOver.hidden = true;
  document.getElementById('word-one').innerHTML = 'HAP-';
  document.getElementById('letter-note-one').innerHTML = 'G';
  document.getElementById('word-two').innerHTML = 'PY';
  document.getElementById('letter-note-two').innerHTML = 'G';
  document.getElementById('word-three').innerHTML = 'BIRTH-';
  document.getElementById('letter-note-three').innerHTML = 'A';
  document.getElementById('word-four').innerHTML = 'DAY';
  document.getElementById('letter-note-four').innerHTML = 'G';
  document.getElementById('word-five').innerHTML = 'TO';
  document.getElementById('letter-note-five').innerHTML = 'C';
  document.getElementById('word-six').innerHTML = 'YOU!';
  document.getElementById('letter-note-six').innerHTML = 'B';
  document.getElementById('column-optional').style.display = 'none';
  changeLine(0);
};

