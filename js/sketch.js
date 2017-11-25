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
var keyWidth = 96; // Ancho de la tecla pulsada (24px es la unidad mínima, semicorchea).
var volumenOnNota = 100; // Volumen con que se pulsa la nota (default)
var volumenOffNota = 0; // Volumen con que se apaga la nota (default)
var channelNota = 1; // Canal de la nota (default)
var spanDuracion;
var sliderKeyWidth;
var buttonPintar;
var buttonBorrar;
var buttonCrearMidiText;
var canvas;

// Iniciamos un array que contendrá 128 array, cada uno por cada nota.
var arrayNotes = [];
for (var i = 0; i < 128; i++) {
  arrayNotes[i] = [];
}

// var arrayOrdenado = [];

var estaBorrando = false;

var osc;

function setup() {
  document.getElementById("edit-miditext").readOnly = true;

  spanDuracion = createSpan('4 cuadrado(s)');
  spanDuracion.parent("buttons");

  // slider
  sliderKeyWidth = createSlider(1, 32, 4, 1);
  sliderKeyWidth.parent("buttons");
  sliderKeyWidth.style('width', '80px');
  sliderKeyWidth.changed(cambiarDuracion);

  // Botón Pintar
  buttonPintar = createButton("Pintar");
  buttonPintar.parent("buttons");
  buttonPintar.class("pintarSelected"); // Clase Button no definitivo
  buttonPintar.mousePressed(changeDraw);

  // Botón Borrar
  buttonBorrar = createButton("Borrar");
  buttonBorrar.parent("buttons");
  buttonBorrar.mousePressed(changeErase);

  // Botón CrearMidiText
  buttonCrearMidiText = createButton("Crear Midi text");
  buttonCrearMidiText.parent("buttons").hide();
  buttonCrearMidiText.mousePressed(crearMidiText);

  // Creamos el canvas
  canvas = createCanvas(BEAT_WIDTH * 64, BEAT_HEIGHT * 128);

  canvas.mouseClicked(clickCanvas); // attach listener for canvas only

  // Move the canvas so it's inside our <div id="pianoroll">.
  canvas.parent('pianoroll');

  // Disabling right click context menu on a HTML Canvas
  document.addEventListener('contextmenu', function(e) {
    var elem = e.target.closest('canvas');
    if (elem) {
      e.preventDefault();
    }
  }, false);

  /*
  if (Drupal.settings.midi.dosmasdos === 4) {
    alert('Got it!');
  }
  */

  // Pintamos (canvas) los rectángulos de fondo inicialmente
  for (var note = 0; note < 128; note++) {
    stroke(170); // borde rectángulos grises
    fill(255);
    if((note % 12 == 11)    // G#
        ||(note % 12 == 9)  // A#
        ||(note % 12 == 6)  // C#
        ||(note % 12 == 4)  // D#
        ||(note % 12 == 1)) // F#
    {
      fill(200);
    }

    var y = note * BEAT_HEIGHT;
    // Draw the key
    rect(0, y, width, BEAT_HEIGHT);
  }

  // Pintamos (canvas) las líneas verticales inicialmente
  var i = 0;
  while (i < width) {
    if (i % (BEAT_WIDTH * 16) == 0) {
      stroke(0);
      strokeWeight(2);
    }

    else if (i % (BEAT_WIDTH * 4) == 0) {
      stroke(85);
    }
    else {
      stroke(170);
    }


    line(i, 0, i, height);
    strokeWeight(1); // 1px de anchura del stroke (strokeWeight(1) por defecto)
    i = i + BEAT_WIDTH;
  }
  noStroke();

  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(240);
  // A triangle oscillator
  //osc = new p5.TriOsc();
  // Start silent
  osc.start();
  osc.amp(0);
}

function cambiarDuracion() {
  spanDuracion.html(sliderKeyWidth.value() + " cuadrado(s)");
}

function changeDraw() {
  buttonBorrar.removeClass("borrarSelected"); // Clase Button no definitivo
  buttonPintar.class("pintarSelected"); // Clase Button no definitivo
  estaBorrando = false;
}

function changeErase() {
  buttonPintar.removeClass("pintarSelected"); // Clase Button no definitivo
  buttonBorrar.class("borrarSelected"); // Clase Button no definitivo
  estaBorrando = true;
}

