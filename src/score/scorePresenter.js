/**
 * Created by olaf on 18/03/14.
 */


var ScorePresenter = (function (eventBus, $) {

    var TOTAL_SCORE_ELEMENT;
    var scoreMultiplier = 0;
    var scoreNextCard = 0;
    var totalScore = 0;
    var gameScore = 0;

    eventBus.subscribe(Messages.UI_READY, function(){
       TOTAL_SCORE_ELEMENT = document.getElementById("total-score-label");
    });

    eventBus.subscribe(Messages.NEW_GAME_STARTED, function (data) {
        scoreMultiplier = data.settings.scoreMultiplier;
        scoreNextCard = scoreMultiplier;
        gameScore = 0;
    });

    eventBus.subscribe(Messages.CARD_DROP_REFUSED, function (data) {
        scoreNextCard *= 0.5 * scoreMultiplier;
    });

    eventBus.subscribe(Messages.CARD_DROPPED, function (data) {
        var delta = Math.round(scoreNextCard);
        totalScore += delta;
        gameScore += delta;
        scoreNextCard = scoreMultiplier;
        TOTAL_SCORE_ELEMENT.innerHTML = totalScore;
        eventBus.publish(Messages.SCORE_UPDATED, {gameScore: gameScore, totalScore: totalScore, delta: delta});
    });

    eventBus.subscribe(Messages.USER_STORE_UPDATED, function (data) {
        totalScore = 0;
        var completedLevels = data.completedLevels;
        for (var i = 0; i < completedLevels.length; i++) {
            totalScore += completedLevels[i].score;
        }
    });

}(amplify, $));