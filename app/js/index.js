import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import R from "ramda";
import initPage from "./page/initPage.js";

import createLocationOverall from "./viz/location-overall.js";
import createIndicatorOverall from "./viz/indicator-overall.js";

import { reflow$, resize$, toPropertyFromResize } from "./page/common.js";
import { simpleSource, zipHrrSource, createTypeAhead } from "./page/typeAhead.js";

import SlopeChart from "./components/SlopeChart/SlopeChart.jsx";


// add's UA info to html class (needed for iPad, see initPage.js)
import "./sniff.min.js";

import { loadVizData } from "./viz/loadVizData.js";

loadVizData()
    .then(json => {

        const { cleanData, locations, indicators, zips } = json;

        const states = R.filter(l => l.abbreviation !== "US", locations);


        /* slope chart */
        ReactDOM.render(
            <SlopeChart data={{cleanData, locations, indicators}} />,
            document.querySelector(".js-viz-slope-chart")
        );


        /* location overall */
        const locationOverallSelector = ".js-viz-location-overall";

        const locationOverall = createLocationOverall({
            selector: locationOverallSelector,
            width: $(locationOverallSelector).width(),
            height: 550,
            locations: states, indicators, cleanData,
            onUnlock: function(){
                // clear the typeahead when the active location is unlocked
                locationOverallTypeAhead.setValue("");
            }
        });

        resize$.onValue(e => {
            locationOverall.setWidth($(locationOverallSelector).width());
        });


        // location overall typeahead
        const locationOverallTypeAhead = createTypeAhead(
            ".js-viz-location-overall__typeahead .typeahead",
            "name",
            zipHrrSource(states, zips),
            function(hrr){
                locationOverall.setActiveLocation(hrr.id);
            }
        );

        // after the viz's are done, force a reflow so the sticky's are correct
        reflow$.emit("viz's loaded");


    });

/** initialize all the page scripts for navigation and sticky vizs, etc **/
initPage();


// cloak hides all the content. now that we've done all our layout crunching,
// show the content
$("body").removeClass("cloak");
