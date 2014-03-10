/**
 * Created by olafjanssen on 3/10/14.
 */

var BetwixtPresenter = (function (eventBus, $) {

    var ELEMENT_ID = "betwixt";
    var IMAGE_ELEMENT_ID = "win-image";
    var BUTTON_ELEMENT_ID = "next-focus";

    var currentImageClassName;

    eventBus.subscribe(Messages.NEW_GAME_STARTED, function(data) {
        document.getElementById(ELEMENT_ID).classList.remove("show");
        currentImageClassName = data.imageClassName;
    })

    eventBus.subscribe(Messages.GRID_IS_FILLED, function (data) {
        onGridFilled();
    });

    function onGridFilled() {
        document.getElementById(ELEMENT_ID).classList.add("show");
        document.getElementById(IMAGE_ELEMENT_ID).classList.add(currentImageClassName);

        setTimeout(function () {
            document.getElementById(ELEMENT_ID).classList.add("fx");
        }, 4000);
    }

}(amplify, $));