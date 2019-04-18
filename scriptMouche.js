$(document).ready(function() {
  console.log("Hello mouche ! ");
  startGame();
  init();
});

function startGame() {
  terrain.start();
  terrain.stop();
  terrain.start();
  mouche = new mouche(10, "#0000ff", 360, 240);
}

var terrain = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.setAttribute("id", "zone_dessin");
    this.canvas.width = 720;
    this.canvas.height = 480;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 30);
  },
  stop: function() {
    clearInterval(this.interval);
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

}

function mouche(radius, color, x, y) {
  console.log("mouche");
  this.radius = radius;
  this.x = x;
  this.y = y;
  this.speedX = 5;
  this.angle = Math.PI / 4;

  this.update = function() {
    ctx = terrain.context;
    ctx.save();
    ctx.translate(this.x, this.y);
    //ctx.rotate(this.angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
  this.newPos = function() {
    this.x += this.speedX * Math.cos(this.angle);
    this.y -= this.speedX * Math.sin(this.angle);
  }
}

function trait(x1, y1, x2, y2, color) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;

  this.update = function() {
    ctx = terrain.context;
    ctx.fillStyle = color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

}


function updateGameArea() {
  terrain.clear();
  //terrain.trait();
  //terrain.collision(mouche, )
  try {
    trait1.update();
  } catch (e) {};

  collision();
  mouche.newPos();
  mouche.update();
  sens(mouche);
}

function collisionCoteTerrain(mouche, terrain) { //collision avec les bords du terrain de jeu
  if ((mouche.x < 0 + mouche.radius) || (mouche.x > terrain.canvas.width - mouche.radius)) {
    mouche.angle = Math.PI - mouche.angle;
  }
  if ((mouche.y < 0 + mouche.radius) || (mouche.y > terrain.canvas.height - mouche.radius)) {
    mouche.angle = -mouche.angle;
  }
  //if (mouche.x > terrain.canvas.width - mouche.radius) { return true};
  //if (mouche.y < 0 + mouche.radius) { mouche.angle = 3 * Math.PI / 2};
  //if (mouche.y > terrain.canvas.height - mouche.radius) { mouche.angle = Math.PI / 2 };
}

function sens(mouche) {
  var cosinus = Math.cos(mouche.angle);
  var sinus = Math.sin(mouche.angle);
  var etat = "";
  if ((cosinus > 0) && (sinus > 0)) {
    etat = "HD";
  }
  if ((cosinus < 0) && (sinus < 0)) {
    etat = "BG";
  }
  if ((cosinus > 0) && (sinus < 0)) {
    etat = "BD";
  }
  if ((cosinus < 0) && (sinus > 0)) {
    etat = "HG";
  }
  console.log("cosinus = " + cosinus + " - sinus = " + sinus + " ---- vers " + etat);
}

function collisionBordLigne(cx, cy, cr, x1, y1) { //collision avec les extrémités de la ligne.
  var distX = cx - x1;
  var distY = cy - y1;
  var distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

  if (distance <= cr) {
    return true
  } else {
    return false
  }
}

function collisionCentreLigne(x1, y1, x2, y2, procheX, procheY) { //collision avec l'un des points de la ligne.
  //Calcul de la distance entre le centre du cercle et les deux extrémités du trait.
  var d1 = dist(procheX, procheY, x1, y1);
  var d2 = dist(procheX, procheY, x2, y2);
  //Calcul de la longueur de la ligne.
  var longt = dist(x1, y1, x2, y2);
  //Définition d'un tampon
  var tamp = 0.1;
  //test
  if (d1 + d2 >= longt - tamp && d1 + d2 <= longt + tamp) {
    return true;
  } else {
    return false;
  }
}

function collisionCentreLigneEtendue(mouche, trait1) {
  //test des collisions au bord du trait
  var inside1 = collisionBordLigne(mouche.x, mouche.y, mouche.radius, trait.x1, trait.y1);
  var inside2 = collisionBordLigne(mouche.x, mouche.y, mouche.radius, trait.x2, trait.y2);
  if (inside1 || inside2) {
    return true
  };

  var longt = dist(trait1.x1, trait1.y1, trait1.x2, trait1.y2);
  //produit scalaire
  var dot = (((mouche.x - trait1.x1) * (trait1.x2 - trait1.x1)) + ((mouche.y - trait1.y1) * (trait1.y2 - trait1.y1))) / Math.pow(longt, 2);
  //points les plus proches.
  var procheX = trait1.x1 + (dot * (trait1.x2 - trait1.x1));
  var procheY = trait1.y1 + (dot * (trait1.y2 - trait1.y1));
  //test des collision au centre du trait
  var sursegment = collisionCentreLigne(trait1.x1, trait1.y1, trait1.x2, trait1.y2, procheX, procheY);
  if (!sursegment) {
    return false
  };

  var distanceproche = dist(procheX, procheY, mouche.x, mouche.y);
  if (distanceproche <= mouche.radius) {
    return true
  };
  return false
}

function collision() {
  try {
    var colLigne = collisionCentreLigneEtendue(mouche, trait1);
    if (colLigne) {
      mouche.speedX = -mouche.speedX;
    }
  } catch (e) {
    console.log("le trait n'est pas défini");
  }
  collisionCoteTerrain(mouche, terrain);
}

function dist(x1, y1, x2, y2) {
  var a = x1 - x2;
  var b = y1 - y2;
  var c = Math.sqrt(a * a + b * b);

  return c
}

//Events de la souris

var press = false;
var coordx1, coordy1, coordx2, coordy2;

function init() {
  var canvas = document.getElementById("zone_dessin");
  canvas.addEventListener("mousemove", doMouseMove, false);
  canvas.addEventListener("mousedown", doMouseDown, false);
  canvas.addEventListener("mouseup", doMouseUp, false);
}

function doMouseMove(e) {
  canvas_x = e.clientX - 10;
  canvas_y = e.clientY - 10;
  document.getElementById('coordonnes').value = canvas_x + ', ' + canvas_y;
}

function doMouseDown(e) {
  if (!press) {
    coordx1 = e.clientX - 10;
    coordy1 = e.clientY - 10;
    press = true;
  }
}

function doMouseUp(e) {
  if (press) {
    coordx2 = e.clientX - 10;
    coordy2 = e.clientY - 10;
    press = false;
  }
  dessiner();
}


function dessiner() {
  document.getElementById("prem").innerHTML = "coord départ : (" + coordx1 + ";" + coordy1 + ")";
  document.getElementById("sec").innerHTML = "coord départ : (" + coordx2 + ";" + coordy2 + ")";
  trait1 = new trait(coordx1, coordy1, coordx2, coordy2, "#0000ff");
}
