// Grid or playing field

var GridController = (function (eventBus) {

    var colTraitCards, rowTraitCards;
    var cols, rows;

    eventBus.subscribe(Messages.NEW_GRID_NEEDED, function (data) {
        cols = data.cols;
        rows = data.rows;
    });

    eventBus.subscribe(Messages.NEW_TRAITS_CHOSEN, function (data) {
        colTraitCards = data[0];
        rowTraitCards = data[1];
    });

    eventBus.subscribe(Messages.POSITION_FILLED, function (data) {
        fillPosition(data.col, data.row);
    });

    function fillPosition(col, row) {
        if (col == 0 || col == cols + 1) {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: rowTraitCards[row - 1]});
        } else if (row == 0 || row == rows + 1) {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: colTraitCards[col - 1]});
        } else {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: rowTraitCards[row -1].withMergedCard(colTraitCards[col-1])});
        }
    }
}(amplify));


function Grid(cols, rows, colTraitCards, rowTraitCards, stack, traitDirections) {
    this.traitDirections = traitDirections;
    this.cols = cols;
    this.rows = rows;
    this.colTraitCards = colTraitCards;
    this.rowTraitCards = rowTraitCards;
    this.cards = new Array(cols + 2);
    for (var col = 0; col < cols + 2; col++) {
        this.cards[col] = new Array(rows);
    }
    this.numberFilled = 0;

    // clean up stack
    this.stack = stack;
    var tempStack = this.stack.concat();
    var tempFill = new Array(cols + 2);
    for (var col = 0; col < cols + 2; col++) {
        tempFill[col] = new Array(rows);
    }
    for (var card = 0; card < tempStack.length; card++) {
        var valid = false;
        for (var col = 0; col < cols + 2; col++) {
            for (var row = 0; row < rows + 2; row++) {
                if (this.validateCard(col, row, tempStack[card]) && tempFill[col][row] === undefined) {
                    valid = true;
                    tempFill[col][row] = true;
                    break;
                }
            }
        }
        // if cannot be placed in the grid remove it
        if (!valid) {
            this.stack.splice(this.stack.indexOf(tempStack[card]), 1);
        }
    }

}

Grid.prototype.render = function () {

    // render the stack
    document.getElementById("stack").innerHTML = "";
    if (this.stack.length == 0) {
        return
    }
    var draggableCard = this.stack[0].render();

    if (this.stack.length > 1) {
        document.getElementById("stack").appendChild(this.stack[1].render());
    }
    document.getElementById("stack").appendChild(draggableCard);

    var thisGrid = this;
    var dragCard = draggableCard;

    // touch handling
    draggableCard.addEventListener('mousedown', function (event) {
        var offsetX = dragCard.offsetLeft - event.clientX;
        var offsetY = dragCard.offsetTop - event.clientY;
        dragCard.classList.remove("animate-dnd");
        dragCard.classList.add("during-drag");

        var mouseMoveListener = function (event) {
            dragCard.style.left = (offsetX + event.clientX) + "px";
            dragCard.style.top = (offsetY + event.clientY) + "px";
        };
        var mouseUpListener = function (event) {
            // remove listeners
            dragCard.removeEventListener("mouseup", mouseUpListener);
            document.removeEventListener("mousemove", mouseMoveListener);
            // find drop target
            document.getElementById("stack").style.display = "none";
            var elem = document.elementFromPoint(event.clientX, event.clientY);
            document.getElementById("stack").style.display = "";

            if (elem !== null && elem.hasAttribute("ondrop") && thisGrid.validateCard(elem.getAttribute("col"), elem.getAttribute("row"), thisGrid.stack[0])) {
                thisGrid.dropCard(elem.getAttribute("col"), elem.getAttribute("row"));
            } else {
                setTimeout(function () {
                    dragCard.classList.add("animate-dnd");
                    dragCard.classList.remove("during-drag");
                    dragCard.style.top = "";
                    dragCard.style.left = "";
                }, 50)
            }
        };
        document.addEventListener('mousemove', mouseMoveListener, false);
        dragCard.addEventListener('mouseup', mouseUpListener, false);
    }, false);

    draggableCard.addEventListener('touchstart', function (event) {
        var offsetX = dragCard.offsetLeft - event.changedTouches[0].pageX;
        var offsetY = dragCard.offsetTop - event.changedTouches[0].pageY;
        dragCard.classList.remove("animate-dnd");
        dragCard.classList.add("during-drag");
        dragCard.addEventListener('touchmove', function (event) {
            dragCard.style.left = (offsetX + event.changedTouches[0].pageX) + "px";
            dragCard.style.top = (offsetY + event.changedTouches[0].pageY) + "px";
        }, false);

        dragCard.addEventListener('touchend', function (event) {
            // find drop target
            document.getElementById("stack").style.display = "none";
            var elem = document.elementFromPoint(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
            document.getElementById("stack").style.display = "";
            if (elem !== null && elem.hasAttribute("ondrop") && thisGrid.validateCard(elem.getAttribute("col"), elem.getAttribute("row"), thisGrid.stack[0])) {
                thisGrid.dropCard(elem.getAttribute("col"), elem.getAttribute("row"));
            } else {
                setTimeout(function () {
                    dragCard.classList.add("animate-dnd");
                    dragCard.classList.remove("during-drag");
                    dragCard.style.top = "";
                    dragCard.style.left = "";
                }, 50)
            }
        }, false);
    }, false);
};

Grid.prototype.setCard = function (col, row, card) {
    this.cards[col][row] = card;
};

Grid.prototype.dropCard = function (col, row) {
    this.setCard(col, row, this.stack.shift());
    this.render();
    this.numberFilled++;
    this.handleFullTable();
};

Grid.prototype.validateCard = function (col, row) {
    return this.validateCard(col, row, this.stack[0]);
};

Grid.prototype.validateCard = function (col, row, card) {
    if (row == 0 && col > 0 && col <= this.cols && this.traitDirections[0] == 1) {
        return this.colTraitCards[col - 1] == card;
    }
    if (col == this.cols + 1 && row > 0 && row <= this.rows && this.traitDirections[1] == 1) {
        return this.rowTraitCards[row - 1] == card;
    }
    if (row == this.rows + 1 && col > 0 && col <= this.cols && this.traitDirections[2] == 1) {
        return this.colTraitCards[col - 1] == card;
    }
    if (col == 0 && row > 0 && row <= this.rows && this.traitDirections[3] == 1) {
        return this.rowTraitCards[row - 1] == card;
    }
    if (col > 0 && row > 0 && col <= this.cols && row <= this.rows) {
        if (this.colTraitCards.indexOf(card) >= 0 || this.rowTraitCards.indexOf(card) >= 0) {
            return false;
        }
        var colTraitCard = this.colTraitCards[col - 1];
        if (colTraitCard !== undefined) {
            for (var key in colTraitCard.traits) {
                if (!card.hasTraitValue(key, colTraitCard.traits[key])) {
                    return false;
                }
            }
        }
        var rowTraitCard = this.rowTraitCards[row - 1];
        if (rowTraitCard !== undefined) {
            for (var key in rowTraitCard.traits) {
                if (!card.hasTraitValue(key, rowTraitCard.traits[key])) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
};


Grid.prototype.handleFullTable = function () {
    if (this.stack.length > 0) {
        return;
    }
    appController.finishGame();
};
