/*
 * magic.js by dinh group 2018
 * canvas drawing of windows using fabric js
 *
 */

// style 280
var testWindow1 = {

    "w": 1000,
    "h": 1000,
    "p": 60,
    "layout": {
        "c": [
            {
                "r": [
                    { f: 0, od: "u" },
                    { h: 400, f: 0, od: "u" },
                    { h: 600, f: 0, od: "u" }
                ]
            },
            {
                "r": [
                    { f: 0, od: "u" },
                    { h: 400, f: 1 }
                ]
            }
        ]
    }
};

var testWindow2 = {

    "w": 1000,
    "h": 1500,
    "p": 60,
    "layout": {
        "r": [
            {
                "c": [
                    { f: 1 },
                    { f: 0, od: "l" }
                ]
            }
        ]
    }
};

const orientation = {
    col: 'c',
    row: 'r'
}

var profileWidth = 60;
var c = window._canvas = new fabric.Canvas('c', {
    preserveObjectStacking: true // keeps objects in order when selected / highlighted
});

var group;

var model = [];

var frameOpts = {
    width: 500, // width in mm
    height: 500, // height in mm
    profileWidth: 60, // profile in mm

    isWindow: false, // is window or just frame
    isFixed: true, // can be opened
    openDirection: "d", // requires isFixed to be false
    hasVent: true, // draw vent or not
    profileColor: "white", // profile color
    glassColor: "skyblue", // glass color
    openingLineColor: "", // opening line color
    highDetailMode: true, // draw extra lines to make pretty

    scale: 1, // not changable. used for calculation
};


//drawWindowJson(testWindow1);

function drawWindowJson(json) {

    var squares = countSquares(json.layout);

    console.log("no of squares: " + squares);

    // draw base frame

    var detailJson = parseJson(json.layout, json.w, json.h, json.p);
    console.log(detailJson);
    //return;
    var opts = {
        width: json.w, // width in mm
        height: json.h, // height in mm
        profileWidth: json.p, // profile in mm

        isWindow: false, // is window or just frame
        isFixed: true, // can be opened
        openDirection: "d", // requires isFixed to be false
        hasVent: true, // draw vent or not
        profileColor: "white", // profile color
        glassColor: "skyblue", // glass color
        openingLineColor: "", // opening line color
        highDetailMode: true, // draw extra lines to make pretty

        scale: 1, // not changable. used for calculation
    };

    drawWindow(opts)

    var s = calculateScale(opts);
    var offset = {
        x: ((c.width / 2) - (json.w * s / 2)),
        y: ((c.height / 2) - (json.h * s / 2))
    };
    var arrayBringToFront = [];

    var countCol = detailJson.length;
    for (var i = 0; i < detailJson.length; i++) {
        var countRow = detailJson[i].length;
        for (var j = 0; j < detailJson[i].length; j++) {
            var element = detailJson[i][j];

            if (element.ox !== 0 || element.oy !== 0) {
                if (element.draw === orientation.col) {
                    c.add(drawProfileLength({
                        x: 0 + offset.x + (element.ox - element.p * i / countCol) * s,
                        y: 0 + offset.y + element.oy + (element.p * s / 2)
                    }, element.h - element.p, element.p, "hd", s, opts));
                } else {
                    c.add(drawProfileLength({
                        x: 0 + (element.ox - (element.p * i / countCol) + element.p / 2) * s + offset.x,
                        y: 0 + (element.oy - element.p * j / countRow) * s + offset.y
                    }, element.w - element.p / countCol, element.p, "vd", s, opts));
                    arrayBringToFront.push(c.getObjects().length - 1);
                }
            }
        }
    }
    
    for (var i = 0; i < arrayBringToFront.length; i++) {
        c.item(arrayBringToFront[i] - i).bringToFront();
    }

}

