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

var marginFive = {
  top: 15,
  bottom: 60,
  left: 100,
  right: 45
};
var width = w - marginFive.left - marginFive.right;
var height = h - marginFive.top - marginFive.bottom;

var svgFive = d3.select("#container5").append("svg")
      .classed('chart', true)
      .attr("width", w)
      .attr("height", h);
var chartFive = svgFive.append("g")
      .classed("display5", true)
      .attr("transform", "translate(" + marginFive.left + "," + marginFive.top + ")");
var xFive = d3.scale.linear()
          .domain([1.02,1.2])
          .range([0, width])
var yFive = d3.scale.linear()
          .domain([0,1.5])
          .range([height,0])
var xAxisFive = d3.svg.axis()
              .scale(xFive)
              .orient('bottom')
              .ticks(0)
var yAxisFive = d3.svg.axis()
              .scale(yFive)
              .orient('left')
              .ticks(0)
var linearColorScale = d3.scale.linear()
                        .domain([1, 11])
                        .range(['#4ABDBC','#044C7F']);
var lineFive = d3.svg.line()
      .x(function(d){
        return xFive(d.x);
      })
      .y(function(d){
        return yFive(d.y);
      });
//color gradient for y axis
var defs = svgFive.append('defs')

var yGradient = defs.append('linearGradient')//TODO prob more efficient way to do these gradients
                  .attr('id', 'svgYGradient')
                  .attr('x1', '0%')
                  .attr('x2', '0%')
                  .attr('y1', '0%')
                  .attr('y2', '100%')
yGradient.append('stop')
        .attr('class', 'start')
        .attr('offset', '0%')
        .attr('stop-color', '#4ABDBC')
        .attr('stop-opacity', 1);

yGradient.append('stop')
        .attr('class', 'end')
        .attr('offset', '100%')
        .attr('stop-color', '#044C7F')
        .attr('stop-opacity', 1);

var xGradient = defs.append('linearGradient')
                  .attr('id', 'svgXGradient')
                  .attr('x1', '0%')
                  .attr('x2', '100%')
                  .attr('y1', '0%')
                  .attr('y2', '0%')
xGradient.append('stop')
        .attr('class', 'start')
        .attr('offset', '0%')
        .attr('stop-color', '#4ABDBC')
        .attr('stop-opacity', 1);

xGradient.append('stop')
        .attr('class', 'end')
        .attr('offset', '100%')
        .attr('stop-color', '#044C7F')
        .attr('stop-opacity', 1);


