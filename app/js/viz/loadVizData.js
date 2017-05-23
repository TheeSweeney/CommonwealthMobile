import d3 from "d3";
import R from "ramda";

const endpoints = [
    "data/data.json",
    "data/indicators.json",
    "data/locations.json"];

const zipCodeEndpoint = "data/zipcodes.csv";

function loadZipCodeData(){

    return new Promise(function (resolve, reject){
        d3.csv(zipCodeEndpoint)
            .row(d => ({
                zip: d.zip,
                hrr: +d.hrr
            }))
            .get(function(error, rows){
                if(error) reject(error);

                resolve(R.indexBy(R.prop("zip"), rows));
            });
    });
}

export function loadVizData(){

	var jsonPromises = endpoints.map(e => {
		return fetch(e)
			.then(response => response.json());
	});

    jsonPromises.push(loadZipCodeData());

	return Promise.all(jsonPromises)
		.then(jsons => {
			const [ cleanData, indicators, locations, zips ] = jsons;
			return { cleanData, indicators, locations, zips };
		});
}
