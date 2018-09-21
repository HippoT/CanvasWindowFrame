var width = window.innerWidth - 500;
var height = window.innerHeight;
$("#contentWindowFrame").append('<canvas style="border: 1px solid black" id="canvasWindowFrame" width="' + width + '" height="' + height + '"></canvas>')

var canvas = this.__canvas = new fabric.Canvas('canvasWindowFrame');

var widthInput = document.getElementById('inputWidth');
var heightInput = document.getElementById('inputHeight');
var profileWidthInput = document.getElementById('inputProfileWidth');
var zoomInput = document.getElementById('inputZoom');


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
    stroke: 'black',
    strokeLineJoin: "round"
  });

  return polygon;
}

function CreateFrameByPath(frameWidth, frameHeight, frameProfile){
  var fillColor = "white";
  //top
  var topPoints = [
    {x : 0, y: 0},
    {x : frameWidth, y : 0},
    {x : frameWidth - frameProfile, y: frameProfile},
    {x : frameProfile, y: frameProfile}
  ]

  var topPolygon = CreatePath(ConvertToPath(topPoints), fillColor, {x: 0, y: 0});

  //Left
  var leftPoints=[
    {x : 0, y : 0},
    {x : frameProfile, y : frameProfile},
    {x : frameProfile, y :frameHeight - frameProfile},
    {x : 0, y : frameHeight}
  ]
  var leftPolygon = CreatePath(ConvertToPath(leftPoints), fillColor, {x : 0, y : 0});

  //botton
  var botPoints = [
    { x: 0, y: frameHeight },
    { x: frameProfile, y: frameHeight - frameProfile },
    { x: frameWidth - frameProfile, y: frameHeight - frameProfile },
    { x: frameWidth, y: frameHeight }
  ]
  var botPolygon = CreatePath(ConvertToPath(botPoints), fillColor, {x : 0, y : frameHeight - frameProfile});

  //right
  var rightPoints = [
    {x : frameWidth, y : 0},
    {x : frameWidth, y : frameHeight},
    {x : frameWidth - frameProfile, y : frameHeight - frameProfile},
    {x : frameWidth - frameProfile, y : frameProfile}
  ];
  var rightPolygon = CreatePath(ConvertToPath(rightPoints), fillColor,  {x : frameWidth - frameProfile, y : 0});

  
  var group = new fabric.Group([topPolygon, leftPolygon, botPolygon, rightPolygon], {
    left: 0,
    top: 0,
    scaleX: 3,
    scaleY: 3
  });
  return group;
}
function CreatePath(pathPoints, fillColor, startPoint){
  var path = new fabric.Path(pathPoints);
  path.set({
    left: startPoint.x,
    top: startPoint.y,
    fill: fillColor,
    selectable: true,
    objectCaching: false,
    strokeWidth: 0.5, 
    stroke: 'black',
    strokeLineJoin: 'round'
  })

  return path;
}

function ConvertToPath(points){
  var path = "M ";

  for(var i = 0; i < points.length; i++){
    if(i != 0){
      path += "L "
    }
    path += points[i].x + ' ';
    path += points[i].y + ' ';
  }

  path += 'z';

  return path;
}


function CreateGlass(frameWidth, frameHeight, frameProfile){
  var glass = new fabric.Rect({
    fill: 'blue',
    width: frameWidth - frameProfile * 2, 
    height: frameHeight - frameProfile * 2
  })

  return glass;
}

function UpdateCanvas() {
  canvas.clear();
  var frameWidth = parseInt(widthInput.value, 10);
  var frameHeight = parseInt(heightInput.value, 10);
  var frameProfile = parseInt(profileWidthInput.value, 10);

  //var groupFrame = CreateFrameByPath(200, 200, 30);
  var groupFrame = CreateFrame(frameWidth, frameHeight, frameProfile);
  canvas.add(groupFrame);
}

function InitCanvas(){
  var frameWidth = parseInt(widthInput.value, 10);
  var frameHeight = parseInt(heightInput.value, 10);
  var frameProfile = parseInt(profileWidthInput.value, 10);

  //var groupFrame = CreateFrameByPath(200, 200, 30);
  var groupFrame = CreateFrame(frameWidth, frameHeight, frameProfile);
  canvas.add(groupFrame);
}

widthInput.addEventListener('change', UpdateCanvas);
widthInput.addEventListener('input', UpdateCanvas);

heightInput.addEventListener('change', UpdateCanvas);
heightInput.addEventListener('input', UpdateCanvas);

profileWidthInput.addEventListener('change', UpdateCanvas);
profileWidthInput.addEventListener('input', UpdateCanvas);

widthInput.value = 500;
heightInput.value = 500;
profileWidthInput.value = 50;

InitCanvas();