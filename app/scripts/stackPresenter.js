/**
 * Created by olafjanssen on 23/02/14.
 */

/*global define */

define(['amplify', 'messages'], function (eventBus, Messages) {
    'use strict';

    eventBus.subscribe(Messages.game.NEW_STACK_CREATED, function () {
        document.getElementById('stack').classList.remove('show');
        setTimeout(function () {
            document.getElementById('stack').classList.add('show');
        }, 1000);
    });

});