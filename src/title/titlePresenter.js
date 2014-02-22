/**
 * Created by olafjanssen on 22/02/14.
 */


var TitlePresenter = (function (eventBus) {

    eventBus.subscribe(Messages.SPLASH_PAGE_FINISHED, function(){
        setVisibility(true);
    });

    function setVisibility(isVisible){
        if (isVisible){
            document.body.classList.add("show-title");
        } else {
            document.body.classList.remove("show-title");
        }
    }

}(amplify));