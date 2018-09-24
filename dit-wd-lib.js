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

    group.setShadow(shadow);

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
    var width = handelInfo.width;
    var height = handelInfo.height;
    var point = [
        { x: handelInfo.width, y: 0 },
        { x: handelInfo.width, y: handelInfo.height },
        { x: frameWidth - frameProfile, y: frameHeight - frameProfile },
        { x: frameWidth - frameProfile, y: frameProfile }
    ];
}