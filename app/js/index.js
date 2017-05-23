import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import R from "ramda";
import initPage from "./page/initPage.js";

import createLocationOverall from "./viz/location-overall.js";
import createIndicatorOverall from "./viz/indicator-overall.js";

import { reflow$, resize$, toPropertyFromResize } from "./page/common.js";
import { simpleSource, zipHrrSource, createTypeAhead } from "./page/typeAhead.js";




// add's UA info to html class (needed for iPad, see initPage.js)
import "./sniff.min.js";

import { loadVizData } from "./viz/loadVizData.js";


/** initialize all the page scripts for navigation and sticky vizs, etc **/
initPage();


// cloak hides all the content. now that we've done all our layout crunching,
// show the content
$("body").removeClass("cloak");
