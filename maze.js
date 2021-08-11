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
        this.status = false; //initialize all cells to be empty at first
        //object to store borders to the cell 
        this.borders = { 
            tb : true,
            rb : true,
            bb : true,
            lb : true,
        };

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

    highlight(columns){
        let x = (this.colI * this.gridSize) / columns + 1;
        let y = (this.rowI * this.gridSize) / columns + 1;

        context.fillStyle = "yellow";
        context.fillRect(x,y,this.gridSize/columns - 3, this.gridSize/ columns -3);
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
        
        context.strokeStyle = "white";
        context.fillStyle = "black";
        context.lineWidth = 2;
        
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
            context.fillRect(x+1,y+1, size/colSize -2, size/rowSize-2);
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
    draw(){
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "black";
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

            curr.highlight(this.cols);
            curr.deleteBorder(curr,next);
            curr = next; 
        //back tracking if theres no valid neighbours 
        } else if (this.stacks.length > 0){
            let cell = this.stacks.pop();
            curr  = cell;
            curr.highlight(this.cols);
        } 

        //finish drawing maze
        if(this.stacks.length==0){
            let x = (curr.colI * curr.gridSize) / this.cols + 1;
            let y = (curr.rowI * curr.gridSize) / this.cols + 1;
    
            context.fillStyle = "black";
            context.fillRect(x,y,curr.gridSize/this.cols - 3, curr.gridSize/this.cols -3);
            return;
        }

        window.requestAnimationFrame(()=>{
            this.draw();
        })
    }

}
let newMaze = new Maze(500,10,10);
newMaze.setup();
newMaze.draw();
