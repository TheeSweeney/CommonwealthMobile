import $ from "jquery";

/**
 * create a model with of the given html
 * @param  {String} html: html to be put in the popup
 * @param  {Number} aspectRatio: a number of width/height.  eg. .75 would be 3/4
 * @return {Object} {
 *     {Function} removeModal: close the modal
 * }
 */
export default function createModal({html = "", aspectRatio}) {

    const $background = $("<div>").addClass("modal-background")
        .on("click", removeModal);

    const $popup = $("<div>").addClass("modal-popup")
        // prevent background click from firing
        .on("click", (e) => e.stopPropagation());

    const $xDiv = $("<div>").addClass("modal-popup__close")
        .html("<svg class='svg-x'> <use xlink:href='img/svg-sprite.svg#x'></use> </svg>")
        .on("click", removeModal);

    const $html = $("<div>").addClass("modal-html");

    $popup.append($xDiv)
        .append($html);

    $background.append($popup);
    $("body").append($background);

    // re-render on resize so we can do the aspect ratio calculations again
    $(window).on("resize", render);

    // close the model when esc is pressed
    $(document).on("keyup", handleKeyPress);
    function handleKeyPress(e) {
        if ((e.which || e.charCode || e.keyCode) === 27){
            removeModal();
        }
    }

    // render the first time
    render();


    // render the html and position the popup
    function render(){

        // reset some stuff
        $background.addClass("is-hidden");
        $popup.height("auto");
        $popup.width("auto");

        // populate the html
        $html.html(html.html());


        // adjust the aspect ratio and fade in
        function finish(){
            const width = $popup.outerWidth();
            const height = $popup.outerHeight();

            // adjust the popup to be be 4:3 aspect ratio
            if (typeof(aspectRatio) === "number"){
                if (height > width * aspectRatio){
                    $popup.height(width * aspectRatio);
                    $popup.width(width);
                }
                else {
                    $popup.height(height);
                    $popup.width(height * (1/aspectRatio));
                }
            }

            $background.removeClass("is-hidden");
        }

        // wait for the image to load to measure if needed
        // otherwise, the width/height measurements won't be accurate.
        const images = $html.find("img");
        if (images.length){
            images.on("load", finish);
        }
        else {
            finish();
        }

    }

    // remove the modal and clean up event listeners
    function removeModal() {

        $background.addClass("is-hidden");

        // when the transition finishes, remove the popup from the DOM
        $background.on("transitionend", () => {
            $background.remove();
        });
        $(document).off("keyup", handleKeyPress);
        $(window).off("resize", removeModal);
    }


    // external api
    return {
        removeModal
    };

}
