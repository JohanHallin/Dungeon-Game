// Represents a vector with two values
class Vector2{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

// Defines what a rooms is
class Room{
    constructor(position, size){
        this.position = position;
        this.size = size;
        this.seen = false;
        this.neighbours = [];
    }
}

// Defines what a path is
class Path{
    constructor(start, end){
        this.start = start;
        this.end = end;
        this.seen = false;
    }
}

// Generate random whole number between
function rnd(in1, in2){
    if(in2 != undefined){
        return Math.round(in1 + (in2 - in1) * Math.random()); // in2 and in1 value
    } else{
        return Math.round(in1 * Math.random()); // 0 and in1
    }
}

// Startup function
// Calls alls functions that need to run at start
function startUp(){
    generateRooms();
    calculateNeighbours();
    selectStartingRoom();
    generatePaths();
    canvas.style.background = "#888";
    onresize();
}

// Debug settings
// False by default 
var seeAllRooms = true;
var seeAllPaths = true;
var seeStartingRoom = true;

// Map settings
var layout = new Vector2(5, 3);
var roomMargin = 2;
var roomMinSize = new Vector2(6, 6);
var roomMaxSize = new Vector2(10, 10);
var wallThickness = 1;
var pathWidth = 2;
var startingRoom;
function selectStartingRoom(){
    startingRoom = new Vector2(rnd(layout.x - 1), rnd(layout.y - 1));
    rooms[startingRoom.x][startingRoom.y].seen = true;
}

// Map data
var paths;
var rooms;
function generateRooms(){
    rooms = [];
    for(var x = 0; x < layout.x; x++){
        rooms.push(new Array());
        for(var y = 0; y < layout.y; y++){
            rooms[x].push(new Room(new Vector2(roomMargin + x * (2 * roomMargin + roomMaxSize.x), roomMargin + y * (2 * roomMargin + roomMaxSize.y)), new Vector2(rnd(roomMinSize.x, roomMaxSize.x), rnd(roomMinSize.y, roomMaxSize.y))));
        }
    }
}

// Canvas
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

// pixelSize used to convert coordinates into pixels depending on screen size
var pixelSize;
function calculatePixelSize(){
    pixelSize = new Vector2(canvas.width / ((2 * roomMargin + roomMaxSize.x) * layout.x), canvas.height / ((2 * roomMargin + roomMaxSize.y) * layout.y));
}


// Resize canvas size when resizing window
window.onresize = function(ev) { 
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    calculatePixelSize();
    draw();
}

// Calls all draw functions
function draw(){
    clearCanvas();
    drawRooms();
    drawPaths();
}

// Clears canvas
function clearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Draws all rooms
function drawRooms(){
    for(var x = 0; x < rooms.length; x++){
        for(var y = 0; y < rooms[x].length; y++){
            if(rooms[x][y].seen || seeAllRooms){
                context.fillStyle = "#999";
                context.fillRect(rooms[x][y].position.x * pixelSize.x, rooms[x][y].position.y * pixelSize.y, rooms[x][y].size.x * pixelSize.x, rooms[x][y].size.y * pixelSize.y);
            }
        }
    }
    if(seeStartingRoom){
        context.fillStyle = "#F00";
        context.fillRect(rooms[startingRoom.x][startingRoom.y].position.x * pixelSize.x, rooms[startingRoom.x][startingRoom.y].position.y * pixelSize.y, 1 * pixelSize.x, 1 * pixelSize.y);
    }
}

// Draws all paths
function drawPaths(){
    for(var i = 0; i < paths.length; i++){
        if(paths[i].seen || seeAllPaths){
            context.beginPath();
            context.strokeStyle = "#999";
            if(paths[i].start.x == paths[i].end.x){
                context.lineWidth = pathWidth * pixelSize.x;
            }else{
                context.lineWidth = pathWidth * pixelSize.y;
            }
            context.moveTo(paths[i].start.x * pixelSize.x, paths[i].start.y * pixelSize.y);
            context.lineTo(paths[i].end.x * pixelSize.x, paths[i].end.y * pixelSize.y);
            context.stroke();
        }
    }
}

// Generate paths
function generatePaths(){
    paths = [];
    var connected = {};
    connected[startingRoom.x + ", " + startingRoom.y] = true;
    var temp = 0;
    while(paths.length < layout.x * layout.y - 1){
        for(x = 0; x < layout.x; x++){
            for(y = 0; y < layout.y; y++){

                // Checks if neighbours are connected to start
                var connectedNeighbours = [];
                for(var i = 0; i < rooms[x][y].neighbours.length; i++){
                    var neighbour = rooms[x][y].neighbours[i];
                    if(connected[neighbour.x + ", " + neighbour.y]) {
                        connectedNeighbours.push(neighbour);
                    }
                }
                // Creates new path if room has any connected neighbours and if the room itself isn't connected 
                if((connectedNeighbours.length != 0) && !connected[x + ", " + y]){
                    connected[x + ", " + y] = true;
                    var i = rnd(connectedNeighbours.length - 1);
                    var start = rooms[x][y];
                    var end = rooms[connectedNeighbours[i].x][connectedNeighbours[i].y];
                    if(start.position.x < end.position.x){          // Neighbour to right
                        paths.push(new Path(new Vector2(start.position.x + start.size.x, start.position.y + roomMinSize.y / 2), new Vector2(end.position.x, start.position.y + roomMinSize.y / 2)));
                    }else if(start.position.x > end.position.x){    // Neighbour to left
                        paths.push(new Path(new Vector2(start.position.x, start.position.y + roomMinSize.y / 2), new Vector2(end.position.x + end.size.x, start.position.y + roomMinSize.y / 2)));
                    }else if(start.position.y > end.position.y){    // Neighbour above
                        paths.push(new Path(new Vector2(start.position.x + roomMinSize.x / 2, start.position.y), new Vector2(start.position.x + roomMinSize.x / 2, end.position.y + end.size.y)));
                    } else{                                         // Neighbour below
                        paths.push(new Path(new Vector2(start.position.x + roomMinSize.x / 2, start.position.y + start.size.y), new Vector2(start.position.x + roomMinSize.x / 2, end.position.y)));
                    }
                }
            }
        }
    }
}

// Calculates which rooms any room is neighbouring
function calculateNeighbours(){
 for(var x = 0; x < layout.x; x++){
    for(var y = 0; y < layout.y; y++){
        
        for(var xComp = 0; xComp < layout.x; xComp++){
            for(var yComp = 0; yComp < layout.y; yComp++){
                if((x == xComp && (y == yComp - 1 || y == yComp + 1)) || (y == yComp && (x == xComp - 1 || x == xComp + 1))){
                    rooms[x][y].neighbours.push(new Vector2(xComp, yComp));
                }
            }
        }
    }
 }
}