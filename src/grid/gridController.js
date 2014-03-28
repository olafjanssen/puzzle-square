// Grid or playing field

(function (eventBus, commandBus) {

    var traitDirections,
        colTraitCards,
        rowTraitCards,
        cols,
        rows,
        droppedCoordinates,
        gridCells,
        stack = [];

    // command handling

    commandBus.subscribe(Commands.ATTEMPT_CARD_DROP, function (data) {
        var col = data.col, row = data.row, card = data.card;
        if (validateCard(col, row, card)) {
            eventBus.publish(GameMessages.CARD_DROPPED, {col: col, row: row, card: card});
            commandBus.publish(Commands.GIVE_CARD_SCORE);
            proceedAfterGridChange();
        } else {
            eventBus.publish(GameMessages.CARD_DROP_REFUSED, {col: col, row: row, card: card});
        }
    });

    commandBus.subscribe(Commands.FILL_POSITION, function (data) {
        var col = data.col, row = data.row;
        if (col === -1 || col === cols) {
            eventBus.publish(GameMessages.CARD_DROPPED, {col: col, row: row, card: rowTraitCards[row]});
        } else if (row === -1 || row === rows) {
            eventBus.publish(GameMessages.CARD_DROPPED, {col: col, row: row, card: colTraitCards[col]});
        } else {
            eventBus.publish(GameMessages.CARD_DROPPED, {col: col, row: row, card: Card.mergeCards(rowTraitCards[row], colTraitCards[col])});
        }
        proceedAfterGridChange();
    });

    // only call this method in a command handler
    function proceedAfterGridChange() {
        if (isGridFull()) {
            eventBus.publish(GameMessages.GRID_IS_FILLED);
        } else {
            eventBus.publish(GameMessages.NEW_PLAYABLE_CARD, stack[0]);
        }
    }

    // message handling

    eventBus.subscribe(GameMessages.NEW_STACK_CREATED, function (data) {
        stack = data.concat();
    });

    eventBus.subscribe(GameMessages.NEW_GRID_NEEDED, function (data) {
        var tempStack, i;

        cols = data.cols;
        rows = data.rows;
        traitDirections = data.traitDirections;
        gridCells = (cols * rows) + rows * (traitDirections[1] + traitDirections[3]) + cols * (traitDirections[0] + traitDirections[2]);

        // clean up the stack of unused cards
        tempStack = stack.concat();
        for (i = 0; i < tempStack.length; i += 1) {
            if (!validateCardInGrid(tempStack[i])) {
                removeCardFromStack(tempStack[i]);
            }
        }
        droppedCoordinates = [];
    });

    eventBus.subscribe(GameMessages.NEW_TRAITS_CHOSEN, function (data) {
        colTraitCards = data.colTraits;
        rowTraitCards = data.rowTraits;
    });

    eventBus.subscribe(GameMessages.CARD_DROPPED, function (data) {
        droppedCoordinates.push(data.col + ", " + data.row);
        removeCardFromStack(data.card);
    });


    function validateCardInGrid(card) {
        var col, row;
        for (col = -traitDirections[3]; col < this.cols + traitDirections[1]; col += 1) {
            for (row = -traitDirections[0]; row < this.rows + traitDirections[2]; row += 1) {
                if (droppedCoordinates.indexOf(col + ", " + row) === -1 && validateCard(col, row, card)) {
                    droppedCoordinates.push(col + ", " + row);
                    return true;
                }
            }
        }
        return false;
    }

    function validateCard(col, row, card) {
        if (droppedCoordinates.indexOf(col + ", " + row) !== -1) {
            return false;
        }
        if (row > -1 && (col === -1 || col === cols)) {
            return Card.equals(card, rowTraitCards[row]);
        }
        if (col > -1 && (row === -1 || row === rows)) {
            return Card.equals(card, colTraitCards[col]);
        }
        if (!rowTraitCards[row]) {
            return Card.hasAllTraitsOf(card, colTraitCards[col]);
        }
        if (!colTraitCards[col]) {
            return Card.hasAllTraitsOf(card, rowTraitCards[row]);
        }
        return Card.hasAllTraitsOf(card, rowTraitCards[row]) && Card.hasAllTraitsOf(card, colTraitCards[col]);
    }

    function isGridFull() {
        return droppedCoordinates.length === gridCells;
    }

    function removeCardFromStack(card) {
        var index;
        for (index = 0; index < stack.length; index += 1) {
            if (Card.equals(stack[index], card)) {
                stack.splice(index, 1);
                break;
            }
        }
    }

}(amplify, amplify));
