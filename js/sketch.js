const BEAT_WIDTH = 24; // ancho de cada beat (cuadrado)
const BEAT_HEIGHT = 24; // altura de cada beat (cuadrado)
const TEXT_SIZE = BEAT_HEIGHT - 16; // El tamaño de fuente del texto de la tecla pulsada
const MIN_WIDTH_FOR_TEXT = 24; // Anchura mínima de la nota pintada para que dibuje el texto de la nota (Ej. C#5)
const TEXT_NOTES = [
  'C8',
  'B7', 'A#7', 'A7', 'G#7', 'G7', 'F#7', 'F7', 'E7', 'D#7', 'D7', 'C#7', 'C7',
  'B6', 'A#6', 'A6', 'G#6', 'G6', 'F#6', 'F6', 'E6', 'D#6', 'D6', 'C#6', 'C6',
  'B5', 'A#5', 'A5', 'G#5', 'G5', 'F#5', 'F5', 'E5', 'D#5', 'D5', 'C#5', 'C5',
  'B4', 'A#4', 'A4', 'G#4', 'G4', 'F#4', 'F4', 'E4', 'D#4', 'D4', 'C#4', 'C4',
  'B3', 'A#3', 'A3', 'G#3', 'G3', 'F#3', 'F3', 'E3', 'D#3', 'D3', 'C#3', 'C3',
  'B2', 'A#2', 'A2', 'G#2', 'G2', 'F#2', 'F2', 'E2', 'D#2', 'D2', 'C#2', 'C2',
  'B1', 'A#1', 'A1', 'G#1', 'G1', 'F#1', 'F1', 'E1', 'D#1', 'D1', 'C#1', 'C1',
  'B0', 'A#0', 'A0'
  //SI          LA           SOL          FA    MI           RE           DO
];

// note 69 (A4) = A440
//note 60 (C4) = Middle C
const MP3_OGG_SOUNDS = [
  '108-C8',
  '107-B7', '106-As7', '105-A7', '104-Gs7', '103-G7', '102-Fs7', '101-F7', '100-E7', '99-Ds7', '98-D7', '97-Cs7', '96-C7',
  '95-B6', '94-As6', '93-A6', '92-Gs6', '91-G6', '90-Fs6', '89-F6', '88-E6', '87-Ds6', '86-D6', '85-Cs6', '84-C6',
  '83-B5', '82-As5', '81-A5', '80-Gs5', '79-G5', '78-Fs5', '77-F5', '76-E5', '75-Ds5', '74-D5', '73-Cs5', '72-C5',
  '71-B4', '70-As4', '69-A4', '68-Gs4', '67-G4', '66-Fs4', '65-F4', '64-E4', '63-Ds4', '62-D4', '61-Cs4', '60-C4',
  '59-B3', '58-As3', '57-A3', '56-Gs3', '55-G3', '54-Fs3', '53-F3', '52-E3', '51-Ds3', '50-D3', '49-Cs3', '48-C3',
  '47-B2', '46-As2', '45-A2', '44-Gs2', '43-G2', '42-Fs2', '41-F2', '40-E2', '39-Ds2', '38-D2', '37-Cs2', '36-C2',
  '35-B1', '34-As1', '33-A1', '32-Gs1', '31-G1', '30-Fs1', '29-F1', '28-E1', '27-Ds1', '26-D1', '25-Cs1', '24-C1',
  '23-B0', '22-As0', '21-A0'
];

const MFILE = "MFile 0 1 96";
const MTRK = "MTrk";
const META_TRKEND = "Meta TrkEnd";
const TRKEND = "TrkEnd";

var buttonSaveMidiFile;
/*
keyWidht
384 -> redonda
192 -> blanca
96  -> negra
48  -> corchea
24  -> semicorchea
 */
var keyWidth = 96; // Ancho de la tecla pulsada (24px es la unidad mínima, semicorchea).
var volumenOnNota = 127; // Volumen con que se pulsa la nota (default)
var volumenOffNota = 0; // Volumen con que se apaga la nota (default)
var channelNota = 1; // Canal de la nota (default)
var spanDuracion; // Span que nos muestra el número de cuadrados seleccionados en el slider
var sliderKeyWidth; // Slider para escoger el ancho de la tecla pulsada (en nº de cuadrados)
var buttonPintar; // Pintar tecla pulsada
var buttonBorrar; // Borrar tecla pulsada
var buttonAtras; // Atrasa la vista del pianoroll 4 cuadrados
var buttonAdelante; // Adelanta la vista del pianoroll 4 cuadrados

