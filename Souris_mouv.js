{
function init() {
  var canvas = document.getElementById("zone_dessin");
  canvas.addEventListener("mousemove", doMouseMove, false);
  canvas.addEventListener("mousedown", doMouseDown, false);
  canvas.addEventListener("mouseup", doMouseUp, false);
}

function doMouseMove(e) {
  if (dessine) {
    canvas_x = e.clientX - 10;
    canvas_y = e.clientY - 10;
    document.getElementById('coordonnes').value = canvas_x + ', ' + canvas_y;
    dessiner();
  }
}

function doMouseDown(e) {
  dessine = true;
  canvas_x = e.clientX - 10;
  canvas_y = e.clientY - 10;
}

function doMouseUp(e) {
  dessine = false;
  deb = false;
}
}

function dessiner() {
  var canvas = document.getElementById("zone_dessin");
  var ctx = canvas.getContext("2d");
  if (!deb) {
    ctx.beginPath();
    ctx.moveTo(canvas_x, canvas_y);
    deb = true;
  }
  else {
    ctx.lineTo(canvas_x, canvas_y);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 5;
    ctx.stroke();
  }
}
