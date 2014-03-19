// Grid or playing field

var GridController = (function (eventBus, commandBus) {

    var traitDirections;
    var colTraitCards, rowTraitCards;
    var cols, rows;
    var droppedCoordinates;
    var gridCells;

    // command handling

    commandBus.subscribe(Commands.ATTEMPT_CARD_DROP, function (data) {
        var col = data.col, row = data.row, card = data.card;
        if (validateCard(col, row, card)) {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: card});
        } else {
            eventBus.publish(Messages.CARD_DROP_REFUSED, {col: col, row: row, card: card});
        }

        if (isGridFull()) {
            eventBus.publish(Messages.GRID_IS_FILLED);
        }
    });

    commandBus.subscribe(Commands.FILL_POSITION, function (data) {
        var col = data.col, row = data.row;
        if (col == -1 || col == cols) {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: rowTraitCards[row]});
        } else if (row == -1 || row == rows) {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: colTraitCards[col]});
        } else {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: Card.mergeCards(rowTraitCards[row], colTraitCards[col])});
        }
    });

    // message handling

    eventBus.subscribe(Messages.NEW_GRID_NEEDED, function (data) {
        cols = data.cols;
        rows = data.rows;
        traitDirections = data.traitDirections;
        droppedCoordinates = [];
        gridCells = (cols * rows) + rows * (traitDirections[1] + traitDirections[3]) + cols * (traitDirections[0] + traitDirections[2]);
    });

    eventBus.subscribe(Messages.NEW_TRAITS_CHOSEN, function (data) {
        colTraitCards = data.colTraits;
        rowTraitCards = data.rowTraits;
    });

    eventBus.subscribe(Messages.CARD_DROPPED, function (data) {
        droppedCoordinates.push(data.col + ", " + data.row);
    });

    eventBus.subscribe(Messages.NEW_PLAYABLE_CARD, function (data) {
        validateCardInGrid(data);
    });

    function validateCardInGrid(card) {
        for (var col = -traitDirections[3]; col < this.cols + traitDirections[1]; col++) {
            for (var row = -traitDirections[0]; row < this.rows + traitDirections[2]; row++) {
                if (droppedCoordinates.indexOf(col + ", " + row) == -1 && validateCard(col, row, card)) {
                    eventBus.publish(Messages.NEW_CARD_IN_GRID, card);
                    return;
                }
            }
        }
        eventBus.publish(Messages.NEW_CARD_NOT_IN_GRID, card);
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
}(amplify, amplify));
