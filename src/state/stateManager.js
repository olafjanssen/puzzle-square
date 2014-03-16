/**
 * Created by olafjanssen on 3/12/14.
 */

var StateManager = (function (eventBus, storage) {

    eventBus.subscribe(Messages.UI_READY, function (data) {

        // check hash for uid or create a new one and set the hash
        uid = window.location.hash.length > 0 ? window.location.hash.substr(1) : guid();
        window.location.hash = uid;

        // validate the uid with the one in the local storage
        if (storage.store("uid") != uid){
            eventBus.publish(Messages.UID_INVALIDATED, {uid: uid});
            storage.store("uid", uid);
        }
    });

}(amplify, amplify));
