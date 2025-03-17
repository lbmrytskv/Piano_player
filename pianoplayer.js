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
  ['G', 'G', 'G', 'E', 'C', 'B']
];

// Array of text elements
const textElements = [
  document.getElementById('word-one'),
  document.getElementById('word-two'),
  document.getElementById('word-three'),
  document.getElementById('word-four'),
  document.getElementById('word-five'),
  document.getElementById('word-six')
];

// Initial state
let currentLineIndex = 0;
let currentNoteIndex = 0;

// 🎵 **Frequencies of notes for sound generation**
const noteFrequencies = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88,
  'high-C': 523.25
};

// 🎵 **Function to generate synthesized sound**
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

// Function to update note display after Reset or line change
function updateNoteDisplay() {
  document.getElementById('letter-note-one').innerHTML = songLines[currentLineIndex][0] || '';
  document.getElementById('letter-note-two').innerHTML = songLines[currentLineIndex][1] || '';
  document.getElementById('letter-note-three').innerHTML = songLines[currentLineIndex][2] || '';
  document.getElementById('letter-note-four').innerHTML = songLines[currentLineIndex][3] || '';
  document.getElementById('letter-note-five').innerHTML = songLines[currentLineIndex][4] || '';
  document.getElementById('letter-note-six').innerHTML = songLines[currentLineIndex][5] || '';
}

// Function to manually switch lines
function changeLine(lineIndex) {
  currentLineIndex = lineIndex;
  currentNoteIndex = 0;
  textElements.forEach(el => el.style.backgroundColor = '');
  updateNoteDisplay();
}

// Function for key press
let enhancedKeyPlay = function(event) {
  let pressedKey = event.target.textContent.trim();

  playSynth(pressedKey); // Додаємо звук

  if (pressedKey === songLines[currentLineIndex][currentNoteIndex]) {
    event.target.style.backgroundColor = 'green';

    if (textElements[currentNoteIndex]) {
      textElements[currentNoteIndex].style.backgroundColor = 'green';
    }

    currentNoteIndex++;

    // 🔥 Фікс: перевіряємо довжину поточного рядка динамічно!
    if (currentNoteIndex >= songLines[currentLineIndex].length) {
      setTimeout(() => triggerNextLine(), 300);
    }
  } else {
    event.target.style.backgroundColor = 'red';
  }
};


// Function to reset key color
let keyReturn = function(event) {
  event.target.style.backgroundColor = '';
};

// Add event listeners to keys
notes.forEach(function(note) {
  note.addEventListener('mousedown', enhancedKeyPlay);
  note.addEventListener('mouseup', keyReturn);
});




// **Function to reset game properly**
function resetGame() {
  currentLineIndex = 0;
  currentNoteIndex = 0;
  textElements.forEach(el => el.style.backgroundColor = '');
  updateNoteDisplay(); // Fix for updating the note display

  nextOne.hidden = false;
  nextTwo.hidden = true;
  nextThree.hidden = true;
  startOver.hidden = true;
}

// Buttons for manually switching lines
let nextOne = document.getElementById('first-next-line');
let nextTwo = document.getElementById('second-next-line');
let nextThree = document.getElementById('third-next-line');
let startOver = document.getElementById('fourth-next-line');

// Hide all buttons except the first one initially
nextTwo.hidden = true;
nextThree.hidden = true;
startOver.hidden = true;

// Button event handlers
nextOne.onclick = function() {
  nextTwo.hidden = false;
  nextOne.hidden = true;
  changeLine(1);
};

nextTwo.onclick = function() {
  nextThree.hidden = false;
  nextTwo.hidden = true;
  changeLine(2);
};

nextThree.onclick = function() {
  startOver.hidden = false;
  nextThree.hidden = true;
  changeLine(3);
};

// Reset button event handler (Fixed)
startOver.onclick = function() {
  resetGame(); // Reset to the first line properly
};

// **Function to trigger the next line automatically if all notes are played**
function triggerNextLine() {
  currentNoteIndex = 0;
  currentLineIndex++;

  if (currentLineIndex < songLines.length) {
    textElements.forEach(el => el.style.backgroundColor = '');

    if (currentLineIndex === 1) nextOne.click();
    else if (currentLineIndex === 2) nextTwo.click();
    else if (currentLineIndex === 3) nextThree.click();
    else startOver.click(); // Останній рядок автоматично завершує гру
  }
}

