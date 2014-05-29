/**
 * Created by olafjanssen on 23/02/14.
 */

(function (eventBus) {

    eventBus.subscribe(GameMessages.NEW_STACK_CREATED, function () {
        document.getElementById("stack").classList.remove("show");
        setTimeout(function () {
            document.getElementById("stack").classList.add("show");
        }, 1000);
    });

}(amplify));