function parseJson(layout, w, h, p, { ox = 0, oy = 0, draw = orientation.col, no = 0 } = {}) {
    var result = [];

    if (layout.c != undefined) {
        var count = layout.c.length;

        for (var i = 0; i < count; i++) {
            var colWidth, cox;

            if(layout.c[i].w != undefined){
                colWidth = layout.c[i].w;
                cox = layout.c[i].w;
            }else{
                colWidth = w / count;
                cox = (i * w / count);
            }

            var col = parseJson(layout.c[i], colWidth, h, p, { ox: cox, oy: oy, draw: draw });
            result.push(col);
        }
    } else if (layout.r != undefined) {
        var count = layout.r.length;
        var height = 0;
        var roy;

        for (var i = 0; i < layout.r.length; i++) {

            if (draw === orientation.col) {
                if (i === 0)
                    height = h;
                else if(layout.r[i].h != undefined){
                    height = layout.r[i].h
                    roy = layout.r[i].h;
                }else{
                    height = h / count;
                    roy = (i * h / count);
                }
                    
            }
            var row = parseJson(layout.r[i], w, height, p, { ox: ox, oy: roy, draw: draw, no: i });
            result.push(row);
        }
    } else {
        layout.w = w;
        layout.p = p;
        layout.h = h;
        layout.ox = ox;
        layout.oy = oy;

        if (draw === orientation.col) {
            if (no === 0)
                layout.draw = orientation.col;
            else
                layout.draw = orientation.row;
        } else {
            if (no === 0)
                layout.draw = orientation.row;
            else
                layout.draw = orientation.col;
        }

        console.log(layout);
        return layout;
    }
    return result;
}

function countSquares(j) {
    // console.log("count start", j);
    var count = 0;

    if (j == null) return 0;

    // is col/row data then just count it
    if (Array.isArray(j)) {
        return j.length;
    } else {
        // check rows
        if (j.r != null) {
            for (var i = 0; i < j.r.length; i++) {
                if (j.r[i].r != null) {
                    count += countSquares(j.r[i].r);
                } else if (j.r[i].c != null) {
                    count += countSquares(j.r[i].c);
                } else {
                    count++;
                }
            }
        }

        // check cols
        if (j.c != null) {
            for (var i = 0; i < j.c.length; i++) {
                if (j.c[i].r != null) {
                    count += countSquares(j.c[i].r);
                } else if (j.c[i].c != null) {
                    count += countSquares(j.c[i].c);
                } else {
                    count++;
                }
            }
        }
    }

    return count;
}

function cs2(layout) {

}


//drawWindow(frameOpts);

$("#view").on('click', function () {
    drawWindow(frameOpts);
});

$("#width, #height, #profile").on('change', function () {
    //drawWindow(frameOpts);
    
    testWindow1.w = parseInt($("#width").val());
    testWindow1.h = parseInt($("#height").val());
    testWindow1.p = parseInt($("#profile").val());

    //drawWindowJson(testWindow1);


});


function drawWindow(opts) {

    // read options this should not be inside here
    //opts.width = parseInt($("#width").val());
    //opts.height = parseInt($("#height").val());
    //opts.profileWidth = parseInt($("#profile").val());

    // create new group to clear
    group = new fabric.Group([], {
        hasBorders: true,
        hasControls: false,
        hasRotatingPoint: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: 'pointer',
        borderScaleFactor: 5
    });
    c.clear();

    console.log("drawWindow opts", opts);

    drawFrame(opts);
}

function calculateScale(opts) {
    var canvas = document.getElementById('c');
    var width = canvas.width;
    var height = canvas.height;

    // add spacing for scale lables here
    var w = opts.width + 50;
    var h = opts.height + 50;
    var s = 1;

    if (width > height) {
        s = Math.min(height / w, width / h);
    } else {
        s = Math.min(width / w, height / h);
    }

    console.log(s);
    return s;
}


function drawFrame(opts) {

    console.log("drawframe ", opts);
    var w = opts.width;
    var h = opts.height;
    var p = opts.profileWidth;

    var s = calculateScale(opts);
    var canvas = document.getElementById('c');

    var offset = {
        x: ((canvas.width / 2) - (w * s / 2)),
        y: ((canvas.height / 2) - (h * s / 2))
    };

    // draw glass first
    if (opts.isWindow) {
        c.add(
            drawGlass({
                x: 0 + offset.x + (p * s),
                y: 0 + offset.y + (p * s)
            },
                (w - (p * 2)) * s,
                (h - (p * 2)) * s,
                opts));
    }

    c.add(drawProfileLength({
        x: 0 + offset.x,
        y: 0 + offset.y
    }, w, p, "hb", s, opts));

    c.add(drawProfileLength({
        x: 0 + offset.x,
        y: 0 + offset.y
    }, h, p, "vr", s, opts));

    c.add(drawProfileLength({
        x: ((w - p) * s) + offset.x,
        y: 0 + offset.y
    }, h, p, "vl", s, opts));

    c.add(drawProfileLength({
        x: 0 + offset.x,
        y: ((h - p) * s) + offset.y
    }, w, p, "ht", s, opts));

}

