/**
 * Created by olafjanssen on 24/02/14.
 */

var LayoutManager = (function (eventBus) {

    var hasGrid = false;

    eventBus.subscribe(Messages.NEW_GRID_NEEDED, function (data) {
        hasGrid = true;
        this.cols = data.cols;
        this.rows = data.rows;
        this.traitDirections = data.traitDirections;
        updateLayout();
    });

    eventBus.subscribe(Messages.UI_READY, function () {
        window.addEventListener("resize", function (event) {
            if (hasGrid) {
                updateLayout();
            }
        })
    });

    var cols, rows, traitDirections;

    function updateLayout() {
        var ac = this.traitDirections[1] + this.traitDirections[3];
        var ar = this.traitDirections[0] + this.traitDirections[2];

        var gridRatio = (this.cols + ac) / (this.rows + ar);
        var clientRatio = window.innerWidth / window.innerHeight;

        var w, h, mw, mh;
        if (clientRatio < 1) {
            mw = w = 0.9 * window.innerWidth;
            if (w / gridRatio * (this.rows + ar + 2) / (this.rows + ar) < 0.9 * window.innerHeight) {
                h = w / gridRatio;
                mh = w / gridRatio * (this.rows + ar + 2) / (this.rows + ar);
            } else {
                h = 0.9 * window.innerHeight * (this.rows + ar) / (this.rows + ar + 2);
                mh = 0.9 * window.innerHeight;
                mw = w = gridRatio * h;
            }
        } else {
            mh = h = 0.9 * window.innerHeight;
            if (gridRatio * h * (this.cols + ac + 2) / (this.cols + ac) < 0.9 * window.innerWidth) {
                w = gridRatio * h;
                mw = gridRatio * h * (this.cols + ac + 2) / (this.cols + ac);
            } else {
                w = 0.9 * window.innerWidth * (this.cols + ac) / (this.cols + ac + 2);
                mw = 0.9 * window.innerWidth;
                mh = h = w / gridRatio;
            }
        }
        var style = document.getElementById("grid").style;
        style.width = w + "px";
        style.height = h + "px";

        var floorStyle = document.getElementById("floor").style;
        floorStyle.width = mw + "px";
        floorStyle.height = mh + "px";
        floorStyle.marginTop = (-mh / 2) + "px";
        floorStyle.marginLeft = (-mw / 2) + "px";

        var stackStyle = document.getElementById("stack").style;
        stackStyle.width = (w / (this.cols + ac)) + "px";
        stackStyle.height = (h / (this.rows + ar)) + "px";
        if (clientRatio < 1) {
            stackStyle.marginBottom = "0";
            stackStyle.marginRight = (-(w / (this.cols + ac)) / 2) + "px";
            stackStyle.bottom = "0";
            stackStyle.right = "50%";
        } else {
            stackStyle.marginBottom = (-(h / (this.rows + ar)) / 2) + "px";
            stackStyle.marginRight = 0;
            stackStyle.bottom = "50%";
            stackStyle.right = "0";
        }

    }

}(amplify));