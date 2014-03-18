/**
 * Created by olaf on 18/03/14.
 */


var ScorePresenter = (function (eventBus, $) {

    var TOTAL_SCORE_ELEMENT;
    var scoreMultiplier = 0;
    var scoreNextCard = 0;
    var totalScore = 0;
    var gameScore = 0;

    eventBus.subscribe(Messages.UI_READY, function () {
        TOTAL_SCORE_ELEMENT = document.getElementById("total-score-label");
    });

    eventBus.subscribe(Messages.NEW_GRID_NEEDED, function (data) {
        scoreMultiplier = 0;
        scoreNextCard = scoreMultiplier;
        gameScore = 0;
        updateView();
    });

    eventBus.subscribe(Messages.NEW_SCORE_MULTIPLIER, function (data) {
        scoreMultiplier = data;
        scoreNextCard = scoreMultiplier;
    });

    eventBus.subscribe(Messages.CARD_DROP_REFUSED, function (data) {
        scoreNextCard = 0.5 * scoreNextCard;
    });

    eventBus.subscribe(Messages.CARD_DROPPED, function (data) {
        if (scoreNextCard == 0) {
            return
        }
        var delta = Math.round(scoreNextCard);
        totalScore += delta;
        gameScore += delta;
        scoreNextCard = scoreMultiplier;
        updateView();

        eventBus.publish(Messages.SCORE_UPDATED, {gameScore: gameScore, totalScore: totalScore, delta: delta});
    });

    eventBus.subscribe(Messages.USER_STORE_UPDATED, function (data) {
        totalScore = 0;
        for (var i = 0; i < data.length; i++) {
            totalScore += parseInt(data[i].payload.score);
        }
        updateView();
    });

    function updateView() {
        TOTAL_SCORE_ELEMENT.innerHTML = totalScore;
    }

}(amplify, $));