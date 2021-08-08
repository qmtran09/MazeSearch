let maze = document.querySelector(".maze");
let context = maze.getContext("2d");


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
    /**
     * method to generate borders around cells
     * x is col coordinate, y is row coordinate
     * dir is which direction do you want to build the border in
     * colSize and rowSize refers to number of columns and rows on grid
     * size refers to area of the grid 
     */
    
    createBorder(x,y,size, colSize, rowSize, dir){
        if(dir == "top"){
            context.beginPath();
            context.moveTo(x,y);
            context.lineTo(x+size/colSize,y);
            context.stroke();
        } else if(dir == "bottom"){
            context.beginPath();
            context.moveTo(x,y-size/rowSize);
            context.lineTo(x + size/colSize);
            context.stroke();
        } else if(dir == "right"){
            context.beginPath();
            context.moveTo(x+size/colSize,y);
            context.lineTo(x+size/colSize,y-size/rowSize);
            context.stroke();
        } else if(dir == "left"){
            context.beginPath();
            context.moveTo(x,y);
            context.lineTo(x,y-size/rowSize);
            context.stroke();
        }




    }

    drawBorder(size, colSize,rowSize){
        //get coordinate of top right corner of cell in grid 
        let x = (this.colNum * size) / colSize;
        let y = (this.rowNum * size) / rowSize;
        
        context.strokeStyle = "white";
        context.fillStyle = "black";
        context.lineWidth = 2;

        if(this.borders.tb){
            this.createBorder(x,y,size,colSize,rowSize,"top");
        }
        if(this.borders.bb){
            this.createBorder(x,y,size,colSize,rowSize,"bottom");
        }
        if(this.borders.lb){
            this.createBorder(x,y,size,colSize,rowSize,"left");
        }
        if(this.borders.rb){
            this.createBorder(x,y,size,colSize,rowSize,"right");
        }



    }

}
/**
 * Maze class, class for the layout of the maze 
 */
class Maze{
    constructor(size, rows, cols){
        this.size = size;
        this.cols = cols;
        this.rows = rows;
        this.grid = [];
        this.stacks = []; //stack for backtracking
    }

    //method to fill out grid with cells
    init(){
        for(let y = 0; y < this.rows; y++ ){
            let row = []
            for(let x = 0; x < this.cols; x++){
                let cell = new Cell(y,x,this.grid,this.gridSize);
                row.push(cell);
            }
            this.grid.push(row);
        }
        curr = this.grid[0][0];
    }

}
