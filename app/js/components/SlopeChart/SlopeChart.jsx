import React from "react";
import $ from "jquery";
import R from "ramda";
import classNames from "classnames";

import munchSlopeChartData, { leftOrRightToIndex } from "./munchSlopeChartData.js";
import * as core from "../../data/core.js";

const { shape, object } = React.PropTypes;

const filters = [
    { name: "All",  value: "all" },
    { name: "Medicaid Expanded",  value: "med-exp" },
    { name: "Upward",  value: "upward" },
    { name: "Downward",  value: "downward" }
];

const padding = 20;

export default React.createClass({

    propTypes: {
        data: shape({
            cleanData: object,
            indicators: object,
            locations: object
        })
    },

    getInitialState() {
        return {
            selectedIndicatorId: core.overallIndicatorIds[0], // overall, etc
            leftLocations: [],
            rightLocations: [],
            locationsData: {},
            hoveredLocationId: null,
            selectedFilter: filters[0].value,

            // a flag to tell when something has changed that requires the svg lines to be recalculated
            // we'll use this to re-render the svg lines *only* once afterward
            shouldRecalculateLines: false,
            svgWidth: 0 // measured from DOM
        };
    },

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    },

    componentDidMount() {
        // re-render so the refs are populated
        this.forceUpdate();

        window.addEventListener("resize", this.calculateLineData);

        // Sometimes scroll bars pop in and out and we need to recalculate the positions
        window.addEventListener("scroll", this.calculateLineData);
    },

    componentWillUnmount() {
        window.removeEventListener("resize", this.calculateLineData);
        window.removeEventListener("scroll", this.calculateLineData);
    },

    componentWillReceiveProps(nextProps) {
        this.munchIndicatorData({ data: nextProps.data });
    },

    componentDidUpdate(prevProps, prevState) {

        // calculate the svg data if the flag says so
        if (this.state.shouldRecalculateLines){
            this.calculateLineData();
        }

    },

    /**
     * munch the data and set the state via setState
     * @param {object} obj.data
     *     Defaults to the data in this.props.  Caller can also pass other data (eg. nextData)
     * @param {object} obj.selectedIndicatorId
     *     Defaults to the selectedIndicatorId in this.state.
     *
     */
    munchIndicatorData({
        data = this.props.data,
        selectedIndicatorId = this.state.selectedIndicatorId
    }){

        const { leftLocations, rightLocations, locationsData } = munchSlopeChartData(data, selectedIndicatorId);

        // including selectedIndicatorId
        const nextState = { leftLocations, rightLocations, locationsData, shouldRecalculateLines: true, selectedIndicatorId };

        this.setState(nextState);
    },


    // lineData calcualted after a render so we can read from the DOM
    // lineData will be added to each location in this.state.locationsData
    // used to draw the lines and calculate the closest line to the mouse
    calculateLineData() {

        const svgWidth = (!this.svg) ? 0 : $(this.svg).width();
        const lowestLocation = this.locations
            ? Math.max.apply(null, R.values(this.locations).map(l => $(l.left).position().top)) 
            : 0;
        const svgHeight = lowestLocation + 20;

        // R.map because this.state.locationsData is an object
        const locationsDataWithLineData = R.map(location => {

            if (!this.locations || !this.svg){ return null; }

            const centerY = el => el.position().top + el.height()/2 ;

            const leftY = centerY($(this.locations[location.data.orderData.left.drawLineFromId].left));
            const rightY = centerY($(this.locations[location.data.orderData.right.drawLineFromId].right));

            const leftRank = location.data.years[0].rank;
            const rightRank = location.data.years[1].rank;

            const color =
                  (leftRank > rightRank) ? "#7c7"
                : (leftRank < rightRank) ? "#c77"
                : "#999";

            return Object.assign({}, location, {
                lineData: { leftY, rightY, color }
            });
        }, this.state.locationsData);


        this.setState({
            locationsData: locationsDataWithLineData,
            svgHeight,
            svgWidth: svgWidth - 2*padding,
            shouldRecalculateLines: false
        });
    },

    saveLocationRef(side, locationId, el) {

        if (!el){ return; }

        if (!this.locations){ this.locations = {}; }

        this.locations[locationId] = Object.assign({}, this.locations[locationId], {
            [side]: el
        });
    },

    handleLocationHover(hoveredLocationId) {
        this.setState({
            hoveredLocationId
        });
    },

    handleMedicaidChange(event){
        const selectedFilter = (event.target.checked) ? "med-exp" : "all";
        this.setState({ selectedFilter });
    },

    handleIndicatorChange(event) {
        this.munchIndicatorData({ selectedIndicatorId: event.target.value });
    },


    handleMouseMove(e) {

        const { svgWidth, hoveredLocationId, locationsData } = this.state;
        const svgOffset = $(this.svg).offset();
        const y = e.pageY - svgOffset.top;
        const x = e.pageX - svgOffset.left;

        const closest = Object.keys(locationsData).reduce((closest, id) => {

            const location = locationsData[id];
            const lineData = location.lineData;

            // inverse slope because 0 is at the top of the svg
            const slope = (lineData.rightY - lineData.leftY) / svgWidth;

            // y = mx + b
            const lineY = (slope * x) + lineData.leftY;
            const distance = Math.abs(lineY - y);

            return (distance < closest.distance)
                ? { distance, id: location.id }
                : closest;

        }, { id: null, distance: Infinity } );

        // don't update if it hasn't changed
        if (closest.id !== hoveredLocationId){
            this.setState({
                hoveredLocationId: closest.id
            });
        }
    },

    drawTick(locationId, leftOrRight) {

        const { locationsData, hoveredLocationId } = this.state;

        const location = locationsData[locationId];
        const lineData = location.lineData;

        // we won't have lineData the first render
        if (!lineData){ return; }

        const isHovered = location.id === hoveredLocationId;
        const orderData = leftOrRight === "left"
            ? location.data.orderData.left
            : location.data.orderData.right;

        const getLineVal = leftOrRight === "left"
            ? d => d.leftY
            : d => d.rightY;

        const xStart = leftOrRight === "left" ? -12 : 12;
        const xEnd = leftOrRight === "left" ? -4 : 4;

        const offsetIncrement = $(this.locations[orderData.drawLineFromId].left).height();
        const yOffset = (orderData.tieOffset * offsetIncrement) - (offsetIncrement * 1/2);

        if(orderData.isSingle || !orderData.hasTiedBefore){
            return "";
        }

        return (
            <path key={locationId}
                transform={`translate(0,${getLineVal(lineData)})`}
                d={`M${xStart},7 l0,${yOffset} l${xEnd},0`}
                fill="none"
                stroke={isHovered ? "#3b3b3b" : "#ccc"}
                strokeWidth={1}
                style={{
                    shapeRendering: "crispEdges"
                }}
            />
        );
    },

    render() {

        const { leftLocations, rightLocations, locationsData, hoveredLocationId, svgWidth, svgHeight,
            selectedFilter, selectedIndicatorId } = this.state;

        const isHovered = location => location.id === hoveredLocationId;

        const isRankDimmed = (leftOrRight, location) => {
            const hoveredLocation = locationsData[hoveredLocationId];

            // if there is no hovered location, delegate to isLoactionDimmed
            if (!hoveredLocation) { return isLocationDimmed(location); }

            const yearIndex = leftOrRightToIndex(leftOrRight);

            const thisRank = location.data.years[yearIndex].rank;
            const hoveredRank = hoveredLocation.data.years[yearIndex].rank;

            return thisRank !== hoveredRank;

        };

        const isLocationDimmed = location => {

            // we won't have this until the second render
            if (!location.lineData) { return false; }

            // if something is hovered, this takes precedence
            if (hoveredLocationId !== null){
                return !isHovered(location);
            }

            const lineData = location.lineData;

            // otherwise, check the filters
            return (
                // medicaid expanded only filter
                (selectedFilter === "med-exp"
                    && location.medicaidExpansion === false
                )
                // upward filter
                || (selectedFilter === "upward"
                    && (location.medicaidExpansion === false || (lineData.leftY <= lineData.rightY))
                )
                // downward filter
                || (selectedFilter === "downward"
                    && (location.medicaidExpansion === false || (lineData.leftY >= lineData.rightY))
                )
            );
        };

        const curveOffset = svgWidth * 0.2;

        const sortByHoveredLocationFirst = id => id === hoveredLocationId ? 1 : 0;

        return (
            <div>
                <div className="slope-chart__indicator-selector">

                    <select name="indicator" value={selectedIndicatorId} onChange={this.handleIndicatorChange}>
                        {core.overallIndicatorIds.map(id => (
                            <option key={id} value={id}>{this.props.data.indicators[id].shortName} </option>
                        ))}
                    </select>

                    <label className="input-checkbox">
                        <input type="checkbox" onChange={this.handleMedicaidChange} />
                        <span /> Medicaid Expansion States <span className="slope-chart__location-dot" />
                    </label>
                </div>
                <div className="slope-chart">
                    <div className="slope-chart__left" ref={el => this.leftDiv = el}>
                        <div className="slope-chart__column-title">Baseline Rank</div>
                        {leftLocations.map(locationId => {
                            const location = locationsData[locationId];

                            const locationClasses = classNames("slope-chart__location", {
                                "is-location-dimmed": isLocationDimmed(location),
                                "is-rank-dimmed": isRankDimmed("left", location),
                                "is-hovered": isHovered(location),
                                "is-last-in-group": location.data.orderData.left.isLastInGroup,
                                "is-first-in-group": location.data.orderData.left.isFirstInGroup,
                                "has-tied-before": location.data.orderData.left.hasTiedBefore,
                                "has-tied-after": location.data.orderData.left.hasTiedAfter,
                                "is-tied": location.data.orderData.left.isTied,
                                "is-single": location.data.orderData.left.isSingle
                            });

                            return (
                                <div className={locationClasses}
                                key={location.abbreviation}
                                onMouseEnter={this.handleLocationHover.bind(null, location.id)}
                                onMouseLeave={this.handleLocationHover.bind(null, null)}
                                ref={el => this.saveLocationRef("left", location.id, el)}>

                                    <span className="slope-chart__location-text">
                                        <span className="slope-chart__location-name">{location.name}</span>
                                        <span className="slope-chart__location-rank">{location.data.years[0].rank}</span>
                                    </span>

                                </div>
                            );
                        })}
                    </div>

                    <div className="slope-chart__lines">

                        <svg height={svgHeight} ref={el => this.svg = el} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleLocationHover.bind(null, null)}>
                            <g className="left-ticks" transform={`translate(${padding}, 0)`}>
                                {R.compose(
                                    R.map(locationId => this.drawTick(locationId, "left")),
                                    R.sortBy(sortByHoveredLocationFirst)
                                )(leftLocations)}
                            </g>
                            <g transform={`translate(${padding}, 0)`}>
                                {leftLocations.map(locationId => {
                                    if (!this.locations || !this.svg){ return null; }

                                    const location = locationsData[locationId];
                                    const lineData = location.lineData;

                                    // we won't have lineData the first render
                                    if (!lineData){ return; }

                                    const opacity = (isLocationDimmed(location)) ? 0.2 : 1;

                                    return (
                                        <path
                                            key={location.id}
                                            d={`
                                                M0,${lineData.leftY}
                                                C${curveOffset},${lineData.leftY}
                                                 ${svgWidth-curveOffset},${lineData.rightY}
                                                 ${svgWidth},${lineData.rightY}`}
                                            stroke={lineData.color}
                                            strokeWidth="2"
                                            opacity={opacity}
                                            fill="none"
                                        />
                                    );
                                })}
                            </g>
                            <g className="right-ticks" transform={`translate(${svgWidth + padding}, 0)`}>
                                {
                                    R.compose(
                                        R.map(locationId => this.drawTick(locationId, "right")),
                                        R.sortBy(sortByHoveredLocationFirst)
                                    )(rightLocations)
                                }
                            </g>
                        </svg>
                    </div>

                    <div className="slope-chart__right">
                        <div className="slope-chart__column-title">2017 Scorecard Rank</div>
                        {rightLocations.map(locationId => {
                            const location = locationsData[locationId];

                            const locationClasses = classNames("slope-chart__location", {
                                "is-location-dimmed": isLocationDimmed(location),
                                "is-rank-dimmed": isRankDimmed("right", location),
                                "is-hovered": isHovered(location),
                                "is-last-in-group": location.data.orderData.right.isLastInGroup,
                                "is-first-in-group": location.data.orderData.right.isFirstInGroup,
                                "has-tied-before": location.data.orderData.right.hasTiedBefore,
                                "has-tied-after": location.data.orderData.right.hasTiedAfter,
                                "is-tied": location.data.orderData.right.isTied,
                                "is-single": location.data.orderData.right.isSingle
                            });

                            return (
                                <div className={locationClasses}
                                key={location.abbreviation}
                                onMouseEnter={this.handleLocationHover.bind(null, location.id)}
                                onMouseLeave={this.handleLocationHover.bind(null, null)}
                                ref={el => this.saveLocationRef("right", location.id, el)}>

                                    <span className="slope-chart__location-text">
                                        <span className="slope-chart__location-rank">{location.data.years[1].rank}</span>
                                        <span className="slope-chart__location-name">{location.name}</span>
                                    </span>
                                    <span className={classNames("slope-chart__location-dot", {
                                        "is-hidden" : !location.medicaidExpansion
                                    })} />

                                </div>
                            );
                        })}
                    </div>

                </div>
                <p className="note">
                    <span className="slope-chart__location-dot" /> indicates states that expanded Medicaid under the Affordable Care Act as of January 1, 2015.
                </p>
            </div>
        );
    }
});
