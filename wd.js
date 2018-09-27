var width = window.innerWidth - 500;
var height = window.innerHeight;
$("#contentWindowFrame").append('<canvas style="border: 1px solid black" id="canvasWindowFrame" width="' + width + '" height="' + height + '"></canvas>')

var canvas = this.__canvas = new fabric.Canvas('canvasWindowFrame');
var group;

function drawComponent(w, h, p, {fill = "white"}){
    
    p = [{x : 0, y : 0}, 
        {x : w, y : 0}, 
        {x : w - p, y : p}, 
        {x : p, y : p}];

    var polygon = new fabric.Polygon(p, {
        stroke: 'black',
        widthStroke: 1,
        fill: fill
    })
    return polygon;
}

var component = drawComponent(200, 200, 60, 1, {});

group = new fabric.Group([component], {
    left: 0,
    top: 0
})

canvas.add(group);