/**
 * Created by olafjanssen on 24/02/14.
 */

var LayoutManager = (function (eventBus) {

    eventBus.subscribe(Messages.NEW_GRID_NEEDED, function (data) {
        this.cols = data.cols;
        this.rows = data.rows;
        this.traitDirections = data.traitDirections;
        updateLayout();
    });

    eventBus.subscribe(Messages.UI_READY, function () {
        window.addEventListener("resize", function (event) {
            updateLayout();
        })
    });

    var cols, rows, traitDirections;

    function updateLayout() {
        var ac = this.traitDirections[1] + this.traitDirections[3];
        var ar = this.traitDirections[0] + this.traitDirections[2];
        
        var gridRatio = (this.cols + ac) / (this.rows + ar);
        var clientRatio = window.innerWidth / window.innerHeight;

        var w, h, mw, mh;
        if (clientRatio < gridRatio) {
            mw = w = 0.9 * window.innerWidth;
            if (gridRatio * w * (this.cols + ac + 2) / (this.cols + ac) < window.innerHeight) {
                h = gridRatio * w;
                mh = gridRatio * w * (this.cols + ac + 2) / (this.cols + ac);
            } else {
                h = 0.9 * window.innerHeight * (this.cols + ac) / (this.cols + ac + 2);
                mh = 0.9 * window.innerHeight;
                mw = w = gridRatio * h;
            }
        } else {
            mh = h = 0.9 * window.innerHeight;
            if (gridRatio * h * (this.rows + ar+2) / (this.rows + ar) < window.innerWidth) {
                w = gridRatio * h;
                mw = gridRatio * w * (this.rows + ar + 2) / (this.rows + ar);
            } else {
                w = 0.9 * window.innerWidth * (this.rows + ar) / (this.rows + ar + 2);
                mw = 0.9 * window.innerWidth;
                mh = h = gridRatio * w;
            }
        }
        var style = document.getElementById("grid").style;
        style.width = w + "px";
        style.height = h + "px";
        style.marginTop = (-mh / 2) + "px";
        style.marginRight = (-mw / 2) + "px";

        var stackStyle = document.getElementById("stack").style;
        stackStyle.width = (w / (this.cols + ac)) + "px";
        stackStyle.height = (h / (this.rows + ar)) + "px";
        stackStyle.marginTop = (clientRatio < gridRatio ? (h / 2) - ((w / (this.cols + ac)) / 2) : -(w / (this.cols + ac)) / 2) + "px";
        stackStyle.marginRight = (clientRatio >= gridRatio ? (w / 2) - ((h / (this.rows + ar)) / 2) : -(h / (this.rows + ar)) / 2) + "px";
    }

}(amplify));