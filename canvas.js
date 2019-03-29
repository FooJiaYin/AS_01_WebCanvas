var canvas;
var canvasWidth = 500;
var canvasHeight = 500;
var ctx; 
var currentRGBA = {
    red: 0,
    green: 0,
    blue: 0,
    alpha: 255,
    setRGBA: function (r, g, b, a) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a;
    },
    get string() {
        return 'rgba(' + this.red.toString() + ', ' + this.green.toString() + ', ' + this.blue.toString() + ', ' + this.alpha.toString() + ')';
    }
};
var currentColor = 0;
function Coordinates(x, y) { 
    this.x = x;
    this.y = y;
}
var startPoints = new Coordinates(0, 0);
var picker = new Coordinates(199, 199);
var isDrawing = false;
var textbox;
var cache;

function load() {
    initialize();
    loadPalette();
    if (canvas != null) {
        canvas.onclick = function(e) { 
            if (currentTool=='text') {
                ctx.fillStyle = currentRGBA.string;
                textbox.value = "";
                textbox.style.visibility = 'visible';
                //textbox.style.display = 'none';
                /*textbox.style.color = '#00000000';
                textbox.style.backgroundColor = '#00000000';
                textbox.style.borderColor = '#00000000';
                textbox.style.outline = 'none; !important';*/
                textbox.style.left = e.clientX.toString() + 'px';
                textbox.style.top = e.clientY.toString() + 'px';
                startPoints.x = e.clientX;
                startPoints.y = e.clientY;
                document.getElementById('textbox').focus();
            }          
            else if (currentTool=='paste') {
                imageHolder = document.getElementById('imageHolder');
                ctx.drawImage(imageHolder, e.clientX, e.clientY);
            }
        }
        canvas.onmousedown = function(e) {
            document.getElementById('textbox').focus();
            cache = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            if (currentTool=='brush01' || currentTool=='eraser' ) {
                isDrawing = true;
                ctx.lineJoin = ctx.lineCap = 'round';
                ctx.moveTo(e.clientX, e.clientY);
            }
            else if (currentTool=='rectangle' || currentTool=='triangle' || currentTool=='circle') {
                if(isDrawing == false) {
                    startPoints.x = e.clientX;
                    startPoints.y = e.clientY;
                    isDrawing = true;
                }
            }
        }
        canvas.onmousemove = function(e) {
            if(isDrawing) {
                if (currentTool=='brush01') {
                    ctx.strokeStyle = currentRGBA.string;
                    ctx.lineTo(e.clientX, e.clientY);
                    ctx.stroke();
                }
                else if (currentTool=='eraser') {
                    ctx.strokeStyle = 'white';
                    ctx.lineTo(e.clientX, e.clientY);
                    ctx.stroke();
                }
                else if (currentTool=='rectangle') {                 
                    ctx.putImageData(cache, 0, 0);
                    ctx.fillStyle = currentRGBA.string;
                    ctx.fillRect(startPoints.x, startPoints.y, e.clientX-startPoints.x, e.clientY-startPoints.y);
                }
                else if (currentTool=='triangle') {         
                    ctx.putImageData(cache, 0, 0);
                    ctx.beginPath();
                    ctx.fillStyle = currentRGBA.string;
                    ctx.moveTo(startPoints.x, startPoints.y);
                    ctx.lineTo(e.clientX, e.clientY);
                    ctx.lineTo((startPoints.x)*2 - e.clientX, e.clientY);
                    ctx.fill();
                }
                else if (currentTool=='circle') {         
                    ctx.putImageData(cache, 0, 0);
                    ctx.beginPath();
                    var dx = startPoints.x- e.clientX;
                    var dy = startPoints.y- e.clientY;
                    ctx.fillStyle = currentRGBA.string;
                    ctx.arc(startPoints.x, startPoints.y, Math.sqrt((dx*dx)+(dy*dy)), 0, Math.PI * 2, true);
                    ctx.fill();
                }
            }
        };
        canvas.onmouseup = function() {
            isDrawing = false;
            if (currentTool!='text') {
                startPoints.x = 0;
                startPoints.y = 0;
            }
        };
        var currentText = textbox.value;
        textbox.onkeypress = function(e) {
            if (currentTool=='text') {
                ctx.putImageData(cache, 0, 0);
                ctx.fillText(textbox.value + e.key, startPoints.x, startPoints.y);
            }
        }
        textbox.onkeydown = function(e) {
            if (currentTool=='text') {
                //currentText += e.key;
                ctx.putImageData(cache, 0, 0);
                ctx.fillText(textbox.value, startPoints.x, startPoints.y);
            }
        }
    }
} 

