/*global require */


//    // global (bad) shuffling method
//    function shuffle(o) { //v1.0
//        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {
//        }
//        return o;
//    }
//
//    function guid() {
//        var d = new Date().getTime();
//        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//            var r = (d + Math.random() * 16) % 16 | 0;
//            d = Math.floor(d / 16);
//            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
//        });
//        return uuid;
//    }
//    ;
//
//    function addOver(element) {
//        if (Modernizr.touch) {
//            element.addEventListener('touchstart', function () {
//                element.classList.add('onover')
//            }, false);
//            element.addEventListener('touchend', function () {
//                element.classList.remove('onover')
//            }, false);
//        } else {
//            element.addEventListener('mouseover', function () {
//                element.classList.add('onover')
//            }, false);
//            element.addEventListener('mouseout', function () {
//                element.classList.remove('onover')
//            }, false);
//        }
//    }
//
//}());

// start the app

require(['jquery', 'amplify', 'messages', 'dynamicBackground', 'splashPresenter', 'titlePresenter', 'playableCard', 'stackPresenter'], function ($, amplify, Messages) {
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