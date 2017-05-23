import R from "ramda";
import $ from "jquery";
window.jquery = $;
import "typeahead.js";

export function simpleSource(accessor, options){
    return function findMatches(q, cb) {
      const testOption = R.compose(R.test(new RegExp(q, "i")), accessor);
      cb(R.filter(testOption, R.values(options)));
    };
}

export function zipHrrSource(hrrs, zips){

  const normalMatch = simpleSource(hrr => hrr.name, hrrs);

  return function findMatches(q, cb){

    // Match zipcode
    const zipMatch = zips[q];

    if(zipMatch){
      cb([hrrs[zipMatch.hrr]]);
    }
    else{
      normalMatch(q, cb);
    }
  };
}


export function createTypeAhead(selector, labelKey, source, handleSelected){

    // blur the input on touch away
    function handleTouchAway(e) {
      if (!$(e.target).closest(".tt-menu").length){
        closeTypeahead();
      }
    }

    function closeTypeahead(){
      $(selector).removeClass("tt-open");
      // this blur is important on touch devices
      $(selector).blur();
      window.removeEventListener("touchstart", handleTouchAway, true);
    }


    let typeaheadValue = "";


    $(selector).typeahead({
        hint: true,
        highlight: true,
        minLength: 0
      }, {
        displayKey: labelKey,
        limit: 500,
        source: source
      })
    .on("typeahead:select", function(e, suggestion, dataset) {
      handleSelected(suggestion);
    })
    .on("typeahead:open", function(e){
      $(selector).addClass("tt-open");
      window.addEventListener("touchstart", handleTouchAway, true);

      // grab the value so we can restore it later if needed
      // for some reason $(selector).typeahead("val") doesn't work
      // even though the docs say it should...
      typeaheadValue = $(this).val();

      // clear the selection so the user can choose something else
      $(selector).typeahead("val", "");
    })
    .on("typeahead:close", function(e){

      // restore the value if nothing else was selected
      if ($(this).val() === "" && typeaheadValue){
        $(selector).typeahead("val", typeaheadValue);
      }

      typeaheadValue = "";

      closeTypeahead();
    });

    return {
      setValue: (val) => {
        // if the user set this value, save it
        typeaheadValue = val;
        $(selector).typeahead("val", val);
      }
    };
}
