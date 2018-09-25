function GetFrame(frameInfo) {

    var fillColor = frameInfo.color;
    var frameWidth = frameInfo.width;
    var frameHeight = frameInfo.height;
    var frameProfile = frameInfo.profile;
    var originPoint = frameInfo.originPoint;

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
        { x: 0, y: 0 },
        { x: frameWidth, y: 0 },
        { x: frameWidth - frameProfile, y: frameProfile },
        { x: frameProfile, y: frameProfile }
    ]
    var topPolygon = CreatePolygon(topPoints, fillColor, { x: 0, y: 0 });
    //topPolygon.setShadow(shadow);

    //Left
    var leftPoints = [
        { x: 0, y: 0 },
        { x: frameProfile, y: frameProfile },
        { x: frameProfile, y: frameHeight - frameProfile },
        { x: 0, y: frameHeight }
    ]
    var leftPolygon = CreatePolygon(leftPoints, fillColor, { x: 0, y: 0 });
    //leftPolygon.setShadow(shadow);

    //botton
    var botPoints = [
        { x: 0, y: frameHeight },
        { x: frameProfile, y: frameHeight - frameProfile },
        { x: frameWidth - frameProfile, y: frameHeight - frameProfile },
        { x: frameWidth, y: frameHeight }
    ]
    var botPolygon = CreatePolygon(botPoints, fillColor, { x: 0, y: frameHeight - frameProfile });
    //botPolygon.setShadow(shadow);

    //right
    var rightPoints = [
        { x: frameWidth, y: 0 },
        { x: frameWidth, y: frameHeight },
        { x: frameWidth - frameProfile, y: frameHeight - frameProfile },
        { x: frameWidth - frameProfile, y: frameProfile }
    ];
    var rightPolygon = CreatePolygon(rightPoints, fillColor, { x: frameWidth - frameProfile, y: 0 })
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