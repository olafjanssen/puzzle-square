/**
 * Created by olaf on 18/03/14.
 */

(function (eventBus, commandBus) {

    var TOTAL_SCORE_ELEMENT,
        scoreMultiplier = 0,
        scoreNextCard = 0,
        totalScore = 0,
        gameScore = 0;

    // command handler

    commandBus.subscribe(Commands.GIVE_CARD_SCORE, function () {
        var delta = Math.round(scoreNextCard);
        eventBus.publish(GameMessages.SCORE_UPDATED, {gameScore: gameScore + delta, totalScore: totalScore + delta, delta: delta});
    });

    // message handler

    eventBus.subscribe(UIMessages.UI_READY, function () {
        TOTAL_SCORE_ELEMENT = document.getElementById("total-score-label");
    });

    eventBus.subscribe(GameMessages.NEW_GAME_STARTED, function (data) {
        scoreMultiplier = data.settings.scoreMultiplier;
        scoreNextCard = scoreMultiplier;
        gameScore = 0;
        updateView();
    });

    eventBus.subscribe(GameMessages.CARD_DROP_REFUSED, function () {
        scoreNextCard = 0.5 * scoreNextCard;
    });

    eventBus.subscribe(GameMessages.SCORE_UPDATED, function (data) {
        totalScore = data.totalScore;
        gameScore = data.gameScore;
        scoreNextCard = scoreMultiplier;
        updateView();
    });

    eventBus.subscribe(UIMessages.USER_STORE_UPDATED, function (data) {
        var i;
        totalScore = 0;
        for (i = 0; i < data.length; i += 1) {
            totalScore += parseInt(data[i].payload.score, 10);
        }
        updateView();
    });

    function updateView() {
        TOTAL_SCORE_ELEMENT.innerHTML = totalScore;
    }

}(amplify, amplify));