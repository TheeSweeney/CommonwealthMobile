import $ from "jquery";
import initStickyViz from "./initStickyViz.js";
import initNav from "./initNav.js";
import addBreakpointHandlers from "./addBreakpointHandlers.js";
import createPopup from "./createPopup.js";
import createModal from "./createModal.js";
import { reflow$ } from "./common.js";
import { attachCalloutBoxToDom } from "../components/CalloutBox.jsx";


export default function initPage(){

    /** init expandable callout boxes **/
    attachCalloutBoxToDom({
        selector: ".js-expandable-box",
        // trigger a page reflow while it animates. This ensures that the
        // sticky vizs are correct while we <animate></animate>
        onAnimationFrame: () => reflow$.emit("location profile expanded/collapsed!")
    });

    /** init non-expandable callout boxes **/
    attachCalloutBoxToDom({
        selector: ".js-callout-box",
        expandable: false
    });


    /** social icon links */
    // const scorecardUrl = "http://www.commonwealthfund.org/interactives/2016/jul/local-scorecard/";
    const scorecardUrl = $("meta[property='og:url']").attr("content");


    // https://dev.twitter.com/web/tweet-button/web-intent
    $(".js-twitter-link").each((i, a) => {
        const text = "Aiming Higher: The 2017 Scorecard on State Health System Performance";
        $(a).attr("href", `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(scorecardUrl)}`);
    });

    // https://developers.facebook.com/docs/plugins/share-button#configurator
    // https://developers.facebook.com/docs/sharing/webmasters#markup
    $(".js-facebook-link").each((i, a) => {
        $(a).attr("href", `https://www.facebook.com/sharer/sharer.php?u=${scorecardUrl}`);
    });

    // https://developer.linkedin.com/docs/share-on-linkedin
    $(".js-linkedin-link").each((i, a) => {
        const title = "Aiming Higher: The 2017 Scorecard on State Health System Performance";
        const summary = "Results from the Commonwealth Fund Scorecard on State Health System Performance";
        $(a).attr("href", `https://www.linkedin.com/shareArticle?url=${scorecardUrl}&title=${title}&summary=${summary}&mini=true`);
    });


    /** init modal links **/
    $(".js-modal").each((i, modal) => {
        const html = $(modal).find(".js-modal-html");

        $(modal).on("click", () => {
            createModal({
                html,
                aspectRatio: (3/4) // 3/4 for the chart links
            });
        });
    });

    /** init footnote popup actions **/
    $(".js-footnote").each((i, footnote) => {

        $(footnote).removeClass("js-footnote")
            .addClass("footnote");

        // grab the html and remove the popup content from the DOM
        const html = $(footnote).find(".js-footnote__popup").remove();

        const trigger = $(footnote).find(".js-footnote__trigger")
            .removeClass("js-footnote__trigger")
            .addClass("footnote__trigger");

        trigger.on("click", (e) => {
            e.preventDefault();
            const offsets = trigger.offset();
            const positionInWindow = offsets.top - $(window).scrollTop();
            const windowHeight = $(window).height();
            const showOnTop = positionInWindow > windowHeight /2;

            const popupConfig = {
                html: html,
                top: offsets.top + (trigger.height()/2),
                left: offsets.left + trigger.width()/2,
                offset: -trigger.height()/2,
                triangle: showOnTop ? "bottom" : "top"
            };

            createPopup(popupConfig);
        });
    });



    /** init sticky navigation **/
    // returns a stream of navHeight (it might change when the user resizes)
    const navHeight$ = initNav();


    /** attach the sticky viz watchers **/
    const toggleFns = $(".viz-section__viz-holder")
        .map(function(i, viz) {
            // return the toggle function for this sticky
            return initStickyViz({
                element: viz,
                topOffset$: navHeight$
            });
        }).get();


    function sizeNonStickyVizBox($el){
        $el.closest(".viz-section").css("min-height", $el.height());
    }

    function sizeNonStickyBoxes(){
        $(".viz-section__not-sticky").each(function(){
            sizeNonStickyVizBox($(this));
        });
    }  

    $(window).on("resize", function(){
        sizeNonStickyBoxes();
    });

    sizeNonStickyBoxes();

    /**
     * @param  {Boolean} enable: true to enable stickies, false to disable
     */
    function toggleStickies(enable) {

        // HACK * always emit false if this is ipad/safari
        if ($("html").hasClass("ipad") && $("html").hasClass("safari")){
            enable = false;
            $(".chapter").css({
                "max-width": "600px",
                "margin": "auto"
            });

            $("body").addClass("is-stacked");
        }

        $("body").toggleClass("sticky", enable);

        // add or remove viz stickies
        toggleFns.forEach(toggle => toggle(enable));

        // alert everyone that we need to remeasure the DOM
        reflow$.emit("toggling stickies");
    }

    /** add breakpoints handers to toggle the sticky vizs **/
    addBreakpointHandlers({
        onSmall: () => toggleStickies(false),
        onMedium: () => toggleStickies(false),
        onLarge: () => toggleStickies(true)
    });


    /** Attach hander for "Go to State Page" button */
    $(document).ready(function(){
        $(".js-state-select").change(function(e){
            const url = $(".js-state-select option:selected").attr("data-url");
            $(".js-goto-state-page").attr("href", url);
        });

        // fire change even to initialize it on the first load
        $(".js-state-select").change();
    });
}
