var instruction = [[
    // {
    //     function: "GetPolygon",
    //     argument: {
    //         points: [ { x: "0", y: "0" }, { x: "500", y: "0" }, { x: "500", y: "0 + {p}" }, { x: "0", y: "0 + {p}" }],
    //         fillColor: "red",
    //         originPoint: { x: "0", y: "0" },
    //         p : "60"
    //     }
    // },
    {
        function: "OpenDirection",
        argument: {
            points: [{x: "500", y: "0"}, {x: "0", y: "250"}, {x: "500", y: "500"}],
            p: "60",
            originPoint: { x: "0", y: "0" }
        }
    }
]];

wd_parse_json.Update(instruction, 2, 1, 1, 1);