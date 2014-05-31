/**
 * Created by olaf on 18/03/14.
 */

/*global define */

define(['amplify', 'amplify', 'messages'], function (eventBus, commandBus, Messages) {
    'use strict';

    var TOTAL_SCORE_ELEMENT,
        scoreMultiplier = 0,
        scoreNextCard = 0,
        totalScore = 0,
        gameScore = 0;

    function updateView() {
        TOTAL_SCORE_ELEMENT.innerHTML = totalScore;
    }

    // command handler

    commandBus.subscribe(Messages.commands.GIVE_CARD_SCORE, function () {
        var delta = Math.round(scoreNextCard);
        eventBus.publish(Messages.game.SCORE_UPDATED, {gameScore: gameScore + delta, totalScore: totalScore + delta, delta: delta});
    });

    // message handler

    eventBus.subscribe(Messages.ui.UI_READY, function () {
        TOTAL_SCORE_ELEMENT = document.getElementById('total-score-label');
    });

    eventBus.subscribe(Messages.game.NEW_GAME_STARTED, function (data) {
        scoreMultiplier = data.settings.scoreMultiplier;
        scoreNextCard = scoreMultiplier;
        gameScore = 0;
        updateView();
    });

    eventBus.subscribe(Messages.game.CARD_DROP_REFUSED, function () {
        scoreNextCard = 0.5 * scoreNextCard;
    });

    eventBus.subscribe(Messages.game.SCORE_UPDATED, function (data) {
        totalScore = data.totalScore;
        gameScore = data.gameScore;
        scoreNextCard = scoreMultiplier;
        updateView();
    });

    eventBus.subscribe(Messages.ui.USER_STORE_UPDATED, function (data) {
        var i;
        totalScore = 0;
        for (i = 0; i < data.length; i += 1) {
            totalScore += parseInt(data[i].payload.score, 10);
        }
        updateView();
    });

});