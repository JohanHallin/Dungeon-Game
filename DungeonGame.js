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

// Debug settings
// False by default 
var seeAll = false;

// Map settings
var layout = new Vector2(5, 3);
var roomMargin = 2;
var roomMinSize = new Vector2(5, 5);
var roomMaxSize = new Vector2(10, 10);
var wallThickness = 1;
var startingRoom;
selectStartingRoom();
function selectStartingRoom(){
    startingRoom = new Vector2(rnd(layout.x), rnd(layout.y));
    console.log(startingRoom);
}

// Map data
var rooms = [];
for(var x = 0; x < layout.x; x++){
    rooms.push(new Array());
    for(var y = 0; y < layout.y; y++){
        rooms[x].push(new Room(new Vector2(roomMargin + x * (2 * roomMargin + roomMaxSize.x), roomMargin + y * (2 * roomMargin + roomMaxSize.y)), new Vector2(rnd(roomMinSize.x, roomMaxSize.x), rnd(roomMinSize.y, roomMaxSize.y))));
    }
}
console.log(rooms);

// Canvas
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.style.background = "#888";

// pixelSize used to convert coordinates into pixels depending on screen size
var pixelSize;
recalculatePixelSize();
function recalculatePixelSize(){
    pixelSize = new Vector2(canvas.width / ((2 * roomMargin + roomMaxSize.x) * layout.x), canvas.height / ((2 * roomMargin + roomMaxSize.y) * layout.y));
}


// Resize canvas size when resizing window
window.onresize = function(ev) { 
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    recalculatePixelSize();
    draw();
}

// Calls all draw functions
function draw(){
    clearCanvas();
    drawRooms();
}

// Clears canvas
function clearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Draws all rooms
function drawRooms(){
    for(var x = 0; x < rooms.length; x++){
        for(var y = 0; y < rooms[x].length; y++){
            if(rooms[x][y].seen || seeAll){
                context.fillStyle = "#999";
                context.fillRect(rooms[x][y].position.x * pixelSize.x, rooms[x][y].position.y * pixelSize.y, rooms[x][y].size.x * pixelSize.x, rooms[x][y].size.y * pixelSize.y);
            }
        }
    }
}