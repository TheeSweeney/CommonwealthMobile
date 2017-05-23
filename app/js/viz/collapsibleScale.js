import R from "ramda";
import d3 from "d3";

export default function collapsibleScale(){

  let domain;
  let positions;
  let activeLoc;
  let locationHeight = 9;

  function locHeight(loc){
    if (activeLoc){
      return loc === activeLoc ? (domain.length + locationHeight): locationHeight - 1;
    }
    else {
      return locationHeight;
    }
  }

  function getPosition(activeLocId){
    return R.reduce((accum, locId) => {
      var val = accum + locHeight(locId);
      if(locId === activeLocId){
        return R.reduced(val - locHeight(locId));
      }
      return val;
    }, 0, domain);
  }

  function update(){
      positions = R.map(getPosition, R.indexBy(R.identity, domain));
  }

  const self = function(locId){

    if (typeof(positions) !== "undefined"){
        return positions[locId];
    }

  };

  self.domain = function(d){
    if(!d){
        return domain;
    }
    domain = d;
    update();
    return self;
  };

  self.range = function(){
    return R.compose(R.sort(d3.ascending), R.values)(positions);
  };

  self.height = function(){
    return d3.max(R.values(positions)) + locHeight(R.last(domain));
  };

  self.locationHeight = function(){
      return locationHeight;
  };

  self.activeLocationHeight = function(){
      return domain.length + locationHeight;
  };

  self.activeLoc = function(loc){
    activeLoc = loc;
    update();
    return self;
  };

  self.totalHeight = function(){
      return domain.length * locationHeight;
  };

  self.rangeTop = function(){
    return self(R.head(domain));
  };

  self.rangeMiddle = function(){
    return self.height()/2 + self(domain[0]);
  };

  self.rangeBottom = function(){
    const last = R.last(domain);
    return self(last) + locHeight(last);
  };

  return self;
}