var imgTeclado; // imágen png del piano como referencia para pintar.

// Divs que que contendrán la barra de progreso mientras se recargan los archivos
// antes de que el pianoroll esté operativo
var divProgress;
var divBar;
var idInterval; // idInterval usado para mostrar la barra de progreso

// Divs que contienen los 2 scrolls del canvas arriba y abajo
var divWrapper1;
var divWrapper2;

var canvas; // Dónde se pinta el pianoroll
var notaY; // Se identificará con cada una de las posiciones [i] del arrayNotes y del array soundOfPianoNotes que crearemos a continuación.
// notaY se obtendrá de notaY = posY / BEAT_HEIGHT; cada vez que pulsemos en el canvas cuando se ejecute la función clickCanvas()

// Iniciamos un array que contendrá 88 arrays, uno por cada nota.
var arrayNotes = [];
for (var i = 0; i < 88; i++) {
  arrayNotes[i] = [];
}

var estaBorrando = false; // Al cargar el pianoroll por primera vez comenzamos pintando ya que se encuentra vacío

var soundOfPianoNotes = []; // Array que contendrá los archivos de sonido mp3 y ogg de las notas del piano

// Precargamos sonidos de notas e imágen del piano antes de que el canvas pianoroll esté operativo
// Se autoejecuta solo (propio del funcionamiento de la librería p5.js)
function preload() {
  select('#edit-miditext').value("");
  document.getElementById("edit-miditext").readOnly = true; // Text area miditext readOnly

  // Creamos he insertamos la imagen teclado88.png dentro del <div id="teclado">
  select('#teclado').style('height', (BEAT_HEIGHT * 88) + 'px')
  imgTeclado = createImg(Drupal.settings.midi_module_path + "/assets/img/teclado88.png");
  imgTeclado.style('width', '100%');
  imgTeclado.style('height', '100%');
  imgTeclado.parent(select('#teclado'));

  // Desabilitamos el click derecho context menu en el <div id="teclado"> que contiene la imgTeclado
  // Esto evita que alguien pulse la opción ver Imagen que obligaría a recargar la página posteriormente de nuevo.
  document.addEventListener('contextmenu', function(e) {
    var elem = e.target.closest("#teclado");
    if (elem) {
      e.preventDefault();
    }
  }, false);

  // Progress Bar
  divProgress = createDiv("").id("progress");
  divProgress.parent("pianoroll");

  divBar = createDiv("Loading Pianoroll...").id("bar");
  divBar.parent(divProgress);

  var widthBar = 30;
  idInterval = setInterval(function(){
    if (widthBar >= 100) {
      widthBar = 20;
    }
    else {
      widthBar += 10;
      divBar.style("width", widthBar + "%");
    }
  }, 240);


  // Load soundOfPianoNotes audios
  for (var i = 0; i < 88; i++) { // 88 teclas
    soundOfPianoNotes[i] = loadSound([
      Drupal.settings.midi_module_path + '/assets/piano_sounds/' + MP3_OGG_SOUNDS[i] + '.mp3',
      Drupal.settings.midi_module_path + '/assets/piano_sounds/' + MP3_OGG_SOUNDS[i] + '.ogg'
    ]);
  }
}

