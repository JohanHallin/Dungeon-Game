class room{
    constructor(height, width, x, y){
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.neighbours = [];
        this.seen = false;
    }
}

class path{
    constructor(startX, startY, endX, endY){
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.seen = false;
    }
}

var rooms = [];
var startingRoom;
var connected = [];
var paths = [];
var x = 0;
var y = 0;
for(i = 0; i < 9; i++){
    newRoom = new room(rnd(6, 10), rnd(6, 10), x, y);
    rooms.push(newRoom);
    x++;
    if(x == 3){
        x = 0;
        y++;
    }
}
for(var i = 0; i < 9; i++){
    for(var a = 0; a < 9; a++){
        if((rooms[a].x == rooms[i].x + 1 && rooms[a].y == rooms[i].y) || (rooms[a].x == rooms[i].x - 1 && rooms[a].y == rooms[i].y) || (rooms[a].y == rooms[i].y + 1 && rooms[a].x == rooms[i].x) || (rooms[a].y == rooms[i].y - 1 && rooms[a].x == rooms[i].x)){
            rooms[i].neighbours += a;
        }
    }
    console.log(rooms);
}
selectStartingRoom();
function regenerateRoom(){
    x = 1;
    y = 1;
    for(i=0; i < 9; i++){
        rooms[i].height = rnd(3, 10);
        rooms[i].width = rnd(3, 10);
        rooms[i].x = x;
        rooms[i].y = y;
        x++;
        if(x == 3){
            x = 1;
            y++;
        }
    }
    selectStartingRoom();
}

function rnd(min, max){
    return Math.round(min + (max - min) * Math.random()); 
}

function selectStartingRoom(){
    startingRoom = rnd(0, 8);
    console.log(startingRoom);
    rooms[startingRoom].seen = true;
    console.log("Seen start");
}

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = canvas.height;
canvas.style.top = 0;
canvas.style.left = 0;

canvas.style.background = "#888";
var pixelSize = window.innerHeight / 42;
drawRooms();

function drawRooms(){
    var y = -1;
    var x;
    context.fillStyle = "#999";
    for(var i = 0; i < 9; i++){
        if(rooms[i].seen == true){
            context.fillRect((2 + rooms[i].x * 14 ) * pixelSize,(2 + rooms[i].y * 14 ) * pixelSize, rooms[i].width * pixelSize, rooms[i].height * pixelSize);
            if(i == startingRoom){
                context.fillStyle = "#f00";
                context.fillRect((2 + rooms[i].x * 14 ) * pixelSize,(2 + rooms[i].y * 14 ) * pixelSize, 2 * pixelSize, 2 * pixelSize);
                context.fillStyle = "#999";
            }
            x++;
        }
    }
}
generatePaths();
function generatePaths(){
    connected = [];
    connected += startingRoom;
    paths = [];
    while (connected.length < 9){
        console.log("Start of loop");
        for(var i = 0; i < 9; i++){
            if(!connected.includes(i)){
                for(var a = 0; a < rooms[i].neighbours.length; a++){
                    if(connected.includes(rooms[i].neighbours[a])){
                        console.log("Possible path found!");
                        newPath = new path(rooms[i].x, rooms[i].y, rooms[rooms[i].neighbours[a]].x, rooms[rooms[i].neighbours[a]].y);
                        paths.push(newPath);
                        connected += i;
                        break;
                    }
                }
            }
        }
        console.log(connected.length);
        console.log("End of loop");
    }
    console.log("Paths generated");
    console.log(paths);
}
drawPaths();
function drawPaths(){
    context.fillStyle = "#000";
    for(var i = 0; i < paths.length; i++){
        if(paths[i].seen){
            if(paths[i].startX == paths[i].endX){
                if(paths[i].startY < paths[i].endY){
                    context.fillRect((6 + 14 * paths[i].startX) * pixelSize, (6 + 14 * paths[i].startY) * pixelSize, 2 * pixelSize, 16 * pixelSize);
                } else{
                    context.fillRect((6 + 14 * paths[i].startX) * pixelSize, (6 + 14 * paths[i].startY) * pixelSize, 2 * pixelSize, -16 * pixelSize);
                }
            } else{
                if(paths[i].startX < paths[i].endX){
                    context.fillRect((6 + 14 * paths[i].startX) * pixelSize, (6 + 14 * paths[i].startY) * pixelSize, 16 * pixelSize, 2 * pixelSize);
                } else{
                    context.fillRect((6 + 14 * paths[i].startX) * pixelSize, (6 + 14 * paths[i].startY) * pixelSize, -16 * pixelSize, 2 * pixelSize);
                }
            }
        }
    }
}