/**
 * Created by olafjanssen on 22/02/14.
 */

var SplashPresenter = (function (eventBus, $) {

    var SPLASH_DELAY = 3000;
    var SPLASH_IMAGE = "#splash-image";
    var SPLASH_CONTAINER = "#splash";

    eventBus.subscribe(Messages.UI_READY, function () {
        $(SPLASH_IMAGE).hide().fadeIn(500).delay(2000).fadeOut(500);
        $(SPLASH_CONTAINER).delay(SPLASH_DELAY).fadeOut(500, function () {
            eventBus.publish(Messages.SPLASH_PAGE_FINISHED);
        });
    });

}(amplify, $));