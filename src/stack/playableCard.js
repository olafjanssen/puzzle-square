/**
 * Created by olafjanssen on 23/02/14.
 */

var PlayableCard = (function (eventBus) {

    var playableCard;
    var cardJiggleTimer;

    eventBus.subscribe(Messages.NEW_PLAYABLE_CARD, function (data) {
        onNewPlayableCard(data);
    });

    eventBus.subscribe(Messages.CARD_DROP_REFUSED, function (data) {
        onDropRefused();
    });

    function getElement() {
        return document.getElementById("stack");
    }

    function onDropRefused() {
        setTimeout(function () {
            playableCard.classList.add("animate-dnd");
            playableCard.classList.remove("during-drag");
            playableCard.style.top = "";
            playableCard.style.left = "";
        }, 50)
    }

    function onNewPlayableCard(card) {
        // render the stack
        getElement().innerHTML = "";

        playableCard = card.render();

        getElement().appendChild(playableCard);

        // touch handling
        playableCard.addEventListener('mousedown', function (event) {
            var offsetX = playableCard.offsetLeft - event.clientX;
            var offsetY = playableCard.offsetTop - event.clientY;
            playableCard.classList.remove("animate-dnd");
            playableCard.classList.add("during-drag");

            var cardJiggleTimer = setTimeout(function () {
                playableCard.classList.add("animate-card");
            }, 500);

            var mouseMoveListener = function (event) {
                playableCard.style.left = (offsetX + event.clientX) + "px";
                playableCard.style.top = (offsetY + event.clientY) + "px";
            };
            var mouseUpListener = function (event) {
                // remove listeners
                playableCard.removeEventListener("mouseup", mouseUpListener);
                document.removeEventListener("mousemove", mouseMoveListener);

                // remove jiggle animation
                playableCard.classList.remove("animate-card");
                clearInterval(cardJiggleTimer);

                // find drop target
                getElement().style.display = "none";
                var elem = document.elementFromPoint(event.clientX, event.clientY);
                getElement().style.display = "";

                if (elem !== null && elem.hasAttribute("ondrop")) {
                    eventBus.publish(Messages.CARD_DROP_ATTEMPTED, {col: elem.getAttribute("col"), row: elem.getAttribute("row"), card: card});
                } else {
                    onDropRefused();
                }
            };
            document.addEventListener('mousemove', mouseMoveListener, false);
            playableCard.addEventListener('mouseup', mouseUpListener, false);
        }, false);

        playableCard.addEventListener('touchstart', function (event) {
            var offsetX = playableCard.offsetLeft - event.changedTouches[0].pageX;
            var offsetY = playableCard.offsetTop - event.changedTouches[0].pageY;
            playableCard.classList.remove("animate-dnd");
            playableCard.classList.add("during-drag");
            playableCard.addEventListener('touchmove', function (event) {
                playableCard.style.left = (offsetX + event.changedTouches[0].pageX) + "px";
                playableCard.style.top = (offsetY + event.changedTouches[0].pageY) + "px";
            }, false);

            playableCard.addEventListener('touchend', function (event) {
                // find drop target
                getElement().style.display = "none";
                var elem = document.elementFromPoint(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
                getElement().style.display = "";
                if (elem !== null && elem.hasAttribute("ondrop")) {
                    eventBus.publish(Messages.CARD_DROP_ATTEMPTED, {col: elem.getAttribute("col"), row: elem.getAttribute("row"), card: card});
                } else {
                    onDropRefused();
                }
            }, false);
        }, false);
    }

}(amplify));