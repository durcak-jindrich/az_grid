//define borders
let borderInfo = [...Array(10)].map(e => Array(8));
borderInfo[3][1] = {left:true, right:true, down:false};

borderInfo[3][2] = {left:true, right:false, down:false};
borderInfo[4][2] = {left:false, right:true, down:false};

borderInfo[2][3] = {left:true, right:false, down:false};
borderInfo[3][3] = {left:false, right:false, down:false};
borderInfo[4][3] = {left:false, right:true, down:false};

borderInfo[2][4] = {left:true, right:false, down:false};
borderInfo[3][4] = {left:false, right:false, down:false};
borderInfo[4][4] = {left:false, right:false, down:false};
borderInfo[5][4] = {left:false, right:true, down:false};

borderInfo[1][5] = {left:true, right:false, down:false};
borderInfo[2][5] = {left:false, right:false, down:false};
borderInfo[3][5] = {left:false, right:false, down:false};
borderInfo[4][5] = {left:false, right:false, down:false};
borderInfo[5][5] = {left:false, right:true, down:false};

borderInfo[1][6] = {left:true, right:false, down:false};
borderInfo[2][6] = {left:false, right:false, down:false};
borderInfo[3][6] = {left:false, right:false, down:false};
borderInfo[4][6] = {left:false, right:false, down:false};
borderInfo[5][6] = {left:false, right:false, down:false};
borderInfo[6][6] = {left:false, right:true, down:false};

borderInfo[0][7] = {left:true, right:false, down:true};
borderInfo[1][7] = {left:false, right:false, down:true};
borderInfo[2][7] = {left:false, right:false, down:true};
borderInfo[3][7] = {left:false, right:false, down:true};
borderInfo[4][7] = {left:false, right:false, down:true};
borderInfo[5][7] = {left:false, right:false, down:true};
borderInfo[6][7] = {left:false, right:true, down:true};

function checkCompletion(hex,grid){
    //resolve the current hex
    const color = hex.draw.node.attributes[2].value;
    if(color == 'white' || color == 'grey'){return false;}
    let visitedHexes = [hex];
    let currentHexes = [hex];
    //gradually get hexes of the same color that are connected to the current hex
    while(true){
        if(currentHexes.length == 0){
            break;
        } else {
            let sameColorNeighbors = getHexNeighborsInSameColor(currentHexes.pop(), color, grid);
            sameColorNeighbors.forEach(function(neighbor){// for each neighbor 
                if (!visitedHexes.includes(neighbor)) {   // if not in visited
                    currentHexes.push(neighbor);          // add to current
                    visitedHexes.push(neighbor);          // add to visited 
                }
            })        
        }
    }
    //check if visited hexes connect all 3 sides
    let completed = {left:false, right:false, down:false};
    visitedHexes.forEach(function(visitedHex){
        completed = updateSideCompletion(completed,borderInfo[visitedHex.x][visitedHex.y]);
    })
    return(completed.left && completed.right && completed.down);
}

function getHexNeighborsInSameColor(hex, color, grid){
    //get neighbors based on row
    let neighbors = [];
    if(hex.y % 2 == 0){
        neighbors.push(grid.get({x:hex.x - 1, y:hex.y - 1}));
        neighbors.push(grid.get({x:hex.x - 1, y:hex.y    }));
        neighbors.push(grid.get({x:hex.x - 1, y:hex.y + 1}));
        neighbors.push(grid.get({x:hex.x    , y:hex.y - 1}));
        neighbors.push(grid.get({x:hex.x + 1, y:hex.y    }));
        neighbors.push(grid.get({x:hex.x    , y:hex.y + 1}));
    } else {
        neighbors.push(grid.get({x:hex.x    , y:hex.y - 1}));
        neighbors.push(grid.get({x:hex.x - 1, y:hex.y    }));
        neighbors.push(grid.get({x:hex.x    , y:hex.y + 1}));
        neighbors.push(grid.get({x:hex.x + 1, y:hex.y - 1}));
        neighbors.push(grid.get({x:hex.x + 1, y:hex.y    }));
        neighbors.push(grid.get({x:hex.x + 1, y:hex.y + 1}));
    }
    let sameColorNeighbors = [];
    neighbors.forEach(function(hexNeighbor) {
        if(typeof(hexNeighbor) !== "undefined" && typeof(hexNeighbor.draw) !== "undefined"){
            if(hexNeighbor.draw.node.attributes[2].value === color){
                sameColorNeighbors.push(hexNeighbor);
            }
        }
      })
    return(sameColorNeighbors);
}

function updateSideCompletion(completed, addedHex){
    return {
        left: completed.left || addedHex.left,
        right: completed.right || addedHex.right,
        down: completed.down || addedHex.down
    }
}