function GetFrame(frameInfo) {

    var fillColor = frameInfo.color;
    var originPoint = frameInfo.originPoint;

    // var originWidth = 500;
    // var originHeight = 500;
    // var originProfile = 60;

    // if(frameInfo.width){
    //     originWidth = originWidth * (frameInfo.width / 1000);
    //     originHeight = originHeight * (frameInfo.height / 1000);
    //     originProfile = originProfile * (frameInfo.profile / 60);

    // }

    var ratio = GetRatio({ width: frameInfo.width, height: frameInfo.height, scale: 0.7 })

    var originWidth = Math.round(frameInfo.width * ratio);
    var originHeight = Math.round(frameInfo.height * ratio);
    var originProfile = Math.round(frameInfo.profile * ratio);

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

    // var centerPoint = [
    //     { x: originWidth / 2, y: originProfile / 2 },
    //     { x: (originWidth + originProfile) / 2, y: originProfile },
    //     { x: (originWidth + originProfile) / 2, y: originHeight - originProfile },
    //     { x: originWidth / 2, y: originHeight - originProfile / 2 },
    //     { x: (originWidth - originProfile) / 2, y: originHeight - originProfile },
    //     { x: (originWidth - originProfile) / 2, y: originProfile },
    // ];

    // var centerPolygon = CreatePolygon(centerPoint, fillColor, { x: (originWidth - originProfile) / 2, y: originProfile / 2 })

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

function GetPolygon(details) {
    var polygon = new fabric.Polygon(details.points, {
        left: details.originPoint.x,
        top: details.originPoint.y,
        fill: details.fillColor,
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

function OpenDirection(details) {

    // var w = details.width;
    // var h = details.height;
    // var hw = w / 2;
    // var hh = h / 2;
    // var pointLine = "M ";

    // switch (details.direction) {
    //     case "l":
    //         var points = [w, " 0 ", " L 0 ", hh, " ", w, " ", h, " z"];
    //         pointLine = pointLine.concat(...points);
    //         break;
    //     case "r":
    //         var points = ["0 0 ", " L ", w, " ", hh, " 0 ", h, " z"];
    //         pointLine = pointLine.concat(...points);
    //         break;
    //     case "u":
    //         var points = ["0 ", h, " L ", hw, " 0 ", w, " ", h, " z"];
    //         pointLine = pointLine.concat(...points);
    //         break;
    //     case "d":
    //         var points = [w, " ", h, " L ", wh, " 0 ", w, " ", h, " z"];
    //         pointLine = pointLine.concat(...points);
    //         break;
    // }
    var pointLine = "M ";
    for (var i = 0; i < details.points.length; i++) {
        if (i == 1)
            pointLine += "L ";
        pointLine += (details.points[i].x + " " + details.points[i].y + " ");
    }

    var line = new fabric.Path(pointLine, {
        stroke: "black",
        objectCaching: false,
        strokeWidth: 5,
        left: details.originPoint.x,
        top: details.originPoint.y,
        fill: ""
    })

    return line;
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

function GetCill(cillDetail) {
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

function GetRatio(size) {
    var frameWidth = parseInt(size.width, 10);
    var frameHeight = parseInt(size.height, 10);

    var onScreenWidth = $("#canvasWindowFrame").outerWidth();
    var onScreenHeight = $("#canvasWindowFrame").outerHeight();

    var wr = onScreenWidth / frameWidth;
    var hr = onScreenHeight / frameHeight;

    var ratio = Math.min(wr, hr) * size.scale;

    return ratio;
}