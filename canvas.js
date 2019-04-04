var canvas;
var canvasWidth = 600;
var canvasHeight = 400;
var currentLayer;
var currentTool;
var ctx; 
var lastLayer = 0;
var layerId = 1;
var layerNo = 1;
var currentRGBA = {
    red: 0,
    green: 0,
    blue: 0,
    alpha: 25,
    setRGBA: function (r, g, b, a) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a;
    },
    get string() {
        var str = 'rgba(' + this.red.toString() + ', ' + this.green.toString() + ', ' + this.blue.toString() + ', ' + this.alpha.toString() + ')';
        console.log(str);
        return str;
    },
    get brightness() {
        return (this.red + this.green + this.blue) / 3.0;
    }
};
var currentColor = 0;
function Coordinates(x, y) { 
    this.x = x;
    this.y = y;
}
var startPoints = new Coordinates(0, 0);
var endPoints = new Coordinates(0, 0);
var picker = new Coordinates(199, 199);
var isDrawing = false;
var textbox;
var clipboard;
var cache;
var selectionCache;

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})


$(function () {
    $('[data-toggle="popover"]').popover({
    })
})

$('shapes').mouseenter(function(){
    var pos = $(this).position();
    $(this).find('div').css('top', (pos.top)+50 + 'px').fadeIn();
  }).mouseleave(function(){
    $(this).find('div').fadeOut();
  });

$('shapes').onmouseover( function() {
    $('shapes-hidden').style.visibility = visible;
});



