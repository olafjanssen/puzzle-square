/*global define */

// Level Menu; shows the different levels a player has attained and gives the option to choose a level.
define(['jquery', 'amplify', 'amplify', 'messages', 'levels', 'state'], function ($, eventBus, commandBus, Messages, Levels, state) {
    'use strict';

    var lastId,
        isShown = false,
        subscription,
        scrollSubscription,
        rotations = [],
        i;

    for (i = 0; i < Levels.length; i += 1) {
        rotations.push(parseInt(Math.random() * 11, 10) - 5);
    }

    function show() {
        isShown = true;
        document.getElementById('level-menu').classList.add('show');
        if (!subscription) {
            clearTimeout(subscription);
        }
        subscription = setTimeout(function () {
            document.getElementById('level-menu').classList.add('fx');
        }, 100);
    }

    function hide() {
        isShown = false;
        document.getElementById('level-menu').classList.remove('fx');
        if (!subscription) {
            clearTimeout(subscription);
        }
        subscription = setTimeout(function () {
            document.getElementById('level-menu').classList.remove('show');
        }, 1000);
    }

    function renderLevelButton(level, index) {
        var button = document.createElement('button'),
            scoreLabel,
            indexLabel;
        button.classList.add(level.settings.imageClassName);
        button.style.webkitTransform = 'rotate(' + rotations[index] + 'deg)';
        button.id = 'level-button-' + level.id;
        if (state.completedLevels[level.id]) {
            scoreLabel = document.createElement('div');
            scoreLabel.innerHTML = state.completedLevels[level.id].score;
            scoreLabel.classList.add('score-label');
            button.appendChild(scoreLabel);
        } else {
            button.classList.add('not-completed');
        }

        button.addEventListener('touchend', function () {
            if (document.getElementById('level-menu-container').classList.contains('scrolling')) {
                return;
            }
            commandBus.publish(Messages.commands.START_NEW_GAME, level);
        });

        button.addEventListener('click', function () {
            if (document.getElementById('level-menu-container').classList.contains('scrolling')) {
                return;
            }
            commandBus.publish(Messages.commands.START_NEW_GAME, level);
        });

        // button content
        indexLabel = document.createElement('div');
        indexLabel.innerHTML = (index + 1);
        indexLabel.classList.add('index-label');
        button.appendChild(indexLabel);

        return button;
    }

    eventBus.subscribe(Messages.ui.UI_READY, function () {
        $('#total-score-label').on('click touchend', function () {
            if (isShown) {
                hide();
            } else {
                show();
            }
        });

        $('#level-menu-container').on('scroll', function () {
            document.getElementById('level-menu-container').classList.add('scrolling');
            clearTimeout(scrollSubscription);
            scrollSubscription = setTimeout(function () {
                document.getElementById('level-menu-container').classList.remove('scrolling');
            }, 500);
        });

    });

    eventBus.subscribe(Messages.game.NEW_GAME_STARTED, function (data) {
        lastId = data.id;

        hide();
    });

    eventBus.subscribe(Messages.ui.USER_STORE_UPDATED, function () {
        var container = document.getElementById('level-menu-container');
        container.innerHTML = '';

        for (i = 0; i < Levels.length; i += 1) {
            container.appendChild(renderLevelButton(Levels[i], i));
        }
    });

    eventBus.subscribe(Messages.game.GRID_IS_FILLED, function () {
        document.getElementById('level-menu-container').scrollTop =
            document.getElementById('level-button-' + lastId).offsetTop +
            document.getElementById('level-button-' + lastId).offsetHeight / 2 - window.innerHeight / 2;

        setTimeout(function () {
            show();
        }, 4000);
    });

});
