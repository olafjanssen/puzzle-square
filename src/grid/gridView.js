/**
 * Created by olafjanssen on 22/02/14.
 */

// connection of grid with the DOM

var GridView = (function() {

    function render(cols, rows, traitDirections){
        var table = document.createElement("div");
        table.setAttribute("cols", this.cols);
        table.setAttribute("rows", this.rows);
        for(var row=0;row<this.rows+2;row++){
            for(var col=0;col<this.cols+2;col++){
                var td = document.createElement("div");
                td.classList.add("grid-cell");
                td.style.width = (100/(this.cols+2)) + "%";
                td.style.height = (100/(this.rows+2)) + "%";
                // draw the cards
                if (this.isDropPosition(col, row, cols, rows, traitDirections)) {
                    td.setAttribute("ondrop","");
                }
                td.setAttribute("col", col);
                td.setAttribute("row", row);
                table.appendChild(td);
            }
        }
        document.getElementById("table").innerHTML = "";
        document.getElementById("table").appendChild(table);
    }

    function isDropPosition(col, row, cols, rows, traitDirections) {
        if (col>0 && row>0 && col<=this.cols && row<=this.rows){
            return true;
        }
        if (row==0 && col>0 && col<=cols && traitDirections[0]==1){
            return true;
        }
        if (col==this.cols+1 && row>0 && row<=rows && traitDirections[1]==1){
            return true;
        }
        if (row==this.rows+1 && col>0 && col<=cols && traitDirections[2]==1){
            return true;
        }
        if (col==0 && row>0 && row<=rows && traitDirections[3]==1){
            return true;
        }
    }

}());



