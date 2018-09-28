/*
 * magic.js by dinh group 2018
 * canvas drawing of windows using fabric js
 * 
 */


// notes 
// need to move center of separater to point


// style 280
var testWindow1 = {

    "w": 1200,
    "h": 1000,
    "pw": 60,
    "pc": "white",
    "hd": 1,
    "layout": [
        {
            "r": [
                { f: 0, od: "l" }
                
            ]
        },
        {
            "w": 600,
            "r": [
                { f: 0, od: "u", h: 375 },
                { f: 1 }
            ]
        },
        {
            "r": [
                { f: 0, od: "u" }
            ]
        }
    ]
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
                    { f: 0, od: "l" },
                    { f: 0, od: "l" }
                ]
            }
        ]
    }
};

var profileWidth = 60;
var c = window._canvas = new fabric.Canvas('c', {
    preserveObjectStacking: true, // keeps objects in order when selected / highlighted
    selection: false

});

var group;

var drawOptions = {
    glassColor: "skyblue", // glass color
    openingLineColor: "", // opening line color
    highDetailMode: true, // draw extra lines to make pretty

    scale: 1, // not changable. used for calculation
}

var frameOpts = {
    width: 300, // width in mm
    height: 400, // height in mm
    profileWidth: 60, // profile in mm

    isWindow: true, // is window or just frame
    isFixed: false, // can be opened
    openDirection: "d", // requires isFixed to be false
    hasVent: true, // draw vent or not
    //profileColor: "white", // profile color

};

function drawWindowJson(json, opts) {

    var squares = countSquares(json.layout);

    console.log("no of squares: " + squares);

    // draw base frame

    // read options this should not be inside here
    opts.width = json.w;
    opts.height = json.h;
    opts.profileWidth = json.pw;

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


    drawFrame1(json);

}

/* count squares for fun */
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

drawWindowJson(testWindow1, frameOpts);

//drawWindow(frameOpts);

$("#view").on('click', function () {
    drawWindow(frameOpts);
});

$("#width, #height, #profile").on('change', function () {
    drawWindow(frameOpts);
});


