import $ from "jquery";
import { toPropertyFromResize } from "./common.js";

/* NOTE: css has breakpoints in scss/_breakpoints.scss */

// page width
const BREAKPOINT_SMALL = 750;
const BREAKPOINT_MEDIUM = 900;

// convert the resize$ stream to a stream of width values
const windowWidth$ = toPropertyFromResize(e => $(window).width())
    // convert the width to "small" or "large"
    .map(width => {
        return (width < BREAKPOINT_SMALL) ? "small"
             : (width < BREAKPOINT_MEDIUM) ? "medium"
             : "large";
    })
    // only emit new values if it's changed
    .skipDuplicates();

export default function addBreakpointHandlers({onLarge = ()=>{}, onMedium = ()=>{}, onSmall = ()=>{}}){

    windowWidth$.onValue(width => {

        if (width === "small"){
            onSmall();
        }
        else if (width === "medium"){
            onMedium();
        }
        else {
            onLarge();
        }
    });
}