function drawGlass(o, w, h, opts) {
    //console.log("drawglass opts", opts);


    var grp = new fabric.Group([], {
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: 'pointer',
        hasBorders: false,
        // borderScaleFactor: 5
    });

    // plain color
    grp.addWithUpdate(new fabric.Rect({
        width: w,
        height: h,
        left: o.x,
        top: o.y,
        fill: opts.glassColor,
        selectable: true,
        hasControls: false,
        hoverCursor: 'pointer',
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
    }));

    if (!opts.isFixed) {

        // draw opener line
        var openinglines = [];

        var lineOpt = {
            stroke: 'rgba(0,255,255,1)',
            strokeWidth: 2,
            selectable: false,
            evented: false
        };

        console.log("draw glass lines for " + opts.openDirection);

        switch (opts.openDirection) {
            case "r":
                openinglines = [[o.x + w, o.y, o.x, o.y + h / 2], [o.x, o.y + h / 2, o.x + w, o.y + h]];
                break;

            case "l":
                openinglines = [[o.x, o.y, o.x + w, o.y + h / 2], [o.x + w, o.y + h / 2, o.x, o.y + h]];
                break;

            case "u":
                openinglines = [[o.x, o.y + h, o.x + (w / 2), o.y], [o.x + (w / 2), o.y, o.x + w, o.y + h]];
                break;

            case "d":
                openinglines = [[o.x, o.y, o.x + (w / 2), o.y + h], [o.x + (w / 2), o.y + h, o.x + w, o.y]];
                break;

        }

        grp.addWithUpdate(new fabric.Line(openinglines[0], lineOpt));
        grp.addWithUpdate(new fabric.Line(openinglines[1], lineOpt));
    }

    return grp;
}

function drawLine(l, opt) {
    c.add(new fabric.Line(l, opt));
}

function drawLineToGroup() {
    c.add(new fabric.Line(l, opt));
}

