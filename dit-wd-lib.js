function GetFrame(frameInfo) {

    var fillColor = frameInfo.color;
    var originPoint = frameInfo.originPoint;

    var originWidth = 500;
    var originHeight = 500;
    var originProfile = 60;

    if(frameInfo.width){
        originWidth = originWidth * (frameInfo.width / 1000);
        originHeight = originHeight * (frameInfo.height / 1000);
        originProfile = originProfile * (frameInfo.profile / 60);
        
    }

    var shadow = {
        color: 'rgba(0,0,0,0.4)',
        blur: 20,
        offsetX: 10,
        offsetY: 10,
        opacity: 0.6,
        fillShadow: true,
        strokeShadow: true
    }

    //top
    var topPoints = [
        { x: 0, y: 0 },
        { x: originWidth, y: 0 },
        { x: originWidth - originProfile, y: originProfile },
        { x: originProfile, y: originProfile }
    ]
    var topPolygon = CreatePolygon(topPoints, fillColor, { x: 0, y: 0 });
    //topPolygon.setShadow(shadow);

    //Left
    var leftPoints = [
        { x: 0, y: 0 },
        { x: originProfile, y: originProfile },
        { x: originProfile, y: originHeight - originProfile },
        { x: 0, y: originHeight }
    ]
    var leftPolygon = CreatePolygon(leftPoints, fillColor, { x: 0, y: 0 });
    //leftPolygon.setShadow(shadow);

    //botton
    var botPoints = [
        { x: 0, y: originHeight },
        { x: originProfile, y: originHeight - originProfile },
        { x: originWidth - originProfile, y: originHeight - originProfile },
        { x: originWidth, y: originHeight }
    ]
    var botPolygon = CreatePolygon(botPoints, fillColor, { x: 0, y: originHeight - originProfile });
    //botPolygon.setShadow(shadow);

    //right
    var rightPoints = [
        { x: originWidth, y: 0 },
        { x: originWidth, y: originHeight },
        { x: originWidth - originProfile, y: originHeight - originProfile },
        { x: originWidth - originProfile, y: originProfile }
    ];
    var rightPolygon = CreatePolygon(rightPoints, fillColor, { x: originWidth - originProfile, y: 0 })
    //rightPolygon.setShadow(shadow);

    var group = new fabric.Group([topPolygon, leftPolygon, botPolygon, rightPolygon], {
        left: originPoint.x,
        top: originPoint.y,
        selectable: false
    });

    if (frameInfo.hasShadow) {
        group.setShadow(shadow);
    }

    return group;
}

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

function GetGlass(glassInfo) {
    var originPoint = glassInfo.originPoint;

    var glass = new fabric.Rect({
        fill: glassInfo.color,
        width: glassInfo.width,
        height: glassInfo.height,
        left: originPoint.x,
        top: originPoint.y,
        stroke: "black"
    })
    return glass;
}

function GetHandle(handelInfo) {
    // var width = handelInfo.width;
    // var height = handelInfo.height;
    var scale = 1;

    if (handelInfo.scale) {
        scale = handelInfo.scale;
    }

    //unit handle size
    var points = [{ x: 5, y: 0 }, { x: 20, y: 0 }, { x: 22, y: 2 }, { x: 22, y: 4 }, { x: 24, y: 4 }, { x: 24, y: 6 }, { x: 60, y: 8 },
    { x: 60, y: 14 }, { x: 24, y: 16 }, { x: 8, y: 15 }, { x: 2, y: 10 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 3, y: 2 }];

    for (var i = 0; i < points.length; i++) {
        points[i].x = Math.round(points[i].x * scale);
        points[i].y = Math.round(points[i].y * scale);
    }

    var polygon = CreatePolygon(points, handelInfo.color, handelInfo.originPoint);

    switch (handelInfo.orientation) {
        case 'left':
            polygon.set({
                flipY: true,
                rotate: 90
            });
            break;
        case 'bottom':
            polygon.set({
                flipY: true
            });
            break;
        case 'right':
            polygon.set({
                rotate: 90
            });
            break;
        default:
            break;

    }

    return polygon;
}

function GetCill(cillDetail){
    var cill = new fabric.Rect({
        width: cillDetail.width,
        height: cillDetail.height,
        strokeWidth: 1,
        stroke: 'black',
        strokeLineJoin: "round",
        fill: cillDetail.color,
        left: cillDetail.originX,
        top: cillDetail.originY
    })

    return cill;
}