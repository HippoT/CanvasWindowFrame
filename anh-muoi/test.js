// var myTestWindow = {
//     "w": 1200,
//     "h": 1000,
//     "pw": 60,
//     "pc": "white",
//     "hd": 1,
//     "layout": {
//         'c': [
//             {
//                 "r": [
//                     { f: 0, od: "l" }

//                 ]
//             },
//             {
//                 "w": 600,
//                 "r": [
//                     {
//                         c: [
//                             { f: 0, od: "u", w: 375 },
//                             { f: 0, od: "u", }
//                         ]
//                     },

//                     { f: 0, od: "u", h: 375 },
//                     { f: 1 }
//                 ]
//             },
//             {
//                 "r": [
//                     { f: 0, od: "u" }
//                 ]
//             }
//         ]

//     }
// };

var myTestWindow = {
    "w": 1200,
    "h": 1000,
    "pw": 60,
    "pc": "white",
    "hd": 1,
    "layout": {
        "r": [
            {
                c: [
                    { f: 0, od: "u", w: 375 },
                    { f: 0, od: "u", }
                ]
            },

            { f: 0, od: "u", h: 375 },
            { f: 1 }
        ]
    }
};

function drawCuaSo(json) {
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

    drawWindow(options);
    drawWithJson(json.layout, json.w, json.h, offset, s, options);
}

function drawWithJson(layout, w, h, offset, s, options) {

    if (layout.c !== undefined) {
        var count = layout.c.length;
        var offsetW = 0;

        for (var i = 0; i < count; i++) {
            if (layout.c[i].ox < w) {
                var element = layout.c[i];
                console.log("height: ", element.h);

                c.add(drawProfileLength({
                    x: 0 + offset.x + (element.ox - element.pw * (i + 1) / count) * s,
                    y: 0 + offset.y + element.oy + (element.pw * s / 2)
                }, element.h - element.pw, element.pw, "hd", s, options));
            }
        }

        for (var i = 0; i < count; i++) {
            offsetW += layout.c[i].w;
            drawWithJson(layout.c[i], offsetW, h, offset, s, options);
        }
    } else if (layout.r !== undefined) {
        var count = layout.r.length;
        var offsetH = 0;

        for (var i = 0; i < count; i++) {
            if (layout.r[i].oy < h) {
                var element = layout.r[i];
                console.log("vd: ", element.oy);

                c.add(drawProfileLength({
                    // x: 0 + (element.ox - (element.pw * i / count) + element.pw / 2) * s + offset.x,
                    // y: 0 + (element.oy - element.pw * i / count) * s + offset.y
                    x: 0 + (element.ox + element.pw / 2) * s + offset.x,
                    y: 0 + (element.oy - element.pw * (i + 1) / count) * s + offset.y
                }, element.w - element.pw, element.pw, "vd", s, options));
            }
        }

        for (var i = 0; i < count; i++) {
            offsetH += layout.r[i].h;
            drawWithJson(layout.r[i], w, offsetH, offset, s, options);
        }
    }
}

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

function calWidthAndHeight(data, obj, key, index) {

    if (obj[key] !== undefined) {
        data.sum += obj[key];
    } else {
        data.countMissVal++;
        data.index.push(index);
    }

    return data;
}
myTestWindow.layout = calibrationJson(myTestWindow.layout, myTestWindow.w, myTestWindow.h, myTestWindow.pw);
myTestWindow.layout = addOffset(myTestWindow.layout);
drawCuaSo(myTestWindow);
//parseJson(testWindow1);