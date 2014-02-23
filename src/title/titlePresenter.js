/**
 * Created by olafjanssen on 22/02/14.
 */


var TitlePresenter = (function (eventBus) {

    eventBus.subscribe(Messages.SPLASH_PAGE_FINISHED, function () {
        setVisibility(true);

        if (Modernizr.touch) {
            document.getElementById("title-focus").addEventListener("touchstart", function () {
                setVisibility(false)
            }, false);
        } else {
            document.getElementById("title-focus").addEventListener("mouseup", function () {
                setVisibility(false)
            }, false);
        }
    });

    function setVisibility(isVisible) {
        if (isVisible) {
            document.body.classList.add("show-title");
        } else {
            document.body.classList.remove("show-title");
        }
    }

}(amplify));