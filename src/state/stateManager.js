/**
 * Created by olafjanssen on 3/12/14.
 */

(function (eventBus, storage) {

    eventBus.subscribe(UIMessages.UI_READY, function () {

        // check hash for uid or create a new one and set the hash
        var uid = window.location.hash.length > 0 ? window.location.hash.substr(1) : guid();
        window.location.hash = uid;

        // validate the uid with the one in the local storage
        if (storage.store("uid") !== uid) {
            eventBus.publish(UIMessages.UID_INVALIDATED, {uid: uid});
            storage.store("uid", uid);
        }
    });

}(amplify, amplify));
