var width = window.innerWidth - 500;
var height = window.innerHeight;
$("#contentWindowFrame").append('<canvas style="border: 1px solid black" id="canvasWindowFrame" width="' + width + '" height="' + height + '"></canvas>')

var canvas = this.__canvas = new fabric.Canvas('canvasWindowFrame');

function GetLayer (elements, pr, wr, hr, s) {
    var group = new fabric.Group([], {
        selectable: false
    });

    if (elements.constructor === Array) {
        var len = elements.length;
        for (var i = 0; i < len; i++) {
            if (elements[i].constructor === Object) {
                var fnName = elements[i].function;
                var fnParams = elements[i].argument;
                var p = parseInt(fnParams.p) * pr;
                fnParams.points = CalculatePoints(fnParams.points, p, wr, hr, s);
                fnParams.originPoint = CalculateOriginPoint(fnParams.originPoint, p, wr, hr, s);
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
        var p = parseInt(fnParams.p) * pr;
        fnParams.points = CalculatePoints(fnParams.points, p, wr, hr, s);
        fnParams.originPoint = CalculateOriginPoint(fnParams.originPoint, p, wr, hr, s);
        var element = window[fnName].apply(null,[fnParams]);
        group.addWithUpdate(element);
    }

    return group;
}

function CalculatePoints(points ,p , wr, hr, s){
    for(var i = 0; i < points.length; i++){        
        points[i].x = eval(("wr * " + points[i].x).replace("{p}",p)) * s,
        points[i].y = eval(("hr * " + points[i].y).replace("{p}",p)) * s;
    }
    return points;
}

function CalculateOriginPoint(point, p, wr, hr, s){
    point.x = eval(("wr * " + point.x).replace("{p}",p)) * s,
    point.y = eval(("hr * " + point.y).replace("{p}",p)) * s;
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
                var layer = GetLayer(instruction[i], 1, 1, 1, s);
                group.addWithUpdate(layer);
            }
        }else{
            console.log("Your schema is wrong");
        }
    
        canvas.add(group);
    },
    
    Update : function (instruction, pr, wr, hr, s){
        canvas.clear();
    
        var group = new fabric.Group([],{
            selectable: false
        })
    
        if(instruction.constructor === Array){
            var len = instruction.length;
            
            for(var i = 0; i < len; i++){
                var layer = GetLayer(instruction[i], pr, wr, hr, s);
                group.addWithUpdate(layer);
            }
        }else{
            console.log("Your schema is wrong");
        }
    
        canvas.add(group);
    }
}
