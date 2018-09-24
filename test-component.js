var width = window.innerWidth - 500;
var height = window.innerHeight;
$("#contentWindowFrame").append('<canvas style="border: 1px solid black" id="canvasWindowFrame" width="' + width + '" height="' + height + '"></canvas>')

var canvas = this.__canvas = new fabric.Canvas('canvasWindowFrame');

function CreatePolygon(points, fillColor, originPoint) {
  var polygon = new fabric.Polygon(points, {
    left: originPoint.x,
    top: originPoint.y,
    fill: fillColor,
    selectable: true,
    objectCaching: false,
    strokeWidth: 1,
    stroke: 'black',
    strokeLineJoin: "round"
  });

  return polygon;
}

function GetHandle(handelInfo) {
  var width = handelInfo.width;
  var height = handelInfo.height;
  var scale = 1;
  // var points = [
  //   { x: 25, y: 0 },
  //   { x: 100, y: 0 },
  //   { x: 110, y: 10 },
  //   { x: 110, y: 20 },
  //   { x: 120, y: 20 },
  //   { x: 120, y: 30 },
  //   { x: 300, y: 40 },
  //   { x: 300, y: 70 },
  //   { x: 120, y: 80 },
  //   { x: 40, y: 75 },
  //   //{ x: 20, y: 50 },
  //   { x: 10, y: 50 },
  //   { x: 10, y: 20 },
  //   { x: 15, y: 20 },
  //   { x: 15, y: 10 }
  // ];

  var points = [
    { x: 5, y: 0 },
    { x: 20, y: 0 },
    { x: 22, y: 2 },
    { x: 22, y: 4 },
    { x: 24, y: 4 },
    { x: 24, y: 6 },
    { x: 60, y: 8 },
    { x: 60, y: 14 },
    { x: 24, y: 16 },
    { x: 8, y: 15 },
    { x: 2, y: 10 },
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 3, y: 2 }
  ];

  for (var i = 0; i < points.length; i++) {
    points[i].x = Math.round(points[i].x * scale);
    points[i].y = Math.round(points[i].y * scale);
  }

  console.log(points);

  var polygon = CreatePolygon(points, handelInfo.color, { x: 0, y: 0 });

  //polygon.set({ scaleX: 1.5, scaleY: 1.5 })
  return polygon
}

var info = {
  width: 100,
  height: 200,
  color: 'red'
}
canvas.add(GetHandle(info));
