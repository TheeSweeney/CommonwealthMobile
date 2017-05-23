import Kefir from "kefir";
import $ from "jquery";
import { createPositionStream, toPropertyFromResize } from "./common.js";
import { measureNav } from "./initNav.js";
import createKefirEmitter from "./Kefir.emitter.js";

// distance from the top to push the viz down
const STICKY_PADDING = 10;

// **NOTE** this should match the percentage in viz-section.scss
const VIZ_WIDTH = 0.6;

// true/false if this viz is sticky
const isSticky$ = createKefirEmitter();

// calculate the space from the sticky nav to the bottom of the viewport
export const maxVizHeight$ = toPropertyFromResize(measureNav)
    .map((navHeight) => window.innerHeight - navHeight - STICKY_PADDING)
    .combine(isSticky$, (maxVizHeight, isSticky) => (isSticky) ? maxVizHeight : Infinity)
    .toProperty(() => Infinity); // start with Infinity


/**
 * initStickyViz: function to add sticky behaviour to a viz
 * @param  {[type]} {element    [description]
 * @param  {Number} topOffset$: stream of values for an offset from the top of the viewport to put the viz
 * @return {[type]}             [description]
 */
export default function initStickyViz({element, topOffset$}){

    const position$ = createPositionStream({element});

    // combine the position stream, the topOffset stream, and the maxHeight
    const shouldUpdate$ = Kefir.combine(
        [position$, topOffset$, maxVizHeight$],
        (position, topOffset, maxHeight) => {
            return Object.assign({}, position, {
                maxHeight,
                topOffset: topOffset + STICKY_PADDING
            });
        }
    );

    shouldUpdate$
        // only do this if it's sticky
        .filterBy(isSticky$)
        // update the dom with our measurements when either of those streams emit
        .onValue(({scroll, parentMeasures, elementMeasures, topOffset, maxHeight }) => {

            const pm = parentMeasures;
            const em = elementMeasures;

            // where the user is scrolled in relation to the parent container
            const above = (scroll + topOffset < pm.top );
            const below = (scroll + topOffset > pm.bottom - em.height);
            const fixed = !above && !below;

            // center might be offset, eg 70/30
            const textWidthPercentage = `${(100*(1-VIZ_WIDTH))}%`;
            const textWidthAbsolute = (pm.width * (1-VIZ_WIDTH));


            $(element).css({
                "position": (fixed) ? "fixed" : "absolute",
                "top" : (above) ? "0px"
                      : (fixed) ? `${topOffset}px`
                      : "auto",
                "right": (fixed)
                    ? (pm.vizOnLeft) ? `${pm.right + textWidthAbsolute}px` : `${pm.right}px`
                    : (pm.vizOnLeft) ? textWidthPercentage : "0",
                "bottom": (below) ? "0" : "auto",
                "left": (fixed)
                    ? (pm.vizOnLeft) ? `${pm.left}px` : `${pm.left + textWidthAbsolute}px`
                    : (pm.vizOnLeft) ? "0" : textWidthPercentage,
                // if the user is on a small screen, make the viz scrollable while it's fixed
                "max-height": (fixed) ? `${maxHeight}px` : "none"
            });
        });


    isSticky$
        // when isSticky$ is false...
        .filterBy(isSticky$.map(b => !b))
        // unstick the nav
        .onValue(unStickIt);


    function unStickIt() {
        $(element).css({
            "position": "relative",
            "top": "auto",
            "right": "auto",
            "bottom": "auto",
            "left": "auto",
            // don't restrict max height when not sticky
            "max-height": "none"
        });
    }

    // a function to add/remove the stickyIt behavior
    function toggleVizSticky(status){
        // update the stream
        isSticky$.emit(status);
    }



    // return this function so the user can toggle it as needed.
    return toggleVizSticky;

}
