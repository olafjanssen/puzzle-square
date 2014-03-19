/**
 * Created by olafjanssen on 3/10/14.
 */

var BetwixtPresenter = (function (eventBus, $) {

    var ELEMENT_ID = "betwixt";
    var IMAGE_ELEMENT_ID = "win-image";
    var BUTTON_ELEMENT_ID = "next-focus";

    var currentImageClassName;

    // todo let presenter know about the settings
//    eventBus.subscribe(GameMessages.NEW_GAME_STARTED, function (data) {
//        document.getElementById(ELEMENT_ID).classList.remove("show");
//        document.getElementById(ELEMENT_ID).classList.remove("fx");
//        currentImageClassName = data.settings.imageClassName;
//    })

    eventBus.subscribe(GameMessages.GRID_IS_FILLED, function (data) {
        onGridFilled();
    });

    eventBus.subscribe(UIMessages.UI_READY, function () {
        updateLayout();
        window.addEventListener("resize", function (event) {
            updateLayout();
        });

        $("#"+BUTTON_ELEMENT_ID).on('touchend click', function () {
            eventBus.publish(UIMessages.NEXT_LEVEL_REQUESTED);
        });
    });

    var cols, rows, traitDirections;

    function updateLayout() {
        var currentSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
        var fontSize = currentSize / 800;
        $("#" + ELEMENT_ID).css({fontSize: fontSize + "em"});
    }

    function onGridFilled() {
        document.getElementById(ELEMENT_ID).classList.add("show");
        document.getElementById(IMAGE_ELEMENT_ID).classList.add(currentImageClassName);

        setTimeout(function () {
            document.getElementById(ELEMENT_ID).classList.add("fx");
        }, 3000);
    }

}(amplify, $));