const BEAT_WIDTH = 24; // ancho de cada beat
const BEAT_HEIGHT = 24; // altura de cada beat
const TEXT_SIZE = BEAT_HEIGHT - 16; // El tamaño de fuente del texto de la tecla pulsada
const MIN_WIDTH_FOR_TEXT = 24; // Anchura mínima de la nota pintada para que dibuje el texto de la nota (Ej. C#5)
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

const NOTES = [
  // note 69 (A6) = A440
  //note 60 (C6) = Middle C

  //Do          Re           Mi    Fa           So           La           Si
  'C0', 'C#0', 'D0', 'D#0', 'E0', 'F0', 'F#0', 'G0', 'G#0', 'A0', 'A#0', 'B0',
  'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
  'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
  'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
  'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
  'C8', 'C#8', 'D8', 'D#8', 'E8', 'F8', 'F#8', 'G8', 'G#8', 'A8', 'A#8', 'B8',
  'C9', 'C#9', 'D9', 'D#9', 'E9', 'F9', 'F#9', 'G9', 'G#9', 'A9', 'A#9', 'B9',
  'C10','C#10','D10','D#10','E10','F10','F#10','G10'
];

const MFILE = "MFile 0 1 96";
const MTRK = "MTrk";
const META_TRKEND = "Meta TrkEnd";
const TRKEND = "TrkEnd";

/*
keyWidht
384 -> redonda
192 -> blanca
96  -> negra
48  -> corchea
24  -> semicorchea
 */
var keyWidth = 96; // ancho de la tecla pulsada (24px es la unidad mínima, semicorchea).

// Iniciamos un array que contendrá 128 array, cada uno por cada nota.
var arrayNotes = [];
for (var i = 0; i < 128; i++) {
  arrayNotes[i] = [];
}

var estaBorrando = false;

function setup() {
  // var divButtons = createDiv("Herramientas: ");
  // divButtons.id("buttons").parent("midi-box");
  var buttonPintar = createButton("Pintar");
  buttonPintar.parent("buttons");
  buttonPintar.mousePressed(changeDraw);

  var buttonBorrar = createButton("Borrar");
  buttonBorrar.parent("buttons");
  buttonBorrar.mousePressed(changeErase);

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

function changeDraw() {
  estaBorrando = false;
}

function changeErase() {
  estaBorrando = true;
}

function addNote() {
  var posX = Math.floor(mouseX / BEAT_WIDTH) * BEAT_WIDTH;
  var posY = Math.floor(mouseY / BEAT_HEIGHT) * BEAT_HEIGHT;

  if (!estaBorrando) {
    stroke(1); // borde réctangulo nota negro
    fill(36, 231, 17); // Verde puro



    var esPintable = true;
    var i = 0;
    while (i < arrayNotes[posY / BEAT_HEIGHT].length && esPintable) {
      if ((posX >= arrayNotes[posY / BEAT_HEIGHT][i][0]
              && posX < arrayNotes[posY / BEAT_HEIGHT][i][1])
          || (posX + keyWidth - BEAT_WIDTH >= arrayNotes[posY / BEAT_HEIGHT][i][0]
              && posX + keyWidth - BEAT_WIDTH < arrayNotes[posY / BEAT_HEIGHT][i][1])) {
        esPintable = false;
      }
      // console.log(arrayNotes[posY / BEAT_HEIGHT][i]);
      i++;
    }

    if (esPintable) {
      // Draw the key
      rect(posX, posY, keyWidth, BEAT_HEIGHT, 2);
      console.log(`${posX}, ${posY}, ${posX + keyWidth}, ${BEAT_HEIGHT}`);

      // Añadimos la nota pulsada al arrayNotes
      arrayNotes[posY / BEAT_HEIGHT].push([posX, posX + keyWidth]);

      if (keyWidth >= MIN_WIDTH_FOR_TEXT) {
        textSize(TEXT_SIZE);
        fill(0);
        text(TEXT_NOTES[posY / BEAT_HEIGHT], posX + 1, posY + BEAT_HEIGHT - 1);
      }

      console.log(arrayNotes);
    }
  }
  else if (estaBorrando) {

  }
}

/*
function numerarNota() {
  (posY - 127) * -1;
}
*/

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