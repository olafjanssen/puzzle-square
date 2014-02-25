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
            return card.equals(rowTraitCards[row].withMergedCard(colTraitCards[col]));
        }
    }

}(amplify));
