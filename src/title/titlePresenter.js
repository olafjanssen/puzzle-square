/**
 * Created by olafjanssen on 22/02/14.
 */

var TitlePresenter = (function (eventBus, $) {

    var TITLE_CONTAINER = "#title";
    var START_BUTTON = "#title-focus";

    eventBus.subscribe(UIMessages.SPLASH_PAGE_FINISHED, function () {

        $(START_BUTTON).on('touchend click', function () {
            $(TITLE_CONTAINER).fadeOut();
            eventBus.publish(UIMessages.NEXT_LEVEL_REQUESTED);
        });

    });

    eventBus.subscribe(UIMessages.OLD_GAME_CONTINUED, function () {
        $(TITLE_CONTAINER).fadeOut();
    });

    }(amplify, $));