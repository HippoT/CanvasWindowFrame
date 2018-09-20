var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
    container: 'contentWindowFrame',
    width: width,
    height: height
});


var layer = new Konva.Layer();
stage.add(layer);

var widthInput = document.getElementById('inputWidth');
var heightInput = document.getElementById('inputHeight');
var profileWidthInput = document.getElementById('inputProfileWidth');

function createFrame(frameWidth, frameHeight, padding) {
    //var padding = 70;
    var group = new Konva.Group();
    var top = new Konva.Line({
        points: [
            0, 0,
            frameWidth, 0,
            frameWidth - padding, padding,
            padding, padding
        ],
        fill: 'white'
    });

    var left = new Konva.Line({
        points: [
            0, 0,
            padding, padding,
            padding, frameHeight - padding,
            0, frameHeight
        ],
        fill: 'white'
    });

    var bottom = new Konva.Line({
        points: [
            0, frameHeight,
            padding, frameHeight - padding,
            frameWidth - padding, frameHeight - padding,
            frameWidth, frameHeight
        ],
        fill: 'white'
    });

    var right = new Konva.Line({
        points: [
            frameWidth, 0,
            frameWidth, frameHeight,
            frameWidth - padding, frameHeight - padding,
            frameWidth - padding, padding
        ],
        fill: 'white'
    });

    var glass = new Konva.Rect({
        x: padding,
        y: padding,
        width: frameWidth - padding * 2,
        height: frameHeight - padding * 2,
        fill: 'lightblue'
    });

    group.add(glass, top, left, bottom, right);

    group.find('Line')
        .closed(true)
        .stroke('black')
        .strokeWidth(1);

    return group;
}

