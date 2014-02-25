/**
 * Created by olafjanssen on 22/02/14.
 */

// connection of grid with the DOM

var GridView = (function (eventBus) {

    eventBus.subscribe(Messages.NEW_GRID_NEEDED, function (data) {
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
        this.cols = cols;
        this.rows = rows;

        var grid = document.createElement("div");
        var cellWidth = (100 / (cols + traitDirections[1] + traitDirections[3])) + "%";
        var cellHeight = (100 / (rows + traitDirections[0] + traitDirections[2])) + "%";

        for (var row = -traitDirections[0]; row < rows + traitDirections[2]; row++) {
            for (var col = -traitDirections[3]; col < cols + traitDirections[1]; col++) {
                grid.appendChild(createNewGridCellElement(cellWidth, cellHeight, col, row));
            }
        }
        getElement().innerHTML = "";
        getElement().appendChild(grid);
    }

    function createNewGridCellElement(width, height, col, row) {
        var cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.style.width = width;
        cell.style.height = height;
        cell.setAttribute("ondrop", "");
        cell.setAttribute("col", col);
        cell.setAttribute("row", row);
        return cell;
    }

    function getElement() {
        return document.getElementById("grid");
    }

}(amplify));



