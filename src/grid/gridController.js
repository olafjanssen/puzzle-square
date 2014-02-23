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

    eventBus.subscribe(Messages.CARD_DROP_ATTEMPTED, function (data) {
        attemptDrop(data.col, data.row, data.card);
    });

    function fillPosition(col, row) {
        if (col == 0 || col == cols + 1) {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: rowTraitCards[row - 1]});
        } else if (row == 0 || row == rows + 1) {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: colTraitCards[col - 1]});
        } else {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: rowTraitCards[row - 1].withMergedCard(colTraitCards[col - 1])});
        }
    }

    function attemptDrop(col, row, card) {
        if (validateCard(col, row, card)) {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: card});
        } else {
            eventBus.publish(Messages.CARD_DROP_REFUSED, {col: col, row: row, card: card});
        }
    }

    function validateCard(col, row, card) {
        if (col == 0 || col == cols + 1) {
            return card.equals(rowTraitCards[row - 1]);
        } else if (row == 0 || row == rows + 1) {
            return card.equals(colTraitCards[col - 1]);
        } else {
            return card.equals(rowTraitCards[row - 1].withMergedCard(colTraitCards[col - 1]));
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

Grid.prototype.dropCard = function (col, row) {
    this.setCard(col, row, this.stack.shift());
    this.render();
    this.numberFilled++;
    this.handleFullTable();
};

Grid.prototype.handleFullTable = function () {
    if (this.stack.length > 0) {
        return;
    }
    appController.finishGame();
};
