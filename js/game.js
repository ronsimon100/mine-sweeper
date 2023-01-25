'use strict'

const EMPTY = ' '
const FLAG = '🚩'
const MINE = '💣'



var gBoard = []
var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    firstClick: true,
    lives: 3,
};

function onInit() {
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.lives = 3;
    buildBoard(gBoard);
    renderBoard(gBoard);
    setMinesNegsCount(gBoard);
    document.querySelector(".lives").innerText = "Lives: " + gGame.lives;
    document.querySelector(".smiley").innerHTML = "😃";
    var startTime = new Date();
    setInterval(function() {
        gGame.secsPassed = (new Date() - startTime) / 1000;
        document.querySelector(".timer").innerText = "Time Passed: " + gGame.secsPassed;
    }, 1000);
}
function buildBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }
    return gBoard;
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //The maximum is inclusive and the minimum is inclusive
}

function chooseLevel() {
    if (gLevel === "1") {
        var beginnerBtn = document.querySelector("#beginner");
        beginnerBtn.addEventListener("click", function() {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        onInit();
    });
    } else if (gLevel === "2") {
        var mediumBtn = document.querySelector("#medium");
        mediumBtn.addEventListener("click", function() {
        gLevel.SIZE = 8;
        gLevel.MINES = 14;
        onInit();
});
    } else if (gLevel === "3") {
        var expertBtn = document.querySelector("#expert");
        expertBtn.addEventListener("click", function() {
        gLevel.SIZE = 12;
        gLevel.MINES = 32;
    onInit();
});
        
   
        console.log(chooseLevel());
        chooseLevel();
        
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (!board[i][j].isMine) {
                var count = 0;
                for (var x = i - 1; x <= i + 1; x++) {
                    if (x < 0 || x >= gLevel.SIZE) continue;
                    for (var y = j - 1; y <= j + 1; y++) {
                        if (y < 0 || y >= gLevel.SIZE) continue;
                        if (x === i && y === j) continue;
                        if (board[x][y].isMine) count++;
                    }
                }
                board[i][j].minesAroundCount = count;
            }
        }
    }
}
    
function renderBoard() {
    var elBoard = document.querySelector(".board");
    var strHTML = "";
      for (var i = 0; i < gLevel.SIZE; i++) {
          strHTML += "<tr>";
          for (var j = 0; j < gLevel.SIZE; j++) {
            console.log(gBoard);
              var cell = gBoard[i][j];
              var className = " ";
                 if (cell.isShown) {
                     className += " shown";
                        if (cell.isMine) strHTML += "<td class='mine" + className + "'>💣</td>";
                        else strHTML += "<td class='" + className + "'>" + cell.minesAroundCount + "</td>";
                      } else if (cell.isMarked) {
                        className += " marked";
                        strHTML += "<td class='" + className + "'>🚩</td>";
                      } else {
                        strHTML += "<td class='" + className + "'> </td>";
                    }
                }
                         strHTML += "</tr>";
            }
                          elBoard.innerHTML = strHTML;
                          var elCells = document.querySelectorAll("td");
                          for (var i = 0; i < elCells.length; i++) {
                              elCells[i].addEventListener("click", onCellClicked);
                              elCells[i].addEventListener("marked", onCellMarked);
        }
    }
    
        
            
    
          function onCellClicked(elCell, i, j) {
                if (gGame.firstClick) {
                    gGame.firstClick = false;
                    // place mines and count neighbors
                    for (var i = 0; i < gLevel.MINES; i++) {
                        var mineI = getRandomIntInclusive(0, gLevel.SIZE - 1);
                        var mineJ = getRandomIntInclusive(0, gLevel.SIZE - 1);
                        if (mineI === i && mineJ === j) {
                            i--;
                            continue;
                        }
                        gBoard[mineI][mineJ].isMine = true;
                    }
                    setMinesNegsCount(gBoard);
                }
                    // check for mine
                        if (gBoard[i][j].isMine) {
                            gGame.lives--;
                            document.querySelector(".lives").innerText = "Lives: " + gGame.lives;
                            if (gGame.lives === 0) {
                                alert("Game Over! You have no lives left.");
                                // reveal all mines
                                for (var i = 0; i < gLevel.SIZE; i++) {
                                    for (var j = 0; j < gLevel.SIZE; j++) {
                                        if (!gBoard[i][j].isMine) {
                                            var mineCell = document.querySelector("tr:nth-child(" + (i + 1) + ") td:nth-child(" + (j + 1) + ")");
                                            mineCell.innerHTML = "💣";
                                        }
                                    }
                                }
            // disable clicking on the cells
            var cells = document.querySelectorAll("td");
            cells.forEach(function(cell) {
                cell.removeEventListener("click", onCellClicked);
                cell.removeEventListener("contextmenu", onCellMarked);
            });
            document.querySelector(".smiley").innerHTML = "😵";
        } else {
            alert("You clicked a mine. Lives left: " + gGame.lives);
        }
    } else {
        elCell.innerHTML = gBoard[i][j].minesAroundCount;
        elCell.removeEventListener("click", onCellClicked);
        elCell.removeEventListener("contextmenu", onCellMarked);
        gBoard[i][j].isShown = true;
        gGame.shownCount++;
        // expand if no mines around
        expandShown(gBoard, elCell, i, j);
        checkGameOver();
        renderBoard(board)
    }
}


function onCellMarked(elCell) {
    var i = elCell.parentNode.rowIndex;
    var j = elCell.cellIndex;
    if (gBoard[i][j].isShown) return;
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
    if (gBoard[i][j].isMarked) {
        elCell.innerHTML = "🚩";
        gGame.markedCount++;
    } else {
        elCell.innerHTML = "";
        gGame.markedCount--;
    }
    checkGameOver();
}

function expandShown(board, elCell, i, j) {
    if (board[i][j].minesAroundCount) return;
    for (var x = i - 1; x <= i + 1; x++) {
        if (x < 0 || x >= gLevel.SIZE) continue;
        for (var y = j - 1; y <= j + 1; y++) {
            if (y < 0 || y >= gLevel.SIZE) continue;
            if (x === i && y === j) continue;
            if (!board[x][y].isShown && !board[x][y].isMarked) {
                var elCurrCell = document.querySelector("tr:nth-child(" + (x + 1) + ") td:nth-child(" + (y + 1) + ")");
                elCurrCell.innerHTML = board[x][y].minesAroundCount;
                elCurrCell.removeEventListener("click", onCellClicked);
                elCurrCell.removeEventListener("contextmenu", onCellMarked);
                board[x][y].isShown = true;
                gGame.shownCount++;
                expandShown(board, elCurrCell, x, y);
            }
        }
    }
}


function checkIfGameOver() {
    if (gGame.markedCount === gLevel.MINES) {
        // check for win
        for (var i = 0; i < gLevel.SIZE; i++) {
            for (var j = 0; j < gLevel.SIZE; j++) {
                if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) return;
            }
        }
        alert("You Win! All mines are marked and all other cells are shown.");
        // disable clicking on the cells
        var cells = document.querySelectorAll("td");
        cells.forEach(function(cell) {
            cell.removeEventListener("click", onCellClicked);
            cell.removeEventListener("contextmenu", onCellMarked);
        });
    }
}