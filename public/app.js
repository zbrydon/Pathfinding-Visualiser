let start = null;
let finish = null;
let mouseDown = false;
let walls = [];

const Xaxis = 50;
const Yaxis = 20;

let grid = [];

for (let i = 0; i <= Yaxis; i++) {
    let row = [];
    for (let j = 0; j <= Xaxis; j++) {
        row.push(createNode(i, j))
    }
    grid.push(row);
    
}

$('.notVisited').click(function () {
    if (start) {
        document.getElementById(`${start}`).classList.remove('start');
        let [x, y] = start.split('~');
        grid[x][y].start = false;
    }
    start = event.target.id;
    let [x, y] = start.split('~');
    if (grid[x][y].wall) return;
    grid[x][y].start = true;
    $(this).addClass('start');
    
    if (start == finish) {
        document.getElementById(`${finish}`).classList.remove('finish');
    }
});

$('.notVisited').contextmenu(function () {
    if (finish) {
        document.getElementById(`${finish}`).classList.remove('finish');
        let [x, y] = finish.split('~');
        grid[x][y].finish = false;
    }
    finish = event.target.id;
    let [x, y] = finish.split('~');
    if (grid[x][y].wall) return;
    grid[x][y].finish = true;
    $(this).addClass('finish');
    
    if (start == finish) {
        document.getElementById(`${start}`).classList.remove('start');
    }
    return false;
});

$('.notVisited').mousedown(function () {
    mouseDown = true;
})

$('.notVisited').mouseenter(function () {
    if (mouseDown) {
        wall = event.target.id;
        let [x, y] = wall.split('~');
        grid[x][y].wall = true;
        if (grid[x][y].start) {
            document.getElementById(`${start}`).classList.remove('start');
            let [x, y] = start.split('~');
            grid[x][y].start = false;
        }
        if (grid[x][y].finish) {
            document.getElementById(`${finish}`).classList.remove('finish');
            let [x, y] = finish.split('~');
            grid[x][y].finish = false;
        }
        $(this).addClass('wall');
        
        walls.push(wall);
    } else
        return;
})

$('.notVisited').mouseup(function () {
    mouseDown = false;
})

$('#clear').click(function () {
    if (start) {
        document.getElementById(`${start}`).classList.remove('start');
        let [x, y] = start.split('~');
        grid[x][y].start = false;
    }
        
    if (finish) {
        document.getElementById(`${finish}`).classList.remove('finish');
        let [x, y] = finish.split('~');
        grid[x][y].finish = false;
    }
    for (let i = 0; i < walls.length; i++) {
        document.getElementById(`${walls[i]}`).classList.remove('wall');
        let [x, y] = walls[i].split('~');
        grid[x][y].wall = false;
    }
        
    start = null;
    finish = null;
    
});

$('#go').click(function (){
    //pick algorithm 
    dijkstra(start, finish);
});

function dijkstra(start, finish) {
    let minBinaryHeap = [];
    let count = 0;

    minBinaryHeap.push(null);
    count++

    for (let i = 0; i <= Yaxis; i++) {
        for (let j = 0; j <= Xaxis; j++) {
            minBinaryHeap.push(grid[i][j]);
            count++
        }

    }
    console.log(minBinaryHeap);
    console.log(count);
    /*for (let i = count / 2; i >= 1; i--) {
        downHeap(i);
    }*/
    
    function downHeap(start) {
        let min = 0;
        let lChild = start * 2;
        let rChild = start * 2 + 1;

        if (count < lChild) return;
        else if (count == lChild) {
            if (minBinaryHeap[start].dist > minBinaryHeap[lChild].dist) {
                Swap(start, lChild);
            }
            return;
        }
        else {
            if (minBinaryHeap[lChild].dist < minBinaryHeap[rChild].dist)
                min = lChild;
            else
                min = rChild;
            if (minBinaryHeap[start].dist > minBinaryHeap[min].dist)
                Swap(start, min);
        }
        DownHeap(min);

    }
    function Swap(from, to) {
        let temp = minBinaryHeap[from];
        minBinaryHeap[from] = minBinaryHeap[to];
        minBinaryHeap[to] = temp;
    }
}

function createNode(x , y) {
    let node = Object.create(null);
    node.id = `c${x},${y}`;
    node.x = x;
    node.y = y;
    node.start = false;
    node.finish = false;
    node.wall = false;
    node.dist = Infinity;
    node.vistited = false
    node.prev = null;
    return node;
}