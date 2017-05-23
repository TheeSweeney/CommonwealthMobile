import d3 from "d3";
import R from "ramda";
import * as core from "../data/core.js";
import
    {ascending, descending, compare, composeComparators, compareStatusThenChangeMagnitude}
    from "../data/compare.js";

export default function createLocationOverall({
    selector,
    width,
    height
}) {

    // constant height for now
    const margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        },
        vizWidth = width - margin.left - margin.right,
        vizHeight = height - margin.top - margin.bottom;

    const svg = d3.select(selector).append("svg")
        .attr("width", vizWidth + margin.left + margin.right)
        .attr("height", vizHeight + margin.top + margin.bottom);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const overallSummaryForLocation = R.curry(function(indicators, data, location) {
        return {
            locId: location.id,
            indicators: R.values(indicators)
                .filter(core.isNotOverallIndicator)
                .map(ind => ({
                    indId: ind.id,
                    change: {
                        changePct: core.directionCorrectedPercentChange(ind, data[ind.id][location.id]),
                        status: core.status(data[ind.id][location.id])
                    }
                })).sort(compareStatusThenChangeMagnitude)
        };
    });

    function transformRawData(locations, indicators, data) {
        return R.values(locations)
            .filter(core.notUsLocation)
            .map(overallSummaryForLocation(indicators, data));
    }

    function changeEndPoints(loc) {

      var groups = R.groupBy(x => x.change.status, loc.indicators);

      var improved = groups["improved"] ? [0, groups["improved"].length] : [0, 0],
        steady = groups["steady"] ? [improved[1], improved[1] + groups["steady"].length] : [improved[1], improved[1]],
        worse = groups["worse"] ? [steady[1], steady[1] + groups["worse"].length] : [steady[1], steady[1]];

      return {
        locId: loc.locId,
        range: [0, worse[1]],
        bars: [
            {type: "improved", range: improved},
            {type: "steady", range: steady},
            {type: "worse", range: worse}
        ]
      };
    }

    function collapsibleScale(){

      var domain,
        positions,
        locationHeight = 2;

      function getPosition(activeLocId){
        return R.reduce((accum, locId) => {
          var val = accum + locationHeight;
          if(locId === activeLocId){
            return R.reduced(val - locationHeight);
          }
          return val;
        }, 0, domain);
      }

      const self = function(locId){
        return positions[locId];
      };

      self.domain = function(d){
        domain = d;
        positions = R.map(getPosition, R.indexBy(R.identity, d));
        return self;
      };

      self.range = function(){
        return R.values(positions);
      };

      return self;
    }

    const xScale = d3.scale.linear().range([0, vizWidth]),
        yScale = collapsibleScale();

    function nudgeLine(d){
        var nudge = 0;//d.type === "worse" ? 4 : d.type === "steady" ? 2 : 0;
        return `translate(${nudge}, 0)`;
    }

    function update({ locations, indicators, cleanData }) {

        const overallData = transformRawData(locations, indicators, cleanData);

        const span = x => x[1] - x[0],
            locationName = d => locations[d.locId].name,
            improvementIndex = x => span(x.bars[0].range) - span(x.bars[2].range), // improved - worse
            improvementIndexComparator = compare(improvementIndex, descending),
            nameComparator = compare(locationName, ascending),
            overallImprovementComparator = composeComparators([
                improvementIndexComparator,
                nameComparator]);

        const endPoints = R.values(overallData)
            .map(changeEndPoints)
            .sort(overallImprovementComparator);

        xScale.domain(endPoints[0].range);
        yScale.domain(endPoints.map(d => d.locId));

        var locationGroups = g.selectAll("g.location").data(endPoints, R.prop("locId"));
        locationGroups.enter().append("g").attr("class", "location");
        locationGroups.exit().remove();
        locationGroups
            .attr("transform", d => `translate(0, ${yScale(d.locId)})`);

        var overallLines = locationGroups
            .selectAll("line.status")
            .data(d => d.bars, R.prop("type"));

        overallLines.enter().append("line").attr("class", "status");
        overallLines.exit().remove();

        overallLines
            .attr("class", d => "status " + d.type)
            .attr("x1", d => xScale(d.range[0]))
            .attr("x2", d => xScale(d.range[1]))
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("transform", nudgeLine);
    }

    return {
        update
    };
}
