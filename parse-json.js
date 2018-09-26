var width = window.innerWidth - 500;
var height = window.innerHeight;
$("#contentWindowFrame").append('<canvas style="border: 1px solid black" id="canvasWindowFrame" width="' + width + '" height="' + height + '"></canvas>')

var canvas = this.__canvas = new fabric.Canvas('canvasWindowFrame');

function GetLayer (elements, wr, hr, s) {
    var group = new fabric.Group([], {
        selectable: false
    });

    if (elements.constructor === Array) {
        var len = elements.length;
        for (var i = 0; i < len; i++) {
            if (elements[i].constructor === Object) {
                var fnName = elements[i].function;
                var fnParams = elements[i].argument;
                fnParams.points = CalculatePoints(fnParams.points, wr, hr, s);
                fnParams.originPoint = CalculateOriginPoint(fnParams.originPoint, wr, hr, s);
                var element = window[fnName].apply(null,[fnParams]);
                group.addWithUpdate(element);
            }else{
                console.log("Your intruction file is wrong schema!");
            }
        }
    }

    if(elements.constructor === Object){
        var fnName = elements.function;
        var fnParams = elements.argument;
        fnParams.points = CalculatePoints(fnParams.points, wr, hr, s);
        fnParams.originPoint = CalculateOriginPoint(fnParams.originPoint, wr, hr, s);
        var element = window[fnName].apply(null,[fnParams]);
        group.addWithUpdate(element);
    }

    return group;
}

function CalculatePoints(points, wr, hr, s){
    for(var i = 0; i < points.length; i++){
        points[i].x = points[i].x * wr * s,
        points[i].y = points[i].y * hr * s;
    }
    return points;
}

function CalculateOriginPoint(point, wr, hr, s){
    point.x = point.x * wr * s,
    point.y = point.y * hr * s;
    return point;
}

var wd_parse_json = {
   
    Init : function(instruction, s){
        var group = new fabric.Group([],{
            selectable: false
        })
    
        if(instruction.constructor === Array){
            var len = instruction.length;
            
            for(var i = 0; i < len; i++){
                var layer = GetLayer(instruction[i], 1, 1, s);
                group.addWithUpdate(layer);
            }
        }else{
            console.log("Your schema is wrong");
        }
    
        canvas.add(group);
    },
    
    Update : function (instruction, wr, hr, s){
        canvas.clear();
    
        var group = new fabric.Group([],{
            selectable: false
        })
    
        if(instruction.constructor === Array){
            var len = instruction.length;
            
            for(var i = 0; i < len; i++){
                var layer = GetLayer(instruction[i], wr, hr, s);
                group.addWithUpdate(layer);
            }
        }else{
            console.log("Your schema is wrong");
        }
    
        canvas.add(group);
    }
}
