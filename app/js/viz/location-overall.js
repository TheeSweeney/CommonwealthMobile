import d3 from "d3";
import R from "ramda";
import $ from "jquery";
import createPopup from "../page/createPopup.js";
import * as core from "../data/core.js";
import
    { ascending, descending, compare, composeComparators }
    from "../data/compare.js";

import collapsibleScale from "./collapsibleScale.js";

import { moveToFront } from "./d3Extensions.js";

export default function createLocationOverall(initialState) {

    const xPath = "M9.442,6.983l3.044-3.036A1.731,1.731,0,1,0,10.036,1.5L6.993,4.537,3.952,1.5A1.731,1.731,0,0,0,1.5,3.943l3.04,3.039L1.5,10.019a1.731,1.731,0,0,0,2.449,2.445L6.991,9.428l3.042,3.039a1.731,1.731,0,0,0,2.45-2.445Z";

    // default state
    let prevState = {
        selector: "",
        width: 0,
        height: 0,
        indicators: {},
        locations: {},
        cleanData: {},
        activeLocationId: null,
        lock: false,
        onUnlock: () => {}
    };

    // merge the initial state in with the default state before we build the svg
    const state = Object.assign({}, prevState, initialState);

    function setState(newState) {

        // copy the state into prevState
        prevState = Object.assign({}, state);

        Object.assign(state, newState);

        // if the locked location has changed (could be back to null)
        if (!state.lock && prevState.lock){
            state.onUnlock();
        }

        // add touch away handler if a location is open
        if (state.activeLocationId){
            window.addEventListener("touchstart", handleTouchAwayLocation, true);
        }

        update();
    }

    const margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 25 // room for location dot
    };

    const popup = createPopup({
        container: state.selector,
        offset: -6,
        triangle: "top",
        isHidden: true,
        closeBtn: false
    });

    const svg = d3.select(state.selector).append("svg");

    // Arrow heads
    const defs = svg.append("defs");

    defs
        .append("marker")
        .attr("id", "arrow-overall")
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("refX", 0)
        .attr("refY", 2)
        .attr("orient", "auto-start-reverse")
        .attr("markerUnits", "strokeWidth")
        .append("path")
        .attr("d", "M0,0 L0,4 L3,2 z");

    defs
        .append("pattern")
        .attr("id", "diagonal")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 6)
        .attr("height", 6)
        .append("path")
        .attr("d", "M-1,1 l 2,-2 M 0,6 l 6,-6 M 5,7 l 4,-4");

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const compareStatus = compare(R.compose(R.prop(R.__, core.statusOrder), d => d.change.status), descending);

    const compareChangeMagnitude = compare(d => d.change.changePct, descending);

    const compareHasChange = compare(d => d.change.hasChange, ascending);

    const compareStatusThenChangeMagnitude = composeComparators([compareStatus, compareChangeMagnitude, compareHasChange]);

    const overallSummaryForLocation = R.curry(function(indicators, data, location) {
        return {
            locId: location.id,
            medicaidExpansion: location.medicaidExpansion,
            indicators: R.compose(
                R.sort(compareStatusThenChangeMagnitude),
                R.map(ind => ({
                    indId: ind.id,
                    change: {
                        changePct: core.directionCorrectedPercentChange(ind, data[ind.id][location.id]),
                        status: core.status(data[ind.id][location.id]),
                        hasChange: core.hasChangeData(data[ind.id][location.id])
                    },
                    data: data[ind.id][location.id]
                })),
                R.filter(core.isNotOverallIndicator),
                R.values)(indicators)
        };
    });

    function transformRawData(locations, indicators, data) {
        return R.values(locations)
            .filter(core.notUsLocation)
            .map(overallSummaryForLocation(indicators, data));
    }

    function changeEndPoints(loc) {

        const groups = R.groupBy(x => x.change.status, loc.indicators);

        const statusKeys = ["improved-full", "improved-half", "steady", "worse-half", "worse-full"];

        // find the bar lengths for each status for the location lines
        const statuses = R.reduce((acc, statusKey) => {

            const indicatorCount = groups[statusKey] ? groups[statusKey].length : 0;
            const nextTally = acc.tally + indicatorCount;

            return {
                tally: nextTally,
                bars: acc.bars.concat({
                    type: statusKey,
                    range: [acc.tally, nextTally]
                })
            };
        }, { tally: 0, bars: [] }, statusKeys);

        // sort the indicators by the statusKeys (green to red)
        const sortedIndicators = loc.indicators.sort((a, b) => {
            const getStatusIndex = (indicator) => statusKeys.indexOf(indicator.change.status);
            return getStatusIndex(a) - getStatusIndex(b);
        });

        return Object.assign({}, loc, {
            range: [0, statuses.tally],
            bars: statuses.bars,
            indicators: sortedIndicators
        });
    }

    const indicatorXScale = d3.scale.ordinal();

    const overallData = transformRawData(state.locations, state.indicators, state.cleanData);

    const span = x => x[1] - x[0];
    const locationName = d => state.locations[d.locId].name;
    const improvementIndex = x => span(x.bars[0].range) - span(x.bars[2].range); // improved - worse
    const improvedIndicators = x =>  span(x.bars[0].range) + span(x.bars[1].range); // sort by most improved indicators (0 and 1, improved-full/improved-half)
    // const improvementIndexComparator = compare(improvementIndex, descending);
    const nameComparator = compare(locationName, ascending);
    const improvedIndicatorsComparator = compare(improvedIndicators, descending);
    const overallImprovementComparator = composeComparators([
        improvedIndicatorsComparator,
        nameComparator
    ]);

    const endPoints = R.compose(
        R.sort(overallImprovementComparator),
        R.map(changeEndPoints),
        R.values
    )(overallData);




    function update() {

        const { activeLocationId } = state;

        const yScale = collapsibleScale()
            .domain(endPoints.map(d => d.locId))
            .activeLoc(activeLocationId);

        const vizWidth = state.width - margin.left - margin.right;
        const vizHeight = yScale.totalHeight();


        const locationLineHeight = yScale.locationHeight() - 3;
        const locationDotRadius = locationLineHeight/2;
        const locationDotArea = (locationDotRadius*2) + 3; // padding

        const locationXScale = d3.scale.linear()
            .domain(endPoints[0].range)
            .range([0, vizWidth]);

        let columnIsExpanding = false;


        svg
            .attr("width", vizWidth + margin.left + margin.right)
            .attr("height", vizHeight + margin.top + margin.bottom);



        /**
         * @param  {Array} mouse : [x, y], see https://github.com/d3/d3-selection#mouse
         * @return {Number} locationId
         */
        const findLocationAtMouse = (mouse) => {
            return yScale.domain()[d3.bisect(yScale.range(), mouse[1]) - 1] || yScale.domain()[0];
        };

        svg.on("mouseleave", function(){
            if (state.lock){ return; }
            setState({ activeLocationId: null });
        });

        g.on("mousemove", function(d, i){
            if (columnIsExpanding || state.lock){ return; }

            var hoveredLocationId = findLocationAtMouse(d3.mouse(this));

            if (hoveredLocationId === activeLocationId){ return; }

            columnIsExpanding = true;
            hidePopUp();
            setState({ activeLocationId: hoveredLocationId });
        })
        .on("click", function(d, i){

            if (state.activeLocationId){ return; }

            var hoveredLocationId = findLocationAtMouse(d3.mouse(this));
            setState({activeLocationId: hoveredLocationId});
        });


        const locationGroups = g.selectAll("g.location")
            .data(endPoints, R.prop("locId"));

        locationGroups.enter()
            .append("g").attr("class", "location")
            .append("circle").attr("class", "location-dot");

        locationGroups.exit().remove();

        locationGroups
            .transition()
            .duration(100)
            .attr("transform", function(d, i){

                // var columnIndex = d3.select(this.parentNode).datum().column;
                return `translate(0, ${yScale(d.locId)})`;
            })
            .style("opacity", d => d.locId === activeLocationId ? 0 : 1);


        const locationDot = locationGroups
            .selectAll(".location-dot")
            .attr("r", locationDotRadius)
            .attr("cx", -locationDotArea) // move into margin
            .attr("cy", locationDotRadius)
            .attr("opacity", d => (d.medicaidExpansion === true) ? 1 : 0)

        const locationLines = locationGroups
            .selectAll("rect.status")
            .data(d => d.bars, R.prop("type"));

        locationLines.enter().append("rect").attr("class", "status");
        locationLines.exit().remove();

        locationLines
            .attr("class", d => "status " + d.type)
            .transition()
            .attr("x", d => locationXScale(d.range[0]) + 1)
            .attr("y", 0)
            .attr("width", d => Math.max(0, locationXScale(d.range[1]) - locationXScale(d.range[0]) - 1))
            .attr("height", yScale.locationHeight() - 3) // minus padding
            .attr("rx", 2)
            .attr("ry", 2)
            .each("end", function(){
                columnIsExpanding = false;
            });

        var activeLocationGroup = g.select("g.active-location");

        if (activeLocationId && activeLocationGroup.empty()){
            activeLocationGroup = g.append("g")
                .attr("class", "active-location location-label");
        }
        else if (!activeLocationGroup.empty() && !activeLocationId){
            activeLocationGroup.remove();
        }

        var closeButton = g.select("path.close");

        if (closeButton.empty()){
            closeButton = g.append("path")
                .attr("class", "close")
                .attr("d", xPath)
                .attr("width", 18)
                .attr("height", 18)
                .style("display", "none")
                .on("click", function(){
                    setState({lock: false});
                });
        }

        closeButton.style("display", "none");

        // let yLabelGroupLeft = g.select("g.y-label.left");
        //
        // if (yLabelGroupLeft.empty()){
        //     yLabelGroupLeft = g.append("g").attr("class", "y-label left");
        //
        //     yLabelGroupLeft.append("line")
        //         .attr("marker-start", "url(#arrow-overall)");
        //
        //     yLabelGroupLeft.append("rect")
        //         .attr("class", "background");
        //
        //     yLabelGroupLeft.append("text")
        //         .text("more improved");
        // }
        //
        // yLabelGroupLeft.select("line")
        //     .transition()
        //     .attr("x1", - 13).attr("x2", - 13)
        //     .attr("y1", 6).attr("y2", yScale.rangeBottom());
        //
        // yLabelGroupLeft.select("rect.background")
        //     .attr("x", - 18)
        //     .attr("y", yScale.rangeMiddle() - 55)
        //     .attr("width", 10)
        //     .attr("height", 110);
        //
        // yLabelGroupLeft.select("text")
        //     .transition()
        //     .attr("x", - 10)
        //     .attr("y", yScale.rangeMiddle())
        //     .attr("transform", `rotate(-90, -10, ${yScale.rangeMiddle()})`);

        // var yLabelGroupRight = g.select("g.y-label.right");
        //
        // if (yLabelGroupRight.empty()){
        //     yLabelGroupRight = g.append("g").attr("class", "y-label right");
        //
        //     yLabelGroupRight.append("line")
        //         .attr("marker-end", "url(#arrow-overall)");
        //
        //     yLabelGroupRight.append("rect")
        //         .attr("class", "background");
        //
        //     yLabelGroupRight.append("text")
        //         .text("less improved");
        // }
        //
        // yLabelGroupRight.select("line")
        //     .transition()
        //     .attr("x1", vizWidth + 13).attr("x2",vizWidth + 13)
        //     .attr("y1", 0).attr("y2", yScales[1].rangeBottom() - 6);
        //
        // yLabelGroupRight.select("rect.background")
        //     .attr("x", vizWidth + 8)
        //     .attr("y", yScales[1].rangeMiddle() - 55)
        //     .attr("width", 10)
        //     .attr("height", 110);
        //
        // yLabelGroupRight.select("text")
        //     .transition()
        //     .attr("x", vizWidth + 10)
        //     .attr("y", yScales[1].rangeMiddle())
        //     .attr("transform", `rotate(90, ${vizWidth + 10}, ${yScales[1].rangeMiddle()})`);

        // moveToFront(hoverZones);

        if (activeLocationId){
            const activeData = R.find(d => d.locId === activeLocationId, endPoints);

            const range = locationXScale.range();

            indicatorXScale
                .rangeBands(range, 0.1)
                .domain(activeData.indicators.map(R.prop("indId")));

            // Label

            var label = activeLocationGroup.select("text.label");

            if (label.empty()){
                label = activeLocationGroup.append("text").attr("class", "label");
            }

            label
                .attr("x", (range[1] - range[0])/2 + range[0])
                .attr("y", yScale(activeLocationId) + 14)
                .attr("dy", "1ex")
                .text(state.locations[activeLocationId].name);


            // Dots

            const dotHeight = 18;

            var indicatorDots = activeLocationGroup.selectAll("rect.indicator-dot")
                .data(activeData.indicators, R.prop("indId"));

            indicatorDots.enter().append("rect").attr("class", "indicator-dot");
            indicatorDots.exit();

            const positionDot = R.curry(function(active, d){

                const offset = active ? [-1, -2] : [0, 0];

                return `translate(${indicatorXScale(d.indId) + offset[0]}, ${yScale(activeLocationId) + 32 + offset[1]})` +
                    (active ? "scale(1.2)" : "");
            });

            indicatorDots
                .attr("x", 0)
                .attr("y", 0)
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("transform", positionDot(false))
                .attr("width", indicatorXScale.rangeBand())
                .attr("height", dotHeight)
                // .attr("class", d => d.change.status) why doesn't this work??
                .classed("improved-full", d => d.change.status === "improved-full")
                .classed("improved-half", d => d.change.status === "improved-half")
                .classed("steady", d => d.change.status === "steady")
                .classed("worse-half", d => d.change.status === "worse-half")
                .classed("worse-full", d => d.change.status === "worse-full")
                .classed("na", d => R.isNil(d.data.years[0].value))
                .style("fill", d => R.isNil(d.data.years[0].value)? "url(#diagonal)": "");


            // Yellow dot
            var activeLocationDot = activeLocationGroup.select(".location-dot");

            if (activeLocationDot.empty()){
                activeLocationDot = activeLocationGroup.append("circle")
                    .attr("class", "location-dot")
            }

            activeLocationDot.attr("r", locationDotRadius*2)
                .attr("cx", -locationDotArea)
                .attr("cy", locationDotRadius + yScale(activeLocationId) + 32 - 2 + dotHeight/2) // magic numbers from positionDot()
                .attr("fill", "#e8ba1a")
                .attr("opacity", d => (activeData.medicaidExpansion === true) ? 1 : 0);

            // hover zone
            let indicatorDotHoverZone = g.select("rect.hover-zone.indicator");

            closeButton
                .attr("transform", `translate(${range[1] - 20}, ${yScale(activeLocationId) + 6})`)
                .style("display", state.lock ? "block" : "none");

            var activeIndicatorId;

            if (indicatorDotHoverZone.empty()){
                indicatorDotHoverZone = g.append("rect")
                    .attr("class", "hover-zone indicator");
            }

            indicatorDotHoverZone
                .attr("fill", "blue")
                .attr("opacity", 1);

            indicatorDotHoverZone
                .attr("x", range[0])
                .attr("y", yScale(activeLocationId))
                .attr("width", range[1] - range[0])
                .attr("height", yScale.activeLocationHeight() - 2)
                .on("mousemove", function(){
                    if (columnIsExpanding){
                        return;
                    }
                    var m = d3.mouse(this);
                    var indAtMouse = indicatorXScale.domain()[d3.bisect(indicatorXScale.range(), m[0]) - 1]
                        || indicatorXScale.domain()[0];

                    if (indAtMouse === activeIndicatorId){
                        return;
                    }
                    activeIndicatorId = indAtMouse;
                    // Deactivate all indicator nodes on switch
                    activeLocationGroup.selectAll("rect.indicator-dot")
                        .attr("transform", positionDot(false));

                    // Activate just the selected node
                    var node = findIndicatorNode(activeLocationGroup, activeIndicatorId);
                    node.attr("transform", positionDot(true));

                    const xPadding = $(this).closest("svg").offset().left - $(state.selector).offset().left;
                    const top = yScale(activeLocationId)  + margin.top + yScale.activeLocationHeight()/2;
                    const offset = -1 * yScale.activeLocationHeight()/2;
                    const triangle = (top < yScale.height()/2) ? "top" : "bottom";

                    showPopUp(
                        state.indicators[activeIndicatorId],
                        node.datum(),
                        [
                            indicatorXScale(activeIndicatorId) + indicatorXScale.rangeBand()/2 + margin.left + xPadding,
                            top
                        ],
                        offset,
                        triangle
                    );
                })
                .on("mouseleave", function(){
                    var node = findIndicatorNode(activeLocationGroup, activeIndicatorId);
                    node.attr("transform", positionDot(false));
                    activeIndicatorId = null;
                    hidePopUp();
                })
                .on("click", function(){
                    setState({lock: true});
                });

            moveToFront(indicatorDotHoverZone);
            moveToFront(closeButton);

            // add window click away listener
            if (state.lock){
                window.addEventListener("click", handleClickAway, true);
            }
            else {
                window.removeEventListener("click", handleClickAway, true);
            }

        }
    }


    function findIndicatorNode(parent, indId){
        return parent.selectAll("rect.indicator-dot")
            .filter(d => d.indId === indId);
    }

    function showPopUp(ind, data, point, offset, triangle){

        const formatter = core.formatValue(ind);

        const html = $(`
            <div class="location-overall__popup">
                <table>
                    <tbody>
                    <tr>` +
                    (!R.isNil(data.data.years[1].value) ?
                        `<td><span>${ind.years[1]}</span> <strong class="${data.change.status}">${formatter(data.data.years[1].value, true)}</strong></td>` +
                        (!R.isNil(data.data.years[0].value) ?
                            `<td><span>${ind.years[0]}</span> <strong>${formatter(data.data.years[0].value, true)}</strong></td>` :
                            "<td><em>Historic data not available</em></td>")
                            : "<td><em>Data not available for this location</em></td>") +
                    `</tr>
                    </tbody>
                </table>
            </div>`);

        popup.setState({
            title: `<span class="indicator-label">${ind.longName}</span>`,
            html: html,
            top:  point[1],
            left: point[0],
            isHidden: false,
            offset,
            triangle
        });

        // replace the location touch away with the popup touch away
        window.addEventListener("touchstart", handleTouchAwayPopup, true);
        window.removeEventListener("touchstart", handleTouchAwayLocation, true);
    }

    function hidePopUp(){
        popup.hidePopup();
    }

    function handleClickAway(event){

        const clickIsInActiveLocation = $(event.target).closest(".active-location").length > 0;

        if (state.activeLocationId && !clickIsInActiveLocation){
            clearLock();
        }
    }

    // hide the popup, and listen for another touch away to hide the location
    function handleTouchAwayPopup(e){
        if (!$(e.target).closest(state.selector).length){
            hidePopUp();
            window.removeEventListener("touchstart", handleTouchAwayPopup, true);
            window.addEventListener("touchstart", handleTouchAwayLocation, true);
        }
    }


    function handleTouchAwayLocation(e) {
        if (!$(e.target).closest(state.selector).length){
            clearLock();
            window.removeEventListener("touchstart", handleTouchAwayLocation, true);
        }
    }

    function clearLock() {
        setState({
            activeLocationId: null, lock: false
        });
    }

    update();

    // external api
    return {
        setWidth: (width) => setState({ width }),
        setActiveLocation: (loc) => setState({activeLocationId: loc, lock: true})
    };
}
