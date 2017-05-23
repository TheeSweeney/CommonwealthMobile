import Kefir from "kefir";
import $ from "jquery";
import createKefirEmitter from "./Kefir.emitter.js";


// imperative stream so we can trigger the resize properties to recalculate
// when there is a reflow in the page. Without this, the measurements will
// become stale and wrong.
// (is there a better way to do this?)
export const reflow$ = createKefirEmitter();

// stream of window resize events
export const resize$ = Kefir.fromEvents(window, "resize");


// property stream of pageYOffset
export const scroll$ = Kefir.fromEvents(window, "scroll")
    .map(e => window.pageYOffset)
    .toProperty(e => window.pageYOffset);

/**
 * A common pattern to create a property based on the resize$ and reflow$ streams
 * @param  {Function} fn: function that does some measuring
 * @return {Stream}
 */
export function toPropertyFromResize(fn){
    return Kefir.merge([resize$, reflow$])
        .map(fn) // measure when the window is resized
        .toProperty(fn); // measure initially
}


/**
 * createPositionStream.  create a stream of measurements to be used by sticky watchers
 * @param  {Element} element: node (use document.querySelector)
 * @return {Stream} stream of the positions
 */
export function createPositionStream({element}){

    // the container element
    const parent = element.parentNode;

    // measure the element's position relative to the document
    const measureElement = () => {
        const elementBB = element.getBoundingClientRect();

        return {
            height: elementBB.height,
            width: elementBB.width,
            top: elementBB.top + window.pageYOffset
        };
    };

    // elementMeasures stream
    const elementMeasures$ = toPropertyFromResize(measureElement);

    // parent's measurements, relative to the document
    const measureParent = () => {
        const parentBB = parent.getBoundingClientRect();

        return {
            top: parentBB.top + window.pageYOffset,
            // $(window).width() does NOT include the scrollbar (important for windows machines)
            right: $(window).width() - parentBB.right + window.pageXOffset,
            bottom: parentBB.bottom + window.pageYOffset,
            left: parentBB.left + window.pageXOffset,
            width: parentBB.width,
            height: parentBB.height,
            // text is on the right, viz is on the left
            vizOnLeft: $( parent).hasClass("viz-section--viz-left")
        };
    };

    // parentMeasures stream
    const parentMeasures$ = toPropertyFromResize(measureParent);

    // combine the streams to calculate where the sticky element should be
    const position$ = Kefir.combine(
        [scroll$, elementMeasures$, parentMeasures$],
        (scroll , elementMeasures , parentMeasures) => {

            return {
                scroll,
                parentMeasures,
                elementMeasures
            };
        }
    );

    return position$;
}
