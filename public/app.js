let start = null;
let finish = null;
let mouseDown = false;
let walls = [];
let weights = [];

const Xaxis = 50;
const Yaxis = 20;

let Wall = false;
let Weight = false;
let stop = false;

let delay = 100;

let grid = [];

for (let i = 0; i <= Yaxis; i++) {
    let row = [];
    for (let j = 0; j <= Xaxis; j++) {
        row.push(createNode(j, i))        
    }
    grid.push(row);
    
}

var modal = document.getElementById("myModal");

var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


$('#wall').click(function () {
    Wall = true;
    Weight = false;
})

$('#weight').click(function () {
    Weight = true;
    Wall = false;
})

$('.notVisited').click(function () {
    if (start) {
        document.getElementById(`${start}`).classList.remove('start');
        let [x, y] = start.split('~');
        grid[y][x].start = false;
        //grid[y][x].dist = Infinity;

    } 
    start = event.target.id;
    let [x, y] = start.split('~');
    if (grid[y][x].wall) return;
    grid[y][x].start = true;
    //grid[y][x].dist = 0;
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
    if (mouseDown && Wall) {
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
    } else if (mouseDown && Weight) {
        weight = event.target.id;
        let [x, y] = weight.split('~');
        grid[y][x].weight = true;
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
        $(this).addClass('weight');
        
        weights.push(weight);
    } else
        return;
})

$('.notVisited').mouseup(function () {
    mouseDown = false;
})

$('#clearAll').click(function () {
    stop = true;
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
    for (let i = 0; i < weights.length; i++) {
        document.getElementById(`${weights[i]}`).classList.remove('weight');
        let [x, y] = weights[i].split('~');
        grid[y][x].weight = false;
    }

    for (let i = 0; i <= Yaxis; i++) {        
        for (let j = 0; j <= Xaxis; j++) {
            grid[i][j].vistited = false;
            document.getElementById(`${grid[i][j].id}`).classList.add('notVisited');
            document.getElementById(`${grid[i][j].id}`).classList.remove('visited');
            document.getElementById(`${grid[i][j].id}`).classList.remove('path');
            document.getElementById(`${grid[i][j].id}`).classList.remove('current'); 
            document.getElementById(`${grid[i][j].id}`).classList.remove('current1');
            document.getElementById(`${grid[i][j].id}`).classList.remove('current2');
        }

    }
    
        
    start = null;
    finish = null;
    
});

$('#clearSearchPath').click(function () {
    stop = true;
    for (let i = 0; i <= Yaxis; i++) {
        for (let j = 0; j <= Xaxis; j++) {
            grid[i][j].vistited = false;
            document.getElementById(`${grid[i][j].id}`).classList.add('notVisited');
            document.getElementById(`${grid[i][j].id}`).classList.remove('visited');
            document.getElementById(`${grid[i][j].id}`).classList.remove('path');
            document.getElementById(`${grid[i][j].id}`).classList.remove('current');
            document.getElementById(`${grid[i][j].id}`).classList.remove('current1');
            document.getElementById(`${grid[i][j].id}`).classList.remove('current2');
        }

    }

})

$('#clearWalls').click(function () {
    stop = true;
    for (let i = 0; i < walls.length; i++) {
        document.getElementById(`${walls[i]}`).classList.remove('wall');
        let [x, y] = walls[i].split('~');
        grid[y][x].wall = false;
    }

})

$('#clearWeights').click(function () {
    stop = true;
    for (let i = 0; i < weights.length; i++) {
        document.getElementById(`${weights[i]}`).classList.remove('weight');
        let [x, y] = weights[i].split('~');
        grid[y][x].weight = false;
    }

})

$('#dijksta').click(function (){
    //pick algorithm     
    dijkstra(start, finish);
});

$('#aStar').click(function () {
    //pick algorithm     
    aStar(start, finish);
});

$('.optionSelected').html($('#weight').val())


$("#speed").on('input', function () {    
    if ($(this).val() == 2) {
        delay = 10;
    }
    else if ($(this).val() == 1) {
        delay = 100;
    }
    else if ($(this).val() == 0) {
        delay = 700;
    }
});

