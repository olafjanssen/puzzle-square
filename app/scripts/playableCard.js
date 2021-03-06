/**
 * Created by olafjanssen on 23/02/14.
 */

/*global define */

define(['amplify', 'amplify', 'messages', 'card'], function (eventBus, commandBus, Messages, Card) {
    'use strict';

    var playableCard;

    function getElement() {
        return document.getElementById('stack');
    }

    function onDropRefused() {
        setTimeout(function () {
            playableCard.classList.add('animate-dnd');
            playableCard.classList.remove('during-drag');
            playableCard.style.top = '';
            playableCard.style.left = '';
        }, 50);
    }

    function onNewPlayableCard(card) {
        // render the stack
        getElement().innerHTML = '';

        playableCard = Card.render(card);
        playableCard.id = 'playable-card';

        getElement().appendChild(playableCard);

        // touch handling
        playableCard.addEventListener('mousedown', function (event) {
            var offsetX = playableCard.offsetLeft - event.clientX,
                offsetY = playableCard.offsetTop - event.clientY,
                cardJiggleTimer,
                mouseMoveListener,
                mouseUpListener;


            playableCard.classList.remove('animate-dnd');
            playableCard.classList.add('during-drag');

            cardJiggleTimer = setTimeout(function () {
                playableCard.classList.add('animate-card');
            }, 500);

            mouseMoveListener = function (event) {
                playableCard.style.left = (offsetX + event.clientX) + 'px';
                playableCard.style.top = (offsetY + event.clientY) + 'px';
            };

            mouseUpListener = function (event) {
                var dropElement;

                // remove listeners
                playableCard.removeEventListener('mouseup', mouseUpListener);
                document.removeEventListener('mousemove', mouseMoveListener);

                // remove jiggle animation
                playableCard.classList.remove('animate-card');
                clearInterval(cardJiggleTimer);

                // find drop target
                getElement().style.display = 'none';
                dropElement = document.elementFromPoint(event.clientX, event.clientY);
                getElement().style.display = '';

                while (dropElement && !dropElement.hasAttribute('ondrop')) {
                    dropElement = dropElement.parentElement;
                }
                if (dropElement !== null) {
                    commandBus.publish(Messages.commands.ATTEMPT_CARD_DROP, {col: dropElement.getAttribute('col'), row: dropElement.getAttribute('row'), card: card});
                } else {
                    onDropRefused();
                }
            };
            document.addEventListener('mousemove', mouseMoveListener, false);
            playableCard.addEventListener('mouseup', mouseUpListener, false);
        }, false);

        playableCard.addEventListener('touchstart', function (event) {
            var offsetX = playableCard.offsetLeft - event.changedTouches[0].pageX,
                offsetY = playableCard.offsetTop - event.changedTouches[0].pageY;

            playableCard.classList.remove('animate-dnd');
            playableCard.classList.add('during-drag');
            playableCard.addEventListener('touchmove', function (event) {
                playableCard.style.left = (offsetX + event.changedTouches[0].pageX) + 'px';
                playableCard.style.top = (offsetY + event.changedTouches[0].pageY) + 'px';
            }, false);

            playableCard.addEventListener('touchend', function (event) {
                // find drop target
                getElement().style.display = 'none';
                var elem = document.elementFromPoint(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
                getElement().style.display = '';
                if (elem !== null && elem.hasAttribute('ondrop')) {
                    commandBus.publish(Messages.commands.ATTEMPT_CARD_DROP, {col: elem.getAttribute('col'), row: elem.getAttribute('row'), card: card});
                } else {
                    onDropRefused();
                }
            }, false);
        }, false);
    }

    eventBus.subscribe(Messages.game.NEW_PLAYABLE_CARD, function (data) {
        onNewPlayableCard(data);
    });

    eventBus.subscribe(Messages.game.CARD_DROP_REFUSED, function () {
        onDropRefused();
    });

    eventBus.subscribe(Messages.game.CARD_DROPPED, function () {
        getElement().innerHTML = '';
    });

});