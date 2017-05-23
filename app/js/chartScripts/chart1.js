var fullWidth;
var w;
var h;
var marginOne = {
  top: 35,
  bottom: 55,
  left: 30,
  right: 120
};
var width = w - marginOne.left - marginOne.right;
var height = h - marginOne.top - marginOne.bottom;

var svgOne = d3.select("#container1").append("svg")
      .classed('chart', true)
      .attr("width", w)
      .attr("height", h);
var chartOne = svgOne.append("g")
      .classed("display1", true)
      .attr("transform", "translate(" + marginOne.left + "," + marginOne.top + ")");
var xOne = d3.scale.linear()
          .domain([1980, 2014])
          .range([0, width])
var yOne = d3.scale.linear()
          .domain([0, 18])
          .range([height, 0])
var xAxis = d3.svg.axis()
              .scale(xOne)
              .orient('bottom')
              .ticks(12)
              .tickSize(0)
              .tickFormat(function(d){
                return d.toString()
              })
var yAxis = d3.svg.axis()
              .scale(yOne)
              .orient('left')
var yGridlines = d3.svg.axis()
                  .scale(yOne)
                  .tickSize(-width, 0, 0)
                  .tickFormat('')
                  .orient('left')
var line = d3.svg.line()
            .x(function(d){
              return xOne(d.year)
            })
            .y(function(d){
              return yOne(d.value)
            })
var index = 0;//used for positioning key chartOnepoints and labels
var clicked = [];//used to hold actively clicked lines

function plotChart1Axes(params){//TODO duplicated in ex4
  
  d3.select('.display1')//Note  TODO must be more efficient way to add multiline notes
    .append('text')
    .classed('chartOnenote', true)
    .attr('x', -20)
    .attr('y', height + 70)
    .classed('alignLeft', true)
    .html('GDP refers to gross domestic product.')
  d3.select('.display1')//Note
    .append('text')
    .classed('chartOnenote', true)
    .attr('x', -20)
    .attr('y', height + 80)
    .classed('alignLeft', true)
    .html('Source: OECD Health Data 2016. Note: Australia, Germany, Japan, Netherlands and Switzerland data is for current ')
  d3.select('.display1')//Note
    .append('text')
    .classed('chartOnenote', true)
    .attr('x', -20)
    .attr('y', height + 90)
    .classed('alignLeft', true)
    .html('spending only, and excludes spending on capital formation of health care providers.')

  this.append('g')
      .classed('gridline y', true)
      .attr('transform','translate(0,0)')
      .call(params.axis.gridlines)
  this.append('g')
      .classed('x axis', true)
      .attr('transform','translate(0,' + (height + 10)+ ')')
      .call(params.axis.x)
  this.append('g')
      .classed('y axis', true)
      .call(params.axis.y)

  this.select('.y.axis')//Top Label
        .append('text')
        .attr('x', 0)
        .attr('y',-20)
        .text('Percent')
}

function mouseOverFade(params){
    var countryName;
    params.country.includes(' ') ? countryName = params.country.replace(' ', ''): countryName = params.country

    function multiLineFade(opacity){
      var prefix = countryName.replace('1','').replace('2','')
      for(var i = 1; i < 3; i++){
        d3.select('#' + prefix + i + 'line').style('stroke-opacity', opacity)
      }
    }
    if(!clicked.length){
      d3.selectAll('.chartOnetrendline').style('stroke-opacity', '.1')
      d3.selectAll('.keyText').style('fill-opacity', '.1')
      d3.selectAll('.key').style('fill-opacity', '.1')
    
      d3.select('#' + countryName + 'line' ).style('stroke-opacity', '1')
      d3.select('#' + countryName + 'keyText' ).style('fill-opacity', '1')
      d3.select('#' + countryName + 'key' ).style('fill-opacity', '1')
      
      if(countryName.includes('1') || countryName.includes('2')){//if line is part of a split dataset
        multiLineFade('1');
      }
    } else if(!clicked.includes(countryName)){
      d3.select('#' + countryName + 'line' ).style('stroke-opacity', '.1')
      d3.select('#' + countryName + 'keyText' ).style('fill-opacity', '.1')
      d3.select('#' + countryName + 'key' ).style('fill-opacity', '.1')
      if(countryName.includes('1') || countryName.includes('2')){//if line is part of a split dataset
        multiLineFade('.1');
      }
    } else {
      d3.select('#' + countryName + 'line' ).style('stroke-opacity', '1')
      d3.select('#' + countryName + 'keyText' ).style('fill-opacity', '1')
      d3.select('#' + countryName + 'key' ).style('fill-opacity', '1')
      if(countryName.includes('1') || countryName.includes('2')){//if line is part of a split dataset
        multiLineFade('1');
      }
    }
}

