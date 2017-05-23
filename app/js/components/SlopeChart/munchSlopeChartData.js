import R from "ramda";
import * as core from "../../data/core.js";
import d3 from "d3";
import { ascending, compare }
    from "../../data/compare.js";


export const leftOrRightToIndex = leftOrRight =>
    leftOrRight === "left" ? 0   // location.year[0]
  : leftOrRight === "right" ? 1  // location.year[1]
  : console.error(`leftOrRight should be "left" or "right" but was given ${leftOrRight}!`);

export default function munchSlopeChartData ({ cleanData, indicators, locations }, selectedIndicatorId){

    /* validate selectedIndicatorId */
    if (R.not(R.contains(selectedIndicatorId, core.overallIndicatorIds))) {
        console.error("invalid selectedIndicatorId: ", selectedIndicatorId);
        return;
    }

    const states = R.filter(core.notUsLocation, locations); // keep only states


    /* helper functions */

    // get the selected indicator data for the given location
    const getIndicatorData = locationId => cleanData[selectedIndicatorId][locationId];
    const getRankChange = locationData => locationData.years[0].rank - locationData.years[1].rank;


    /* make arrays of ID's of the left and right ordered by rank */

    // make a compare function for the given year (0 or 1)
    const compareRank = leftOrRight => {
        const yearIndex = leftOrRightToIndex(leftOrRight);
        return compare(location => getIndicatorData(location.id).years[yearIndex].rank, ascending);
    };

    // @param {String} leftOrRight : "left" or "right"
    const processLocations = leftOrRight => R.compose(
        R.map(R.prop("id")),
        R.sort(compareRank(leftOrRight)),
        R.values // transform object > array
    )(states);

    // make arrays or location IDs ordered by year ranks
    const leftLocations = processLocations("left");

    const rightLocations = processLocations("right");




    /* munch indicator data to make locationsData */

    /**
     * areSameRank: look at the location before and after to see if they have the same rank
     * @param  {String} leftOrRight : "left" or "right"
     * @param  {Object} locationId1 : ID of a location
     * @param  {Object} locationId2 : ID of a location
     * @return {Boolean}  True if location1 and location2 have the same rank
     *                     at the given year (leftOrRight)
     */
    const areSameRank = R.curry((leftOrRight, locationId1, locationId2) => {

        const l1 = getIndicatorData(locationId1);
        const l2 = getIndicatorData(locationId2);

        if (!l1 || !l2) { return false; }

        const yearIndex = leftOrRightToIndex(leftOrRight);

        const rank1 = l1.years[yearIndex].rank;
        const rank2 = l2.years[yearIndex].rank;

        return rank1 === rank2;
    });


    /**
     *  process the locations for left and right, using the locationsData
     *  @param {Object} location: { id, name, abbreviation, medicaidExpansion }
     *  @return {Array} : arrays of objects like this:
     *  {
     *      hasTiedAfter: Boolean,
     *      hasTiedBefore: Boolean,
     *      drawLineFromId: Number: if this location is tied with one or more above,
     *          this will be the id of that one on top. ie. from where the
     *          line for this location should be drawn
     *  }
     */
    const getOrderData = (leftOrRight, location) => {

        // array of id's either the leftLocations or rightLocations
        const orderedStates = (leftOrRight === "left") ? leftLocations
                            : (leftOrRight === "right") ? rightLocations
                            : console.error(`leftOrRight should be "left" or "right" but was given ${leftOrRight}!`);



        const findTopTiedId = (j) => {

            const currentLocationId = orderedStates[j];
            const previousLocationId = orderedStates[j-1];

            // if j-1 is a valid index and it's the same rank, recurse
            if (previousLocationId && areSameRank(leftOrRight, currentLocationId, previousLocationId)){
                return findTopTiedId(j-1);
            }
            else {
                // otherwise, this is the top, return the id
                return currentLocationId;
            }
        };

        const index = R.findIndex(R.equals(location.id), orderedStates);
        const firstIndexOfRank = R.findIndex(areSameRank(leftOrRight, location.id), orderedStates);

        const hasTiedBefore = areSameRank(leftOrRight, orderedStates[index], orderedStates[index-1]);
        const hasTiedAfter = areSameRank(leftOrRight, orderedStates[index], orderedStates[index+1]);
        const isLastInGroup = hasTiedBefore && !hasTiedAfter;
        const isFirstInGroup = !hasTiedBefore && hasTiedAfter;
        const isTied = hasTiedAfter || hasTiedBefore;
        const isSingle = !hasTiedAfter && !hasTiedBefore;
        const tieOffset = index - firstIndexOfRank;

        return {
            hasTiedBefore, hasTiedAfter, isLastInGroup, isFirstInGroup, isTied, isSingle, tieOffset,
            drawLineFromId: findTopTiedId(index)
        };
    };


    // augment the location data
    const munchIndicatorData = location => {

        const locationData = getIndicatorData(location.id);

        return {
            // calculate change in rank
            change: {
                rank: getRankChange(locationData)
            },
            years: locationData.years,
            orderData: {
                left: getOrderData("left", location),
                right: getOrderData("right", location)
            }
        };
    };

    const locationsData = R.compose(
        R.map(l => R.merge(l, { data: munchIndicatorData(l) }))
    )(states);





    return {
        leftLocations,
        rightLocations,
        locationsData
    };

}