$('#stop').click(function () {
    stop = true;
});

$('#wallMaze').click(function () {
    for (let i = 0; i < walls.length; i++) {
        document.getElementById(`${walls[i]}`).classList.remove('wall');
        let [x, y] = walls[i].split('~');
        grid[y][x].wall = false;
    }
    for (let i = 0; i < weights.length; i++) {
        document.getElementById(`${weights[i]}`).classList.remove('weight');
        let [x, y] = weights[i].split('~');
        grid[y][x].weight = false;
    }
    for (let i = 0; i <= Yaxis; i++) {        
        for (let j = 0; j <= Xaxis; j++) {
            if (Math.random() < 0.3) {
                wall = grid[i][j].id;
                grid[i][j].wall = true;


                if (grid[i][j].start) {
                    document.getElementById(`${start}`).classList.remove('start');
                    let [x, y] = start.split('~');
                    grid[y][x].start = false;
                }
                if (grid[i][j].finish) {
                    document.getElementById(`${finish}`).classList.remove('finish');
                    let [x, y] = finish.split('~');
                    grid[y][x].finish = false;
                }
                
                document.getElementById(`${wall}`).classList.add('wall');

                walls.push(wall);
            }            
        }       
    }    
});

$('#weightMaze').click(function () {
    for (let i = 0; i < walls.length; i++) {
        document.getElementById(`${walls[i]}`).classList.remove('wall');
        let [x, y] = walls[i].split('~');
        grid[y][x].wall = false;
    }
    for (let i = 0; i < weights.length; i++) {        
        document.getElementById(`${weights[i]}`).classList.remove('weight');
        let [x, y] = weights[i].split('~');
        grid[y][x].weight = false;
    }
    for (let i = 0; i <= Yaxis; i++) {
        for (let j = 0; j <= Xaxis; j++) {
            if (Math.random() < 0.3) {
                weight = grid[i][j].id;
                grid[i][j].weight = true;


                if (grid[i][j].start) {
                    document.getElementById(`${start}`).classList.remove('start');
                    let [x, y] = start.split('~');
                    grid[y][x].start = false;
                }
                if (grid[i][j].finish) {
                    document.getElementById(`${finish}`).classList.remove('finish');
                    let [x, y] = finish.split('~');
                    grid[y][x].finish = false;
                }                
                document.getElementById(`${weight}`).classList.add('weight');

                weights.push(weight);
            }
        }
    } 
});

function createNode(x, y) {
    let node = Object.create(null);
    node.id = `${x}~${y}`;
    node.x = x;
    node.y = y;
    node.start = false;
    node.finish = false;
    node.wall = false;
    node.weight = false;
    node.dist = Infinity;
    node.vistited = false
    node.prev = null;
    node.f = null;
    node.g = null;
    node.h = null;
    return node;
}

