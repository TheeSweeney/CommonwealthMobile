/**
 * if this popup is outside of it's parent, nudge it back in
 * @param  {element} popup: DOM elmenet of the popup to be placed
 * @param  {number} top: The top coordinate of where the popup should point
 * @param  {number} left: The left coordinate of where the popup should point
 * @param  {number} offset: an offet to be added to top/bottom or left/right
 * @param  {string} triangle: "top", "right", "bottom", or "left"
 * @param  {number} triangleSize: used to calculate the position
 * @param  {boolean} flipToContain: will flip the popup if it goes outside the parent container
 * @return {object} {
 *     realTop       : with no offset adjustment, the popup should go here, based on triangleSide
 *     realLeft      : ^^
 *     popupTop      : with adjustment when the popup butts up agains the parent
 *     popupLeft     : ^^
 *     overflow      : "top", "right", "bottom", "left".  Positive numbers are overflows
 *     triangleOffset: Amount the triangle needs to move to be on the dot, relative from 50%
 *     triangleSide  : Will be the same as passed in triangle, unless it fliped via flipToContain
 * }
 * use popupTop, popupLeft, and triangleOffset to position the popup
 */
function calculatePopupOffsets({popup, top, left, offset = 0, triangle = "bottom", triangleSize, flipToContain = false}){


    // make a copy of this
    let triangleSide = triangle;

    // get the width and height of this popup from the DOM
    const width = popup.offsetWidth;
    const height = popup.offsetHeight;

    // get the width/height of the parent container div
    const parent = popup.parentNode;
    const parentWidth = parent.clientWidth;
    const parentHeight = parent.offsetHeight; // client height of body will only be the viewport height

    // common calculations
    const popupOnTop = top - height - triangleSize + offset;
    const popupOnBottom = top + triangleSize - offset;
    const popupOnLeft = left - width - triangleSize + offset;
    const popupOnRight = left + triangleSize - offset;

    // calculate where the top of the popup should be based on top/left
    const realTop = (triangleSide === "bottom") ? popupOnTop
                  : (triangleSide === "top")    ? popupOnBottom
                  : top - height/2; //  left or right

    const realLeft = (triangleSide === "right") ? popupOnLeft
                   : (triangleSide === "left")  ? popupOnRight
                   : left - (width/2); // center

    // the amounts that this popup is outside of it's parent.
    const overflow = {
        top: -realTop,
        right: -(parentWidth - (realLeft + width)),
        bottom: -(parentHeight - (realTop + height)),
        left: -realLeft
    };




    // calculate where the popup should go
    // start with popupLeft as realLeft before nudging
    let popupTop = realTop;
    let popupLeft = realLeft;
    let triangleOffset = 0;


    // if there is an overflow on the right, adjust the popup and triangle position
    if (overflow.right > 0){
        if (triangleSide === "top" || triangleSide === "bottom"){
            popupLeft = realLeft - overflow.right;
            triangleOffset = overflow.right;
        }

        // for left, flip the popup
        if (triangleSide === "left" && flipToContain){
            triangleSide = "right";
            popupLeft = popupOnLeft;
        }
    }

    // if there is an overflow on the left, adjust the popup and triangle position
    if (overflow.left > 0){
        if (triangleSide === "top" || triangleSide === "bottom"){
            popupLeft = realLeft + overflow.left;
            triangleOffset = -overflow.left;
        }

        // for right, flip the popup
        if (triangleSide === "right" && flipToContain){
            triangleSide = "left";
            popupLeft = popupOnRight;
        }
    }

    // if there is an overflow on the bottom
    if (overflow.bottom > 0){
        // for left/right, butt the popup against the bottom
        if (triangleSide === "left" || triangleSide === "right") {
            popupTop = realTop - overflow.bottom;
            triangleOffset = overflow.bottom;
        }
        // for top, flip the popup
        if (triangleSide === "top" && flipToContain){
            triangleSide = "bottom";
            popupTop = popupOnTop;
        }
    }

    // if there is an overflow on the top
    if (overflow.top > 0){

        if (triangleSide === "left" || triangleSide === "right") {
            popupTop = realTop + overflow.top;
            triangleOffset = -overflow.top;
        }

        // for bottom, flip the popup
        if (triangleSide === "bottom" && flipToContain){
            triangleSide = "top";
            popupTop = popupOnBottom;
        }
    }

    // return all the measurements
    return {
        realTop, realLeft, popupTop, popupLeft, overflow, triangleOffset, triangleSide
    };

}

export default calculatePopupOffsets;
