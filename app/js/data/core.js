import R from "ramda";
import d3 from "d3";

// Dimension
export const dimensionNames = {
    "ACCESS": "Access and Affordability",
    "QUALITY": "Prevention and Treatment",
    "USE": "Avoidable Hospital Use and Costs",
    "LIVES": "Healthy Lives"
};

// Indicator
export const overallIndicatorIds = ["OVERALL", "a100", "q100", "u100", "h100"];

export const isOverallIndicator = ind => R.contains(ind.id, overallIndicatorIds);

export const isNotOverallIndicator = R.complement(isOverallIndicator);

export const lowerIsBetter = ind => ind.direction === "Low";

// Location

export const isUsLocation = R.propEq("id", 0);

export const notUsLocation = R.complement(isUsLocation);

// Data point
export const hasChangeData = dp => dp.change && !R.isNil(dp.change.delta);

export const magnitudeOfChange = dp => !hasChangeData(dp)
    ? 0
    : Math.abs(dp.change.delta / dp.years[0].value);

export const directionCorrectedPercentChange = (ind, dp) => magnitudeOfChange(dp) * (lowerIsBetter(ind) ? -1 : 1);

export const statusOrder = {"worse": 0, "steady": 1, "improved": 2};

export const status = dp => dp.change.improved || "steady";

export const dataPointOrderByStatus = R.compose(R.prop(R.__, statusOrder), status);

export const getOverallIndicatorChange = dp => dp.years[0].rank - dp.years[1].rank;

export const getChange = R.curry((ind, dp) => isOverallIndicator(ind) ? getOverallIndicatorChange(dp) : dp.change.delta);

export const overallIndicatorChangeStatus = dp => {
    const change = getOverallIndicatorChange(dp);
    return change > 0 ? "improved" : change < 0 ? "worse" : "steady";
};

export const getChangeStatus = R.curry((ind, dp) => isOverallIndicator(ind) ? overallIndicatorChangeStatus(dp) : dp.change.improved);

export const getData = R.curry((ind, year, dp) => isOverallIndicator(ind) ? dp.years[year].rank : dp.years[year].value);

export const latestYearValue = dp => dp.years[1].value;

function formatNumberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatValue = R.curry(function(ind, value, sup){
    if(ind.dataType === "percent"){
        return value + (sup ? "<sup>%</sup>" : "%");
    }
    else if(ind.dataType === "dollars"){
        return (sup ? "<sup>$</sup>" : "$") + formatNumberWithCommas(value);
    }
    else if(ind.dataType === "rank"){
        return (sup ? "<sup>#</sup>" : "#") + value;
    }
    else{
        return value;
    }
});

export const indicatorHasHistoricalData =
    R.curry((data, ind) => R.any(d => !R.isNil(d.years[0].value), R.values(data[ind.id])));

export function calculateDifferenceDescription(data) {
    const max = d3.max(data),
        min = d3.min(data);

    const diffRate = max/min;

    if(diffRate < 2){
        return Math.round((diffRate - 1) * 100) + "%";
    }

    return Math.round(diffRate) + "x";
}
