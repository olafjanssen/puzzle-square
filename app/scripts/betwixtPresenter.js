/**
 * Created by Olaf Janssen on 3/10/14.
 */

/*global define */

define(['jquery', 'amplify', 'messages'], function ($, eventBus, Messages) {
    'use strict';

    var ELEMENT_ID = 'betwixt',
        BUTTON_ELEMENT_ID = 'next-focus';

    function updateLayout() {
        var currentSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth,
            fontSize = currentSize / 800;
        $('#' + ELEMENT_ID).css({fontSize: fontSize + 'em'});
    }

    eventBus.subscribe(Messages.game.NEW_GAME_STARTED, function () {
        document.getElementById(ELEMENT_ID).classList.remove('show');
        document.getElementById(ELEMENT_ID).classList.remove('fx');
    });

    eventBus.subscribe(Messages.ui.UI_READY, function () {
        updateLayout();
        window.addEventListener('resize', function () {
            updateLayout();
        });

        $('#' + BUTTON_ELEMENT_ID).on('touchend click', function () {
            eventBus.publish(Messages.ui.NEXT_LEVEL_REQUESTED);
        });
    });

});