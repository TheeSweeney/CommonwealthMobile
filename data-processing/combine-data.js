var fs = require('fs');
var R = require ('ramda');
var data = require(process.argv[2]);
var d3 = require('d3');

function parseDataPoint(row){
    return {
        year: row["DATAYEAR"],
        value: parseFloat(row["PointEstimate"]),
        rank: parseFloat(row["RANK"]),
        quartile: parseFloat(row["QUARTILE"])
    };
}

function foldLocationData(years){
    return years.reduce((accum, year) => {
        if(!accum){
            accum = {
                locId: +year["geoid"],
                change: {
                },
                years: {
                }
            };
        }

        accum.years[year["sTIME"]] = parseDataPoint(year);
        
        if(!accum.change.thresholdV1 && year["threshold_v1"]){
            accum.change.thresholdV1 = parseFloat(year["threshold_v1"]);
        }
        if(!accum.change.thresholdV2 && year["threshold_v2"]){
            accum.change.thresholdV2 = parseFloat(year["threshold_v2"]);
        }
        if(!accum.change.delta && year["DELTA"]){
            accum.change.delta = parseFloat(year["DELTA"]);
        }
        if(!accum.change.improved && year["sTIME"] === "1"){
            accum.change.improved = 
                year["improved_1std"] ? "improved-full" :
                year["improved_5std"] ? "improved-half" :
                year["worse_1std"] ? "worse-full" :
                year["worse_5std"] ? "worse-half" :
                "steady";
        }
        return accum;
    }, null);
}

// function getQuantileScale(dataGroup){
//     return d3.scale.quantile().domain(dataGroup.map(d => d["Rank"])).range(R.range(1,11));
// }

// // Deciles
// var decileScales = R.compose(R.map(R.map(getQuantileScale)), R.map(R.groupBy(x => x.stime)), R.groupBy(x => x.mxid))(data);

var grouped = R.compose(
    R.map(R.map(foldLocationData)), 
    R.map(R.groupBy(x => +x.geoid)), 
    R.groupBy(x => x.mxID))(data);

fs.writeFile(process.argv[3], JSON.stringify(grouped));