function load() {
    initialize();
    loadPalette();
    if (canvas != null) {
        canvas.onclick = function(e) { 
            console.log(e.clientX, e.clientY);            
            offset = $('#layer0').offset();
            console.log(offset);
            var currentPoint = new Coordinates(Math.floor(e.clientX-offset.left), Math.floor(e.clientY-offset.top))
            console.log(e.clientX, e.clientY);
            console.log(offset.left, offset.top)
            console.log(currentPoint);
            if (currentTool=='text') {
                ctx.fillStyle = currentRGBA.string;
                textbox.value = "";
                textbox.style.visibility = 'visible';
                //textbox.style.display = 'none';
                /*textbox.style.color = '#00000000';
                textbox.style.backgroundColor = '#00000000';
                textbox.style.borderColor = '#00000000';
                textbox.style.outline = 'none; !important';*/
                textbox.style.left = currentPoint.x.toString() + 'px';
                textbox.style.top = currentPoint.y.toString() + 'px';
                startPoints.x = currentPoint.x;
                startPoints.y = currentPoint.y;
                document.getElementById('textbox').focus();
            }          
            else if (currentTool=='paste') {
                imageHolder = document.getElementById('imageHolder');
                ctx.drawImage(imageHolder, currentPoint.x, currentPoint.y);
            }
            else if (currentTool=='pasteLocal') {
                ctx.putImageData(clipboard, currentPoint.x, currentPoint.y);
            }
            updateMini();
        }
        canvas.onmousedown = function(e) {
            offset = $('#layer0').offset();
            var currentPoint = new Coordinates(Math.floor(e.clientX-offset.left), Math.floor(e.clientY-offset.top));
            document.getElementById('textbox').focus();
            if(currentTool != 'select') {
                cache = ctx.getImageData(0, 0, canvas.width, canvas.height);
                lastLayer = layerId;
            }
            else {
                changeLayer(-1);
                cache = document.getElementById("layer"+lastLayer).getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            }
            ctx.beginPath();
            if (currentTool=='brush01' || currentTool=='eraser') {
                isDrawing = true;
                ctx.lineJoin = ctx.lineCap = 'round';
                ctx.setLineDash([]);
                ctx.closePath();
                ctx.moveTo(currentPoint.x, currentPoint.y);
            }
            else if (currentTool=='rectangle' || currentTool=='triangle' || currentTool=='circle' || currentTool=='select') {
                if(isDrawing == false) {
                    console.log(ctx);
                    deselect();
                    startPoints.x = currentPoint.x;
                    startPoints.y = currentPoint.y;
                    isDrawing = true;
                }
            }
            updateMini();
        }
        canvas.onmousemove = function(e) {
            console.log(e.clientX, e.clientY);
            offset = $('#layer0').offset();
            var currentPoint = new Coordinates(Math.floor(e.clientX-offset.left), Math.floor(e.clientY-offset.top));
            if(isDrawing) {
                if (currentTool=='brush01') {
                    ctx.strokeStyle = currentRGBA.string;
                    ctx.lineTo(currentPoint.x, currentPoint.y);
                    ctx.stroke();
                }
                else if (currentTool=='eraser') {         
                    ctx.globalCompositeOperation = "destination-out"; 
                    ctx.strokeStyle = "rgba(255, 255, 255, 255)";               
                    ctx.lineTo(currentPoint.x, currentPoint.y);
                    ctx.stroke();
                    console.log(ctx.lineWidth);
                }
                else if (currentTool=='rectangle') {                 
                    ctx.putImageData(cache, 0, 0);
                    ctx.fillStyle = currentRGBA.string;
                    ctx.fillRect(startPoints.x, startPoints.y, currentPoint.x-startPoints.x, currentPoint.y-startPoints.y);
                }
                else if (currentTool=='select') {                 
                    //console.log(startPoints);
                    ctx.putImageData(cache, 0, 0);
                    ctx.lineWidth = 1;
                    ctx.setLineDash([10, 10]);
                    ctx.strokeStyle = "rgba(0, 0, 0, 255)";
                    //ctx.fillStyle = 'transparent';
                    //console.log(ctx);
                    //ctx.strokeRect(startPoints.x, startPoints.y, 100, 100);
                    ctx.strokeRect(startPoints.x, startPoints.y, currentPoint.x-startPoints.x, currentPoint.y-startPoints.y);
                    ctx.strokeStyle = "rgba(255, 255, 255, 255)";
                    ctx.strokeRect(startPoints.x+1, startPoints.y +1, currentPoint.x-startPoints.x-2, currentPoint.y-startPoints.y-2);
                }
                else if (currentTool=='triangle') {         
                    ctx.putImageData(cache, 0, 0);
                    ctx.beginPath();
                    ctx.fillStyle = currentRGBA.string;
                    ctx.moveTo(startPoints.x, startPoints.y);
                    ctx.lineTo(currentPoint.x, currentPoint.y);
                    ctx.lineTo((startPoints.x)*2 - currentPoint.x, currentPoint.y);
                    ctx.fill();
                }
                else if (currentTool=='circle') {         
                    ctx.putImageData(cache, 0, 0);
                    ctx.beginPath();
                    var dx = startPoints.x- currentPoint.x;
                    var dy = startPoints.y- currentPoint.y;
                    ctx.fillStyle = currentRGBA.string;
                    ctx.arc(startPoints.x, startPoints.y, Math.sqrt((dx*dx)+(dy*dy)), 0, Math.PI * 2, true);
                    ctx.fill();
                }
            }
        };
        canvas.onmouseup = function(e) {
            offset = $('#layer0').offset();
            var currentPoint = new Coordinates(Math.floor(e.clientX-offset.left), Math.floor(e.clientY-offset.top));
            isDrawing = false;
            if (currentTool=='select') {
                endPoints.x = 0;
                endPoints.y = 0;
                if(currentPoint.x < startPoints.x) {
                    endPoints.x = startPoints.x;
                    startPoints.x = currentPoint.x;
                }
                else endPoints.x = currentPoint.x;
                if(currentPoint.y < startPoints.y) {
                    endPoints.y = startPoints.y;
                    startPoints.y = currentPoint.y;
                }
                else endPoints.y = currentPoint.y;
                changeSize();
                console.log(startPoints);
                console.log(endPoints);
            }
            else if (currentTool!='text') {
                startPoints.x = 0;
                startPoints.y = 0;
            }
            updateMini();
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
    document.getElementById('shapes').content = $('shapes-hidden').innerHTML;
} 

function loadPalette() {
    palette = document.getElementById('palette');
    var offset = $('#palette').offset();
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
        var currentPoint = new Coordinates(Math.floor(e.clientX-offset.left), Math.floor(e.clientY-offset.top))
        if(currentPoint.y <= 200) {
            picker.x = currentPoint.x;
            picker.y = currentPoint.y;
        }
        else if(currentPoint.y <= 250) {
            currentColor = currentPoint.x;
        }
        console.log(currentPoint, picker, currentColor);
        updateColor();
    }
    var slider = document.getElementById("transparencySlider");
    var value = document.getElementById("transparency");
    value.innerHTML = slider.value; 
    currentRGBA.alpha = slider.value;
    slider.oninput = function() {
        value.innerHTML = slider.value; 
        currentRGBA.alpha = slider.value;
        ctx.globalAlpha = slider.value/100;
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
    var id = Math.floor(currentColor)*4;
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
    canvas = document.getElementById('layer0');
    textbox = document.getElementById('textbox');
    document.getElementById('layerSelector').value = "1";
    changeLayer(1);
    choose('brush01');
    if (currentLayer != null) {
        ctx.globalAlpha = 1.0;
        changeSize(10);
        cache = ctx.getImageData(0, 0, canvas.width, canvas.height);
        changeFont();
    }
    isDrawing = false;
    startPoints.x = 0;
    startPoints.y = 0;
}

function reset() {
    layerId = 1;
    layerNo = 1;
    document.getElementById('canvas').innerHTML = '<canvas id="history" width="600" height="400" style="visibility: hidden; top:0px; left:0px; position: absolute;"></canvas><canvas class="layer" id="layer1" width="600" height="400"></canvas><canvas class="layer" id="layer0" width="600" height="400"></canvas>';
    document.getElementById('layerSelector').innerHTML = '<option value="1" id="option1">1</option>';
    document.getElementById('minimaps').innerHTML = '<div class="d-flex flex-row"><div class="layerHeading" id="layerCount">Layers (1)</div><select id="layerSelector" onchange="changeLayer()"><option value="1" id="option1">1</option></select><div class="ml-auto layerHeading" id="newLayer" onclick="newLayer()">+ New Layer</div></div><span class="minimap" id="mini1"><input type="checkbox" class="visible" id="visible1" checked="true" onchange="toggleLayer(1)"><img id="minimap1" width="120" height="80" onclick="changeLayer(1)"></canvas></span>';
    canvas = document.getElementById('layer0');
    changeLayer(1);
    currentLayer.height = 0;
    currentLayer.height = canvasHeight;
    ctx.lineWidth = 10;
    console.log(currentLayer);
    console.log(currentRGBA);
    console.log(ctx);
    console.log(canvas);
}

function choose(tool) {
    ctx.globalCompositeOperation = "source-over";  
    changeSize();
    if(currentTool && currentTool == 'select') {
        deselect();
        changeLayer(layerId);
    }
    else {
        startPoints.x = startPoints.y = 0;
        endPoints.x = canvas.width;
        endPoints.y = canvas.height;
    }
    if(tool == 'text') toggle('text');
    if(tool == 'brush01' || tool=='eraser') toggle('brush');
    if(tool == 'copy' || tool == 'cut') {
        console.log(startPoints, endPoints);
        clipboard = ctx.getImageData(startPoints.x, startPoints.y, endPoints.x-startPoints.x, endPoints.y-startPoints.y);
        console.log(clipboard);
        choose('pasteLocal');
    }
    if(tool == 'cut' || tool == 'delete') {
        cache = ctx.getImageData(0, 0, canvas.width, canvas.height);
        lastLayer = layerId;
        console.log(startPoints.x, startPoints.y, endPoints.x, endPoints.y);
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(255, 255, 255, 255)";
        ctx.fillRect(startPoints.x, startPoints.y, endPoints.x-startPoints.x, endPoints.y-startPoints.y);
        if(tool == 'delete') choose(currentTool);
    }
    if(tool=='select') {
        changeLayer(-1);
        console.log('select');
    }
    if(tool != 'copy' && tool != 'cut' && tool != 'delete') currentTool = tool;
    if(currentTool=='brush01') {
        canvas.style.cursor = "url('image/brush_cursor.png') 0 60, auto";
    } else if (currentTool=='eraser') {
        canvas.style.cursor = "url('image/eraser_cursor.png') 20 30, auto";
    } else if (currentTool=='paste' || currentTool=='pasteLocal') {
        canvas.style.cursor = "url('image/paste.png') 56 46, auto";
    } else if (currentTool=='text') {
        canvas.style.cursor = "url('image/text_cursor.png') 60 60, auto";
    } else {
        canvas.style.cursor = 'crosshair';
    }
    isDrawing = false;
    textbox.style.visibility = 'hidden';
    console.log(currentTool);
    updateMini();
}

function toggle(tool) {
    var toolbox = document.getElementById(tool+'-hidden');
    if(toolbox.style.display == 'none') toolbox.style.display = 'block';
    else toolbox.style.display = 'none';
}

function fill() {
    changeLayer(layerId);
    cache = ctx.getImageData(0, 0, canvas.width, canvas.height);
    lastLayer = layerId;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = currentRGBA.string;
    if(currentTool=='select' && endPoints.x-startPoints.x!=0) {
        ctx.fillRect(startPoints.x, startPoints.y, endPoints.x-startPoints.x, endPoints.y-startPoints.y);
    }
    else ctx.fillRect(0, 0, canvas.width, canvas.height);
    deselect();
}

function deselect() {
    console.log('deselect');
    ctx.save();
    var ctxDeselect = document.getElementById('layer0').getContext('2d');
    ctxDeselect.globalCompositeOperation = "destination-out";  
    ctxDeselect.fillStyle = "rgba(255, 255, 255, 255)";
    ctxDeselect.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    /*canvas.height = 0;
    canvas.height = canvasHeight;*/
    if(currentTool=='select') currentLayer = canvas;
}

function changeSize() {
    var slider = document.getElementById("sizeSlider");
    var value = document.getElementById("size");
    value.innerHTML = "Stroke: " + slider.value; 
    ctx.lineWidth = slider.value;
    slider.oninput = function() {
        changeSize();
    }
}

function changeFont() {
    var slider = document.getElementById("fontSlider");
    var font = document.getElementById("font").value;
    document.getElementById("fontSize").innerHTML = "Font: " + slider.value; 
    ctx.font = slider.value + 'px ' + font;
    textbox.focus();
    ctx.putImageData(cache, 0, 0);
    ctx.fillText(textbox.value, startPoints.x, startPoints.y-12);
    slider.oninput = function() {
        changeFont();
    }
}

function changeLayer(id) {
    console.log(id);
    if(id==-1) currentLayer = document.getElementById("layer0");
    else {
        document.getElementById("minimap" + layerId).style.border = "solid #808080 2px";
        if(id)  {
            layerId = id;
            document.getElementById("layerSelector").value = id;
        }
        else layerId = document.getElementById("layerSelector").value;
        currentLayer = document.getElementById("layer" + layerId);
        document.getElementById("minimap" + layerId).style.border = "solid #6de0c0 2px";
    }
    var ctx2 = currentLayer.getContext('2d');
    if(ctx) {
        ctx2.globalCompositeOperation = ctx.globalCompositeOperation;
        ctx2.globalAlpha = ctx.globalAlpha;
        ctx2.fillStyle = ctx.fillStyle;
        ctx2.strokeStyle = ctx.strokeStyle;
        ctx2.lineWidth = ctx.lineWidth;
        ctx2.lineJoin = ctx.lineJoin;
        ctx2.font = ctx.font;
    }
    ctx = ctx2;
    console.log(currentLayer);
}

function toggleLayer(id) {
    var target = document.getElementById("layer" + id);
    var visible = document.getElementById("visible" + id).checked;
    if(visible) target.style.visibility = 'visible';
    else target.style.visibility = 'hidden';
}

function newLayer() {
    layerNo ++;
    document.getElementById("layerCount").innerHTML = "Layers (" + layerNo + ")";
    changeLayer(layerId);
    currentLayer.insertAdjacentHTML("afterend", '<canvas class="layer" id="layer' + layerNo + '" width="600" height="400"></canvas>');
    var currentOption = document.getElementById('option'+layerId);
    currentOption.insertAdjacentHTML("afterend", '<option value="' + layerNo + '" id="option' + layerNo + '">' + layerNo + '</option>');
    var currentMini = document.getElementById("mini" + layerId);
    currentMini.insertAdjacentHTML("afterend", '<span class="minimap" id="mini' + layerNo + '"><input type="checkbox" class="visible" id="visible' + layerNo + '" checked="true" onchange="toggleLayer(' + layerNo + ')"><img id="minimap' + layerNo + '" width="120" height="80" onclick="changeLayer(' + layerNo + ')"></canvas></span>');
    changeLayer(layerNo);
}

function updateMini() {
    var currentMini = document.getElementById("minimap" + layerId);
    currentMini.src = document.getElementById("layer" + layerId).toDataURL();
    var history = document.getElementById("history");
    if(cache) history.getContext('2d').putImageData(cache, 0, 0);
    document.getElementById("prevStep").src = history.toDataURL();
}

function undo() {
    changeLayer(lastLayer);
    var redo = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(cache, 0, 0);
    cache = redo;
    ctx.beginPath();
    if(currentTool == 'select') changeLayer(-1);
    else changeLayer(layerId);
}

function readFile() {
    //var img = new Image();
    var holder = document.getElementById('imageHolder');
    var file = document.getElementById('upload').files[0];
    var reader  = new FileReader();
    reader.onload = function (e) {
        holder.src = e.target.result;
        //img.src = e.target.result;
        //document.getElementById('layer0').getContext('2d').drawImage(img, 0, 0);
        choose('paste');
    }
    if (file) {
       reader.readAsDataURL(file);
    }
}

function save() {
    var link = document.getElementById('download');
    link.href = currentLayer.toDataURL("image/png");
}