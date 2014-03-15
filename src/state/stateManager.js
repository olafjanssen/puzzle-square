/**
 * Created by olafjanssen on 3/12/14.
 */

var StateManager = (function (eventBus) {

    eventBus.subscribe(Messages.UI_READY, function (data) {

        // check hash for uid or create a new one and set the hash
        uid = window.location.hash.length > 0 ? window.location.hash.substr(1) : guid();
        window.location.hash = uid;

        window.state = uid;

    });

    function guid() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    };

}(amplify));
