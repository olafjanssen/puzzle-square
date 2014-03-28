/**
 * Created by olafjanssen on 3/10/14.
 */

(function (eventBus, $) {
    "use strict";

    var ELEMENT_ID = "betwixt",
        IMAGE_ELEMENT_ID = "win-image",
        BUTTON_ELEMENT_ID = "next-focus",
        currentImageClassName;

    eventBus.subscribe(GameMessages.NEW_GAME_STARTED, function (data) {
        document.getElementById(ELEMENT_ID).classList.remove("show");
        document.getElementById(ELEMENT_ID).classList.remove("fx");
        currentImageClassName = data.settings.imageClassName;
    });

    eventBus.subscribe(UIMessages.UI_READY, function () {
        updateLayout();
        window.addEventListener("resize", function () {
            updateLayout();
        });

        $("#" + BUTTON_ELEMENT_ID).on('touchend click', function () {
            eventBus.publish(UIMessages.NEXT_LEVEL_REQUESTED);
        });
    });

    function updateLayout() {
        var currentSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth,
            fontSize = currentSize / 800;
        $("#" + ELEMENT_ID).css({fontSize: fontSize + "em"});
    }

}(amplify, $));