async function aStar(start, finish) {
    if (!start || !finish) return;

    let open = [];
    let closed = [];

    let [x, y] = start.split('~');
    let startNode = grid[y][x];

    [x, y] = finish.split('~');
    let finishNode = grid[y][x];

    startNode.dist = 0;
    startNode.g = 0;
    startNode.h = manhattanDist(startNode);
    startNode.f = startNode.g + startNode.h;

    open.push(startNode);
    let current = open[0];
    while (open.length != 0) {
        if (stop == true) {
            stop = false;
            break;
        }
            
        current = open[0];
        closed.push(current);
        open.shift();
        document.getElementById(`${current.id}`).classList.remove('notVisited');
        document.getElementById(`${current.id}`).classList.remove('weight');
        document.getElementById(`${current.id}`).classList.add('current1');
        await sleep(delay);
        if (current === finishNode)
            break;
        let adjacents = getAdjacent(current);
        for (let i = 0; i < adjacents.length; i++) {
            let node = adjacents[i];            
            if (closed.includes(node))
                continue;
            if (!open.includes(node)) {                
                node.g = node.dist;
                node.h = manhattanDist(node);
                node.f = node.g + node.h;
                node.vistited = true;
                open.push(node);
                document.getElementById(`${node.id}`).classList.remove('notVisited');
                document.getElementById(`${node.id}`).classList.remove('weight');
                document.getElementById(`${node.id}`).classList.add('current2');
                open.sort(function ({ f: a }, { f: b }) { return a - b });
            } 

            await sleep(delay);
            document.getElementById(`${node.id}`).classList.remove('current');
            document.getElementById(`${node.id}`).classList.remove('current1');
            /*document.getElementById(`${node.id}`).classList.remove('current2');*/
            document.getElementById(`${node.id}`).classList.add('visited');
        }
    }
    if (open.length == 0 && current !== finishNode) {
        modal.style.display = "block";
        stop = true;
    }else if (current == finishNode) {
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

    function manhattanDist(node) {
        let h = Math.abs(node.x - finishNode.x) + Math.abs(node.y - finishNode.y);
        return h;
    }    

}

async function dijkstra(start, finish) {
    if (!start || !finish) return;
    let nodes = [];
    let count = 0;

    let [x, y] = start.split('~');
    let startNode = grid[y][x];

    [x, y] = finish.split('~');
    let finishNode = grid[y][x];

    startNode.dist = 0;
    startNode.prev = null;

    nodes.push(startNode);
    count++

    let currentNode = startNode;    

    

    while (currentNode != finishNode) {

        if (stop == true) {
            stop = false;
            
            document.getElementById(`${currentNode.id}`).classList.remove('visited');

            document.getElementById(`${currentNode.id}`).classList.add('notVisited');
            break;
        }        
        for (let i = 1; i < count; i++) {            
            if (nodes[i].vistited != true) {
                currentNode = nodes[i];

                document.getElementById(`${currentNode.id}`).classList.add('current');
                await sleep(delay);
                

                nodes[i].vistited = true;
                document.getElementById(`${currentNode.id}`).classList.remove('notVisited');
                document.getElementById(`${currentNode.id}`).classList.remove('weight');
                
                document.getElementById(`${currentNode.id}`).classList.add('visited');

                break;
            }
            else if (i == count - 1) {
                modal.style.display = "block";
                stop = true;
                break;
            }

        }
        if (currentNode == finishNode) break;
        let adjacentNodes = getAdjacent(currentNode);

        for (let i = 0; i < adjacentNodes.length; i++) {
            nodes.push(adjacentNodes[i]);
            count++;
        }
        nodes.sort(function ({ dist: a }, { dist: b }) { return a - b });        
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

       
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || 1000));
}

function getAdjacent(currentNode) {
    let adjacentNodes = [];
    if (currentNode.x != 0) {
        let left = grid[currentNode.y][currentNode.x - 1];
        if (left.vistited != true && left.wall != true) {
            left.prev = currentNode;
            if (left.weight == true)
                left.dist = currentNode.dist + 5;
            else
                left.dist = currentNode.dist + 1;
            adjacentNodes.push(left);
        }
    }
    if (currentNode.x != 50) {
        let right = grid[currentNode.y][currentNode.x + 1];
        if (right.vistited != true && right.wall != true) {
            right.prev = currentNode;
            if (right.weight == true)
                right.dist = currentNode.dist + 5;
            else
                right.dist = currentNode.dist + 1;
            adjacentNodes.push(right);
        }
    }
    if (currentNode.y != 20) {
        let below = grid[currentNode.y + 1][currentNode.x];
        if (below.vistited != true && below.wall != true) {
            below.prev = currentNode;
            if (below.weight == true)
                below.dist = currentNode.dist + 5;
            else
                below.dist = currentNode.dist + 1;
            adjacentNodes.push(below);
        }

    }
    if (currentNode.y != 0) {
        let above = grid[currentNode.y - 1][currentNode.x];
        if (above.vistited != true && above.wall != true) {
            above.prev = currentNode;
            if (above.weights == true)
                above.dist = currentNode.dist + 5;
            else
                above.dist = currentNode.dist + 1;
            adjacentNodes.push(above);
        }

    }
    return adjacentNodes.filter(node => !node.vistited);
} 