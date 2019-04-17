var myTestWindow = {
    "w": 1400,
    "h": 1000,
    "pw": 60,
    "pc": "white",
    "hd": 1,
    "layout": {
        'c': [
            {
                "r": [
                    { f: 0, od: "l" }

                ]
            },
            {
                "w": 600,
                "r": [
                    {
                        c: [
                            { f: 0, od: "u", w: 375, pw: 60 },
                            { f: 0, od: "u", }
                        ]
                    },

                    { f: 0, od: "u", h: 200 },
                    { f: 1 }
                ]
            },
            {
                "r": [
                    { f: 0, od: "u" }
                ]
            },
            {
                "r": [
                    { f: 0, od: "u" }
                ]
            }
        ]

    }
};

// var myTestWindow = {
//     "w": 1200,
//     "h": 1000,
//     "pw": 60,
//     "pc": "white",
//     "hd": 1,
//     "layout": {
//         "r": [
//             {
//                 c: [
//                     { f: 0, od: "u", w: 400, pw: 60 },
//                     { f: 0, od: "u", },
//                     { f: 0, od: "u", }
//                 ]
//             },

//             { f: 0, od: "u", h: 375 },
//             { f: 1 }
//         ]
//     }
// };

var myTestWindow = {

    "w": 1000,
    "h": 1200,
    "pw": 60,
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

var c = window._canvas = new fabric.Canvas('c', {
    preserveObjectStacking: true // keeps objects in order when selected / highlighted
});

//draw window by json that is modified
function drawByJson(layout, w, h, offset, s, options) {

    if (layout.c !== undefined) {
        var count = layout.c.length;
        var offsetW = 0;

        for (var i = 0; i < count - 1; i++) {
            var element = layout.c[i];

            c.add(drawProfileLength({
                x: 0 + offset.x + element.ox * s,
                y: 0 + offset.y + element.oy * s
            }, element.h, element.pw, "hd", s, options, { pwb: element.ot, pwe: element.ob }));
        }

        for (var i = 0; i < count; i++) {
            offsetW += layout.c[i].w;
            drawByJson(layout.c[i], offsetW, h, offset, s, options);
        }
    } else if (layout.r !== undefined) {
        var count = layout.r.length;
        var offsetH = 0;

        for (var i = 0; i < count - 1; i++) {
            var element = layout.r[i];

            c.add(drawProfileLength({
                x: element.ox * s + offset.x,
                y: element.oy * s + offset.y
            }, element.w, element.pw, "vd", s, options, { pwb: element.ol, pwe: element.or }));
        }

        for (var i = 0; i < count; i++) {
            offsetH += layout.r[i].h;
            drawByJson(layout.r[i], w, offsetH, offset, s, options);
        }
    }
}

//add offset position ox and oy
function addOffset(layout, { ox = 0, oy = 0 } = {}) {
    var result = layout;

    if (layout.c !== undefined) {
        var count = layout.c.length;
        var offset = ox;

        for (var i = 0; i < count; i++) {
            offset += layout.c[i].w;
            layout.c[i].ox = offset;
            layout.c[i].oy = oy;
        }

        for (var i = 0; i < count; i++) {
            var o = {
                ox: ox,
                oy: oy
            }
            if (i !== 0) {
                o.ox = layout.c[i - 1].ox;
                o.oy = layout.c[i - 1].oy;
            }
            layout.c[i] = addOffset(layout.c[i], o);
        }

        result = layout;
    } else if (layout.r !== undefined) {
        var count = layout.r.length;
        var offset = oy;

        for (var i = 0; i < count; i++) {
            offset += layout.r[i].h;
            layout.r[i].ox = ox;
            layout.r[i].oy = offset;
        }

        for (var i = 0; i < count; i++) {
            var o = {
                ox: ox,
                oy: oy
            }
            if (i !== 0) {
                o.ox = layout.r[i - 1].ox;
                o.oy = layout.r[i - 1].oy;
            }
            layout.r[i] = addOffset(layout.r[i], o);
        }

        result = layout;
    }

    return result;
}

//add miss field h, w, pw
function calibrationJson(layout, parentW, parentH, pw) {
    var result = layout;
    var data = {
        'sum': 0,
        'countMissVal': 0,
        'index': []
    }

    if (layout.c !== undefined) {
        var count = layout.c.length;

        for (var i = 0; i < count; i++) {
            data = calWidthAndHeight(data, layout.c[i], 'w', i);
            layout.c[i].h = parentH;
            if (layout.c[i].pw === undefined)
                layout.c[i].pw = pw;
        }

        var calW = (parentW - data.sum) / data.countMissVal;

        for (var i = 0; i < data.index.length; i++)
            layout.c[data.index[i]].w = calW;

        for (var i = 0; i < count; i++)
            layout.c[i] = calibrationJson(layout.c[i], layout.c[i].w, layout.c[i].h, pw)

        result = layout;
    } else if (layout.r !== undefined) {
        var count = layout.r.length;

        for (var i = 0; i < count; i++) {
            data = calWidthAndHeight(data, layout.r[i], 'h', i);
            layout.r[i].w = parentW;
            if (layout.r[i].pw === undefined)
                layout.r[i].pw = pw;
        }

        var calH = (parentH - data.sum) / data.countMissVal;

        for (var i = 0; i < data.index.length; i++)
            layout.r[data.index[i]].h = calH;

        for (var i = 0; i < count; i++)
            layout.r[i] = calibrationJson(layout.r[i], layout.r[i].w, layout.r[i].h, pw)

        result = layout;
    }

    return result;
}

//modify width and height of frame
function calWidthAndHeight(data, obj, key, index) {

    if (obj[key] !== undefined) {
        data.sum += obj[key];
    } else {
        data.countMissVal++;
        data.index.push(index);
    }

    return data;
}

//add parent pw to calculate width, height and offset
function addParentProfileWidth(layout, ol, or, ot, ob, oh, ow) {

    if (layout.c !== undefined) {
        var count = layout.c.length;
        for (var i = 0; i < count; i++) {
            if (i == 0) {
                layout.c[i].ol = ol;
            }
            else {
                layout.c[i].ol = layout.c[i - 1].or;
            }
            if (i == count - 1) {
                layout.c[i].or = or;
            } else {
                layout.c[i].or = layout.c[i].pw;
            }
            layout.c[i].ot = ot;
            layout.c[i].ob = ob;
        }

        for (var i = 0; i < count; i++) {
            layout.c[i] = addParentProfileWidth(layout.c[i], layout.c[i].ol, layout.c[i].or, layout.c[i].ot, layout.c[i].ob, oh, ow);
        }
    } else if (layout.r !== undefined) {
        var count = layout.r.length;
        for (var i = 0; i < count; i++) {
            if (i == 0) {
                layout.r[i].ot = ot;
            }
            else {
                layout.r[i].ot = layout.r[i - 1].ot;
            }
            if (i == count - 1) {
                layout.r[i].ob = ob;
            } else {
                layout.r[i].ob = layout.r[i].pw;
            }
            layout.r[i].ol = ol;
            layout.r[i].or = or;
        }

        for (var i = 0; i < count; i++) {
            layout.r[i] = addParentProfileWidth(layout.r[i], layout.r[i].ol, layout.r[i].or, layout.r[i].ot, layout.r[i].ob, oh, ow);
        }
    }
    layout.oh = oh;
    layout.ow = ow;
    return layout;
}

function calibrationWH(layout) {
    if (layout.c !== undefined) {
        var count = layout.c.length;
        for (var i = 0; i < count; i++) {
            var h = layout.c[i].h;
            var subH = 0;
            if (layout.c[i].oy < layout.c[i].ot) {
                if (layout.c[i].ot < layout.c[i].pw) {
                    subH += layout.c[i].ot / 2;
                } else {
                    subH += (layout.c[i].ot - layout.c[i].pw / 2);
                }
            } else {
                if (layout.c[i].ot >= layout.c[i].pw) {
                    subH += (layout.c[i].ot - layout.c[i].pw) / 2;
                }
            }

            layout.c[i].oy += subH;
            layout.c[i].ox -= layout.c[i].pw / 2;

            if (layout.c[i].h == layout.c[i].oh) {
                if(layout.c[i].ob < layout.c[i].pw){
                    subH += layout.c[i].ob/2;
                }else{
                    subH += (layout.c[i].ob - layout.c[i].pw / 2);
                }
            } else {
                if(layout.c[i].ob >= layout.c[i].pw){
                    subH += (layout.c[i].ob - layout.c[i].pw) / 2;
                }
            }

            layout.c[i].h = h - subH;
        }

        for (var i = 0; i < count; i++) {
            layout.c[i] = calibrationWH(layout.c[i]);
        }
    } else if (layout.r !== undefined) {
        var count = layout.r.length;
        for (var i = 0; i < count; i++) {
            var w = layout.r[i].w;
            var subW = 0;
            if (layout.r[i].ox < layout.r[i].ol) {
                if(layout.r[i].ol < layout.r[i].pw){
                    subW += layout.r[i].ol/2;
                }else{
                    subW += (layout.r[i].ol - layout.r[i].pw / 2);
                }
            } else {
                if(layout.r[i].ol >= layout.r[i].pw){
                    subW += (layout.r[i].ol - layout.r[i].pw) / 2;
                }
            }

            layout.r[i].ox += subW;
            layout.r[i].oy -= layout.r[i].pw / 2;

            if (layout.r[i].w == layout.r[i].ow) {
                if(layout.r[i].or < layout.r[i].pw){
                    subW += layout.r[i].or / 2;
                }else{
                    subW += (layout.r[i].or - layout.r[i].pw / 2);
                }
            } else {
                if(layout.r[i].or >= layout.r[i].or){
                    subW += (layout.r[i].or - layout.r[i].pw) / 2;
                }
            }

            layout.r[i].w = w - subW;
        }

        for (var i = 0; i < count; i++) {
            layout.r[i] = calibrationWH(layout.r[i]);
        }
    }

    return layout;
}

function calculateScale(opts) {
    var canvas = document.getElementById('c');
    var width = canvas.width;
    var height = canvas.height;

    // add spacing for scale lables here
    var w = opts.width + 100;
    var h = opts.height + 100;
    var s = 1;

    if (width > height) {
        s = Math.min(height / w, width / h);
    } else {
        s = Math.min(width / w, height / h);
    }

    //console.log(s);
    return s;
}

function drawFrame(opts) {

    //console.log("drawframe ", opts);
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

        //console.log("draw glass lines for " + opts.openDirection);

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

function drawProfileLength(o, l, pw, d, s, opts, { pwb = 0, pwe = 0 } = {}) {
    if(pwb > pw){
        pwb = pw;
    }

    if(pwe > pw){
        pwe = pw;
    }

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
                y: o.y + ((pwb / 2) * s)
            },
            {
                x: o.x + ((pw / 2) * s),
                y: o.y + 0
            },
            {
                x: o.x + (pw * s),
                y: o.y + ((pwb / 2) * s)
            },
            {
                x: o.x + (pw * s),
                y: o.y + ((l - pwe / 2) * s)
            },
            {
                x: o.x + ((pw / 2) * s),
                y: o.y + (l * s)
            },
            {
                x: o.x + 0,
                y: o.y + ((l - pwe / 2) * s)
            }
            ];

            outerHl = [
                o.x + ((pw * 0.15) * s),
                o.y + ((pwb / 2 * 0.75) * s),
                o.x + ((pw * 0.15) * s),
                o.y + ((l - (pwe / 2) * 0.75) * s)
            ];

            innerHl = [
                o.x + ((pw * 0.85) * s),
                o.y + ((pwb / 2 * 0.75) * s),
                o.x + ((pw * 0.85) * s),
                o.y + ((l - pwe / 2 * 0.75) * s)
            ];
            break;
        case "vd":
            p = [{
                x: o.x + 0,
                y: o.y + ((pw / 2) * s)
            },
            {
                x: o.x + ((pwb / 2) * s),
                y: o.y + 0
            },
            {
                x: o.x + ((l - (pwe / 2)) * s),
                y: o.y + 0
            },
            {
                x: o.x + (l * s),
                y: o.y + (pw / 2 * s)
            },
            {
                x: o.x + ((l - (pwe / 2)) * s),
                y: o.y + (pw * s)
            },
            {
                x: o.x + ((pwb / 2) * s),
                y: o.y + (pw * s)
            }
            ];

            outerHl = [
                o.x + ((pwb / 2 * 0.75) * s),
                o.y + ((pw * 0.15) * s),
                o.x + ((l - pwe / 2 * 0.75) * s),
                o.y + ((pw * 0.15) * s)
            ];

            innerHl = [
                o.x + ((pwb / 2 * 0.75) * s),
                o.y + ((pw * 0.85) * s),
                o.x + ((l - pwe / 2 * 0.75) * s),
                o.y + ((pw * 0.85) * s)
            ];
            break;
    }

    // draw it
    //console.log(d, p);
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

function drawWindow(json) {
    json.layout = calibrationJson(json.layout, json.w, json.h, json.pw);
    json.layout = addOffset(json.layout);
    json.layout = addParentProfileWidth(json.layout, json.pw, json.pw, json.pw, json.pw, json.h, json.w);
    console.log("unconfig", JSON.stringify(json.layout));
    json.layout = calibrationWH(json.layout);

    var options = {
        width: json.w, // width in mm
        height: json.h, // height in mm
        profileWidth: json.pw, // profile in mm

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

    var s = calculateScale(options);
    var offset = {
        x: ((c.width / 2) - (json.w * s / 2)),
        y: ((c.height / 2) - (json.h * s / 2))
    };
    console.log(JSON.stringify(json));

    drawFrame(options);
    drawByJson(json.layout, json.w, json.h, offset, s, options);
}

drawWindow(myTestWindow);