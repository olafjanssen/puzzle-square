// Grid or playing field

var GridController = (function (eventBus) {

    var colTraitCards, rowTraitCards;
    var cols, rows;

    eventBus.subscribe(Messages.NEW_GRID_NEEDED, function (data) {
        cols = data.cols;
        rows = data.rows;
    });

    eventBus.subscribe(Messages.NEW_TRAITS_CHOSEN, function (data) {
        colTraitCards = data.colTraits;
        rowTraitCards = data.rowTraits;
    });

    eventBus.subscribe(Messages.POSITION_FILLED, function (data) {
        fillPosition(data.col, data.row);
    });

    eventBus.subscribe(Messages.CARD_DROP_ATTEMPTED, function (data) {
        attemptDrop(data.col, data.row, data.card);
    });

    eventBus.subscribe(Messages.NEW_PLAYABLE_CARD, function (data) {
        validateCardInGrid(data);
    });

    function validateCardInGrid(card) {
        for (var col = -1; col <= this.cols; col++) {
            for (var row = -1; row <= this.rows; row++) {
                if (validateCard(col, row, card)) {
                    return;
                }
            }
        }
        eventBus.publish(Messages.NEW_CARD_NOT_IN_GRID, card);
    }

    function fillPosition(col, row) {
        if (col == -1 || col == cols) {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: rowTraitCards[row]});
        } else if (row == -1 || row == rows) {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: colTraitCards[col]});
        } else {
            eventBus.publish(Messages.CARD_DROPPED, {col: col, row: row, card: rowTraitCards[row].withMergedCard(colTraitCards[col])});
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
        if (col == -1 || col == cols) {
            return card.equals(rowTraitCards[row]);
        } else if (row == -1 || row == rows) {
            return card.equals(colTraitCards[col]);
        } else {
            if (!rowTraitCards[row]) {
                return card.hasAllTraitsOf(colTraitCards[col]);
            } else if (!colTraitCards[col]) {
                return card.hasAllTraitsOf(rowTraitCards[row]);
            } else {
                return card.hasAllTraitsOf(rowTraitCards[row]) && card.hasAllTraitsOf(colTraitCards[col]);
            }
        }
    }

}(amplify));
