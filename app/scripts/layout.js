/**
 * Created by Olaf Janssen on 24/02/14.
 */

/*global define */

define(['amplify', 'messages'], function (eventBus, Messages) {
    'use strict';

    var hasGrid = false,
        traitDirections = [],
        rows = 0,
        cols = 0;

    function updateLayout() {
        var ac = traitDirections[1] + traitDirections[3],
            ar = traitDirections[0] + traitDirections[2],
            gridRatio = (cols + ac) / (rows + ar),
            clientRatio = window.innerWidth / window.innerHeight,
            w,
            h,
            mw,
            mh,
            style,
            floorStyle,
            stackStyle;

        if (clientRatio < 1) {
            mw = w = 0.9 * window.innerWidth;
            if (w / gridRatio * (rows + ar + 2) / (rows + ar) < 0.9 * window.innerHeight) {
                h = w / gridRatio;
                mh = w / gridRatio * (rows + ar + 2) / (rows + ar);
            } else {
                h = 0.9 * window.innerHeight * (rows + ar) / (rows + ar + 2);
                mh = 0.9 * window.innerHeight;
                mw = w = gridRatio * h;
            }
        } else {
            mh = h = 0.9 * window.innerHeight;
            if (gridRatio * h * (cols + ac + 2) / (cols + ac) < 0.9 * window.innerWidth) {
                w = gridRatio * h;
                mw = gridRatio * h * (cols + ac + 2) / (cols + ac);
            } else {
                w = 0.9 * window.innerWidth * (cols + ac) / (cols + ac + 2);
                mw = 0.9 * window.innerWidth;
                mh = h = w / gridRatio;
            }
        }
        style = document.getElementById('grid').style;
        style.width = w + 'px';
        style.height = h + 'px';

        floorStyle = document.getElementById('floor').style;
        floorStyle.width = mw + 'px';
        floorStyle.height = mh + 'px';
        floorStyle.marginTop = (-mh / 2) + 'px';
        floorStyle.marginLeft = (-mw / 2) + 'px';

        stackStyle = document.getElementById('stack').style;
        stackStyle.width = (w / (cols + ac)) + 'px';
        stackStyle.height = (h / (rows + ar)) + 'px';
        if (clientRatio < 1) {
            stackStyle.marginBottom = '0';
            stackStyle.marginRight = (-(w / (cols + ac)) / 2) + 'px';
            stackStyle.bottom = '0';
            stackStyle.right = '50%';
        } else {
            stackStyle.marginBottom = (-(h / (rows + ar)) / 2) + 'px';
            stackStyle.marginRight = 0;
            stackStyle.bottom = '50%';
            stackStyle.right = '0';
        }

    }

    eventBus.subscribe(Messages.game.NEW_GRID_NEEDED, function (data) {
        hasGrid = true;
        cols = data.cols;
        rows = data.rows;
        this.traitDirections = data.traitDirections;
        updateLayout();
    });

    eventBus.subscribe(Messages.ui.UI_READY, function () {
        window.addEventListener('resize', function () {
            if (hasGrid) {
                updateLayout();
            }
        });
    });


});