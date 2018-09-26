var width = window.innerWidth - 500;
var height = window.innerHeight;
$("#contentWindowFrame").append('<canvas style="border: 1px solid black" id="canvasWindowFrame" width="' + width + '" height="' + height + '"></canvas>')

var canvas = this.__canvas = new fabric.Canvas('canvasWindowFrame');

var layerFrame = GetFrame({
  width: 500,
  height: 500,
  profile: 40,
  color: 'white',
  originPoint: {
    x: 0,
    y: 0
  },
  hasShadow: true
});

var layerWindow = GetFrame({
  width: 420,
  height: 420,
  profile: 60,
  color: 'white',
  originPoint: {
    x: 40,
    y: 40
  }
});

var glass = GetGlass({
  width: 300,
  height: 300,
  color: '#e5f3f6',
  originPoint: {
    x: 100,
    y: 100
  }
});

var handle = GetHandle({
  color: '#969696',
  scale: 1.5,
  orientation: 'bottom',
  originPoint: {
    x: 230,
    y: 420
  }
});

var cill = GetCill({
  color: "white",
  width: 600,
  height: 20,
  originX: -50,
  originY: 500
})

var onScreenWidth = $("#canvasWindowFrame").outerWidth();
var onScreenHeight = $("#canvasWindowFrame").outerHeight();


var x = Math.round((onScreenWidth - layerWindow.width) * 0.5);
var y = Math.round((onScreenHeight - layerWindow.height) * 0.5); 

var group = new fabric.Group([layerWindow], {
  left: x,
  top: y,
  selectable: false
});


canvas.add(group);

