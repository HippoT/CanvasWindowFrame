$("#contentWindowFrame").css("height", "100vh");

var width = $("#contentWindowFrame").outerWidth();
var height = $("#contentWindowFrame").outerHeight();
$("#contentWindowFrame").append('<canvas style="border: 1px solid black" id="canvasWindowFrame" width="' + width + '" height="' + (height - 15) + '"></canvas>')

var canvas = this.__canvas = new fabric.Canvas('canvasWindowFrame');

var widthInput = document.getElementById('inputWidth');
var heightInput = document.getElementById('inputHeight');
var profileWidthInput = document.getElementById('inputProfileWidth');
var zoomInput = document.getElementById('inputZoom');


function CreateFrame(frameWidth, frameHeight, frameProfile, startPoint){
  var fillColor = "white";

  var shadow = {
    color: 'rgba(0,0,0,0.6)',
    blur: 20,
    offsetX: 10,
    offsetY: 10,
    opacity: 0.6,
    fillShadow: true,
    strokeShadow: true
  }

  //top
  var topPoints = [
    {x : 0, y: 0},
    {x : frameWidth, y : 0},
    {x : frameWidth - frameProfile, y: frameProfile},
    {x : frameProfile, y: frameProfile}
  ]
  var topPolygon = CreatePolygon(topPoints, fillColor, {x: 0, y: 0});
  //topPolygon.setShadow(shadow);

  //Left
  var leftPoints=[
    {x : 0, y : 0},
    {x : frameProfile, y : frameProfile},
    {x : frameProfile, y :frameHeight - frameProfile},
    {x : 0, y : frameHeight}
  ]
  var leftPolygon = CreatePolygon(leftPoints, fillColor, {x : 0, y : 0});
  //leftPolygon.setShadow(shadow);

  //botton
  var botPoints = [
    { x: 0, y: frameHeight },
    { x: frameProfile, y: frameHeight - frameProfile },
    { x: frameWidth - frameProfile, y: frameHeight - frameProfile },
    { x: frameWidth, y: frameHeight }
  ]
  var botPolygon = CreatePolygon(botPoints, fillColor, {x : 0, y : frameHeight - frameProfile});
  //botPolygon.setShadow(shadow);

  //right
  var rightPoints = [
    {x : frameWidth, y : 0},
    {x : frameWidth, y : frameHeight},
    {x : frameWidth - frameProfile, y : frameHeight - frameProfile},
    {x : frameWidth - frameProfile, y : frameProfile}
  ];
  var rightPolygon = CreatePolygon(rightPoints, fillColor, {x : frameWidth - frameProfile, y : 0})
  //rightPolygon.setShadow(shadow);

  var glass = CreateGlass(frameWidth, frameHeight, frameProfile, {x : 0, y : 0});
  
  var group = new fabric.Group([topPolygon, leftPolygon, botPolygon, rightPolygon, glass], {
    left: startPoint.x,
    top: startPoint.y,
    selectable: false
  });

  //CreateHandle("./images/handle.png", {x : frameWidth / 2, y : frameHeight - frameProfile / 2}, group, startPoint);

  var handle = GetHandle({color: 'red'});
   handle.set({
     left: (frameWidth - handle.width / 2),
     top: (frameHeight - handle.height / 2)
   });

  group.addWithUpdate(handle);

  group.setShadow(shadow);

  return group;
}

function CreatePolygon(points, fillColor, startPoint){
  // var clonedPoints = points.map(function(o){
  //   return fabric.util.object.clone(o);
  // });

  var polygon = new fabric.Polygon(points, {
    left: startPoint.x,
    top: startPoint.y,
    fill: fillColor,
    selectable: true,
    objectCaching: false,
    strokeWidth: 1, 
    stroke: 'black',
    strokeLineJoin: "round"
  });

  return polygon;
}

