/**
 * Created by olafjanssen on 22/02/14.
 */

var SplashPresenter = (function (eventBus) {

    var SPLASH_DELAY = 3000;

    setTimeout(function () {
        document.getElementById("splash").style.display = "none";

        eventBus.publish(Messages.SPLASH_PAGE_FINISHED);
    }, SPLASH_DELAY);

}(amplify));