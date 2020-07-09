//draw triangle
let playerOneTurn = true;
const draw = SVG().addTo('#board').size(500, 350);
const Hex = Honeycomb.extendHex({ 
    size: 25,
    highlight() {
        let { x, y } = this.toPoint();    
        if(this.draw === undefined || this.draw.node.attributes[2].value === 'white') {
            // fill hex
            this.draw = draw
                .polygon(corners.map(({ x, y }) => `${x},${y}`))
                .fill({ opacity: 1, color: playerOneTurn?'aquamarine':'red'})
                .translate(x, y);
        } else {
            // fill hex
            this.draw = draw
                .polygon(corners.map(({ x, y }) => `${x},${y}`))
                .fill({ opacity: 1, color: 'white' })
                .translate(x, y);
        }
        //redraw border
        draw.use(hexSymbol).translate(x, y);
    } 
})
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

//handle actions
document.addEventListener('click', ({ offsetX, offsetY }) => {
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
        playerOneTurn = !playerOneTurn;
        let turn = document.getElementById('playerTurn');
        // turn.innerHTML = playerOneTurn?'Blue':'Red';
        turn.innerHTML = '';
        turn.style.backgroundColor = playerOneTurn?'aquamarine':'red';
        turn.style.borderColor = 'black';
        turn.style.borderWidth = '2px';
        turn.style.borderStyle = 'solid';
        // let turn = document.getElementsByClassName('hexagon')[0];
        // turn.style.color=playerOneTurn?'blue':'red';
    }
  })