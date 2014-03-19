/**
 * Created by olaf on 18/03/14.
 */


var ScorePresenter = (function (eventBus, commandBus, $) {

    var TOTAL_SCORE_ELEMENT;
    var scoreMultiplier = 0;
    var scoreNextCard = 0;
    var totalScore = 0;
    var gameScore = 0;

    // command handler

    commandBus.subscribe(Commands.GIVE_CARD_SCORE, function(data){
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

    eventBus.subscribe(GameMessages.CARD_DROP_REFUSED, function (data) {
        scoreNextCard = 0.5 * scoreNextCard;
    });

    eventBus.subscribe(GameMessages.SCORE_UPDATED, function (data) {
        totalScore = data.totalScore;
        gameScore = data.gameScore;
        scoreNextCard = scoreMultiplier;
        updateView();
    });

    eventBus.subscribe(UIMessages.USER_STORE_UPDATED, function (data) {
        totalScore = 0;
        for (var i = 0; i < data.length; i++) {
            totalScore += parseInt(data[i].payload.score);
        }
        updateView();
    });

    function updateView() {
        TOTAL_SCORE_ELEMENT.innerHTML = totalScore;
    }

}(amplify, amplify, $));