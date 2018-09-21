function test() {
    var canvas = this.__canvas = new fabric.Canvas('contentWindowFrame');
  
    var startPoints = [
      {x: 0, y: 0},
      {x: 155, y: 0},
      {x: 155, y: 243},
      {x: 0, y: 243},
      {x: 0, y: 0},

      {x: 5, y: 5},
      {x: 150, y: 5},
      {x: 150, y: 238},
      {x: 5, y: 238},
      {x: 5, y: 5},

      {x: 150, y: 5},
      {x: 155, y: 0},
      {x: 155, y: 243},
      {x: 150, y: 238},
      {x: 5, y: 238},
      {x: 0, y: 243}

    ];
  
    var clonedStartPoints = startPoints.map(function(o){
      return fabric.util.object.clone(o);
    });
  
    var polygon = new fabric.Polygon(clonedStartPoints, {
      left: 10,
      top: 10,
      fill: 'purple',
      selectable: true,
      objectCaching: false,
      strokeWidth: 0.5, 
      stroke: 'black'
    });
    canvas.add(polygon);
}

test();