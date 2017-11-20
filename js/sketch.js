const BEAT_WIDTH = 20; // ancho de cada beat
const BEAT_HEIGHT = 20; // altura de cada beat
const TEXT_SIZE = BEAT_HEIGHT - 8; // El tamaño de fuente del texto de la tecla pulsada
const MIN_WIDTH_FOR_TEXT = 40;
const TEXT_NOTES = [
                            'G10','F#10','F10','E10','D#10','D10','C#10','C10',
  'B9', 'A#9', 'A9', 'G#9', 'G9', 'F#9', 'F9', 'E9', 'D#9', 'D9', 'C#9', 'C9',
  'B8', 'A#8', 'A8', 'G#8', 'G8', 'F#8', 'F8', 'E8', 'D#8', 'D8', 'C#8', 'C8',
  'B7', 'A#7', 'A7', 'G#7', 'G7', 'F#7', 'F7', 'E7', 'D#7', 'D7', 'C#7', 'C7',
  'B6', 'A#6', 'A6', 'G#6', 'G6', 'F#6', 'F6', 'E6', 'D#6', 'D6', 'C#6', 'C6',
  'B5', 'A#5', 'A5', 'G#5', 'G5', 'F#5', 'F5', 'E5', 'D#5', 'D5', 'C#5', 'C5',
  'B4', 'A#4', 'A4', 'G#4', 'G4', 'F#4', 'F4', 'E4', 'D#4', 'D4', 'C#4', 'C4',
  'B3', 'A#3', 'A3', 'G#3', 'G3', 'F#3', 'F3', 'E3', 'D#3', 'D3', 'C#3', 'C3',
  'B2', 'A#2', 'A2', 'G#2', 'G2', 'F#2', 'F2', 'E2', 'D#2', 'D2', 'C#2', 'C2',
  'B1', 'A#1', 'A1', 'G#1', 'G1', 'F#1', 'F1', 'E1', 'D#1', 'D1', 'C#1', 'C1',
  'B0', 'A#0', 'A0', 'G#0', 'G0', 'F#0', 'F0', 'E0', 'D#0', 'D0', 'C#0', 'C0'
  //SI          LA           SOL          FA    MI           RE           DO
];

var keyWidth = 40; // ancho de la tecla pulsada (20px es la unidad mínima).

function setup() {
  // var divButtons = createDiv("Herramientas: ");
  // divButtons.id("buttons").parent("midi-box");
  var button = createButton("Pintar");
  button.parent("buttons");
  // button.mousePressed();

  // var divPianoRoll = createDiv(null);
  // divPianoRoll.id("pianoroll").parent("midi-box");
  var canvas = createCanvas(BEAT_WIDTH * 64, BEAT_HEIGHT * 128);

  canvas.mouseClicked(addNote); // attach listener for canvas only

  // Move the canvas so it's inside our <div id="pianoroll">.
  canvas.parent('pianoroll');

  /*
  if (Drupal.settings.midi.dosmasdos === 4) {
    alert('Got it!');
  }
  */

  for (var note = 0; note < 128; note++) {
    stroke(170); // borde rectángulos grises
    noFill();
    if((note % 12 == 1) // C#
        ||(note % 12 == 3) // Eb
        ||(note % 12 == 6) // F#
        ||(note % 12 == 8) // Ab
        ||(note % 12 == 10)) // Bb
    {
      fill(200);
    }

    var y = note * BEAT_HEIGHT;
    // Draw the key
    rect(0, y, width-1, BEAT_HEIGHT-1);
  }

  var i = 0;
  while (i < width) {
    if (i % (BEAT_WIDTH * 16) == 0) {
      stroke(0);
      strokeWeight(2);
    }

    else if (i % (BEAT_WIDTH * 4) == 0) {
      stroke(85);
      strokeWeight(1);
    }
    else {
      stroke(170);
      strokeWeight(1);
    }


    line(i, 0, i, height);
    i = i + BEAT_WIDTH;
  }
}


function addNote() {
  stroke(1); // borde réctangulo nota negro
  fill(36, 231, 17); // Verde puro

  var posX = Math.floor(mouseX / BEAT_WIDTH) * BEAT_WIDTH;
  var posY = Math.floor(mouseY / BEAT_HEIGHT) * BEAT_HEIGHT;

  // Draw the key
  rect(posX, posY, keyWidth, BEAT_HEIGHT, 2);
  console.log(`${posX}, ${posY}, 40, ${BEAT_HEIGHT}`);

  if (keyWidth >= MIN_WIDTH_FOR_TEXT) {
    textSize(TEXT_SIZE);
    fill(0);
    text(TEXT_NOTES[posY / BEAT_HEIGHT], posX + 1, posY + BEAT_HEIGHT - 1);
  }
}


function draw(){
  /*
  // The height for each key
  var h = height / 128;
  for (var i = 0; i < 128; i++) {
    var y = i * h;


    // If the mouse is over the key
    if (mouseY > y && mouseY < y + h && mouseX < width) {
      // If we're clicking
      if (mouseIsPressed) {
        fill(100,255,200);
        // Or just rolling over
      } else {
        fill(127);
      }
    } else {
      fill(200);
    }

    // Draw the key
    rect(0, y, width-1, h-1);
  }
  */
}