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
