/**
 * Created by Olaf Janssen on 20/03/14.
 */

/*global define */

define(['amplify', 'messages'], function (eventBus, Messages) {
    'use strict';

    var levels = 3,
        itemsPerLevel = [10, 10, 10],
        sizePerLevel = [10, 5, 3],
        shiftMultiplier = 0.05,

        element;

    function updateLevelShift(offsetX, offsetY) {
        var level, container;
        for (level = 0; level < levels; level += 1) {
            container = document.getElementById('bg-level-' + level);
            container.style.left = -offsetX / (level + 1) * shiftMultiplier + 'px';
            container.style.top = -offsetY / (level + 1) * shiftMultiplier + 'px';
        }
    }

    eventBus.subscribe(Messages.ui.UI_READY, function () {
        var level, container, item, disc;

        element = document.getElementById('dynamic-background');

        for (level = 0; level < levels; level += 1) {
            container = document.createElement('div');
            container.classList.add('level');
            container.id = 'bg-level-' + level;

            for (item = 0; item < itemsPerLevel[level]; item += 1) {
                disc = document.createElement('div');
                disc.classList.add('disc');
                disc.style.width = sizePerLevel[level] + 'em';
                disc.style.height = sizePerLevel[level] + 'em';
                disc.style.left = (Math.random() * 150 - 25) + '%';
                disc.style.top = (Math.random() * 150 - 25) + '%';
                container.appendChild(disc);
            }

            element.appendChild(container);
        }

        setInterval(function () {
            var card = document.getElementById('playable-card');
            if (card) {
                updateLevelShift(card.offsetLeft, card.offsetTop);
            }
        }, 10);

    });

});


