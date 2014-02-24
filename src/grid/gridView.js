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

    eventBus.subscribe(Messages.UI_READY, function () {
        window.addEventListener("resize", function (event) {
            onResize();
        })
    });

    var cols, rows;

    function onResize() {
        var gridRatio = (this.cols + 2) / (this.rows + 2);
        var clientRatio = document.body.clientWidth / document.body.clientHeight;

        console.log("grid: " + gridRatio + " client: " + clientRatio);

        var w, h, mw, mh;
        if (clientRatio < gridRatio) {
            mw = w = 0.9 * document.body.clientWidth;
            if (gridRatio * w * (this.cols + 4) / (this.cols + 2) < document.body.clientHeight) {
                h = gridRatio * w;
                mh = gridRatio * w * (this.cols + 4) / (this.cols + 2);
            } else {
                h = 0.9 * document.body.clientHeight * (this.cols + 2) / (this.cols + 4);
                mh = 0.9 * document.body.clientHeight;
                mw = w = gridRatio * h;
            }
        } else {
            mh = h = 0.9 * document.body.clientHeight;
            if (gridRatio * h * (this.rows + 4) / (this.rows + 2) < document.body.clientWidth) {
                w = gridRatio * h;
                mw = gridRatio * w * (this.rows + 4) / (this.rows + 2);
            } else {
                w = 0.9 * document.body.clientWidth * (this.rows + 2) / (this.rows + 4);
                mw = 0.9 * document.body.clientWidth;
                mh = h = gridRatio * w;
            }
        }
        var style = getElement().style;
        style.width = w + "px";
        style.height = h + "px";
        style.marginTop = (-mh / 2) + "px";
        style.marginRight = (-mw / 2) + "px";
    }

    function setCard(col, row, card) {
        var cardElement = card.render();
        var gridCell = getElement().querySelector("[col='" + col + "'][row='" + row + "']");
        gridCell.innerHTML = "";
        gridCell.appendChild(cardElement);
    }

    function render(cols, rows, traitDirections) {
        this.cols = cols;
        this.rows = rows;
        onResize();

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
        return col == 0 && row > 0 && row <= rows && traitDirections[3] == 1;

    }

    function getElement() {
        return document.getElementById("grid");
    }

}(amplify));



