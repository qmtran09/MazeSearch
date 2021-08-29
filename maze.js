let maze = document.querySelector(".maze");
let context = maze.getContext("2d");
let curr;

/**
 * Cell class, class for the cells in the maze
 */
class Cell{
    constructor(rowI, colI, pGrid, gridSize){
        this.rowI = rowI;
        this.colI = colI;
        this.pGrid = pGrid;
        this.gridSize = gridSize;
        this.status = false; //initialize all cells to be empty at first, for maze generation 
        this.previous = undefined;
        this.searched = false;

        //a* start variables, f = g + h 
        this.gScore = Infinity;
        this.fScore = Infinity; 
        this.borders = { 
            tb : true,
            rb : true,
            bb : true,
            lb : true,
        };
        this.isStart = false;
        this.isTarget = false;

    }

    //get adjacent cells that can be accessed, ie. no borders 
    getNeighbours(){
        let grid = this.pGrid;
        let row = this.rowI;
        let col = this.colI;
        let nb = []; 

        //assign neigbnour and handle if cell is on edge of grid
        let top = row !== 0 ? grid[row-1][col] : undefined;
        let right = col !== grid.length - 1  ? grid[row][col+1] : undefined;
        let bot = row !== grid.length -1 ? grid[row+1][col] : undefined;
        let left = col !== 0 ? grid[row][col-1] : undefined;

        if(top && !this.borders.tb && !top.searched){
            nb.push(top);
            
        }

        if(right && !this.borders.rb  && !right.searched){
            nb.push(right);
            
        }

        if(bot && !this.borders.bb && !bot.searched){
            nb.push(bot);
            
        }

        if(left && !this.borders.lb &&  !left.searched){
            nb.push(left);
            
        }
        
        return nb;

    }

    //get all adjacent cells 
    getAdjacent(){
        let grid = this.pGrid;
        let row = this.rowI;
        let col = this.colI;
        let nb = []; 

        //assign neigbnour and handle if cell is on edge of grid
        let top = row !== 0 ? grid[row-1][col] : undefined;
        let right = col !== grid.length - 1  ? grid[row][col+1] : undefined;
        let bot = row !== grid.length -1 ? grid[row+1][col] : undefined;
        let left = col !== 0 ? grid[row][col-1] : undefined;

        if(top){
            nb.push(top);
            
        }

        if(right){
            nb.push(right);
            
        }

        if(bot){
            nb.push(bot);
            
        }

        if(left){
            nb.push(left);
            
        }
        
        return nb;

    }

    checkNB(){
        let grid = this.pGrid;
        let row = this.rowI;
        let col = this.colI;
        let nb = []; 

        //assign neigbnour and handle if cell is on edge of grid
        let top = row !== 0 ? grid[row-1][col] : undefined;
        let right = col !== grid.length - 1  ? grid[row][col+1] : undefined;
        let bot = row !== grid.length -1 ? grid[row+1][col] : undefined;
        let left = col !== 0 ? grid[row][col-1] : undefined;

        if(top && !top.status ){
            nb.push(top);
        }

        if(right && !right.status ){
            nb.push(right);
        }

        if(bot && !bot.status ){
            nb.push(bot);
        }

        if(left && !left.status ){
            nb.push(left);
        }

        //select and return a random neighbour 
        if(nb.length !==0){
            let random = Math.floor(Math.random()*nb.length);
            return nb[random];
        } else{
            return undefined;
        }
    



    }
    deleteBorder(c1,c2){
        let x = c1.colI - c2.colI;
        let y = c1.rowI - c2.rowI;

        if(x==1){
            c1.borders.lb = false;
            c2.borders.rb = false;
        }
        else if(x==-1){
            c1.borders.rb = false;
            c2.borders.lb = false;
        }

        if(y==1){
            c1.borders.tb = false;
            c2.borders.bb = false;
        }
        else if(y==-1){
            c1.borders.bb = false;
            c2.borders.tb = false;
        }
        
    }

    highlight(columns,color){
        let x = (this.colI * this.gridSize) / columns + 1;
        let y = (this.rowI * this.gridSize) / columns + 1;

        context.fillStyle = color;
        context.fillRect(x+1,y+1,this.gridSize/columns - 5, this.gridSize/ columns -5);
        requestAnimationFrame(this.highlight);

    }