function CreateGlass(frameWidth, frameHeight, frameProfile, startPoint){
  var glass = new fabric.Rect({
    fill: '#e5f3f6',
    width: frameWidth - frameProfile * 2, 
    height: frameHeight - frameProfile * 2,
    left: startPoint.x + frameProfile,
    top: startPoint.y + frameProfile,
    stroke: "black"
  })

  return glass;
}


// function CreateHandle(url, startPoint, group, groupPoint){
//   fabric.Image.fromURL(url, function(img){
//     var imageHeight = img.getScaledHeight();
//     var imageWidth = img.getScaledWidth();

//     img.set({
//       left: (startPoint.x - imageWidth / 2 + groupPoint.x),
//       top: (startPoint.y - imageHeight / 2 + groupPoint.y)
//     });

//     //group.addWithUpdate(img);

//     // group.on("mousedown", function(e){
//     //   var a = e.target;
//     //   if(a.item(0).fill == "white"){
//     //     a.item(0).set({fill : 'black'});
//     //     a.item(1).set({fill : 'black'});
//     //     a.item(2).set({fill : 'black'});
//     //     a.item(3).set({fill : 'black'});
//     //   }else{
//     //     a.item(0).set({fill : 'white'});
//     //     a.item(1).set({fill : 'white'});
//     //     a.item(2).set({fill : 'white'});
//     //     a.item(3).set({fill : 'white'});
//     //   }
  
  
//       // canvas.renderAll();
//     // });

//     AddCanvas(group);
//   });
// }

function UpdateCanvas() {
  canvas.clear();
  var frameWidth = parseInt(widthInput.value, 10);
  var frameHeight = parseInt(heightInput.value, 10);
  var frameProfile = parseInt(profileWidthInput.value, 10);

  var onScreenWidth = $("#canvasWindowFrame").outerWidth();
  var onScreenHeight = $("#canvasWindowFrame").outerHeight();

  var wr = onScreenWidth / frameWidth;
  var hr = onScreenHeight / frameHeight;

  var ratio = Math.min(wr, hr) * 0.5;

  var frameOnScreenWidth = Math.round(frameWidth * ratio);
  var frameOnScreenHeight = Math.round(frameHeight * ratio);
  var frameOnScreenProfile = Math.round(frameProfile * ratio);

  var x = Math.round((onScreenWidth - frameOnScreenWidth) * 0.5);
  var y = Math.round((onScreenHeight - frameOnScreenHeight) * 0.5); 

  console.log(frameOnScreenWidth);
  //var groupFrame = CreateFrameByPath(200, 200, 30);
  var groupFrame = CreateFrame(frameOnScreenWidth, frameOnScreenHeight, frameOnScreenProfile, {x : x, y : y});

  canvas.add(groupFrame);
}


widthInput.addEventListener('change', UpdateCanvas);
widthInput.addEventListener('input', UpdateCanvas);

heightInput.addEventListener('change', UpdateCanvas);
heightInput.addEventListener('input', UpdateCanvas);

profileWidthInput.addEventListener('change', UpdateCanvas);
profileWidthInput.addEventListener('input', UpdateCanvas);

widthInput.value = 5000;
heightInput.value = 5000;
profileWidthInput.value = 500;

UpdateCanvas();

function GetHandle(handelInfo) {
  // var width = handelInfo.width;
  // var height = handelInfo.height;
  var scale = 2;

  if(handelInfo.scale){
    scale = handelInfo.scale;
  }

  //unit handle size
  var points = [{ x: 5, y: 0 }, { x: 20, y: 0 }, { x: 22, y: 2 }, { x: 22, y: 4 }, { x: 24, y: 4 }, { x: 24, y: 6 }, { x: 60, y: 8 }, 
    { x: 60, y: 14 }, { x: 24, y: 16 }, { x: 8, y: 15 }, { x: 2, y: 10 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 3, y: 2 }];

  for (var i = 0; i < points.length; i++) {
    points[i].x = Math.round(points[i].x * scale);
    points[i].y = Math.round(points[i].y * scale);
  }

  return CreatePolygon(points, handelInfo.color, {x: 0, y: 0});
}