function mouseOutFade(d){
   if(!clicked.length){ 
    d3.selectAll('.chartOnetrendline').style('stroke-opacity', '1')
     d3.selectAll('.keyText').style('fill-opacity', '1')
     d3.selectAll('.key').style('fill-opacity', '1')
   }
}

function removeInfoBox(){
  this.selectAll('#infoBubble')
      .remove();
  this.selectAll('#infoBubbleGDP')
      .remove();
  this.selectAll('#infoBubbleYear')
      .remove();
}

function infoHover(d, country){

  if(clicked.length === 0 ||  clicked.includes(country.slice(0,-8))){
    removeInfoBox.call(this)

    var minYearX = fullWidth ? 1983 : 1987;
  
    this.selectAll('#infoBubble')
      .data([d])
      .enter()
        .append('rect')
        .attr('x', function(d){
          return d.year < minYearX ? xOne(minYearX) - 60 : xOne(d.year) - 60;
        })
        .attr('y', function(d){
          return yOne(d.value) - 40;
        })
        .attr('rx', 5)
        .attr('ry', 5)        
        .attr('height', 25)
        .attr('width', 80)
        .attr('id', 'infoBubble')
        .classed( country + 'InfoBox', true)
  
    this.selectAll('#infoBubbleYear')
      .data([d])
      .enter()
        .append('text')
        .attr('x', function(d){
          return d.year < minYearX ? xOne(minYearX) - 58 : xOne(d.year) - 58;
        })
        .attr('y', function(d){
          return yOne(d.value) - 20;
        })  
        .attr('id', 'infoBubbleYear')
        .text(function(d){
          return d.year + ':';
        })
        .classed('infoBubbleData', true)
  
    this.selectAll('#infoBubbleGDP') 
      .data([d])
      .enter()
        .append('text')
        .attr('x', function(d){
          return d.year < minYearX ? xOne(minYearX) - 30 : xOne(d.year) - 30;
        })
        .attr('y', function(d){
          return yOne(d.value) - 20;
        })  
        .attr('id', 'infoBubbleGDP')
        .text(function(d){
          return d.value.toString().slice(0,4) + '%';
        })
        .classed('infoBubbleData', true)
  }

}


function plotChart1Key(params){
  var countryName;
  params.country.includes(' ') ? countryName = params.country.replace(' ', ''): countryName = params.country
  if(!params.country.includes('2')){//build lines over


    this.selectAll('.key' + countryName)
        .data([params.data])
        .enter()
          .append('rect')
          .classed('key', true)
          .attr('id', countryName + 'key')
          .attr('y', index * 16)
          .attr('x', width + 7)
          .attr('height', 2)
          .attr('width', 12)
          .on('mouseover', function(d, i){
            mouseOverFade.call(this, params);
            removeInfoBox.call(chartOne);
          })
          .on('mouseout', function(d, i){
            mouseOutFade(d);
          })
          .on('click', function(d,i){
            clicked.includes(countryName) ? clicked.splice(clicked.indexOf(countryName), 1) : clicked.push(countryName);
            mouseOverFade.call(this, params, d)
          })

    this.selectAll('.keyText' + countryName)
        .data([params.data])
        .enter()
          .append('text')
          .classed('keyText', true)
          .attr('id', countryName + 'keyText')
          .attr('y', (index * 16) + 5)
          .attr('x', width + 27)
          .text(function(){
            if(params.country.includes('1')){
              return params.country.replace('1','')
            }
            return params.country
          })
          .on('mouseover', function(d, i){
            removeInfoBox.call(chartOne);
            mouseOverFade.call(this, params);
          })
          .on('mouseout', function(d, i){
            mouseOutFade(d);
          })
          .on('click', function(d,i){
            if(countryName.includes('1') || countryName.includes('2')){//if line is part of a split dataset
              countryName = countryName.replace('1','').replace('2','')
              for(var i = 1; i < 3; i++){
                clicked.includes(countryName + i.toString()) ? clicked.splice(clicked.indexOf(countryName + i.toString()), 1) : clicked.push(countryName + i.toString());
              }
            }else{
              clicked.includes(countryName) ? clicked.splice(clicked.indexOf(countryName), 1) : clicked.push(countryName);
            }
            mouseOverFade.call(this, params, d)
          })

  
    index++;
  }

}
function plotChart1LineAndPoints(params){
    
  var countryName;
  params.country.includes(' ') ? countryName = params.country.replace(' ', ''): countryName = params.country
    //enter
  this.selectAll('.chartOnetrendline' + countryName)
    .data([params.data])
    .enter()
      .append('path')
      .classed('chartOnetrendline', true)
      .attr('id', countryName + 'line')
      .on('mouseover', function(d, i){
            mouseOverFade.call(this, params);
        })
      .on('mouseout', function(d, i){
        mouseOutFade(clicked);
      })
      .style('stroke-width', function(){
        return fullWidth ? '3px' : '2px'
      })


  this.selectAll(countryName + '.chartOnepoints')
    .data(params.data)
    .enter()
      .append('circle')
      .attr('r', function(){
        return fullWidth ? 3 : 2;
      })
      .classed(countryName + 'chartOnepoints point', true)
      .on('mouseover', function(d){
        var country = d3.select(this)[0][0].classList[0].slice(0, d3.select(this)[0][0].classList[0].length - 6);
        mouseOverFade.call(this, params);
        infoHover.call(chartOne, d, country)
      })
  //update
  this.selectAll('.chartOnetrendline')
      .attr('d', function(d){
        return line(d)
      })
  this.selectAll('.point')
      .style('fill-opacity', '0')//keep the chartOnepoints hidden
      .attr('cx', function(d){
        return xOne(d.year)
      })
      .attr('cy', function(d){
        return yOne(d.value)
      })

}