    /**
     * methods to generate borders around cells
     * x is col coordinate, y is row coordinate
     * dir is which direction do you want to build the border in
     * colSize and rowSize refers to number of columns and rows on grid
     * size refers to area of the grid 
     */
    
    createBorderTop(x,y,size, colSize, rowSize){
     
        context.beginPath();
        context.moveTo(x,y);
        context.lineTo(x+size/colSize,y);
        context.stroke();
        

    }
    createBorderBot(x,y,size, colSize, rowSize){

        context.beginPath();
        context.moveTo(x,y+size/rowSize);
        context.lineTo(x + size/colSize,y+size/rowSize);
        context.stroke();
    

    }
    createBorderRight(x,y,size, colSize, rowSize){
     
        context.beginPath();
        context.moveTo(x+size/colSize,y);
        context.lineTo(x+size/colSize,y+size/rowSize);
        context.stroke();


    }
    createBorderLeft(x,y,size, colSize, rowSize){
     
  
        context.beginPath();
        context.moveTo(x,y);
        context.lineTo(x,y+size/rowSize);
        context.stroke();

    }


    drawBorder(size, colSize,rowSize){
        //get coordinate of top right corner of cell in grid 
        let x = (this.colI * size) / colSize;
        let y = (this.rowI * size) / rowSize;
        
        context.strokeStyle = "black";
        context.fillStyle = "#a4aba6";
        context.lineWidth = 5;
        
        if(this.borders.tb){
            this.createBorderTop(x,y,size,colSize,rowSize);
            
        }
        if(this.borders.bb){
            this.createBorderBot(x,y,size,colSize,rowSize);
        }
        if(this.borders.lb){
            this.createBorderLeft(x,y,size,colSize,rowSize);
        }
        if(this.borders.rb){
            this.createBorderRight(x,y,size,colSize,rowSize);
        }
        if(this.status){
            //+1 and -2 is so that when it fills the box it doesnt fill the borders
            context.fillRect(x+2,y+2, size/colSize -5, size/rowSize-5);
        }



    }



}
/**
 * Maze class, class for the layout of the maze 
 */
class Maze{
    constructor(size, rows, cols){
        this.size = size; // number of pixels
        this.cols = cols; // number of cols
        this.rows = rows; // number of rows
        this.cellSize = size / cols ;
        this.grid = [];
        this.stacks = []; //stack for backtracking
    }

