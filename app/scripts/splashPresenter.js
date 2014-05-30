/**
 * Created by olafjanssen on 22/02/14.
 */

/*global define */

define(['jquery', 'amplify', 'messages'], function ($, eventBus, Messages) {
    'use strict';

    var SPLASH_DELAY = 3000,
        SPLASH_IMAGE = '#splash-image',
        SPLASH_CONTAINER = '#splash';

    eventBus.subscribe(Messages.ui.UI_READY, function () {
        $(SPLASH_IMAGE).hide().fadeIn(500).delay(2000).fadeOut(500);
        $(SPLASH_CONTAINER).delay(SPLASH_DELAY).fadeOut(500, function () {
            eventBus.publish(Messages.ui.SPLASH_PAGE_FINISHED);
        });
    });

    eventBus.subscribe(Messages.ui.OLD_GAME_CONTINUED, function () {
        $(SPLASH_IMAGE).hide();
    });

});