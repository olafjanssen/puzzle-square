/**
 * Created by olafjanssen on 22/02/14.
 */

var TitlePresenter = (function (eventBus, $) {

    var TITLE_CONTAINER = "#title";
    var START_BUTTON = "#title-focus";

    eventBus.subscribe(Messages.SPLASH_PAGE_FINISHED, function () {

        $(START_BUTTON).click(function(){
            $(TITLE_CONTAINER).fadeOut();
        });

    });

}(amplify, $));