function loadPalette() {
    palette = document.getElementById('palette');
    canvas = document.getElementById('canvas');
    var ctx2 = palette.getContext('2d');
    //var gradient02_position = new Coordinates(0, 100);
    //var gradient02_size = new Coordinates(100, 20);
    var gradient02 = ctx2.createLinearGradient(0, 210, 200, 210);
    gradient02.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient02.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient02.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient02.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient02.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient02.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient02.addColorStop(1, 'rgba(255, 0, 0, 1)');
    ctx2.fillStyle = gradient02;
    ctx2.fillRect(0, 200, 200, 20);
    updateColor();
    palette.onclick = function(e) {
        if(e.clientY <= 200) {
            picker.x = e.clientX - 516;
            picker.y = e.clientY;
        }
        else if(e.clientY <= 220) {
            currentColor = e.clientX - 516;
        }
        updateColor();
    }
}

function updateColor() {
    palette = document.getElementById('palette');
    var ctx2 = palette.getContext('2d');
    //var gradient01_position = new Coordinates(0, 0);
    setColor(2);

    var gradient01_size = new Coordinates(200, 200);
    var gradient01 = ctx2.createLinearGradient(0, 0, 199, 99);
    ctx2.fillStyle = currentRGBA.string;
    ctx2.fillRect(0, 0, gradient01_size.x, gradient01_size.y);
    
    var grdWhite = ctx2.createLinearGradient(0, 0, gradient01_size.x-1, 0);
    grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
    grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
    ctx2.fillStyle = grdWhite;
    ctx2.fillRect(0, 0, gradient01_size.x, gradient01_size.y);
    
    var grdBlack = ctx2.createLinearGradient(0, 0, 0, gradient01_size.y-1);
    grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
    grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
    ctx2.fillStyle = grdBlack;
    ctx2.fillRect(0, 0, gradient01_size.x, gradient01_size.y);

    setColor(1);

    ctx2.beginPath();
    ctx2.moveTo(0, 0);
    ctx2.lineTo(0, 200);
    ctx2.lineTo(200, 200);
    ctx2.lineTo(200, 0);
    ctx2.clip();

    ctx2.beginPath();
    ctx2.lineWidth = 1;
    ctx2.strokeStyle = 'white';
    ctx2.arc(picker.x, picker.y, 6, 0, Math.PI * 2, true);
    ctx2.stroke();
    ctx2.closePath();
}

function setColor(mode) {
    palette = document.getElementById('palette');
    var ctx2 = palette.getContext('2d');
    var colorInfo;
    var id = currentColor*4;
    if (mode == 1) {
        colorInfo = ctx2.getImageData(0, 0, 200, 200).data;
        id = ((picker.y*200)+picker.x)*4;
    }
    else {
        colorInfo = ctx2.getImageData(0, 200, 200, 20).data;
    }
    var r = colorInfo[id+0];
    var g = colorInfo[id+1];
    var b = colorInfo[id+2];
    var a = colorInfo[id+3];
    currentRGBA.setRGBA(r, g, b, a);
    console.log(currentRGBA);
}

function initialize() {
    canvas = document.getElementById('canvas');
    textbox = document.getElementById('textbox');
    choose('brush01');
    if (canvas != null) {
        ctx = canvas.getContext('2d');
        changeSize(10);
        cache = ctx.getImageData(0, 0, canvas.width, canvas.height);
        changeFont();
    }
    isDrawing = false;
    startPoints.x = 0;
    startPoints.y = 0;
}

function reset() {
    canvas.height = 0;
    canvas.height = canvasHeight;
    ctx.lineWidth = 10;
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function choose(tool) {
    currentTool = tool;
    if(tool=='brush01') {
        canvas.style.cursor = "url('image/brush.png') 60 60, auto";
    } else if (tool=='eraser') {
        canvas.style.cursor = "url('image/eraser.png') 20 60, auto";
    } else if (tool=='paste') {
        canvas.style.cursor = "url('image/paste.png') 4 4, auto";
    } else {
        canvas.style.cursor = 'crosshair';
    }
    isDrawing = false;
    textbox.style.visibility = 'hidden';
}

function changeSize() {
    var slider = document.getElementById("sizeSlider");
    var value = document.getElementById("size");
    value.innerHTML = slider.value; 
    ctx.lineWidth = slider.value;
    slider.oninput = function() {
        changeSize();
    }
}

function changeFont() {
    var fontSize = document.getElementById("fontSize").value;
    var font = document.getElementById("font").value;
    ctx.font = fontSize + ' ' + font;
    textbox.focus();
    ctx.putImageData(cache, 0, 0);
    ctx.fillText(textbox.value, startPoints.x, startPoints.y-12);
}

function undo() {
    var redo = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(cache, 0, 0);
    cache = redo;
    ctx.beginPath();
}

function readFile() {
    //var img = new Image();
    var holder = document.getElementById('imageHolder');
    var file = document.getElementById('upload').files[0];
    var reader  = new FileReader();
    reader.onload = function (e) {
        holder.src = e.target.result;
        //img.src = e.target.result;
        //document.getElementById('canvas').getContext('2d').drawImage(img, 0, 0);
        choose('paste');
    }
    if (file) {
       reader.readAsDataURL(file);
    }
}

function save() {
    var link = document.getElementById('download');
    link.href = document.getElementById('canvas').toDataURL("image/png");
}