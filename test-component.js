var width = window.innerWidth - 500;
var height = window.innerHeight;
$("#contentWindowFrame").append('<canvas style="border: 1px solid black" id="canvasWindowFrame" width="' + width + '" height="' + height + '"></canvas>')

var canvas = this.__canvas = new fabric.Canvas('canvasWindowFrame');

var circle = new fabric.Circle({
  radius: 100,
  fill: '#eef',
  scaleY: 0.5,
  originX: 'center',
  originY: 'center'
});

var rect = new fabric.Rect({
  originX: 'center',
  originY: 'center',
  fill: 'green',
  width: 50, 
  height: 80
});

var text = new fabric.Text('hello world', {
  fontSize: 30,
  // originX: 'center',
  // originY: 'center'
  left: 200,
  top: 200
});

var group = new fabric.Group([circle, rect, text], {
  left: 150,
  top: 100
});

canvas.add(group);