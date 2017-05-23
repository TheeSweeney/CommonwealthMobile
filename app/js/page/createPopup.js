import $ from "jquery";
import calculatePopupOffsets from "../utils/calculatePopupOffsets.js";


$.extend( $.easing, {
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	}
});


/**
 * creates a popup and injects it in to the document.
 * @param  {String} title : title of the popup, optional
 * @param  {String} html : content of the popup as html
 * @param  {Number} top  : top position relative to the document
 * @param  {Number} left : left position relative to the document
 * @param  {Number} offset : a vertical or horizonal distance from the top/left the triangle should point
 *                           depending on if the triangle is top/bottom or left/right
 * @param  {String} container : a selector of the container in which to inject the popup
 * @param  {String} triangle : "top", "right", "bottom", or "left"
 * @param  {Boolean} flipToContain: will flip the popup if it goes outside the parent container
 * @param  {Boolean} closeBtn : if the X should be shown.  If not, the popup with not have pointer events
 *                              this is useful for popups on hover that shouldn't fire mouseenter/leave
 * @param  {Boolean} isHidden: Whether or not the popup is visible.
 * @return {Object} {
 *     {Function} hidePopup   : will set isHidden to true
 *     {Function} removePopup : will remove the popup from the DOM),
 *     {Function} setState : pass an object with any keys from above to update the popup.
 * }
 */
export default function createPopup(initialState) {

    // defaults, and this object will hold the previous state after setState
    let prevState = {
        title     : "",
        html      : "",
        top       : 0,
        left      : 0,
        width     : "",
        offset    : 0,
        container : "body",
        triangle  : "bottom",
        closeBtn  : true,
        isHidden  : false,
        flipToContain: false
    };

    let state = Object.assign({}, prevState, initialState);


    function setState(newState){

        // copy the old state into prevState
        prevState = Object.assign({}, state);

        Object.assign(state, newState);

        // console.log(state);

        render();
    }

    // initialize popup
    // always start hidden so it can animate in
    const $popup = $("<div class='popup'>")
        .css({
            "opacity": 0,
            "width": state.width,
            "transform": "scale(0.89)",
            "pointer-events": (state.closeBtn) ? "auto" : "none"
        });
    const $titleDiv    = $("<div>").addClass("popup__title");
    const $triangleDiv = $("<div>").addClass("popup__triangle");
    const $content     = $("<div>").addClass("popup__content");

    // attach the close button if we're supposed to
    if (state.closeBtn){
        const $xDiv = $("<div>").addClass("popup__x-icon")
            .html("<svg class='svg-x'> <use xlink:href='img/svg-sprite.svg#x'></use> </svg>")
            .on("click", removePopup);
        $popup.append($xDiv);


        window.addEventListener("click", handleClickAway, true);
        window.addEventListener("touchstart", handleClickAway, true);
        window.addEventListener("resize", handleClickAway, true);
        window.addEventListener("keyup", escListener, true);
    }

    $popup.append($titleDiv);
    $popup.append($triangleDiv);
    $popup.append($content);

    $(state.container).append($popup);



    // if the user clicked outside of the popup, close it
    function handleClickAway(e) {
        const inPopup = $(e.target).closest(".popup").length;
        if (!inPopup){ removePopup(); }
    }

    function escListener(e){
        if((e.which || e.charCode || e.keyCode) === 27){
            removePopup();
        }
    }

    function hidePopup(){

        window.removeEventListener("click", handleClickAway, true);
        window.removeEventListener("touchstart", handleClickAway, true);
        window.removeEventListener("resize", handleClickAway, true);
        window.removeEventListener("keyup", escListener, true);

        // only re-render if we need to
        if (state.isHidden !== true){
            // will kick of the transition
            setState({
                isHidden: true
            });
        }
    }

    function removePopup(){

        // first close it
        hidePopup();

        // when the transition finishes, remove the popup from the DOM
        $popup.on("transitionend", () => {
            $popup.remove();
        });
    }

    // render the first time
    render();

    function render(){

        const { top, left, offset, triangle, isHidden, html, title, flipToContain } = state;


        // update the content before calculating the offsets
        $content.html(html);
        $titleDiv.html(title);


        const offsets = calculatePopupOffsets({
            popup: $popup.get(0),
            triangleSize: $triangleDiv.outerHeight(),
            top, left, offset, triangle, flipToContain
        });

        // if the popup was hidden, we want to place it where it needs to be
        // the update will fade it in
        // enter - put it in place before transitioning in
        if (prevState.isHidden && !isHidden){
            $popup.css({
                "top" : `${offsets.popupTop}px`,
                "left": `${offsets.popupLeft}px`
            });
        }

        $popup
            // .stop().animate({
            .css({
                opacity: (isHidden) ? 0 : 1,
                transform: (isHidden) ? "scale(0.9)" : "scale(1)",
                top: offsets.popupTop,
                left: offsets.popupLeft,
                width: state.width
            }, 250, "easeInOutCubic")
            .removeClass(function(index, css){
                return (css.match(/\bis-triangle-\S+/g) || []).join(" ");
            })
            .addClass(`is-triangle-${offsets.triangleSide}`)
            .toggleClass("popup--hidden", isHidden);


        // adjust the triangle
        $triangleDiv.css({
            "transform": (offsets.triangleSide === "top" || offsets.triangleSide === "bottom")
                ? `translateX(${offsets.triangleOffset}px)` // top/bottom
                : `translateY(${offsets.triangleOffset}px)` // left/right
        });


        $popup.toggleClass("no-title", !title);

    }

    // external api
    return {
        setState,
        hidePopup,
        removePopup
    };

}
