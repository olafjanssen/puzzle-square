/**
 * Created by olafjanssen on 22/02/14.
 */

// connection of grid with the DOM

var GridView = (function (eventBus) {

    eventBus.subscribe(Messages.NEW_GAME_STARTED, function (data) {
        render(data.cols, data.rows, data.traitDirections);
    });

    eventBus.subscribe(Messages.CARD_DROPPED, function (data) {
        setCard(data.col, data.row, data.card)
    });

    function setCard(col, row, card) {
        var cardElement = card.render();
        var gridCell = getElement().querySelector("[col='" + col + "'][row='" + row + "']");
        gridCell.innerHTML = "";
        gridCell.appendChild(cardElement);
    }

    function render(cols, rows, traitDirections) {
        var grid = document.createElement("div");
        grid.setAttribute("cols", cols);
        grid.setAttribute("rows", rows);
        for (var row = 0; row < rows + 2; row++) {
            for (var col = 0; col < cols + 2; col++) {
                var td = document.createElement("div");
                td.classList.add("grid-cell");
                td.style.width = (100 / (cols + 2)) + "%";
                td.style.height = (100 / (rows + 2)) + "%";
                // draw the cards
                if (isDropPosition(col, row, cols, rows, traitDirections)) {
                    td.setAttribute("ondrop", "");
                }
                td.setAttribute("col", col);
                td.setAttribute("row", row);
                grid.appendChild(td);
            }
        }
        getElement().innerHTML = "";
        getElement().appendChild(grid);
    }

    // checks whether the position in the grid is a drop position (or a border position)
    function isDropPosition(col, row, cols, rows, traitDirections) {
        if (col > 0 && row > 0 && col <= cols && row <= rows) {
            return true;
        }
        if (row == 0 && col > 0 && col <= cols && traitDirections[0] == 1) {
            return true;
        }
        if (col == cols + 1 && row > 0 && row <= rows && traitDirections[1] == 1) {
            return true;
        }
        if (row == rows + 1 && col > 0 && col <= cols && traitDirections[2] == 1) {
            return true;
        }
        if (col == 0 && row > 0 && row <= rows && traitDirections[3] == 1) {
            return true;
        }
    }

    function getElement() {
        return document.getElementById("table");
    }

}(amplify));



