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
        //this.visited = false; //this one is for the search algo. 
        //object to store borders to the cell 
        this.previous = undefined;
        this.searched = false;
        this.borders = { 
            tb : true,
            rb : true,
            bb : true,
            lb : true,
        };
        this.isStart = false;
        this.isTarget = false;

    }

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

    draw(){
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
            this.draw();
        })
    }

    //highlights the shortest path found by BFS
    backTrackHighlight(cell){
        if(cell.isStart === true){
            cell.highlight(this.cols,"green");
            return;
        }

        let previous = cell.previous;
        console.log(previous);
        previous.highlight(this.cols,"yellow");
        
        requestAnimationFrame(()=>{
            this.backTrackHighlight(previous);
        })



    }

    //recursive BFS
    breathFirstSearch(start,current,queue){
    
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
                
    
               // console.log([current.colI,curr.rowI]);
    
                let nb = current.getNeighbours();
                
                for(let i = 0; i<nb.length;i++){
                    queue.enqueue(nb[i]);
                    nb[i].previous = current;
                }
    
                requestAnimationFrame(()=>{
                    this.breathFirstSearch(start,current,queue);
                });
            }
    
       }
    
    
    
    }

}

// Queue class
class Queue
{
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


//function to find coordinates of clicks
function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let res = [x,y];
    return res;
    
}


 




let newMaze = new Maze(500,10,10);
newMaze.setup();
newMaze.draw();

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
        //breathFirstSearch(newMaze.grid,start);
    }
    //let startIndex = [ (start[0]/ newMaze.cellSize),(start[1]/ newMaze.cellSize)]; 

    if(selectFlag==-1){
        // console.log(start);
        // console.log(target);
        
        var current = newMaze.grid[start[1]][start[0]];
        var queue = new Queue;
        queue.enqueue(current);

        newMaze.breathFirstSearch(current,start,queue);
       
       
    }
    
   
});



