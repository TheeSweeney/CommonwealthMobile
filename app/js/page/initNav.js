import Kefir from "kefir";
import $ from "jquery";
import createKefirEmitter from "./Kefir.emitter.js";
import { scroll$, createPositionStream, toPropertyFromResize } from "./common.js";
import addBreakpointHandlers from "./addBreakpointHandlers.js";

// measure the height of the nav including padding
export function measureNav() {
    return $("nav").outerHeight();
}


/**
 * Observe the positions stream and update the nav to make it sticky
 * @param  {Element} element:
 * @param  {Number} topOffset: amount of space from the top of the
 *                             screen to place the sticky nav
 * @return {Nothing}
 */
function attachStickyWatcherToNav({element}) {

    const position$ = createPositionStream({element});

    // stream of true/false of whether or not the nav should be sticky
    const isSticky$ = createKefirEmitter();

    position$
        // only do this if it's supposed to be sticky
        .filterBy(isSticky$)
        // update the dom with our measurements when either of those streams emit
        .onValue(({scroll, parentMeasures, elementMeasures}) => {

            const pm = parentMeasures;
            const em = elementMeasures;

            const shouldFix = (scroll > em.top);

            $(element).find("nav").css({
                "position": (shouldFix) ? "fixed" : "absolute",
                "top" : (shouldFix) ? 0 : "auto",
                "left": pm.left,
                "right": pm.right
            });
        });

    isSticky$
        // when isSticky$ is false...
        .filterBy(isSticky$.map(b => !b))
        // unstick the nav
        .onValue(unStickIt);


    function unStickIt(){
        $(element).find("nav").css({
            "position": "relative",
            "top" : "auto",
            "left": "auto",
            "right": "auto"
        });
    }

    // a function to add/remove the sticky behavior
    function toggleStickyNav(status){
        isSticky$.emit(status);
    }

    return {
        toggleStickyNav,
        isSticky$
    };
}

// return the id and top offset of the chapter, relative to the document
function getChapterPositions(){
    const chapters = $(".chapter").map((i, chapter) => {
        return {
            id: $(chapter).attr("id"),
            top: $(chapter).offset().top
        };
    }).get();

    return chapters;
}

// this will be updated once we init the nav
export let scrollBodyTo = () => {};

/**
 * Attach sticky watcher to nav
 * @return {Stream} stream of navHeight values
 *                 (it might change if the user resizes their browser and the nav wraps)
 */
export default function initNav(){

    // make the nav sticky
    const {toggleStickyNav, isSticky$ } = attachStickyWatcherToNav({
        element: $(".nav-holder").get(0)
    });


    // measure the navHeight and set the height of the holder
    // this is because it will be position fixed when it's scrolls,
    // so the nav-holder will maintain the space
    const navHeight$ = toPropertyFromResize(measureNav);

    // add smooth scroll to nav links
    $("nav a").on("click", function(e, el) {
        e.preventDefault();
        const scrollTo = $($(this).attr("href"));

        if (scrollTo){
            scrollBodyTo(scrollTo.offset().top);
        }
    });


    // update the nav holder height
    Kefir.combine([navHeight$, isSticky$])
    .onValue(([navHeight, isSticky]) => {
            $(".nav-holder").height(navHeight);

            // redefine this function to reflect the new navHeight
            scrollBodyTo = (top, duration = 750) => {
                $("html, body").stop().animate({
                    scrollTop: top - (isSticky ? navHeight : 0)
                }, duration);
            };

        }
    );

    // remove the sticky nav on small windows
    addBreakpointHandlers({
        onSmall: () => toggleStickyNav(false),
        onMedium: () => toggleStickyNav(true),
        onLarge: () => toggleStickyNav(true)
    });

    // stream of chapter positions
    const chapterPositions$ = toPropertyFromResize(getChapterPositions);

    // watch the scroll to determine what chapter we're on
    Kefir.combine([scroll$, chapterPositions$, navHeight$])
        .onValue(([scroll, chapterPositions, navHeight]) => {

            // how far above the chapter to be considered in it
            const offset = 100;

            const currentChapter = chapterPositions
                .map(chapter => Object.assign({}, chapter, { distance: scroll + navHeight - chapter.top + offset}))
                .reduce((closest, chapter) => {
                    // -1 because of rounding (could be -0.5)
                    return (chapter.distance > -1 && chapter.distance < closest.distance) ? chapter : closest;
                }, { distance: Infinity });

            $("nav a").each((i, a) => {
                const hrefId = $(a).attr("href").replace("#", "");
                $(a).toggleClass("is-current", hrefId === currentChapter.id);
            });
        });


    // return the navHeight so others can use it
    return navHeight$;
}
