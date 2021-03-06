/**
 * Created by olafjanssen on 3/12/14.
 */

/*global define */

define(['amplify', 'amplify', 'messages', 'guid'], function (eventBus, storage, Messages, guid) {
    'use strict';

    eventBus.subscribe(Messages.ui.UI_READY, function () {
        // check hash for uid or create a new one and set the hash
        var uid = window.location.hash.length > 0 ? window.location.hash.substr(1) : guid();
        window.location.hash = uid;

        // validate the uid with the one in the local storage
        if (storage.store('uid') !== uid) {
            eventBus.publish(Messages.ui.UID_INVALIDATED, {uid: uid});
            storage.store('uid', uid);
        }
    });

});
