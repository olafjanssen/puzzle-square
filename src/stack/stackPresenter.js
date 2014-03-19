/**
 * Created by olafjanssen on 23/02/14.
 */

var StackPresenter = (function (eventBus) {

    var stack = [];

    eventBus.subscribe(Messages.NEW_STACK_CREATED, function (data) {
        document.getElementById("stack").classList.remove("show");
        setTimeout(function () {
            document.getElementById("stack").classList.add("show");
        }, 1000);
    });

}(amplify));