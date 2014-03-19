// Grid or playing field

var GridController = (function (eventBus, commandBus) {

    var traitDirections;
    var colTraitCards, rowTraitCards;
    var cols, rows;
    var droppedCoordinates;
    var gridCells;

    var stack = [];

    // command handling

    commandBus.subscribe(Commands.ATTEMPT_CARD_DROP, function (data) {
        var col = data.col, row = data.row, card = data.card;
        if (validateCard(col, row, card)) {
            eventBus.publish(GameMessages.CARD_DROPPED, {col: col, row: row, card: card});
        } else {
            eventBus.publish(GameMessages.CARD_DROP_REFUSED, {col: col, row: row, card: card});
        }
        proceedAfterGridChange();
    });

    commandBus.subscribe(Commands.FILL_POSITION, function (data) {
        var col = data.col, row = data.row;
        if (col == -1 || col == cols) {
            eventBus.publish(GameMessages.CARD_DROPPED, {col: col, row: row, card: rowTraitCards[row]});
        } else if (row == -1 || row == rows) {
            eventBus.publish(GameMessages.CARD_DROPPED, {col: col, row: row, card: colTraitCards[col]});
        } else {
            eventBus.publish(GameMessages.CARD_DROPPED, {col: col, row: row, card: Card.mergeCards(rowTraitCards[row], colTraitCards[col])});
        }
        proceedAfterGridChange();
    });

    // only call this method in a command handler
    function proceedAfterGridChange(){
        if (isGridFull()) {
            eventBus.publish(GameMessages.GRID_IS_FILLED);
        } else {
            eventBus.publish(GameMessages.NEW_PLAYABLE_CARD, stack[0]);
        }
    }

    // message handling

    eventBus.subscribe(GameMessages.NEW_STACK_CREATED, function (data) {
        stack = deck.concat();
    });

    eventBus.subscribe(GameMessages.NEW_GRID_NEEDED, function (data) {
        cols = data.cols;
        rows = data.rows;
        traitDirections = data.traitDirections;
        droppedCoordinates = [];
        gridCells = (cols * rows) + rows * (traitDirections[1] + traitDirections[3]) + cols * (traitDirections[0] + traitDirections[2]);
    });

    eventBus.subscribe(GameMessages.NEW_TRAITS_CHOSEN, function (data) {
        colTraitCards = data.colTraits;
        rowTraitCards = data.rowTraits;

        // clean up the stack of unused cards
        var tempStack = deck.concat();
        for(var i=0;i<tempStack.length;i++){
            if (!validateCardInGrid(tempStack[i])){
                removeCardFromStack(tempStack[i]);
            }
        }
    });

    eventBus.subscribe(GameMessages.CARD_DROPPED, function (data) {
        droppedCoordinates.push(data.col + ", " + data.row);
        removeCardFromStack(data.card);
    });


    function validateCardInGrid(card) {
        for (var col = -traitDirections[3]; col < this.cols + traitDirections[1]; col++) {
            for (var row = -traitDirections[0]; row < this.rows + traitDirections[2]; row++) {
                if (droppedCoordinates.indexOf(col + ", " + row) == -1 && validateCard(col, row, card)) {
                    return true;
                }
            }
        }
        return false;
    }

    function validateCard(col, row, card) {
        if (row > -1 && (col == -1 || col == cols)) {
            return Card.equals(card, rowTraitCards[row]);
        } else if (col > -1 && (row == -1 || row == rows)) {
            return Card.equals(card, colTraitCards[col]);
        } else {
            if (!rowTraitCards[row]) {
                return Card.hasAllTraitsOf(card, colTraitCards[col]);
            } else if (!colTraitCards[col]) {
                return Card.hasAllTraitsOf(card, rowTraitCards[row]);
            } else {
                return Card.hasAllTraitsOf(card, rowTraitCards[row]) && Card.hasAllTraitsOf(card, colTraitCards[col]);
            }
        }
    }

    function isGridFull() {
        return droppedCoordinates.length == gridCells;
    }

    function removeCardFromStack(card) {
        var index;
        for (index = 0; index < stack.length; index++) {
            if (Card.equals(stack[index], card)) {
                stack.splice(index, 1);
                break;
            }
        }
    }

}(amplify, amplify));