function resizeChart1(){

  removeInfoBox.call(chartOne);

  if(window.outerWidth > 914){
    fullWidth = false
    w = window.outerWidth > 1100 ? 610 : window.outerWidth * .53;
    h = .7 * w - 50;
  }else{
    window.outerWidth > 600 ? (fullWidth = true) : (fullWidth = false);
    w = window.outerWidth - 30
    h = .5 * w
  }

  width = w - marginOne.left - marginOne.right;
  height = h - marginOne.top - marginOne.bottom; 

  xOne = d3.scale.linear()
              .domain([1980, 2014])
              .range([0, width])
  yOne = d3.scale.linear()
              .domain([0, 18])
              .range([height, 0])
  xAxis = d3.svg.axis()
                .scale(xOne)
                .orient('bottom')
                .ticks(w > 400 ? 12 : 5)
                .tickSize(0)
                .tickFormat(function(d){
                  return d.toString()
                })
  yAxis = d3.svg.axis()
                .scale(yOne)
                .orient('left')
  yGridlines = d3.svg.axis()
                    .scale(yOne)
                    .tickSize(-width, 0, 0)
                    .tickFormat('')
                    .orient('left')
  index = 0 //used to plotChart1 key/keylabels

  d3.select(this.node().parentNode)//resizeChart1 SVG element
        .attr('height', h + 50)
        .attr('width', w)

  this.selectAll('g')//remove axes
      .remove();
  this.selectAll('.chartOnenote')//remove notes and header
      .remove();
  this.selectAll('.key')//remove key line
      .remove();
  this.selectAll('.keyText')//remove key labels
      .remove();
  this.selectAll('.chartOnetrendline')
      .remove();
  this.selectAll('.chartOnepoints')
      .remove();  
  d3.select('#chartOneTitle')
      .remove();

  plotChart1Axes.call(chartOne, {
    axis: {
      x: xAxis,
      y: yAxis,
      gridlines: yGridlines
    }
  })

  d3.selectAll('.x.axis .tick')[0].forEach(function(tick){
    var currentTranslate = d3.select(tick).attr('transform')
    d3.select(tick).attr('transform', currentTranslate + 'rotate(45)')
  })

  for( var Country in data){
    plotChart1LineAndPoints.call(chartOne, {//TODO factor out params obj? somewhat duplicated with plotChart1Axes
      country: Country,
      data: data[Country],
      axis: {
        x: xAxis,
        y: yAxis
      }
    })

    plotChart1Key.call(chartOne, {
      country: Country,
      data: data[Country]
    })
  }
}

resizeChart1.call(chartOne, {
  axis: {
    x: xAxis,
    y: yAxis,
    gridlines: yGridlines
  }
})

var resizeTimerOne;
window.addEventListener('resize', function(e){
  clearTimeout(resizeTimerOne)
  resizeTimerOne = setTimeout(function(){
    resizeChart1.call(chartOne)
  }, 200)
  console.log('butt')
})                  

window.addEventListener('scroll', function(){
  $(window).trigger('resize')
  console.log('sd')
})