function drawWindow(opts) {

    // read options this should not be inside here
    opts.width = parseInt($("#width").val());
    opts.height = parseInt($("#height").val());
    opts.profileWidth = parseInt($("#profile").val());

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

function calculateScale(j) {
    var canvas = document.getElementById('c');
    var width = canvas.width;
    var height = canvas.height;

    // add spacing for scale lables here
    var w = j.w + 50;
    var h = j.h + 50;
    var s = 1;

    if (width > height) {
        s = Math.min(height / w, width / h);
    } else {
        s = Math.min(width / w, height / h);
    }

    console.log(s);
    return s;
}

function drawFrame1(opts) {

    console.log("drawframe 1 ", opts);
    var w = opts.w;
    var h = opts.h;
    var p = opts.pw;

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

    c.add(drawCircle({
        x: 0 + offset.x,
        y: 0 + offset.y
    }));


    c.add(drawProfileLength({
        x: 0 + offset.x,
        y: 0 + offset.y
    }, h, p, "vr", s, opts));

    c.add(drawProfileLength({
        x: ((w - p) * s) + offset.x,
        y: 0 + offset.y
    }, h, p, "vl", s, opts));

    c.add(drawCircle({
        x: ((w - p) * s) + offset.x,
        y: 0 + offset.y
    }));

    c.add(drawCircle({
        x: ((w) * s) + offset.x,
        y: 0 + offset.y
    }));


    c.add(drawProfileLength({
        x: 0 + offset.x,
        y: ((h - p) * s) + offset.y
    }, w, p, "ht", s, opts));

    var lineOpt = {
        stroke: 'rgba(0,255,255,1)',
        strokeWidth: 2,
        evented: false
    };

    // draw separators for cols
    var cols = opts.layout.length;
    var colX = (p / 2) * s; // x start
    var colGap = ((w - p) / (cols)) * s;
    console.log("cols: " + (cols - 1));

    // -1 because u only need one less separater
    for (var i = 0; i < cols - 1; i++) {
        //console.log(i);

        // do it first as we missing one col so we move it in
        colX += colGap;

        // draw vertical 
        c.add(drawProfileLength({
            x: (colX + offset.x),
            y: ((p / 2) * s) + offset.y
        }, (h - p), p, "vd", s, opts));

        console.log("offsetx " + offset.x);

        c.add(drawCircle({
            x: (colX + offset.x),
            y: ((p / 2) * s) + offset.y
        }));
    }

    // col loop again to calculate x start
    colX = (p / 2) * s; // x start
    colGap = ((w - p) / (cols)) * s;

    // loop for every cols
    for (var i = 0; i < cols; i++) {
        
        var rows = opts.layout[i].r.length;
        var rowY = (p / 2) * s;
        var rowGap = ((h - p) / (rows)) * s;
        var rowW = ((w-p) / cols);

        console.log("h " + h + " rows " + rows + " rowgap " + rowGap);
        for (var j = 0; j < rows -1 ; j++) {

            rowY += rowGap;
            console.log("rowY " + rowY);
            c.add(drawProfileLength({
                x: colX + offset.x,
                y: rowY + offset.y
            }, rowW, p, "hd", s, opts));

            c.add(drawCircle({
                x: colX + offset.x,
                y: rowY + offset.y
            }));

        }

        colX += colGap;
    }

    // reset for vert

    // c.add(drawProfileLength({
    //     x: 0 + ((p / 2) * s) + offset.x,
    //     y: (((h / 2) - (p / 2)) * s) + offset.y
    // }, w - p, p, "hd", s, opts));

    // c.add(drawProfileLength({
    //     x: (((w / 2) - (p / 2)) * s) + offset.x,
    //     y: ((p / 2) * s) + offset.y
    // }, (h / 2) - (p / 2), p, "vd", s, opts));

    // c.add(drawProfileLength({
    //     x: (((w / 2) - (p / 2)) * s) + offset.x,
    //     y: (((h / 2)) * s) + offset.y
    // }, (h / 2) - (p / 2), p, "vd", s, opts));


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

function drawDivider(o, w, h, opts) {

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

function drawCircle(o) {
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

    grp.addWithUpdate(
        new fabric.Circle({
            left: o.x,
            top: o.y,
            strokeWidth: 1,
            radius: 1,
            fill: '#f00',
            stroke: '#f00'
        }));

    return grp;
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
        case "vd":
            p = [
                {
                    x: o.x + 0,
                    y: o.y + 0
                },
                {
                    x: o.x + ((pw / 2) * s),
                    y: o.y + ((pw / 2) * s)
                },
                {
                    x: o.x + ((pw / 2) * s),
                    y: o.y + ((l - (pw / 2)) * s)
                },
                {
                    x: o.x + 0,
                    y: o.y + ((l) * s)
                },
                {
                    x: o.x + (-(pw / 2) * s),
                    y: o.y + ((l - (pw / 2)) * s)
                },
                {
                    x: o.x + (-(pw / 2) * s),
                    y: o.y + ((pw / 2) * s)
                }
            ];

            outerHl = [
                o.x + (-(pw * 0.35) * s),
                o.y + ((pw * 0.35) * s),
                o.x + (-(pw * 0.35) * s),
                o.y + ((l - pw * 0.35) * s)
            ];

            innerHl = [
                o.x + ((pw * 0.35) * s),
                o.y + ((pw * 0.35) * s),
                o.x + ((pw * 0.35) * s),
                o.y + ((l - pw * 0.35) * s)
            ];

            break;
        case "hd":
            p = [
            {
                x: o.x + 0,
                y: o.y + 0
            },
            {
                x: o.x + ((pw/2)* s),
                y: o.y + (-(pw/2)* s)
            },
            {
                x: o.x + ((l -(pw / 2))* s),
                y: o.y + (-(pw/2)* s)
            },
            {
                x: o.x + ((l) * s),
                y: o.y + 0
            },
            {
                x: o.x + ((l -(pw / 2))* s),
                y: o.y + ((pw/2)* s)
            },
            {
                x: o.x + ((pw/2)* s),
                y: o.y + ((pw / 2) * s)
            },
            ];

            outerHl = [
                o.x + ((pw * 0.35) * s),
                o.y + (-(pw * 0.35) * s),
                o.x + ((l - (pw * 0.35)) * s),
                o.y + (-(pw * 0.35) * s)
            ];

            innerHl = [
                o.x + ((pw * 0.35) * s),
                o.y + ((pw * 0.35) * s),
                o.x + ((l - (pw * 0.35)) * s),
                o.y + ((pw * 0.35) * s)
            ];
            break;
    }

    // draw it
    console.log(d, p);
    grp.addWithUpdate(new fabric.Polygon(p, {
        fill: opts.pc,
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

    if (opts.hd) {
        if (outerHl.length > 0) {
            //console.log("draw highlights ", outerHl);
            grp.addWithUpdate(new fabric.Line(outerHl, {
                // fill: 'red',
                stroke: 'rgba(0,0,0,0.2)',
                strokeWidth: 1,
                selectable: false,
                evented: false,
            }));
        }

        if (innerHl.length > 0) {
            //console.log("draw highlights ", innerHl);
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