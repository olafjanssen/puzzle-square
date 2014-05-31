/*global require */

// start the app

require(['jquery', 'amplify', 'betwixtPresenter', 'dynamicBackground', 'gameFactory', 'gridController', 'gridView',
    'layout', 'levelManager', 'levelMenu', 'localStore', 'playableCard', 'scorePresenter', 'splashPresenter',
    'stackPresenter', 'stateManager', 'store', 'titlePresenter'], function ($, amplify, Messages) {

    'use strict';

    function stopScrolling(touchEvent) {
        var target = touchEvent.target;
        while (target && !target.hasAttribute('scrollable')) {
            target = target.parentElement;
        }
        if (target === null) {
            touchEvent.preventDefault();
        }
    }

    $(document).ready(function () {
        document.body.addEventListener('touchstart', stopScrolling, false);
        amplify.publish(Messages.ui.UI_READY);
    });

});