// Grid or playing field

/*global define */

define(['amplify', 'amplify', 'messages', 'card'], function (eventBus, commandBus, Messages, Card) {
    'use strict';

    var traitDirections,
        colTraitCards,
        rowTraitCards,
        cols,
        rows,
        droppedCoordinates,
        gridCells,
        stack = [];

    function isGridFull() {
        return droppedCoordinates.length === gridCells;
    }

    // only call this method in a command handler
    function proceedAfterGridChange() {
        if (isGridFull()) {
            eventBus.publish(Messages.game.GRID_IS_FILLED);
        } else {
            eventBus.publish(Messages.game.NEW_PLAYABLE_CARD, stack[0]);
        }
    }

    function validateCard(col, row, card) {
        if (droppedCoordinates.indexOf(col + ', ' + row) !== -1) {
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

    function validateCardInGrid(card) {
        var c, r;
        for (c = -traitDirections[3]; c < cols + traitDirections[1]; c += 1) {
            for (r = -traitDirections[0]; r < rows + traitDirections[2]; r += 1) {
                if (droppedCoordinates.indexOf(c + ', ' + r) === -1 && validateCard(c, r, card)) {
                    droppedCoordinates.push(c + ', ' + r);
                    return true;
                }
            }
        }
        return false;
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

    // command handling
    commandBus.subscribe(Messages.commands.ATTEMPT_CARD_DROP, function (data) {
        var col = data.col, row = data.row, card = data.card;
        if (validateCard(col, row, card)) {
            eventBus.publish(Messages.game.CARD_DROPPED, {col: col, row: row, card: card});
            commandBus.publish(Messages.commands.GIVE_CARD_SCORE);
            proceedAfterGridChange();
        } else {
            eventBus.publish(Messages.game.CARD_DROP_REFUSED, {col: col, row: row, card: card});
        }
    });

    commandBus.subscribe(Messages.commands.FILL_POSITION, function (data) {
        var col = data.col, row = data.row;
        if (col === -1 || col === cols) {
            eventBus.publish(Messages.game.CARD_DROPPED, {col: col, row: row, card: rowTraitCards[row]});
        } else if (row === -1 || row === rows) {
            eventBus.publish(Messages.game.CARD_DROPPED, {col: col, row: row, card: colTraitCards[col]});
        } else {
            eventBus.publish(Messages.game.CARD_DROPPED, {col: col, row: row, card: Card.mergeCards(rowTraitCards[row], colTraitCards[col])});
        }
        proceedAfterGridChange();
    });

    // message handling

    eventBus.subscribe(Messages.game.NEW_STACK_CREATED, function (data) {
        stack = data.concat();
    });

    eventBus.subscribe(Messages.game.NEW_GRID_NEEDED, function (data) {
        var tempStack, i;

        cols = data.cols;
        rows = data.rows;
        traitDirections = data.traitDirections;
        gridCells = (cols * rows) + rows * (traitDirections[1] + traitDirections[3]) + cols * (traitDirections[0] + traitDirections[2]);
        droppedCoordinates = [];

        // clean up the stack of unused cards
        tempStack = stack.concat();
        for (i = 0; i < tempStack.length; i += 1) {
            if (!validateCardInGrid(tempStack[i])) {
                removeCardFromStack(tempStack[i]);
            }
        }
        droppedCoordinates = [];

    });

    eventBus.subscribe(Messages.game.NEW_TRAITS_CHOSEN, function (data) {
        colTraitCards = data.colTraits;
        rowTraitCards = data.rowTraits;
    });

    eventBus.subscribe(Messages.game.CARD_DROPPED, function (data) {
        droppedCoordinates.push(data.col + ', ' + data.row);
        removeCardFromStack(data.card);
    });
});