function clickCanvas() { // user click the canvas
  var posX = Math.floor(mouseX / BEAT_WIDTH) * BEAT_WIDTH;
  var posY = Math.floor(mouseY / BEAT_HEIGHT) * BEAT_HEIGHT;

  var notaY = posY / BEAT_HEIGHT;

  if (!estaBorrando) {
    keyWidth = sliderKeyWidth.value() * BEAT_WIDTH;
    console.log(keyWidth);
    var esPintable = true;
    var i = 0;
    while (i < arrayNotes[notaY].length && esPintable) {
      if ((posX >= arrayNotes[notaY][i][0]
              && posX < arrayNotes[notaY][i][1])
          || (posX + keyWidth - BEAT_WIDTH >= arrayNotes[notaY][i][0]
              && posX + keyWidth - BEAT_WIDTH < arrayNotes[notaY][i][1])
          || (arrayNotes[notaY][i][0] >= posX
              && arrayNotes[notaY][i][1] < posX + keyWidth)) {
        esPintable = false;
      }
      i++;
    }

    console.log(esPintable);
    if (esPintable) {
      // Sonido tecla pulsada con su duración.
      playNote(numerarNotaMidiReal(notaY));

      fill(36, 231, 17); // Verde puro
      // Draw the key
      if ((posX + keyWidth) % 384 == 0) {
        rect(posX + 1, posY + 1, keyWidth - 2, BEAT_HEIGHT - 1, 2);
      }
      else {
        rect(posX + 1, posY + 1, keyWidth - 1, BEAT_HEIGHT - 1, 2);
      }

      // Añadimos la nota pulsada al arrayNotes
      // posX -> posición dónde empieza la nota
      // posX + keyWidth -> posición dónde termina la nota
      // volumenOnNota -> Volumen con que se pulsa la nota
      // volumenOffNota -> Volumen con que se apaga la nota
      // channelNota -> Canal de la nota
      arrayNotes[notaY].push([posX, posX + keyWidth, volumenOnNota,volumenOffNota, channelNota]);

      if (keyWidth >= MIN_WIDTH_FOR_TEXT) {
        textSize(TEXT_SIZE);
        fill(0);
        text(TEXT_NOTES[notaY], posX + 1, posY + BEAT_HEIGHT - 1);
      }


    }
  }
  else if (estaBorrando) {
    var noEsBorrable = true;
    var i = 0;
    while (i < arrayNotes[notaY].length && noEsBorrable) {
      if (posX >= arrayNotes[notaY][i][0] && posX < arrayNotes[notaY][i][1]) {
        noEsBorrable = false;

        // Repintamos el rectángulo de fondo
        fill(255);
        if(((notaY) % 12 == 11)    // G#
            ||((notaY) % 12 == 9)  // A#
            ||((notaY) % 12 == 6)  // C#
            ||((notaY) % 12 == 4)  // D#
            ||((notaY) % 12 == 1)) // F#
        {
          fill(200);
        }
        rect(arrayNotes[notaY][i][0], posY + 1, arrayNotes[notaY][i][1] - arrayNotes[notaY][i][0], BEAT_HEIGHT - 1);

        // Repintamos las líneas verticales
        var j = arrayNotes[notaY][i][0];
        while (j <= arrayNotes[notaY][i][1]) {
          if (j % (BEAT_WIDTH * 16) == 0) {
            stroke(0);
            strokeWeight(2);
          }

          else if (j % (BEAT_WIDTH * 4) == 0) {
            stroke(85);
          }
          else {
            stroke(170);
          }


          line(j, posY, j, posY + BEAT_HEIGHT);
          strokeWeight(1); // default
          j = j + BEAT_WIDTH;
        }

        // Borramos la notaPulsada del arrayNotes
        arrayNotes[notaY].splice(i, 1);
        select('textarea').value("");
      }
      i++;
    }

    noStroke();
  }

  habilitarCrearMidiText();
}

function habilitarCrearMidiText() {
  var contieneNotas = false;
  var i = 0;
  while (i < arrayNotes.length && !contieneNotas) {
    if (arrayNotes[i].length > 0) {
      contieneNotas = true;
    }
    i++;
  }

  if (contieneNotas) {
    buttonCrearMidiText.show();
    buttonCrearMidiText.style("display", "inline");
  }
  else {
    buttonCrearMidiText.hide();
  }
}

// const MFILE = "MFile 0 1 96";
// const MTRK = "MTrk";
// const META_TRKEND = "Meta TrkEnd";
// const TRKEND = "TrkEnd";

function crearMidiText() {
  var arrayOrdenado = [];
  var stringMidi = "";

  stringMidi += MFILE + "\n";
  stringMidi += MTRK + "\n";

  for (var i = 0; i < arrayNotes.length; i++) {
    for (var j = 0; j < arrayNotes[i].length; j++) {
      var posInicio = arrayNotes[i][j][0];
      var ch = arrayNotes[i][j][4];
      var n = numerarNotaMidiReal(i);
      var volInicio = arrayNotes[i][j][2];

      var posFinal = arrayNotes[i][j][1];
      var volFinal = arrayNotes[i][j][3];

      arrayOrdenado.push([posInicio, ch, n, volInicio]);
      arrayOrdenado.push([posFinal, ch, n, volFinal]);
    }
  }

  // Primero ordenamos por volumen de 0 a más (necesario para el cierre de nota con volumen 0)
  arrayOrdenado.sort(function (a, b) {
    return a[3] - b[3];
  });

  // Segundo ordenamos por posición de 0 a más.
  arrayOrdenado.sort(function (a, b) {
    return a[0] - b[0];
  });

  // Seguimos añadiendo al stringMidi
  for (var i = 0; i < arrayOrdenado.length; i++) {
    stringMidi += arrayOrdenado[i][0] + " On ch=" + arrayOrdenado[i][1] + " n=" + arrayOrdenado[i][2] + " v=" + arrayOrdenado[i][3] + "\n";
  }

  stringMidi += arrayOrdenado[arrayOrdenado.length - 1][0] + " " + META_TRKEND + "\n";
  stringMidi += TRKEND;

  console.log(stringMidi);
  select('textarea').value(stringMidi);
}

// 0 -> 127, 1 -> 126, 2 -> 125, ...
function numerarNotaMidiReal(notaSinTransformar) {
  return (notaSinTransformar - 127) * (-1);
}

// A function to play a note
function playNote(note, duration) {
  osc.freq(midiToFreq(note));
  // Fade it in
  osc.fade(0.5,0.2);

  osc.fade(0,0.5);

  // If we sest a duration, fade it out
  if (duration) {
    setTimeout(function() {
      osc.fade(0,0.2);
    }, duration-50);
  }
}

function getDurationMilisegundos() {
  return 500 * keyWidth / 96; // 500 milisegundos en 120 BPM (Beats por minuto)
}

/*
function draw(){

}
*/