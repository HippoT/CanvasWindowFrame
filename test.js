var instruction = [[
    {
        function: "GetPolygon",
        argument: {
            points: [{ x: 500, y: 0 }, { x: 500, y: 500 }, { x: 440, y: 440 }, { x: 440, y: 60 }],
            fillColor: 'red',
            originPoint: { x: 440, y: 0 }
        }
    },
    {
        function: "GetPolygon",
        argument: {
            points: [ { x: 0, y: 0 }, { x: 500, y: 0 }, { x: 440, y: 60 }, { x: 60, y: 60 }],
            fillColor: 'red',
            originPoint: { x: 0, y: 0 }
        }
    },
    {
        function: "GetPolygon",
        argument: {
            points: [{ x: 0, y: 0 }, { x: 60, y: 60 }, { x: 60, y: 440 }, { x: 0, y: 500 }],
            fillColor: 'red',
            originPoint: { x: 0, y: 0 }
        }
    },
    {
        function: "GetPolygon",
        argument: {
            points: [{ x: 0, y: 500 }, { x: 60, y: 440 }, { x: 440, y: 440 }, { x: 500, y: 500 }], 
            fillColor: 'red',
            originPoint: { x: 0, y: 440 }
        }
    }
]];

wd_parse_json.Update(instruction, 1, 1, 1);