function drawProfileLength(o, l, pw, d, s, opts) {

    var grp = new fabric.Group([], {
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: 'pointer',
        hasBorders: false,
        // borderScaleFactor: 5
    });

    //console.log(o);
    var p = [];

    // highlight points
    // disable in low quality mode
    var outerHl = [];
    var innerHl = [];


    switch (d) {
        case "ht":
            p = [{
                x: o.x + (pw * s),
                y: o.y + 0
            },
            {
                x: o.x + ((l - pw) * s),
                y: o.y + 0
            },
            {
                x: o.x + (l * s),
                y: o.y + (pw * s)
            },
            {
                x: o.x + 0,
                y: o.y + (pw * s)
            }
            ];

            outerHl = [
                o.x + ((pw * 0.15) * s),
                o.y + ((pw * 0.85) * s),
                o.x + ((l - (pw * 0.15)) * s),
                o.y + ((pw * 0.85) * s)
            ];

            innerHl = [
                o.x + ((pw * 0.85) * s),
                o.y + ((pw * 0.15) * s),
                o.x + ((l - (pw * 0.85)) * s),
                o.y + ((pw * 0.15) * s)
            ];
            break;
        case "hb":
            p = [{
                x: o.x + 0,
                y: o.y + 0
            },
            {
                x: o.x + (l * s),
                y: o.y + 0
            },
            {
                x: o.x + ((l - pw) * s),
                y: o.y + (pw * s)
            },
            {
                x: o.x + (pw * s),
                y: o.y + (pw * s)
            }
            ];

            outerHl = [
                o.x + ((pw * 0.15) * s),
                o.y + ((pw * 0.15) * s),
                o.x + ((l - (pw * 0.15)) * s),
                o.y + ((pw * 0.15) * s)
            ];

            innerHl = [
                o.x + ((pw * 0.85) * s),
                o.y + ((pw * 0.85) * s),
                o.x + ((l - (pw * 0.85)) * s),
                o.y + ((pw * 0.85) * s)
            ];
            break;
        case "vl":
            p = [{
                x: o.x + 0,
                y: o.y + (pw * s)
            },
            {
                x: o.x + (pw * s),
                y: o.y + 0
            },
            {
                x: o.x + (pw * s),
                y: o.y + (l * s)
            },
            {
                x: o.x + 0,
                y: o.y + ((l - pw) * s)
            }
            ];

            outerHl = [
                o.x + ((pw * 0.85) * s),
                o.y + ((pw * 0.15) * s),
                o.x + ((pw * 0.85) * s),
                o.y + ((l - (pw * 0.15)) * s)
            ];

            innerHl = [
                o.x + ((pw * 0.15) * s),
                o.y + ((pw * 0.85) * s),
                o.x + ((pw * 0.15) * s),
                o.y + ((l - (pw * 0.85)) * s)
            ];
            break;
        case "vr":
            p = [{
                x: o.x + 0,
                y: o.y + 0
            },
            {
                x: o.x + (pw * s),
                y: o.y + (pw * s)
            },
            {
                x: o.x + (pw * s),
                y: o.y + ((l - pw) * s)
            },
            {
                x: o.x + 0,
                y: o.y + (l * s)
            }
            ];

            outerHl = [
                o.x + ((pw * 0.15) * s),
                o.y + ((pw * 0.15) * s),
                o.x + ((pw * 0.15) * s),
                o.y + ((l - pw * 0.15) * s)
            ];

            innerHl = [
                o.x + ((pw * 0.85) * s),
                o.y + ((pw * 0.85) * s),
                o.x + ((pw * 0.85) * s),
                o.y + ((l - pw * 0.85) * s)
            ];
            break;

        // dividers
        case "hd":
            p = [{
                x: o.x + 0,
                y: o.y + ((pw / 2) * s)
            },
            {
                x: o.x + ((pw / 2) * s),
                y: o.y + 0
            },
            {
                x: o.x + (pw * s),
                y: o.y + ((pw / 2) * s)
            },
            {
                x: o.x + (pw * s),
                y: o.y + ((l - pw / 2) * s)
            },
            {
                x: o.x + ((pw / 2) * s),
                y: o.y + (l * s)
            },
            {
                x: o.x + 0,
                y: o.y + ((l - pw / 2) * s)
            }
            ];

            outerHl = [
                o.x + ((pw * 0.15) * s),
                o.y + ((pw / 2 * 0.75) * s),
                o.x + ((pw * 0.15) * s),
                o.y + ((l - (pw / 2) * 0.75) * s)
            ];

            innerHl = [
                o.x + ((pw * 0.85) * s),
                o.y + ((pw / 2 * 0.75) * s),
                o.x + ((pw * 0.85) * s),
                o.y + ((l - pw / 2 * 0.75) * s)
            ];
            break;
        case "vd":
            p = [{
                x: o.x + 0,
                y: o.y + ((pw / 2) * s)
            },
            {
                x: o.x + ((pw / 2) * s),
                y: o.y + 0
            },
            {
                x: o.x + ((l - (pw / 2)) * s),
                y: o.y + 0
            },
            {
                x: o.x + (l * s),
                y: o.y + (pw / 2 * s)
            },
            {
                x: o.x + ((l - (pw / 2)) * s),
                y: o.y + (pw * s)
            },
            {
                x: o.x + ((pw / 2) * s),
                y: o.y + (pw * s)
            }
            ];
            
            outerHl = [
                o.x + ((pw / 2 * 0.75) * s),
                o.y + ((pw * 0.15) * s),
                o.x + ((l - pw / 2 * 0.75) * s),
                o.y + ((pw * 0.15) * s)
            ];

            innerHl = [
                o.x + ((pw / 2 * 0.75) * s),
                o.y + ((pw * 0.85) * s),
                o.x + ((l - pw / 2 * 0.75) * s),
                o.y + ((pw * 0.85) * s)
            ];
            break;
    }

    // draw it
    console.log(d, p);
    grp.addWithUpdate(new fabric.Polygon(p, {
        fill: opts.profileColor,
        selectable: true,
        objectCaching: false,
        strokeWidth: 1,
        stroke: "rgba(0,0,0,0.3)",
        perPixelTargetFind: true,
        hasBorders: true,
        hasControls: false,
        hasRotatingPoint: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: 'pointer',
        borderScaleFactor: 5
    }));
    //group.addWithUpdate();

    if (opts.highDetailMode) {
        if (outerHl.length > 0) {
            console.log("draw highlights ", outerHl);
            grp.addWithUpdate(new fabric.Line(outerHl, {
                // fill: 'red',
                stroke: 'rgba(0,0,0,0.2)',
                strokeWidth: 1,
                selectable: false,
                evented: false,
            }));
        }

        if (innerHl.length > 0) {
            console.log("draw highlights ", innerHl);
            grp.addWithUpdate(new fabric.Line(innerHl, {
                // fill: 'red',
                stroke: 'rgba(0,0,0,0.2)',
                strokeWidth: 1,
                selectable: false,
                evented: false,
            }));
        }
    }

    return grp;

}