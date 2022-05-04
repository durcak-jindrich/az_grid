//draw triangle
let playerOneTurn = true;
var slider = document.getElementById("myRange");
var answerPrecissionLimit = document.getElementById("precission");
answerPrecissionLimit.innerHTML = slider.value;
slider.oninput = function() {
    answerPrecissionLimit.innerHTML = this.value;
}
const draw = SVG().addTo('#board').size(500, 350);
const Hex = Honeycomb.extendHex({ 
    size: 25,
    highlight() {
        let { x, y } = this.toPoint();
        const answerPrecission = Math.random()*100;
        if(this.draw === undefined || this.draw.node.attributes[2].value === 'white') {
            if(answerPrecission > Number(answerPrecissionLimit.innerText)){
                //Wrong answer -> grey tile
                this.draw = fillHexTile('grey', x, y)
            } else {
                // correct answer -> filed with color
                this.draw = fillHexTile(playerOneTurn?'aquamarine':'red', x, y)
            }
        } else if(this.draw.node.attributes[2].value === 'grey') {
            // when selecting grey tile, there is 50% chance for winning it (just like AZ kviz)
            const correctChoice = Math.random() < 0.5;
            if(correctChoice){
                this.draw = fillHexTile(playerOneTurn?'aquamarine':'red', x, y)
            } else {
                this.draw = fillHexTile(playerOneTurn?'red':'aquamarine', x, y)
                playerOneTurn = !playerOneTurn;
            }
        } else {
            // tiles with blue/red color are reset to white
            this.draw = fillHexTile('white', x, y)
        }
        //redraw border
        draw.use(hexSymbol).translate(x, y);
    } 
})

function fillHexTile(color, x, y){
    return draw
        .polygon(corners.map(({ x, y }) => `${x},${y}`))
        .fill({ opacity: 1, color: color })
        .translate(x, y);
}

function changePlayerTurn(){
    playerOneTurn = !playerOneTurn;
    let turn = document.getElementById('playerTurn');
    turn.innerHTML = '';
    turn.style.backgroundColor = playerOneTurn?'aquamarine':'red';
    turn.style.borderColor = 'black';
    turn.style.borderWidth = '2px';
    turn.style.borderStyle = 'solid';
}

const Grid = Honeycomb.defineGrid(Hex)
const corners = Hex().corners()
const hexSymbol = draw.symbol()
    // map the corners' positions to a string and create a polygon
    .polygon(corners.map(({ x, y }) => `${x},${y}`))
    .fill('none')
    .stroke({ width: 1, color: 'black' })

const grid = Grid.triangle({size:7, direction: 5})

grid.forEach(hex => {
    hex.x=hex.x-3
    const { x, y } = hex.toPoint()
    draw.use(hexSymbol).translate(x, y)
})

//handle board actions
const board = document.getElementById('board');
board.addEventListener('click', ({ offsetX, offsetY }) => {
    const hexCoordinates = Grid.pointToHex([offsetX, offsetY]);
    const hex = grid.get(hexCoordinates);
    
    if (hex) {
        hex.highlight();
        if(checkCompletion(hex, grid)){
            let modal = document.getElementById("myModal");
            let winner = playerOneTurn?'Blue':'Red';
            let winnerDiv = document.getElementById("winner");
            winnerDiv.innerHTML = winner + " player has won.";
            modal.style.display = "block";
            
            let span = document.getElementsByClassName("close")[0];
            span.onclick = function() {
                modal.style.display = "none";
            }
        }
        changePlayerTurn();
    }
  })