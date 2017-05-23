var fs = require('fs');
var R = require ('ramda');
var locations = require(process.argv[2]);

var mapped = locations.map(function(l){
	return {
		id: +l.geoid,
		name: l.state,
        abbreviation: l.st,
        medicaidExpansion: l['MEDICAID_EXPAND'] === 'Yes'
	};
});

fs.writeFile(process.argv[3], JSON.stringify(R.indexBy(x => +x.id, mapped)));