    //method to fill out grid with cells
    setup(){
        for(let y = 0; y < this.rows; y++ ){
            let row = []
            for(let x = 0; x < this.cols; x++){
                let cell = new Cell(y,x,this.grid,this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        curr = this.grid[0][0];
    }

    select(coordinate,selectFlag){
        let x = coordinate[0];
        let y = coordinate[1];

        if(selectFlag==1){
            let grid = this.grid;
            grid[y][x].highlight(this.cols,"green");
            grid[y][x].isStart = true;
        }
        if(selectFlag==-1){
            let grid = this.grid;
            grid[y][x].highlight(this.cols,"red");
            grid[y][x].isTarget = true;
        }

    }
    //generate maze with randomized prim's algoritm, using list of adjacent cells instead of edges
    primMaze(){
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "grey";
        curr.status = true;

        for (let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.cols; c++){
                let grid = this.grid;
                grid[r][c].drawBorder(this.size,this.cols,this.rows);
            }
        }


        if(!nbList.isEmpty){
            let random = Math.floor(Math.random()*nbList.length);
            let next = nbList[random];
           
            let index = nbList.indexOf(next);
            nbList.splice(index,1);

            if(!next.status){
                
                next.highlight(this.cols,"yellow");
                
                
                let temp = next.getAdjacent();
                let unvisitedNB = [];
                let visitedNB = [];

                for(let i = 0; i < temp.length;i++){
                    if(temp[i].status){
                        visitedNB.push(temp[i]);
                    } else{
                        unvisitedNB.push(temp[i]);
                    }

                }
                
                //connect cell to a random neigbouring visited cell
                //add all unvisited cell to list 
                random = Math.floor(Math.random()*visitedNB.length);
                let connected = visitedNB[random]
                next.deleteBorder(connected,next);
                
                nbList.push.apply(nbList,unvisitedNB);
                //curr = next;

            }

            curr = next;


        }else {
         
            return;
        }

        requestAnimationFrame(()=>{
            this.primMaze();
        })

    }


    //generate maze with randomized bfs using recursion
    dfsMaze(){
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "grey";
        curr.status = true;

        for (let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.cols; c++){
                let grid = this.grid;
                grid[r][c].drawBorder(this.size,this.cols,this.rows);
            }
        }

        let next = curr.checkNB();
        if(next){
            next.visited = true;

            this.stacks.push(curr);

            curr.highlight(this.cols,"yellow");
            curr.deleteBorder(curr,next);
            curr = next; 
        //back tracking if theres no valid neighbours 
        } else if (this.stacks.length > 0){
            let cell = this.stacks.pop();
            curr  = cell;
            curr.highlight(this.cols,"yellow");
        } 

        //finish drawing maze
        if(this.stacks.length==0){
            let x = (curr.colI * curr.gridSize) / this.cols + 1;
            let y = (curr.rowI * curr.gridSize) / this.cols + 1;
            
            // fix for initial cell not getting highlighted correctly
            context.fillStyle = "#a4aba6";
            context.fillRect(x+1,y+1,curr.gridSize/this.cols -5, curr.gridSize/this.cols -5);
            return;
        }

        requestAnimationFrame(()=>{
            this.dfsMaze();
        })
    }

    //highlights the shortest path found by BFS
    backTrackHighlight(cell){
        if(cell.isStart === true){
            cell.highlight(this.cols,"green");
            return;
        }

        let previous = cell.previous;

        previous.highlight(this.cols,"yellow");
        
        requestAnimationFrame(()=>{
            this.backTrackHighlight(previous);
        })



    }

    //recursive BFS
    breathFirstSearch(current,queue){
    
       if(!queue.isEmpty()){
            current = queue.dequeue();
            current.searched = true;
           

    
            if(current.isTarget){
                this.backTrackHighlight(current);
                
                return;
    
    
                
            } else {
                if(current.isStart || current.isTarget ){
                
                } else{
                    current.highlight(this.cols,"purple");
                }
                
    

    
                let nb = current.getNeighbours();
                
                for(let i = 0; i<nb.length;i++){
                    queue.enqueue(nb[i]);
                    nb[i].previous = current;
                }
    
                requestAnimationFrame(()=>{
                    this.breathFirstSearch(current,queue);
                });
            }
    
       }
    
    
    
    }

    /**
     * A* algorithm
     * @param {*} start: starting cell
     * @param {*} target: target cell
     */
    Astar(start,target,openSet){
        //use priority queue so we can retrieve the item with the lowest fScore with O(1) time.
        
        var searchedList = []
    
        start.gScore = 0;
        start.fScore = heuristic(start,target);

        openSet.enqueue(start,start.fScore);
    
        while(!openSet.isEmpty()){
         
            let current = openSet.dequeue();
            searchedList.push(current.element);
        

            //once target is found trace back to start to get shortest path
            if(current.element.isTarget){
                //highlights the search
                this.listHighlight(searchedList);

                return;
            }
            
            let nb = current.element.getNeighbours();

            for(let i = 0; i < nb.length; i++){
                let tempG = current.element.gScore + 1;
                if(tempG < nb[i].gScore){
                    nb[i].previous = current.element;
                    nb[i].gScore = tempG;
                    nb[i].fScore = nb[i].gScore + heuristic(nb,target);
                    if(!openSet.contains(nb[i])){
                        openSet.enqueue(nb[i],nb[i].fScore);
                    }
                }



            }
            

        }




    }
    /**
     * helper function for Astar to highlight search and shortest path
     */
    listHighlight(list){
        let cell = list.shift();
        console.log(cell)
        if(cell.isTarget){
            this.backTrackHighlight(cell);
            return;
        }
        if(!cell.isStart && !cell.isTarget){
            cell.highlight(this.cols,"purple");

        }
        
        requestAnimationFrame(()=>{
            this.listHighlight(list);
        });
    }


}



/**
 * Heuristic function, using manhatten distance
 */
function heuristic(current,target){

    let distance = Math.abs(current.colI - target.colI) + Math.abs(current.rowI - target.rowI);
    return distance; 

}

// Queue class
class Queue{
    // Array is used to implement a Queue
    constructor()
    {
        this.items = [];
    }
                  