function createInfo(frameWidth, frameHeight, padding) {
    var offset = 40;

    var arrowOffset = offset / 2;
    var arrowSize = 8;

    var group = new Konva.Group();

    var linesProWidth = new Konva.Shape({
        sceneFunc: function(ctx){
            ctx.fillStyle = 'grey';
            ctx.lineWidth = 0.5;

            ctx.moveTo(-offset, padding);
            ctx.lineTo(-(2 * offset), padding);

            ctx.moveTo(-offset, (frameHeight - padding));
            ctx.lineTo(-(2 * offset), (frameHeight - padding));

            ctx.moveTo(padding, (frameHeight + offset));
            ctx.lineTo(padding, (frameHeight + offset * 2));

            ctx.moveTo((frameWidth - padding), (frameHeight + offset));
            ctx.lineTo((frameWidth - padding), (frameHeight + offset * 2));
        }
    });

    var arrowLeftProWidth = new Konva.Shape({
        sceneFunc: function(ctx){
            ctx.fillStyle = 'grey';
            ctx.lineWidth = 0.5;

            // top pointer
            ctx.moveTo(-arrowOffset - arrowSize - offset, arrowSize + padding);
            ctx.lineTo(-arrowOffset - offset, padding);
            ctx.lineTo(-arrowOffset + arrowSize - offset, arrowSize + padding);

            // line
            ctx.moveTo(-arrowOffset - offset, padding);
            ctx.lineTo(-arrowOffset - offset, frameHeight - padding);

            // bottom pointer
            ctx.moveTo(-arrowOffset - arrowSize - offset, frameHeight - arrowSize - padding);
            ctx.lineTo(-arrowOffset - offset, frameHeight - padding);
            ctx.lineTo(-arrowOffset + arrowSize - offset, frameHeight - arrowSize - padding);

            ctx.stroke();
        }
    });

    var arrowBotProWidth = new Konva.Shape({
        sceneFunc: function(ctx){
            ctx.fillStyle = 'grey';
            ctx.lineWidth = 0.5;

            ctx.translate(padding, frameHeight + arrowOffset + offset);
            ctx.moveTo(arrowSize, -arrowSize);
            ctx.lineTo(0, 0);
            ctx.lineTo(arrowSize, arrowSize);

            // line
            ctx.moveTo(0, 0);
            ctx.lineTo(frameWidth - padding * 2, 0);

            // bottom pointer
            ctx.moveTo(frameWidth - arrowSize - padding * 2, -arrowSize);
            ctx.lineTo(frameWidth - padding * 2, 0);
            ctx.lineTo(frameWidth - arrowSize - padding * 2, arrowSize);

            ctx.stroke();
        }
    });
    var lines = new Konva.Shape({
        sceneFunc: function (ctx) {
            ctx.fillStyle = 'grey';
            ctx.lineWidth = 0.5;

            ctx.moveTo(0, 0);
            ctx.lineTo(-offset, 0);

            ctx.moveTo(0, frameHeight);
            ctx.lineTo(-offset, frameHeight);

            ctx.moveTo(0, frameHeight);
            ctx.lineTo(0, frameHeight + offset);

            ctx.moveTo(frameWidth, frameHeight);
            ctx.lineTo(frameWidth, frameHeight + offset);

            ctx.stroke();
        }
    });

    var leftArrow = new Konva.Shape({
        sceneFunc: function (ctx) {
            // top pointer
            ctx.moveTo(-arrowOffset - arrowSize, arrowSize);
            ctx.lineTo(-arrowOffset, 0);
            ctx.lineTo(-arrowOffset + arrowSize, arrowSize);

            // line
            ctx.moveTo(-arrowOffset, 0);
            ctx.lineTo(-arrowOffset, frameHeight);

            // bottom pointer
            ctx.moveTo(-arrowOffset - arrowSize, frameHeight - arrowSize);
            ctx.lineTo(-arrowOffset, frameHeight);
            ctx.lineTo(-arrowOffset + arrowSize, frameHeight - arrowSize);

            ctx.strokeShape(this);
        },
        stroke: 'grey',
        strokeWidth: 0.5
    });

    var bottomArrow = new Konva.Shape({
        sceneFunc: function (ctx) {
            // top pointer
            ctx.translate(0, frameHeight + arrowOffset);
            ctx.moveTo(arrowSize, -arrowSize);
            ctx.lineTo(0, 0);
            ctx.lineTo(arrowSize, arrowSize);

            // line
            ctx.moveTo(0, 0);
            ctx.lineTo(frameWidth, 0);

            // bottom pointer
            ctx.moveTo(frameWidth - arrowSize, -arrowSize);
            ctx.lineTo(frameWidth, 0);
            ctx.lineTo(frameWidth - arrowSize, arrowSize);

            ctx.strokeShape(this);
        },
        stroke: 'grey',
        strokeWidth: 0.5
    });

    // left text
    var leftLabel = new Konva.Label();

    leftLabel.add(new Konva.Tag({
        fill: 'white',
        stroke: 'grey'
    }));

    var leftText = new Konva.Text({
        text: heightInput.value + 'mm',
        padding: 2,
        fill: 'black'
    });

    leftLabel.rotation(90);
    leftLabel.add(leftText);
    leftLabel.position({
        x: -arrowOffset,
        y: frameHeight / 2 - leftText.height() / 2
    });

    leftLabel.on('click tap', function () {
        createInput('height', this.getAbsolutePosition(), leftText.size());
    });



    var leftProWidthLabel = new Konva.Label();

    leftProWidthLabel.add(new Konva.Tag({
        fill: 'white',
        stroke: 'grey'
    }));

    var leftText = new Konva.Text({
        text: (heightInput.value - profileWidthInput.value * 2) + 'mm',
        padding: 2,
        fill: 'black'
    });

    leftProWidthLabel.rotation(90);
    leftProWidthLabel.add(leftText);
    leftProWidthLabel.position({
        x: -arrowOffset -offset,
        y: frameHeight / 2 - leftText.height() / 2
    });


    // bottom text
    var bottomLabel = new Konva.Label();

    bottomLabel.add(new Konva.Tag({
        fill: 'white',
        stroke: 'grey'
    }));
    var bottomText = new Konva.Text({
        text: widthInput.value + 'mm',
        padding: 2,
        fill: 'black'
    });

    bottomLabel.add(bottomText);
    bottomLabel.position({
        x: frameWidth / 2 - bottomText.width() / 2,
        y: frameHeight + arrowOffset
    });

    bottomLabel.on('click tap', function () {
        createInput('width', this.getAbsolutePosition(), bottomText.size());
    });

    
    var bottomProWidthLabel = new Konva.Label();

    bottomProWidthLabel.add(new Konva.Tag({
        fill: 'white',
        stroke: 'grey'
    }));
    var bottomText = new Konva.Text({
        text: (widthInput.value - profileWidthInput.value * 2) + 'mm',
        padding: 2,
        fill: 'black'
    });

    bottomProWidthLabel.add(bottomText);
    bottomProWidthLabel.position({
        x: frameWidth / 2 - bottomText.width() / 2,
        y: frameHeight + offset + arrowOffset
    });

    group.add(lines, leftArrow, 
        bottomArrow, leftLabel, 
        bottomLabel, linesProWidth, 
        arrowLeftProWidth, arrowBotProWidth,
        leftProWidthLabel, bottomProWidthLabel);

    return group;
}

