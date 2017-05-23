$(document).ready(function(){

var currentDataSet = dataSet.dataOverall.data;
var currentTitle = dataSet.dataOverall.title
var w;
var h;

if(window.outerWidth > 914){
  fullWidth = false
  w = window.outerWidth > 1100 ? 600 : window.outerWidth * .53;
  h = .617647 * w - 50;
}else{
  window.outerWidth > 600 ? (fullWidth = true) : (fullWidth = false);
  w = window.outerWidth - 30
  h = .5 * w
}

var margin = {
  top: 0,
  bottom: 60,
  left: 15,
  right: 30
};
var categories = [1,2,3,4,5]
var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

var controls = d3.select('#container3')
                .insert('div')
                .attr('id', 'controls');

var svg = d3.select("#container3").insert("svg")
      .classed('chart', true)
      .attr("width", w)
      .attr("height", h + 50);

var chart = svg.append("g")
      .classed("display", true)
      .attr("transform", "translate(" + margin.left + "," + (margin.top + 50) + ")");

var x = d3.scale.linear()
          .domain(d3.extent(dataSet.dataOverall.data, function(d){
            return d.rank;
          }))
          .range([10, width]);

var xPoints = d3.scale.linear()
          .domain(d3.extent(dataSet.dataOverall.data, function(d){
            return d.rank;
          }))
          .range([50, width]);

var y = d3.scale.linear()
          .domain([-1, d3.max(dataSet.dataOverall.data, function(d){
            return d.value + .1;
          })])
          .range([height, 0])
var linearColorScale = d3.scale.linear()
                        .domain([0, dataSet.dataOverall.data.length])
                        .range(['#4ABDBC','#044C7F']);

var xAxis = d3.svg.axis()
              .scale(x)
              .orient('bottom')
              .ticks(0)
              .tickSize(0)

var yAxis = d3.svg.axis()
              .scale(y)
              .orient('left')
              .ticks(0)

var line = d3.svg.line()
      .x(function(d){
        return x(d.date);
      })
      .y(function(d){
        return y(d.value);
      });
//color gradient for y axis
var defs = svg.append('defs')

var gradient = defs.append('linearGradient')
                  .attr('id', 'svgGradient')
                  .attr('x1', '0%')
                  .attr('x2', '0%')
                  .attr('y1', '0%')
                  .attr('y2', '100%')
gradient.append('stop')
        .attr('class', 'start')
        .attr('offset', '0%')
        .attr('stop-color', '#4ABDBC')
        .attr('stop-opacity', 1);

gradient.append('stop')
        .attr('class', 'end')
        .attr('offset', '100%')
        .attr('stop-color', '#044C7F')
        .attr('stop-opacity', 1);
//sorting buttons
//TODO make button creation DRYer
var sort_overAll_btn = controls.append('button')
                .html('Overall')
                .attr('id', 'overAllBtn')
                .classed('btn', true)
var sort_quality_btn = controls.append('button')
                .html('Quality')
                .attr('id', 'qualityBtn')
                .classed('btn', true)
var sort_access_btn = controls.append('button')
                .html('Access')
                .attr('id', 'accessBtn')
                .classed('btn', true)
var sort_admin_btn = controls.append('button')
                .html('Administrative Efficiency')
                .attr('id', 'adminBtn')
                .classed('btn', true)
var sort_equity_btn = controls.append('button')
                .html('Equity')
                .attr('id', 'equityBtn')
                .classed('btn', true)
var sort_outcomes_btn = controls.append('button')
                .html('Health Outcomes')
                .attr('id', 'outcomesBtn')
                .classed('btn', true)
function drawAxesAndLabels(params){
  
  var axesLabels = {
    top: 'Higher Performing',
    bottom: 'Lower Performing'
  }

  function yAxesAndLabels() {//TODO factor out to prevent code repition in this and exhibit 5
    this.append('g')//y axis
        .classed('y axis', true)
        .attr('transform', 'translate(0,0)')
        .call(params.axis.y)


    this.select('.y.axis')//Top Label
        .append('text')
        .style('font-size', '18px')
        .style('fill', '#4ABDBC')
        .attr('x',-10)
        .attr('y',-20)
        .text(axesLabels.top)

    this.select('.y.axis')//Bottom Label
        .append('text')
        .style('font-size', '18px')
        .style('fill', '#044C7F')
        .attr('x',-10)
        .attr('y', height + 35)
        .text(axesLabels.bottom)    
    this.select('.domain')
        .attr("fill", "url(#svgGradient)")

    this.select('g')//top Triangle
        .append('path')
        .attr('d', function(d){
          return 'M 22,40 42,40 32,22 z';
        })
        .attr('transform', 'translate(-35,-35)')
        .style('fill', '#4ABDBC')


    this.select('g')//bottom Triangle
        .append('path')
        .attr('d', function(d){
          return 'M 22,28 42,28 32,46 z';
        })
        .attr('transform', 'translate(-35,' + (height - 30) + ')')
        .style('fill', '#044C7F')
  }


  if(!params.initialize){//replot y axis on resize
    this.select('.y.axis')
        .remove()
    yAxesAndLabels.call(this)
  }

  if(params.initialize){
    yAxesAndLabels.call(this) 
  }

  //calc average
  var average = (params.data.reduce(function(acc, val){
      return acc + val.value
    }, 0))/params.data.length

  var avgData = [
    {value: average, date: 1, label: "Eleven-country Average"},
    {value: average, date: 11}
  ]

  //enter
  this.selectAll('.avgLine')
      .data([avgData])
      .enter()
          .append('path')
          .classed('avgLine', true)

  this.selectAll('.avgLabel')
  .data(avgData)
  .enter()
    .append('text')
    .classed('avgLabel', true)

  //update
  this.selectAll('.avgLine')
      .transition()
      .duration(800)
      .attr('d', function(d){
        return line(d);
      })
      
  this.selectAll('.avgLabel')
      .transition()
      .duration(800)
      .attr('x', function(d, i){
        return x(d.date)
      })
      .attr('y', function(d, i){
        return y(d.value) + 18;
      })
      .attr('fill', 'black')
      .text(function(d, i){
        return d.label
      })

  //exit
  this.selectAll('.avgLine')
      .data([avgData])
      .exit()
      .remove();

    this.selectAll('.avgLabel')
      .data(avgData)
      .exit()
      .remove()


}
function buttonFocus(d){
  if(selectedPoints.length){
    d3.selectAll('.point')
    .attr('fill-opacity', '.4')

    d3.selectAll('.pointLabel')
    .attr('fill-opacity', '.4')
  
    selectedPoints.forEach(function(country){
      d3.select('#' + country + 'point')
        .attr('fill-opacity', '1')
      d3.select('#' + country + 'label')
        .attr('fill-opacity', '1')
    })
  }else{
    d3.selectAll('.point')
    .attr('fill-opacity', '1')
    d3.selectAll('.pointLabel')
    .attr('fill-opacity', '1')
  }
}

var selectedPoints = []

function plot(params){


  //dynamically adjust y axis onClick/resize
  var yUpdate = d3.scale.linear()
          .domain([0, d3.max(params.data, function(d){
            return d.value + .1;
          })])
          .range([params.height, 0])
  //dynamically adjust x axis on resize
  var xPointsUpdate = d3.scale.linear()
                        .domain(d3.extent(params.data, function(d){
                          return d.rank;
                        }))
                        .range([50, params.width])

  drawAxesAndLabels.call(this, params)

  d3.select('#note')
    .remove()
  d3.select('.display')//Note
        .append('text')
        .attr('id', 'note')
        .attr('x',0)
        .attr('y', params.height + 50)
        .classed('alignLeft', true)
        .html('Note: See the methodology appendix for a description of how the performance score is calculated.')
  //TODO: factor out text for labels, and note so plot() can but used on different charts
  
  //enter()
  this.selectAll('.point')
      .data(params.data)
      .enter()
        .append('circle')
        .classed('point', true)
        .attr('r', 4)
        .style('fill', function(d,i){
          return linearColorScale(i)
        })
        .on('click', function(d,i){
          selectedPoints.includes(d.country) ? selectedPoints.splice(selectedPoints.indexOf(d.country), 1) : selectedPoints.push(d.country);
          buttonFocus.call(this, d);
          console.log(d)
        })

  this.selectAll('.pointLabel')
      .data(params.data)
      .enter()
        .append('text')
        .classed('pointLabel', true)
        .on('click', function(d,i){
          selectedPoints.includes(d.country) ? selectedPoints.splice(selectedPoints.indexOf(d.country), 1) : selectedPoints.push(d.country);
          buttonFocus.call(this, d);
          // console.log(d)
        })
        

  //update
  this.selectAll('.point')
      .transition()
      .duration(800)
      .style('fill', function(d, i){
        return linearColorScale(d.rank)
      })
      .attr('cx', function(d){
        return xPointsUpdate(d.rank);
      })
      .attr('cy', function(d){
        return yUpdate(d.value)
      })
      .attr('id', function(d){
        return (d.country + 'point');
      })
  this.selectAll('.pointLabel')
    .transition()
    .duration(800)
    .attr('x', function(d, i){
      return xPointsUpdate(d.rank) - d.country.length*5;
    })
    .attr('y', function(d, i){
      return yUpdate(d.value) - 7;
    })
    .attr('fill', 'black')
    .text(function(d, i){
      return d.country
    })
    .attr('id', function(d){
      return (d.country + 'label');
    })


  //exit()
  this.selectAll('.point')
      .data(params.data)
      .exit()
      .remove();
  this.selectAll('.pointLabel')
      .data(params.data)
      .exit()
      .remove();
  this.selectAll('#note')
      .data(params.data)
      .exit()
      .remove();

}

function resizeChart3(params){
 if(window.outerWidth > 914){
    fullWidth = false
    w = window.outerWidth > 1100 ? 600 : window.outerWidth * .53;
    h = .617647 * w - 50;
  }else{
    window.outerWidth > 600 ? (fullWidth = true) : (fullWidth = false);
    w = window.outerWidth - 30
    h = .5 * w
  }

  height = params.height = h - margin.top - margin.bottom;
  width = params.width = w - margin.left - margin.right;
  
  x = d3.scale.linear()
          .domain(d3.extent(params.data, function(d){
            return d.rank;
          }))
          .range([10, params.width]);

  y = d3.scale.linear()
          .domain([0, d3.max(params.data, function(d){
            return d.value + .1;
          })])
          .range([params.height, 0])


  params.axis.x = d3.svg.axis()
                  .scale(x)
                  .orient('bottom')
                  .ticks(d3.time.days, 7)
                  .tickFormat(d3.time.format('%m/%d'))
  params.axis.y = d3.svg.axis()
              .scale(y)
              .orient('left')
              .ticks(0)

  x.range[10, width] 
 
 //change chart size
  d3.select(this.node().parentNode)
        .attr('height', h + 50)
        .attr('width', w);

  this.select('g')
      .remove()

  plot.call(this, params)
}

function selectBtn(btnID){
  $('.selectedBtn').removeClass('selectedBtn')
  $('#'+btnID).addClass('selectedBtn')
}


sort_overAll_btn.on('click', function(d){
  
  selectBtn($(this)[0].id)
  currentDataSet = dataSet.dataOverall.data;
  currentTitle = dataSet.dataOverall.title;
  resizeChart3.call(chart, {
    data: currentDataSet,
    title: currentTitle,
    axis: {
      x: xAxis,
      y: yAxis
    },
  initialize: false,
  height: height,
  width: width
  })
})
//TODO function factory
sort_quality_btn.on('click', function(d){
  
  selectBtn($(this)[0].id)
  currentDataSet = dataSet.qualityData.data;
  currentTitle = dataSet.qualityData.title;
  resizeChart3.call(chart, {
    data: currentDataSet,
    title: currentTitle,
    axis: {
      x: xAxis,
      y: yAxis
    },
  initialize: false,
  height: height,
  width: width
  })
})

sort_access_btn.on('click', function(d){
  
  selectBtn($(this)[0].id)
  currentDataSet = dataSet.accessData.data;
  currentTitle = dataSet.accessData.title;
  resizeChart3.call(chart, {
    data: currentDataSet,
    title: currentTitle,
    axis: {
      x: xAxis,
      y: yAxis
    },
  initialize: false,
  height: height,
  width: width
  })
})

sort_admin_btn.on('click', function(d){
  
  selectBtn($(this)[0].id)
  currentDataSet = dataSet.adminData.data;
  currentTitle = dataSet.adminData.title;
  resizeChart3.call(chart, {
    data: currentDataSet,
    title: currentTitle,
    axis: {
      x: xAxis,
      y: yAxis
    },
  initialize: false,
  height: height,
  width: width
  })
})

sort_equity_btn.on('click', function(d){
  
  selectBtn($(this)[0].id)
  currentDataSet = dataSet.equityData.data;
  currentTitle = dataSet.equityData.title;
  resizeChart3.call(chart, {
    data: currentDataSet,
    title: currentTitle,
    axis: {
      x: xAxis,
      y: yAxis
    },
  initialize: false,
  height: height,
  width: width
  })
})

sort_outcomes_btn.on('click', function(d){
  
  selectBtn($(this)[0].id)
  currentDataSet = dataSet.outcomesData.data;
  currentTitle = dataSet.outcomesData.title;
  resizeChart3.call(chart, {
    data: currentDataSet,
    title: currentTitle,
    axis: {
      x: xAxis,
      y: yAxis
    },
  initialize: false,
  height: height,
  width: width
  })
})



plot.call(chart, {
  data: currentDataSet,
  title: currentTitle,
  axis: {
    x: xAxis,
    y: yAxis
  },
  initialize: true,
  height: height,
  width: width
});

var resizeTimerThree;
//responsive bahavior
window.addEventListener('resize', function(e){
  clearTimeout(resizeTimerThree);
  resizeTimerThree = setTimeout(function(){
    if(window.outerWidth < 1100){
      resizeChart3.call(chart, {
        data: currentDataSet,
        title: currentTitle,
        axis: {
          x: xAxis,
          y: yAxis
        },
        initialize: false,
      });
    }
  }, 200)
}, true)

})
