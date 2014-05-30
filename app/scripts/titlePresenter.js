/**
 * Created by Olaf Janssen on 22/02/14.
 */

/*global define */

define(['jquery', 'amplify', 'messages'], function ($, eventBus, Messages) {
    'use strict';

    var TITLE_CONTAINER = '#title',
        START_BUTTON = '#title-focus';

    eventBus.subscribe(Messages.ui.SPLASH_PAGE_FINISHED, function () {

        $(START_BUTTON).on('touchend click', function () {
            $(TITLE_CONTAINER).fadeOut();
            eventBus.publish(Messages.ui.NEXT_LEVEL_REQUESTED);
        });

    });

    eventBus.subscribe(Messages.ui.OLD_GAME_CONTINUED, function () {
        $(TITLE_CONTAINER).fadeOut();
    });

});