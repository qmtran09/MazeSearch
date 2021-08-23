


function breathFirstSearch(grid,start){
    let curr = grid[start[1]][start[0]];
    let queue = new Queue(grid.length*2);
    queue.enqueue(curr);

    while(!queue.isEmpty()){
        let temp = q.dequeue();
        if(!temp.isTarget){
            //console.log([temp.colI,temp.rowI]);
        
            nb = temp.getNeighbours();

            nb.forEach(n => {
                queue.enqueue(n)
            });
        } else{
            break;
        }
        




    }



}