/*
function setup() {
    line(15, 25, 70,90);
}
*/

/*
var x = 0;

function setup() {
    background(100);
}

function draw() {
    ellipse(x, height/2, 20, 20);
    x = x + 1;
}
*/

/*
function setup() {
    createCanvas(600, 400);
    line(15, 25, 70, 90);
}
*/

/*
function setup() {
    var myCanvas = createCanvas(600, 400);
    myCanvas.parent('myContainer');
}
*/

/*
function setup() {
    drawingContext.shadowOffsetX = 5;
    drawingContext.shadowOffsetY = -5;
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = "black";
    background(200);
    ellipse(width/2, height/2, 50, 50);
}
*/

/* Bien
function setup() {
    createCanvas(400, 240);
    loadImage('cat.jpg', drawCat);
}

function drawCat(img) {
    image(img, 0, 0);
}
*/

/* Mal
function setup() {
    createCanvas(400, 240);
    var img = loadImage('cat.jpg');
    image(img, 0, 0);
}
*/

/* Bien
var img;
function preload() {
    img = loadImage('cat.jpg');
}

function setup() {
    createCanvas(400, 240);
    image(img, 0, 0);
}
*/

/* Storing pointers and calling methods
var canvas;

function setup() {
    // We are still calling createCanvas like in the past, but now
    // we are storing the result as a variable. This way we can
    // call methods of the element, to set the position for instance.
    canvas = createCanvas(600, 400);

    // Here we call methods of each element to set the position
    // and id, try changing these values.
    // Use the inspector to look at the HTML generated from this
    // code when you load the sketch in your browser.
    canvas.position(300, 50);
    canvas.class("lemon");
}

function draw() {
    // These commands are applied to the graphics canvas as normal.
    background(220, 180, 200);
    ellipse(width/2, height/2, 100, 100);
    ellipse(width/4, height/2, 50, 50);
}
*/

/* Using parent()
// En html <div id='myContainer'></div>
function setup() {
    var myCanvas createCanvas(600, 400);
    myCanvas.parent('myContainer');
}
*/

/* Using position()
function setup() {
    var myCanvas = createCanvas(600, 400);
    myCanvas.position(100, 100);
}
*/

/* Creating other HTML elements
var canvas, text;

function setup() {
    canvas = createCanvas(600, 400);
    canvas.position(300, 50);

    text = createDiv("Here is some text and <a href='http://i.imgur.com/WXaUlrK.gif'>this is an HTML link</a>!");
    text.position(50, 50);
}

function draw() {
    background(220, 180, 200);

    ellipse(width/2, height/2, 100, 100);
    ellipse(width/4, height/2, 50, 50);
}
*/

/*
var img;
var canvas;

function setup() {
  img = createImg("http://th07.deviantart.net/fs70/PRE/i/2011/260/3/5/dash_hooray_by_rainbowcrab-d49xk0d.png");
  canvas = createCanvas(400, 400);

  img.parent('midi-block');
  img.position(190, 50);
  img.size(200, 200);

  canvas.parent('midi-block');
  canvas.position(300, 50);
}

function draw() {
  noStroke();
  background(220, 180, 200);
  fill(180, 200, 40);
  strokeWeight(6);
  stroke(180, 100, 240);
  for (var i = 0; i < width; i += 15) {
    line(i, 0, i, height);
  }
}
*/

function setup() {
  var divButtons = createDiv("MIDI file (*.mid) to upload: ");
  divButtons.id("buttons").parent("midi-box");
  var button = createButton("Examinar...");
  button.parent("buttons");
  button.mousePressed(load)

  var divPianoRoll = createDiv(null);
  divPianoRoll.id("pianoroll").parent("midi-box");
  var canvas = createCanvas(680, 2560);
  // Move the canvas so it's inside our <div id="sketch-holder">.
  canvas.parent('pianoroll');

  /*
  if (Drupal.settings.midi.dosmasdos === 4) {
    alert('Got it!');
  }
  */
}

function draw(){
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
}