function createInput(metric, pos, size) {
    var wrap = document.createElement('div');
    wrap.style.position = 'absolute';
    wrap.style.backgroundColor = 'rgba(0,0,0,0.1)';
    wrap.style.top = 0;
    wrap.style.left = 0;
    wrap.style.width = '100%';
    wrap.style.height = '100%';

    document.body.appendChild(wrap);

    var input = document.createElement('input');
    input.type = 'number';

    var similarInput = (metric === 'width' ? widthInput : heightInput);
    input.value = similarInput.value;

    input.style.position = 'absolute';
    input.style.top = pos.y + 3 + 'px';
    input.style.left = pos.x + 'px';

    input.style.height = (size.height + 3) + 'px';
    input.style.width = (size.width + 3) + 'px';

    wrap.appendChild(input);

    input.addEventListener('change', function () {
        similarInput.value = input.value;
        updateCanvas();
    });

    input.addEventListener('input', function () {
        similarInput.value = input.value;
        updateCanvas();
    });

    wrap.addEventListener('click', function (e) {
        if (e.target === wrap) {
            document.body.removeChild(wrap);
        }
    });


    input.addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
            document.body.removeChild(wrap);
        }
    });
}

function updateCanvas() {
    layer.children.destroy();

    var frameWidth = parseInt(widthInput.value, 10);
    var frameHeight = parseInt(heightInput.value, 10);
    var frameProfileWidth = parseInt(profileWidthInput.value, 10);

    var wr = stage.width() / frameWidth;
    var hr = stage.height() / frameHeight;

    var ratio = Math.min(wr, hr) * 0.8;

    var frameOnScreenWidth = frameWidth * ratio;
    var frameOnScreenHeight = frameHeight * ratio;
    var frameOnScreenProfileWidth = frameProfileWidth * ratio;

    var group = new Konva.Group({});

    group.x(Math.round(stage.width() / 2 - frameOnScreenWidth / 2) + 0.5);
    group.y(Math.round(stage.height() / 2 - frameOnScreenHeight / 2) + 0.5);

    layer.add(group);

    var frameGroup = createFrame(frameWidth, frameHeight, frameProfileWidth);
    frameGroup.scale({ x: ratio, y: ratio });
    group.add(frameGroup);

    var infoGroup = createInfo(frameOnScreenWidth, frameOnScreenHeight, frameOnScreenProfileWidth);
    group.add(infoGroup);

    layer.draw();

}

widthInput.addEventListener('change', updateCanvas);
widthInput.addEventListener('input', updateCanvas);

heightInput.addEventListener('change', updateCanvas);
heightInput.addEventListener('input', updateCanvas);

profileWidthInput.addEventListener('change', updateCanvas);
profileWidthInput.addEventListener('input', updateCanvas);

// set default value
widthInput.value = 1000;
heightInput.value = 2000;
profileWidthInput.value = 70;

updateCanvas();