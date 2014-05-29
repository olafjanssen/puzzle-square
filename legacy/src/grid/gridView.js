/**
 * Created by olafjanssen on 22/02/14.
 */

// connection of grid with the DOM

(function (eventBus, $) {

    eventBus.subscribe(GameMessages.NEW_GRID_NEEDED, function (data) {
        render(data.cols, data.rows, data.traitDirections);
    });

    eventBus.subscribe(GameMessages.CARD_DROPPED, function (data) {
        setCard(data.col, data.row, data.card);
    });

    eventBus.subscribe(GameMessages.GRID_IS_FILLED, function () {
        onGridFilled();
    });

    function onGridFilled() {
        // set off screen
        getElement().classList.add("grid-filled");
        setTimeout(function () {
            $(".grid-cell").each(function () {
                var offset = parseInt($(this).attr("row"), 10) * parseInt($(this).height(), 10),
                    rotation = Math.random() * 360 - 180;
                $(this).css({transform: 'translate3d(0px,' + (2 * innerHeight + offset) + 'px, 0) rotate(' + rotation + 'deg)'});
            });
        }, 2000);
    }

    function setCard(col, row, card) {
        var fx = document.createElement("div"),
            cardElement = Card.render(card),
            gridCell = getElement().querySelector("[col='" + col + "'][row='" + row + "']");

        fx.classList.add("card-fx");
        gridCell.innerHTML = "";
        gridCell.appendChild(fx);
        gridCell.appendChild(cardElement);

        setTimeout(function () {
            fx.classList.add("dropped");
            cardElement.classList.add("dropped");
        }, 0);

        setTimeout(function () {
            fx.parentNode.removeChild(fx);
        }, 2000);
    }

    function render(cols, rows, traitDirections) {
        var row, col, cell,
            grid = document.createDocumentFragment(),
            cellWidth = (100 / (cols + traitDirections[1] + traitDirections[3])) + "%",
            cellHeight = (100 / (rows + traitDirections[0] + traitDirections[2])) + "%";

        this.cols = cols;
        this.rows = rows;

        for (row = -traitDirections[0]; row < rows + traitDirections[2]; row += 1) {
            for (col = -traitDirections[3]; col < cols + traitDirections[1]; col += 1) {
                cell = createNewGridCellElement(cellWidth, cellHeight, col, row);
                cell.setAttribute("ondrop", "");
                if (traitDirections[0] && row === -1) {
                    cell.classList.add("trait-top");
                }
                if (traitDirections[1] && col === cols) {
                    cell.classList.add("trait-right");
                }
                if (traitDirections[2] && row === rows) {
                    cell.classList.add("trait-bottom");
                }
                if (traitDirections[3] && row === -1) {
                    cell.classList.add("trait-left");
                }
                grid.appendChild(cell);
            }
        }
        getElement().innerHTML = "";
        getElement().appendChild(grid);

        // set off screen
        $(".grid-cell").each(function () {
            var rot = Math.random() * 7200 - 3600,
                phi = Math.random() * 2 * Math.PI,
                rho = Math.floor(Math.random() * 2 + 2);
            $(this).css({transform: 'translate3d(' + Math.cos(phi) * rho * innerWidth + 'px,' + Math.sin(phi) * rho * innerHeight + 'px,0) rotate(' + rot + 'deg)'});
        });
        // animate back again
        setTimeout(function () {
            $(".grid-cell").each(function () {
                $(this).css({transform: 'translate3d(0,0,0)'});
            });
        }, 0);
    }

    function createNewGridCellElement(width, height, col, row) {
        var cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.style.width = width;
        cell.style.height = height;
        cell.setAttribute("col", col);
        cell.setAttribute("row", row);
        return cell;
    }

    function getElement() {
        return document.getElementById("grid");
    }

}(amplify, $));



