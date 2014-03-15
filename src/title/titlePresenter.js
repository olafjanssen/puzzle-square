/**
 * Created by olafjanssen on 22/02/14.
 */

var TitlePresenter = (function (eventBus, $) {

    var TITLE_CONTAINER = "#title";
    var START_BUTTON = "#title-focus";

    eventBus.subscribe(Messages.SPLASH_PAGE_FINISHED, function () {

        $(START_BUTTON).on('touchend click', function () {
            $(TITLE_CONTAINER).fadeOut();
            eventBus.publish(Messages.NEXT_LEVEL_REQUESTED);
        });

    });

    eventBus.subscribe(Messages.OLD_GAME_CONTINUED, function () {
        $(TITLE_CONTAINER).fadeOut();
    });

    }(amplify, $));