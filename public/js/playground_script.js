let redSlider = document.getElementById('redSlider');
let greenSlider = document.getElementById('greenSlider');
let blueSlider = document.getElementById('blueSlider');


var drawCanvas = document.getElementById("myCanvas");
var ctx = drawCanvas.getContext("2d");
var grd = ctx.createRadialGradient(50, 50, 15, 50, 50, 60);
grd.addColorStop(0, 'rgb(' + redSlider.value + ', ' + greenSlider.value + ', ' + blueSlider.value + ')');
grd.addColorStop(1, "white");

redSlider.addEventListener('input', function () {
    drawCircle();
});

greenSlider.addEventListener('input', function () {
    drawCircle();
});

blueSlider.addEventListener('input', function () {
    drawCircle();
});

function drawCircle() {
    var grd = ctx.createRadialGradient(50, 50, 15, 50, 50, 40);
    grd.addColorStop(0, 'rgb(' + redSlider.value + ', ' + greenSlider.value + ', ' + blueSlider.value + ')');
    grd.addColorStop(1, "white");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(50, 50, 25, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#003300";
    ctx.stroke();
}

ctx.fillStyle = grd;
ctx.beginPath();
ctx.arc(50, 50, 25, 0, 2 * Math.PI, false);
ctx.fill();
ctx.lineWidth = 2;
ctx.strokeStyle = "#003300";
ctx.stroke();