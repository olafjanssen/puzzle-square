/**
 * Created by olafjanssen on 24/02/14.
 */

var LayoutManager = (function(eventBus){

    eventBus.subscribe(Messages.NEW_GRID_NEEDED, function (data) {
        this.cols = data.cols;
        this.rows = data.rows;
        updateLayout();
    });

    eventBus.subscribe(Messages.UI_READY, function () {
        window.addEventListener("resize", function (event) {
            updateLayout();
        })
    });

    var cols, rows;

    function updateLayout() {
        var gridRatio = (this.cols + 2) / (this.rows + 2);
        var clientRatio = document.body.clientWidth / document.body.clientHeight;

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
        var style = document.getElementById("grid").style;
        style.width = w + "px";
        style.height = h + "px";
        style.marginTop = (-mh / 2) + "px";
        style.marginRight = (-mw / 2) + "px";
    }

}(amplify));