import d3 from "d3";
import R from "ramda";
import $ from "jquery";
import { createSelector } from "reselect";
import createPopup from "../page/createPopup.js";
import * as core from "../data/core.js";
import
    {ascending, descending, compare, composeComparators}
    from "../data/compare.js";

export default function createLocationOverall(initialState) {

    // defaults, and this object will hold the previous state after setState
    let prevState = {
        selector: "",
        width: 500,
        indicators: {},
        locations: {},
        cleanData: {},
        selectedDimension: Object.keys(core.dimensionNames)[0],
        afterSlide: () => {}
    };

    // merge the initial state in with the default state
    let state = Object.assign({}, prevState, initialState);

    function setState(newState) {
        // copy the old state into prevState
        prevState = Object.assign({}, state);

        Object.assign(state, newState);

        update();
    }


    const popup = createPopup({
        container: state.selector,
        offset: 0,
        triangle: "top",
        isHidden: true,
        closeBtn: false
    });

    const rootElement = d3.select(state.selector);

    const compareStatus = compare(R.compose(R.prop(R.__, core.statusOrder), d => d.change.status), descending);

    const compareChangeMagnitude = compare(d => d.change.changePct, descending);

    const compareHasChange = compare(d => d.change.hasChange, ascending);

    const compareStatusThenChangeMagnitude = composeComparators([compareStatus, compareChangeMagnitude, compareHasChange]);

    const overallSummaryForIndicator = R.curry(function(locations, data, indicator) {
        return {
            indId: indicator.id,
            locations: R.compose(
                R.sort(compareStatusThenChangeMagnitude),
                R.map(loc => ({
                    locId: loc.id,
                    change: {
                        changePct: core.directionCorrectedPercentChange(indicator, data[indicator.id][loc.id]),
                        status: core.status(data[indicator.id][loc.id]),
                        hasChange: core.hasChangeData(data[indicator.id][loc.id])
                    },
                    data: data[indicator.id][loc.id]
                })),
                R.filter(core.notUsLocation),
                R.values)(locations)
        };
    });

    const transformRawData = createSelector(
        state => state.locations,
        state => state.indicators,
        state => state.cleanData,
        (locations, indicators, cleanData) => {
            return R.compose(
                R.map(R.map(overallSummaryForIndicator(locations, cleanData))),
                R.groupBy(i => i.dimension),
                R.filter(core.isNotOverallIndicator),
                R.filter(core.indicatorHasHistoricalData(cleanData)),
                R.values
            )(indicators);
        }
    );

    function changeEndPoints(ind) {

      var groups = R.groupBy(x => x.change.status, ind.locations);

      var improved = groups["improved"] ? [0, groups["improved"].length] : [0, 0],
        steady = groups["steady"] ? [improved[1], improved[1] + groups["steady"].length] : [improved[1], improved[1]],
        worse = groups["worse"] ? [steady[1], steady[1] + groups["worse"].length] : [steady[1], steady[1]];

      return {
        indId: ind.indId,
        range: [0, worse[1]],
        bars: [
            {type: "improved", range: improved},
            {type: "steady", range: steady},
            {type: "worse", range: worse}
        ],
        locations: ind.locations
      };
    }

    var xScale = d3.scale.linear();

    function update(){

        const overallData = transformRawData(state);

        const span = x => x[1] - x[0];
        const indicatorName = d => state.indicators[d.indId].shortName;
        // const improvementIndex = x => span(x.bars[0].range) - span(x.bars[2].range); // improved - worse
        const mostImprovedLocationsIndex = x => span(x.bars[0].range);
        // const improvementIndexComparator = compare(improvementIndex, descending);
        const mostImprovedLocationsComparator = compare(mostImprovedLocationsIndex, descending);
        const nameComparator = compare(indicatorName, ascending);
        const overallImprovementComparator = composeComparators([
                mostImprovedLocationsComparator,
                nameComparator]);

        const endPoints = R.compose(
            R.map(R.sort(overallImprovementComparator)),
            R.map(R.map(changeEndPoints)))(overallData);

        xScale.range([2, state.width - 2]).domain(endPoints["ACCESS"][0].range);

        var dimensionGroups = rootElement.selectAll("div.dimension").data(R.keys(endPoints), R.identity);

        var dimensionGroupsEnter = dimensionGroups.enter().append("div").attr("class", "dimension");
        dimensionGroups.exit().remove();

        dimensionGroupsEnter.append("div")
            .attr("class", "dimension-label")
            .text(d => core.dimensionNames[d])
            .on("click", (d, i) => {
                const selectedDimension = (state.selectedDimension === d) ? null : d;
                setState({ selectedDimension });
            });

        // accordion for dimension indicators
        if (prevState.selectedDimension !== state.selectedDimension){

            dimensionGroups.each(function(d, i){
                const isSelected = state.selectedDimension === d;

                (isSelected)
                    ? $(this).find(".indicators").slideDown(250, state.afterSlide)
                    : $(this).find(".indicators").slideUp(250, state.afterSlide);

                $(this).toggleClass("is-expanded", isSelected);
            });
        }


        // make indicators
        dimensionGroupsEnter.append("div")
            .attr("class", "indicators")
            // hide all but the first dimension
            .style({ "display": (d, i) => i === 0 ? "block" : "none" });

        const indicators = dimensionGroups.selectAll(".indicators");

        var indicatorGroups = indicators.selectAll("div.indicator").data(g => endPoints[g], d => d.indId);

        var indicatorEnter = indicatorGroups.enter().append("div").attr("class", "indicator");
        indicatorGroups.exit().remove();

        indicatorEnter.append("div")
            .attr({ "class": "indicator-label" })
            .text(d => state.indicators[d.indId].shortName);
        indicatorEnter.append("svg");


        indicatorGroups.select("svg")
            .attr("width", state.width)
            .attr("height", 20);

        var bars = indicatorGroups.select("svg").selectAll("rect.status").data(g => g.bars, d => d.type);

        bars.enter().append("rect").attr("class", "status");
        bars.exit().remove();

        const steadySpacing = 10;

        bars
            .attr("class", d => "status " + d.type)
            .attr("x", d => xScale(d.range[0]) + ((d.type === "steady") ? steadySpacing/2 : 0) )
            .attr("width", d =>  xScale(d.range[1]) - xScale(d.range[0]) - ((d.type === "steady") ? steadySpacing : 0))
            .attr("y", 6)
            .attr("height", 8)
            .attr("rx", d => 4)
            .attr("ry", d => 4);

        var hoverBars = indicatorGroups.select("svg").selectAll("rect.hover-target").data(g => g.bars, d => d.type);

        function selectBar(d){

            const parentData = d3.select(this.parentNode).datum(),
                indicator = state.indicators[parentData.indId];

            // getting the position of the .indicator (i don't think you can get the position() of an svg element)
            const parent =  $(this).closest(".indicator");
            const yPosition = parent.position().top + parent.height();

            const xPadding = $(this).closest("svg").offset().left - $(state.selector).offset().left;

            const targetBar = d3.select($(this).closest("svg").find("rect.status." + d.type)[0]);

            //targetBar.addClass("active");
            targetBar
                .transition().duration(200)
                .attr("y", 2)
                .attr("rx", d => 8)
                .attr("ry", d => 8)
                .attr("height", 16);

            showPopUp(
                indicator,
                parentData,
                d,
                [
                    xScale((d.range[1] - d.range[0])/2 + d.range[0]) - 1 + xPadding,
                    yPosition
                ]);

        }

        function deselectBar(){

            d3.select(state.selector).selectAll("rect.status")
                .transition().duration(200)
                .attr("y", 6)
                .attr("rx", d => 4)
                .attr("ry", d => 4)
                .attr("height", 8);

            hidePopUp();

            window.removeEventListener("touchstart", deselectBar, true);
        }

        hoverBars.enter().append("rect").attr("class", "hover-target")
            .on("mouseenter", selectBar)
            .on("touchstart", function(d) {
                selectBar.call(this, d);
                window.addEventListener("touchstart", deselectBar, true);
            })
            .on("mouseleave", deselectBar);

        hoverBars.exit().remove();

        hoverBars
            .attr("x", d => xScale(d.range[0]))
            .attr("width", d => xScale(d.range[1]) - xScale(d.range[0]))
            .attr("y", 0)
            .attr("height", 20);
    }

    update();

    function showPopUp(ind, parentData, data, point){

        const locationCount = data.range[1] - data.range[0],
            description =
                  (data.type === "improved") ? "improved"
                : (data.type === "worse")    ? "worsened"
                : (data.type === "steady")   ? "had little or no change*" : "";

            const note = (data.type === "steady")
                ? "<div class='indicator-overall__popup-note'>* Includes the number of local areas with no change or without sufficient data for this subpopulation to assess change over time</div>"
                : "";

            const html = $(`
                <div class="indicator-overall__popup">
                    <span class="${data.type}"><strong>${locationCount}</strong> HRRs ${description}</span>
                    out of ${parentData.locations.length}
                    ${note}
                </div>`);

            popup.setState({
                title: "",
                html: html,
                top:  point[1],
                left: point[0],
                isHidden: false
            });
    }

    function hidePopUp(){
        popup.hidePopup();
    }

    // external api
    return {
        setWidth: (width) => setState({ width })
    };
}
