var width = window.innerWidth - 500;
var height = window.innerHeight;
$("#contentWindowFrame").append('<canvas style="border: 1px solid black" id="canvasWindowFrame" width="' + width + '" height="' + height + '"></canvas>')

function test() {
    var canvas = this.__canvas = new fabric.Canvas('canvasWindowFrame');

    var groupFrame = CreateFrame(200, 200, 30);
    canvas.add(groupFrame);
}

function CreateFrame(frameWidth, frameHeight, frameProfile){
  

  var fillColor = "white";
  //top
  var topPoints = [
    {x : 0, y: 0},
    {x : frameWidth, y : 0},
    {x : frameWidth - frameProfile, y: frameProfile},
    {x : frameProfile, y: frameProfile}
  ]
  var topPolygon = CreatePolygon(topPoints, fillColor, {x: 0, y: 0});

  //Left
  var leftPoints=[
    {x : 0, y : 0},
    {x : frameProfile, y : frameProfile},
    {x : frameProfile, y :frameHeight - frameProfile},
    {x : 0, y : frameHeight}
  ]
  var leftPolygon = CreatePolygon(leftPoints, fillColor, {x : 0, y : 0});

  //botton
  var botPoints = [
    { x: 0, y: frameHeight },
    { x: frameProfile, y: frameHeight - frameProfile },
    { x: frameWidth - frameProfile, y: frameHeight - frameProfile },
    { x: frameWidth, y: frameHeight }
  ]
  var botPolygon = CreatePolygon(botPoints, fillColor, {x : 0, y : frameHeight - frameProfile});

  //right
  var rightPoints = [
    {x : frameWidth, y : 0},
    {x : frameWidth, y : frameHeight},
    {x : frameWidth - frameProfile, y : frameHeight - frameProfile},
    {x : frameWidth - frameProfile, y : frameProfile}
  ];
  var rightPolygon = CreatePolygon(rightPoints, fillColor, {x : frameWidth - frameProfile, y : 0})

  
  var group = new fabric.Group([topPolygon, leftPolygon, botPolygon, rightPolygon], {
    left: 0,
    top: 0
  });
  return group;
}

function CreatePolygon(points, fillColor, startPoint){
  var clonedPoints = points.map(function(o){
    return fabric.util.object.clone(o);
  });

  var polygon = new fabric.Polygon(clonedPoints, {
    left: startPoint.x,
    top: startPoint.y,
    fill: fillColor,
    selectable: true,
    objectCaching: false,
    strokeWidth: 0.5, 
    stroke: 'black'
  });

  return polygon;
}

test();