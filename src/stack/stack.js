/**
 * Created by olafjanssen on 23/02/14.
 */

var Stack = (function (eventBus) {

    var stack = [];

    eventBus.subscribe(Messages.NEW_STACK_CREATED, function (data) {
        initStack(data);
    });

    eventBus.subscribe(Messages.CARD_DROPPED, function (data) {
        removeCard(data.card);

        if (stack.length > 0) {
            eventBus.publish(Messages.NEW_PLAYABLE_CARD, stack[0]);
        }
    });

    eventBus.subscribe(Messages.NEW_CARD_NOT_IN_GRID, function (data) {
        removeCard(data);

        if (stack.length > 0) {
            eventBus.publish(Messages.NEW_PLAYABLE_CARD, stack[0]);
        }
    });

    function initStack(deck) {
        stack = deck.concat();
    }

    function removeCard(card) {
        stack.splice(stack.indexOf(card), 1);
        console.log(stack.length + " " + card.render().outerHTML);
    }

}(amplify));