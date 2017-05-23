var fs = require('fs');
var R = require ('ramda');
var indicatorsFromData = require(process.argv[2]);
var indicators = require(process.argv[3]);

function parseIndicator(ind){
    return {
        order: +ind["order"],
        dimension: ind["Dimension"],
        id: ind["ID"],
        longName: ind["LongName"],
        shortName: ind["ShortName"],
        direction: ind["Direction"],
        dataType: ind["DataType"],
        label: ind["IndicatorLabel"]
    };
}

function foldIndicators(indicators){
    return indicators.reduce((accum, ind) => {
        if(!accum){
            accum = {
                years: {}
            };
        }
        if(!accum.years[ind["sTIME"]]){
            accum.years[ind["sTIME"]] = ind["DATAYEAR"];
        }
        return accum;
    }, null);
}

function replaceYearDash(indicator){
    indicator.years = R.map(function(y){
        return y.replace(/[-]/g, "–");
    }, indicator.years);
    return indicator;
}

var groupedFromData = R.compose(/*R.map(replaceYearDash), */R.map(foldIndicators), R.groupBy(R.prop('mxID')))(indicatorsFromData);
var fromIndicators = R.map(parseIndicator, indicators);

// Combine the two
var displayOrderComparator = R.comparator((a, b) => a.order < b.order);
var combined = R.compose(
    R.indexBy(R.prop('id')),
    R.sort(displayOrderComparator),
    R.map(ind => R.assoc('years', groupedFromData[ind.id].years, ind)))(fromIndicators);


//var grouped = R.compose(R.values, R.map(foldIndicators), R.groupBy(R.prop('mxid')))(indicators);

fs.writeFile(process.argv[4], JSON.stringify(combined));