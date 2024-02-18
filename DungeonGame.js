class room{
    constructor(height, width){
        this.height = height;
        this.width = width;
    }
}

var rooms = [];
for(i = 0; i < 9; i++){
    newRoom = new room(rnd(3.0, 10.0), rnd(3.0, 10.0));
    rooms.push(newRoom);
}

function regenerateRoom(){
    for(i=0; i < 9; i++){
        rooms[i].height = rnd(3, 10);
        rooms[i].width = rnd(3, 10);
    }
}

function rnd(min, max){
    return Math.round(min + (max - min) * Math.random()); 
}
