let start = null;
let finish = null;
let mouseDown = false;
let walls = [];

const Xaxis = 50;
const Yaxis = 20;


let stop = false;

let delay = 200;

let grid = [];

for (let i = 0; i <= Yaxis; i++) {
    let row = [];
    for (let j = 0; j <= Xaxis; j++) {
        row.push(createNode(j, i))
    }
    grid.push(row);
    
}
$('.notVisited').click(function () {
    if (start) {
        document.getElementById(`${start}`).classList.remove('start');
        let [x, y] = start.split('~');
        grid[y][x].start = false;
    } 
    start = event.target.id;
    let [x, y] = start.split('~');
    if (grid[y][x].wall) return;
    grid[y][x].start = true;
    $(this).addClass('start');
    
    if (start == finish) {
        document.getElementById(`${finish}`).classList.remove('finish');
    }
});

$('.notVisited').contextmenu(function () {
    if (finish) {
        document.getElementById(`${finish}`).classList.remove('finish');
        let [x, y] = finish.split('~');
        grid[y][x].finish = false;
    }
    finish = event.target.id;
    let [x, y] = finish.split('~');
    if (grid[y][x].wall) return;
    grid[y][x].finish = true;
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
        grid[y][x].wall = true;
        if (grid[y][x].start) {
            document.getElementById(`${start}`).classList.remove('start');
            let [x, y] = start.split('~');
            grid[y][x].start = false;
        }
        if (grid[y][x].finish) {
            document.getElementById(`${finish}`).classList.remove('finish');
            let [x, y] = finish.split('~');
            grid[y][x].finish = false;
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
        grid[y][x].start = false;
    }
        
    if (finish) {
        document.getElementById(`${finish}`).classList.remove('finish');
        let [x, y] = finish.split('~');
        grid[y][x].finish = false;
    }
    for (let i = 0; i < walls.length; i++) {
        document.getElementById(`${walls[i]}`).classList.remove('wall');
        let [x, y] = walls[i].split('~');
        grid[y][x].wall = false;
    }

    for (let i = 0; i <= Yaxis; i++) {        
        for (let j = 0; j <= Xaxis; j++) {
            grid[i][j].vistited = false;
            document.getElementById(`${grid[i][j].id}`).classList.add('notVisited');
            document.getElementById(`${grid[i][j].id}`).classList.remove('visited');
            document.getElementById(`${grid[i][j].id}`).classList.remove('path');
        }

    }
    
        
    start = null;
    finish = null;
    
});

$('#go').click(function (){
    //pick algorithm 

    dijkstra(start, finish);
});


$('.optionSelected').html($('#weight').val())


$("#weight").on('input', function () {    
    if ($(this).val() == 2) {
        delay = 10;
    }
    else if ($(this).val() == 1) {
        delay = 200;
    }
    else if ($(this).val() == 0) {
        delay = 700;
    }
});

$('#stop').click(function () {
    stop = true;
});


async function dijkstra(start, finish) {
    if (!start || !finish) return;
    let minBinaryHeap = [];
    let count = 0;

    minBinaryHeap.push(createNode(null, null));
    count++
    
    let [x, y] = start.split('~');
    let startNode = grid[y][x];

    [x, y] = finish.split('~');
    let finishNode = grid[y][x];

    startNode.dist = 0;
    startNode.prev = null;

    minBinaryHeap.push(startNode);
    count++

    let currentNode = startNode;    

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms || 1000));
    }

    
    
    while (currentNode != finishNode) {
        await sleep(delay);
        if (stop == true) {
            stop = false;
            break;
        }
        for (let i = 1; i < count; i++) {
            if (minBinaryHeap[i].vistited != true) {
                currentNode = minBinaryHeap[i];

                document.getElementById(`${currentNode.id}`).classList.add('current');
                document.getElementById(`${currentNode.id}`).classList.remove('current');
                
                minBinaryHeap[i].vistited = true;
                document.getElementById(`${currentNode.id}`).classList.remove('notVisited');
                document.getElementById(`${currentNode.id}`).classList.add('visited');

                break;
            }
                

        }
        if (currentNode == finishNode) break;
        let adjacentNodes = getAdjacent(currentNode);
        
        for (let i = 0; i < adjacentNodes.length; i++) {
            minBinaryHeap.push(adjacentNodes[i]);
            count++;
        }
        for (let i = (count - 1) / 2; i >= 1; i--) {
            if (i == 0)
                return;
            downHeap(Math.floor(i));
        }
    }
    if (currentNode == finishNode) {
        let path = [];
        let node = finishNode.prev;
        while (node != startNode) {
            path.push(node);
            node = node.prev;
        }
        for (let i = path.length - 1; i >= 0; i--) {
            document.getElementById(`${path[i].id}`).classList.remove('visited');
            document.getElementById(`${path[i].id}`).classList.add('path');
            await sleep(delay);
        }
    }

    function getAdjacent(currentNode) {
        let adjacentNodes = [];
        if (currentNode.x != 0) {
            let left = grid[currentNode.y][currentNode.x - 1];
            if (left.vistited != true && left.wall != true) {
                left.prev = currentNode;
                left.dist = currentNode.dist + 1;
                adjacentNodes.push(left);
            }
            
        }
        if (currentNode.x != 50) {
            let right = grid[currentNode.y][currentNode.x + 1];
            if (right.vistited != true && right.wall != true) {
                right.prev = currentNode;
                right.dist = currentNode.dist + 1;
                adjacentNodes.push(right);
            }
            
        }
        if (currentNode.y != 20) {
            let below = grid[currentNode.y + 1][currentNode.x];
            if (below.vistited != true && below.wall != true) {
                below.prev = currentNode;
                below.dist = currentNode.dist + 1;                
                adjacentNodes.push(below);
            }
            
        }
        if (currentNode.y != 0) {
            let above = grid[currentNode.y - 1][currentNode.x];
            if (above.vistited != true && above.wall != true) {
                above.prev = currentNode;
                above.dist = currentNode.dist + 1;
                adjacentNodes.push(above);
            }
            
        }        
        return adjacentNodes.filter(node => !node.vistited);       
    }

    function downHeap(start) {
        let min = 0;
        let lChild = start * 2;
        let rChild = start * 2 + 1;

        if (count - 1 < lChild) return;
        else if (count - 1 == lChild) {
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
        downHeap(min);

    }
    function Swap(from, to) {
        let temp = minBinaryHeap[from];
        minBinaryHeap[from] = minBinaryHeap[to];
        minBinaryHeap[to] = temp;
    }
}

function createNode(x , y) {
    let node = Object.create(null);
    node.id = `${x}~${y}`;
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