    // enqueue function
    enqueue(element)
    {    
        // adding element to the queue
        this.items.push(element);
    }
    // dequeue function
    dequeue()
    {
        // removing element from the queue
        // returns underflow when called 
        // on empty queue
        if(this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }
    // isEmpty function
    isEmpty()
    {
        // return true if the queue is empty.
        return this.items.length == 0;
    }
}


// User defined class
// to store element and its priority
class QElement {
    constructor(element, priority)
    {
        this.element = element;
        this.priority = priority;
    }
}
 
// PriorityQueue class
class PriorityQueue {
 
    // An array is used to implement priority
    constructor()
    {
        this.items = [];
    }
 
    // enqueue function to add element
    // to the queue as per priority
    enqueue(element, priority)
    {
        // creating object from queue element
        var qElement = new QElement(element, priority);
        var contain = false;
    
        // iterating through the entire
        // item array to add element at the
        // correct location of the Queue
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                // Once the correct location is found it is
                // enqueued
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }
    
        // if the element have the highest priority
        // it is added at the end of the queue
        if (!contain) {
            this.items.push(qElement);
        }
    }

    // dequeue method to remove
    // element from the queue
    dequeue()
    {
        // return the dequeued element
        // and remove it.
        // if the queue is empty
        // returns Underflow
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    // front function
    front()
    {
        // returns the highest priority element
        // in the Priority queue without removing it.
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }

    // rear function
    rear()
    {
        // returns the lowest priority
        // element of the queue
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[this.items.length - 1];
    }


    // isEmpty function
    isEmpty()
    {
        // return true if the queue is empty.
        return this.items.length == 0;
    }

    //function to check if pQueue contains a certain cell
    contains(cell){
        for(let i = 0; i< this.items.length; i++ ){
            if(this.items[i].colI == cell.colI && this.items[i].rowI == cell.rowI){
                return true;
            }
        }
        return false; 
    }




}


//function to find coordinates of clicks
function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let res = [x,y];
    return res;
    
}


var mazeSel = document.getElementById("selMazeAlgo");
var searchSel = document.getElementById("selSearchAlgo"); 
var mazeButton = document.getElementById("genMze");
var searchButton = document.getElementById("searchBtn");


var newMaze = new Maze(500,10,10);
newMaze.setup();
var nbList = curr.getAdjacent();
var mazeCheck = false;


//if button gen maze button is pressed, generate a maze based on user's selection.
mazeButton.addEventListener("click", function(e){
    if(mazeSel.options[mazeSel.selectedIndex].value == 1){
        newMaze = new Maze(500,10,10);
        newMaze.setup();
        newMaze.dfsMaze();
        mazeCheck = true;
    }else if(mazeSel.options[mazeSel.selectedIndex].value == 2){
        newMaze = new Maze(500,10,10);
        newMaze.setup();
        nbList = curr.getAdjacent();
        newMaze.primMaze();
        mazeCheck = true;
    }else{
        alert("Please select maze generation method!");
        mazeCheck = false;
    }

});


var start = [];
var target = [];
let selectFlag = 0;


//select end and target
maze.addEventListener("mousedown", function(e)
{   
    if(selectFlag === 0){
        let startCoord = getMousePosition(maze, e);
        start = [ Math.floor(startCoord[0]/ newMaze.cellSize),Math.floor(startCoord[1]/ newMaze.cellSize)];
        selectFlag = 1;
        newMaze.select(start,selectFlag);
    } else if(selectFlag === 1){
        let startCoord = getMousePosition(maze, e);
        target = [ Math.floor(startCoord[0]/ newMaze.cellSize),Math.floor(startCoord[1]/ newMaze.cellSize)];
        selectFlag = -1;
        newMaze.select(target,selectFlag);
       
    }
    
    if(selectFlag==-1){
    
        
       
       
    }
    
   
});

searchButton.addEventListener("click",function(e){
    if(!mazeCheck){
        alert("you need to generate a maze before you can search!");
    } else if(selectFlag !=-1){
        alert("click on the maze to select a start and finish!");
    } else if(searchSel.options[searchSel.selectedIndex].value == 0){
        alert('select an search algo before you can perform searches!');
    } else if(searchSel.options[searchSel.selectedIndex].value == 1){
        var current = newMaze.grid[start[1]][start[0]];
        var queue = new Queue;
        queue.enqueue(current);
        newMaze.breathFirstSearch(current,queue);

    } else if(searchSel.options[searchSel.selectedIndex].value == 2){
        var openSet = new PriorityQueue();
        newMaze.Astar(newMaze.grid[start[1]][start[0]],newMaze.grid[target[1]][target[0]],openSet);
       
    }
    
});