function yAxesAndLabelsFive(params, height, width) {//TODO factor out to prevent code repition in this and exhibit 3
    this.append('g')//y axis
        .classed('y axis grad', true)
        .attr('transform', 'translate(0,0)')
        .call(params.axis.y)
    
    this.append('g')//x axis
        .classed('x axis grad', true)
        .attr('transform', 'translate(10,' + (height + 10) + ')')
        .call(params.axis.x)

    this.select('.y.axis')// yAxisFive Top Label
        .append('text')
        .classed('axisText', true)
        .style('fill', '#4ABDBC')
        .attr('x', -58)
        .attr('y',10)
        .text('Higher')

    this.select('.y.axis')
        .append('text')
        .classed('axisText', true)
        .style('fill', '#4ABDBC')
        .attr('x', -95)
        .attr('y',27)
        .text('health system')

    this.select('.y.axis')
        .append('text')
        .classed('axisText', true)
        .style('fill', '#4ABDBC')
        .attr('x', -90)
        .attr('y', 44)
        .text('performance')

     this.select('.y.axis')// yAxisFive Bottom Label
        .append('text')
        .classed('axisText', true)
        .style('fill', '#044C7F')
        .attr('x', -56)
        .attr('y', height - 20)
        .text('Lower')

    this.select('.y.axis')
        .append('text')
        .classed('axisText', true)
        .style('fill', '#044C7F')
        .attr('x', -95)
        .attr('y', height - 3)
        .text('health system')

    this.select('.y.axis')
        .append('text')
        .classed('axisText', true)
        .style('fill', '#044C7F')
        .attr('x', -90)
        .attr('y', height + 14)
        .text('performance')    

    this.select('.x.axis')// xAxisFive Left Label
        .append('text')
        .classed('axisText', true)
        .style('fill', '#4ABDBC')
        .attr('x', 0)
        .attr('y', 30)
        .text('Lower health care spending')

    this.select('.x.axis')// xAxisFive Right Label
        .append('text')
        .style('text-anchor', 'end')
        .classed('axisText', true)
        .style('fill', '#044C7F')
        .attr('x', width)
        .attr('y', 30)
        .text('Higher health care spending')

    this.select('g')//yTop Triangle
        .append('path')
        .attr('d', function(d){
          return 'M 22,40 42,40 32,22 z';
        })
        .attr('transform', 'translate(-35,-35)')
        .style('fill', '#4ABDBC')


    this.select('g')// yBottom Triangle
        .append('path')
        .attr('d', function(d){
          return 'M 22,28 42,28 32,46 z';
        })
        .attr('transform', 'translate(-35,' + (height - 35) + ')')
        .style('fill', '#044C7F')

    this.select('g')// xLeft Triangle
        .append('path')
        .attr('d', function(d){
          return 'M 22,40 42,40 32,22 z';
        })
        .attr('transform', 'translate(-25,' + (height + 45) + ') rotate(270)')
        .style('fill', '#4ABDBC')


    this.select('g')// xRight Triangle
        .append('path')
        .attr('d', function(d){
          return 'M 22,28 42,28 32,46 z';
        })
        .attr('transform', 'translate(' + (width - 20) + ',' + (height + 45) + ') rotate(270)')
        .style('fill', '#044C7F')


    //average/avg line
    var avgData = [//TODO Average line helper
      {y: 1.0016, x: 1.025, label: "Eleven-country Average"},
      {y: 1.0016, x: 1.2}
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
        .attr('d', function(d){
          return lineFive(d);
        })
        
    this.selectAll('.avgLabel')
        .attr('x', function(d, i){
          return xFive(d.x)
        })
        .attr('y', function(d, i){
          return yFive(d.y) + 15;
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

function plotFive(params){

  //enter
  this.selectAll('.point')
      .data(params.data)
      .enter()
          .append('circle')
          .classed('point', true)
  this.selectAll('.pointLabel')
      .data(params.data)
      .enter()
        .append('text')
        .classed('pointLabel', true)
  //update
  this.selectAll('.point')//data points
      .attr('r', function(){
        return fullWidth ? 4 : 3;
      })
      .attr('cx', function(d){
        return xFive(d.x)
      })
      .attr('cy', function(d){
        return yFive(d.y)
      })
      .style('fill', function(d,i){
        return linearColorScale(i)
      })
  this.selectAll('.pointLabel')// country labels of data points
    .attr('x', function(d, i){
      if(d.labelX === 'left') return fullWidth ? (xFive(d.x) - d.country.length*11) : (xFive(d.x) - (d.country.length*11) + 3);
      if(d.labelX === 'right') return xFive(d.x) + 5; 
      if(d.labelX === 'center') return xFive(d.x) - 20;     
    })
    .attr('y', function(d, i){
      if(d.labelY === 'top') return yFive(d.y) - 2;
      if(d.labelY === 'center') return yFive(d.y) + 5;
      if(d.labelY === 'bottom') return yFive(d.y) + 25;       
    })
    .attr('fill', 'black')
    .text(function(d, i){
      return d.country
    })
    .style('font-size', function(){
      return fullWidth ? '15px' : '13px'
    })
  //exit
  this.selectAll('.point')
    .data(params.data)
    .exit()
    .remove()
  this.selectAll('.pointLabel')
    .data(params.data)
    .exit()
    .remove();
}

function resizeFive(params){
  if(window.outerWidth > 914){
    fullWidth = false
    w = window.outerWidth > 1100 ? 600 : window.outerWidth * .53;
    h = .617647 * w - 50;
  }else{
    window.outerWidth > 600 ? (fullWidth = true) : (fullWidth = false);
    w = window.outerWidth - 30
    h = .5 * w
  }

  width = w - marginFive.left - marginFive.right;
  height = h - marginFive.top - marginFive.bottom;

  xFive = d3.scale.linear()
        .domain([1.02,1.2])
        .range([0, width])
  yFive = d3.scale.linear()
        .domain([0,1.5])
        .range([height,0])

  xAxisFive = d3.svg.axis()
              .scale(xFive)
              .orient('bottom')
              .ticks(0)
  yAxisFive = d3.svg.axis()
              .scale(yFive)
              .orient('left')
              .ticks(0)

  var params = {
      data: chart5data,
      axis: {
        x: xAxisFive,
        y: yAxisFive
      }
  }

  d3.select(chartFive.node().parentNode)//resize svg element
      .attr('height', h)
      .attr('width', w)

  chartFive.selectAll('g')//remove axes and average line
      .remove();
  
  yAxesAndLabelsFive.call(chartFive, params, height, width)

  plotFive.call(chartFive, params)

  
}


yAxesAndLabelsFive.call(chartFive, {
    data: chart5data,
    axis: {
      x: xAxisFive,
      y: yAxisFive
    }
  }, height, width)

plotFive.call(chartFive, {
  data: chart5data,
  axis: {
    x: xAxisFive,
    y: yAxisFive
  }
})

window.addEventListener('resize', function(){
  resizeFive.call(chart);
  console.log('th')
})