// Se autoejecuta después de la función preload (propio del funcionamiento de la librería p5.js)
function setup() {
  clearInterval(idInterval); // Paramos la barra de progreso
  divProgress.remove(); // Removemos la barra de progreso

  select('#topscroll-pianoroll').style('width', (BEAT_WIDTH * 64) + 'px');

  spanDuracion = createSpan('4 cuadrado(s)');
  spanDuracion.parent("buttons"); // parent() - Movemos el spanDuracion dentro del <div id="buttons">

  // slider
  sliderKeyWidth = createSlider(1, 32, 4, 1);
  sliderKeyWidth.parent("buttons");
  sliderKeyWidth.style('width', '80px');
  sliderKeyWidth.changed(cambiarDuracion);

  // Botón Pintar
  buttonPintar = createButton("Pintar");
  buttonPintar.parent("buttons");
  buttonPintar.class("pintarSelected");
  buttonPintar.mousePressed(changeDraw);

  // Botón Borrar
  buttonBorrar = createButton("Borrar");
  buttonBorrar.parent("buttons");
  buttonBorrar.mousePressed(changeErase);

  // Botón Atrás
  buttonAtras = createButton("<-- pianoroll atrás");
  buttonAtras.parent("buttons");
  buttonAtras.mousePressed(pianorollAtras);

  // Botón Adelante
  buttonAdelante = createButton("pianoroll adelante -->");
  buttonAdelante.parent("buttons");
  buttonAdelante.mousePressed(pianorollAdelante);

  // Botón SaveMidiFile
  buttonSaveMidiFile = select('#edit-submitcreate');

  // funcionalidad doble scroll arriba y abajo del canvas
  divWrapper1 = document.getElementById("wrapper1");
  divWrapper2 = document.getElementById("wrapper2");

  divWrapper1.addEventListener("scroll", function () {
    divWrapper2.scrollLeft = divWrapper1.scrollLeft;
  });

  divWrapper2.addEventListener("scroll", function () {
    divWrapper1.scrollLeft = divWrapper2.scrollLeft;
  });

  // Creamos el canvas con un ancho y un alto y display en línea
  canvas = createCanvas(BEAT_WIDTH * 64, BEAT_HEIGHT * 88).style("display", "inline");
  canvas.mouseClicked(clickCanvas); // attach listener al canvas solo
  canvas.parent('pianoroll');

  // Desabilitamos el click derecho context menu en el HTML Canvas
  document.addEventListener('contextmenu', function(e) {
    var elem = e.target.closest('canvas');
    if (elem) {
      e.preventDefault();
    }
  }, false);

  // Pintamos (canvas) los rectángulos de fondo inicialmente
  for (var note = 0; note < 88; note++) {
    stroke(170); // borde rectángulos grises
    fill(255);
    if((note % 12 == 11)    // C#
        ||(note % 12 == 9)  // D#
        ||(note % 12 == 6)  // F#
        ||(note % 12 == 4)  // G#
        ||(note % 12 == 2)) // A#
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
}

function cambiarDuracion() {
  spanDuracion.html(sliderKeyWidth.value() + " cuadrado(s)");
}

function changeDraw() {
  buttonBorrar.removeClass("borrarSelected");
  buttonPintar.class("pintarSelected");
  estaBorrando = false;
}

function changeErase() {
  buttonPintar.removeClass("pintarSelected");
  buttonBorrar.class("borrarSelected");
  estaBorrando = true;
}

function pianorollAtras() {
  divWrapper1.scrollLeft -= BEAT_WIDTH * 4;
  divWrapper2.scrollLeft -= BEAT_WIDTH * 4;
}

function pianorollAdelante() {
  divWrapper1.scrollLeft += BEAT_WIDTH * 4;
  divWrapper2.scrollLeft += BEAT_WIDTH * 4;
}



function clickCanvas() { // user click the canvas
  var posX = Math.floor(mouseX / BEAT_WIDTH) * BEAT_WIDTH;
  var posY = Math.floor(mouseY / BEAT_HEIGHT) * BEAT_HEIGHT;

  // Cada vez que pulsemos el canvas si existe notaY paramos la ejecución del sonido de dicha nota
  if (notaY) {
    soundOfPianoNotes[notaY].stop();
  }

  notaY = posY / BEAT_HEIGHT;

  if (!estaBorrando) {
    keyWidth = sliderKeyWidth.value() * BEAT_WIDTH;

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

    if (esPintable) {
      soundOfPianoNotes[notaY].play();

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
        if(((notaY) % 12 == 11)    // C#
            ||((notaY) % 12 == 9)  // D#
            ||((notaY) % 12 == 6)  // F#
            ||((notaY) % 12 == 4)  // G#
            ||((notaY) % 12 == 2)) // A#
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
      }
      i++;
    }

    noStroke();
  }

  habilitarSaveMidiFile();
}

function habilitarSaveMidiFile() {
  var contieneNotas = false;
  var i = 0;
  while (i < arrayNotes.length && !contieneNotas) {
    if (arrayNotes[i].length > 0) {
      contieneNotas = true;
    }
    i++;
  }

  if (contieneNotas) {
    crearMidiText();
    buttonSaveMidiFile.show();
  }
  else {
    buttonSaveMidiFile.hide();
    select('#edit-miditext').value(""); // borra el textarea value
    changeDraw();
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

  select('#edit-miditext').value(stringMidi);
}

// 0 -> 127, 1 -> 126, 2 -> 125, ...
function numerarNotaMidiReal(notaSinTransformar) {
  return (notaSinTransformar - 87) * (-1);
}

function getDurationEnSegundos() {
  return 500 * keyWidth / 96 / 1000; // 500 milisegundos en 120 BPM (Beats por minuto)
}