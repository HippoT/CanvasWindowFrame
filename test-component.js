var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
    container: 'contentWindowFrame',
    width: width,
    height: height
});

var layer = new Konva.Layer();
var padding = 70;
var frameWidth = 500;

var redLine = new Konva.Line({
  points: [0, 0,frameWidth, 0,frameWidth - padding, padding,padding, padding],
  fill: 'red',
  stroke: 'black',
  strokeWidth: 5,
});

redLine.closed(true);
layer.add(redLine);
stage.add(layer);