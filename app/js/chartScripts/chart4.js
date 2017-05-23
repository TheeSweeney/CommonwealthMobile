
var wFour;
var hFour;
var marginFour = {
  top: 50,
  bottom: 0,
  left: 40,
  right: 40
};
var widthFour = wFour - marginFour.left - marginFour.right;
var heightFour = hFour - marginFour.top - marginFour.bottom;

var svgFourg = d3.select('#container4').append('svg')
            .classed('chart', true)
            .attr('width', wFour)
            .attr('height', hFour)
var chart = svgFourg.append('g')
              .classed('displayFour', true)
              .attr('transform','translate(' + marginFour.right  + ',' + marginFour.top + ')')
var controls = d3.select('#container4')
                .append('div')
                .attr('id', 'controls');
var x = d3.scale.linear()
          .domain([-.5, chart4data['2014Ascending'].length-.5])
          .range([0, widthFour])
var y = d3.scale.linear()
          .domain([0, 160])
          .range([heightFour, 0])
var xAxis = d3.svg.axis(x)
              .orient('bottom')
              .tickFormat(function(d){
                return
              })
              .tickSize(0)

var yAxis = d3.svg.axis()
              .scale(y)
              .orient('left')
              .tickSize(5)
var sort2014_btn = controls.append('button')
                      .html('Sort Best to Worst by 2014 rate')
                      .attr('id','sort2014btn')
                      .classed('btn', true)
var sortMost_btn = controls.append('button')
                      .html('Sort by most improved')
                      .attr('id','sortmostbtn')
                      .classed('btn', true)


function plotAxes(params){//duplicated in ex1

  this.select('.x.axis').remove()
  this.select('.y.axis').remove()

  this.append('g')
      .classed('x axis', true)
      .attr('transform','translate(0,' + height + ')')
      .call(params.axis.x)
  this.append('g')
      .classed('y axis', true)
      .attr('transform','translate(0,0)')
      .call(params.axis.y)

  this.select('.y.axis')//Top Label
        .append('text')
        .style('font-size', '12px')
        .style('fill', '#808080')
        .attr('x', 10)
        .attr('y',-20)
        .text('Deaths per 100,000 population')

  this.select('.y.axis')// old key point
      .append('circle')
      .attr('r', 4)
      .attr('fill', 'rgb(250, 202, 168)')
      .attr('cx', widthFour - 100)
      .attr('cy', -30)

  this.select('.y.axis')// new key point
      .append('circle')
      .attr('r', 4)
      .attr('fill', 'rgb(243, 123, 49)')
      .attr('cx', widthFour - 100)
      .attr('cy', -15)

   this.select('.y.axis')// old key point
      .append('text')
      .attr('r', 4)
      .attr('x', widthFour - 90)
      .attr('y', -30)
      .text('2004')
      .classed('chart4keyText', true)

  this.select('.y.axis')// new key point
      .append('text')
      .attr('r', 4)
      .attr('x', widthFour - 90)
      .attr('y', -15)
      .text('2014')
      .classed('chart4keyText', true)
}

function plotLines(params){
  //enter
  this.selectAll('.bar')
      .data(params.data)
      .enter()
        .append('rect')
        .classed('bar', true)
        .attr('id', function(d){
          return d.country + 'bar';
        })
  //update
  this.selectAll('.bar')
      .transition()
      .duration(500)
      .attr('x', function(d,i){
        return x(d.rank - 1)
      })
      .attr('y', function(d,i){
        return y(d[params.year])
      })
      .attr('width', 1)
      .attr('height', function(d,i){
        return params.year == '2004' ? y(d['2014']) - y(d[params.year]) : heightFour - y(d[params.year])
      })
  //exit
  this.selectAll('.bar')
      .data(params.data)
      .exit()
      .remove();
}

// function plotDelta(params){
//   //enter
//   this.selectAll('.deltaBar')
//       .data(params.data)
//       .enter()
//         .append('rect')
//         .classed('deltaBar bar', true)
//         .attr('id', function(d){
//           return d.country + 'deltaBar';
//         })
//   //update
//   this.selectAll('.deltaBar')
//       .transition()
//       .duration(500)
//       .attr('x', function(d,i){
//         return x(d.rank - 1)
//       })
//       .attr('y', function(d,i){
//         return y(d[params.year])
//       })
//       .attr('width', 1)
//       .attr('height', function(d,i){
//         return y(d['2014']) - y(d[params.year])
//       })
//   //exit
//   this.selectAll('.deltaBar')
//       .data(params.data)
//       .exit()
//       .remove();
// }

function infoBox(d){
  this.append('rect')
      .attr('x', function(){
        return x(d.rank - 1) - 35;
      })
      .attr('y', function(){
        return y(d['2004']) - 55
      })
      .attr('width', 70)      
      .attr('height', 45)
      .attr('fill', 'white') 
      .attr('stroke', '#808080')
      .attr('rx', 5)
      .attr('id', d.country + 'InfoBox')
      .classed('infoBox', true)

  this.append('text')// text top line
      .attr('x', function(){
        return x(d.rank - 1) - 28;
      })
      .attr('y', function(){
        return y(d['2004']) - 38;
      })
      .attr('id', d.country + 'OldInfoText')
      .classed('info', true)
      .text(function(){
        return (Math.round(d['2004'] - d['2014']) + ' fewer')
      })
  this.append('text')// text bottom line
      .attr('x', function(){
        return x(d.rank - 1) - 28;
      })
      .attr('y', function(){
        return y(d['2004']) - 18;
      })
      .attr('id', d.country + 'NewInfoText')
      .classed('info', true)
      .text('deaths')
}

function removeChart4InfoBox(d){
    this.select('#' + d.country + 'InfoBox')
        .remove()
    this.select('#' + d.country + 'OldInfoText')
        .remove()
    this.select('#' + d.country + 'NewInfoText')
        .remove()
    this.select('#' + d.country + 'OldInfoNumber')
        .remove()
    this.select('#' + d.country + 'NewInfoNumber')
        .remove()
}


function plotPoints(params){
  //enter
  this.selectAll('.'+params.class)
      .data(params.data)
      .enter()
          .append('circle')
          .classed(params.class, true)
          .on('mouseenter', function(d){
            infoBox.call(chart, d)
          })
          .on('mouseleave', function(d){
            removeChart4InfoBox.call(chart, d)
          })
  this.selectAll('.label')
      .data(params.data)
      .enter()
          .append('text')
          .classed('label', true)
          .on('mouseenter', function(d){
            infoBox.call(chart, d)
          })
          .on('mouseleave', function(d){
            removeChart4InfoBox.call(chart, d)
          })

  //update
  this.selectAll('.' + params.class)
      .transition()
      .duration(500)
      .attr('r', 4)
      .attr('cx', function(d,i){
        return x(d.rank - 1)
      })
      .attr('cy', function(d,i){
        return y(d[params.year])
      })
  this.selectAll('.label')
      .transition()
      .duration(500)
      .attr('x', function(d){
        return x(d.rank - 1) - (d.country.length * 2.5)
      })
      .attr('y', heightFour + 15)
      .attr('fill', 'black')
      .text(function(d, i){
        return d.country
      })
  //exit
  this.selectAll('.' + params.class)
      .data(params.data)//TODO factor this and following two lines into single function
      .exit()
      .remove();
  this.selectAll('.label')
      .data(params.data)
      .exit()
      .remove()
}

sort2014_btn.on('click', function(){
  plot('2014', chart4data['2014Ascending']);
})

sortMost_btn.on('click', function(){
  plot('2004', chart4data['diffMost']);
})

plotAxes.call(chart, {
  axis: {
    x: xAxis,
    y: yAxis
  }
})

function plot(year, data) {
  plotLines.call(chart,{
    data: data,
    year: year
  })


  plotPoints.call(chart, {
    data: data,
    year: '2004',
    class: 'oldPoints'
  })

  plotPoints.call(chart, {
    data: data,
    year: '2014',
    class: 'newPoints'
  })
}

function resize4(params){
  if(window.outerWidth > 914){
    fullWidth = false
    wFour = window.outerWidth > 1100 ? 600 : window.outerWidth * .53;
    hFour = .617647 * wFour - 50;
  }else{
    window.outerWidth > 600 ? (fullWidth = true) : (fullWidth = false);
    wFour = window.outerWidth - 30
    hFour = .5 * wFour 
  }

  widthFour = wFour - marginFour.left - marginFour.right;
  heightFour = hFour - marginFour.top - marginFour.bottom;

  x = d3.scale.linear()
        .domain([-.5, chart4data['2014Ascending'].length-.5])
        .range([0, widthFour])
  y = d3.scale.linear()
        .domain([0, 160])
        .range([heightFour, 0])
  xAxis = d3.svg.axis(x)
            .orient('bottom')
            .tickFormat(function(d){
              return
            })
            .tickSize(0)

  yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .tickSize(0)
  
  d3.select(this.node().parentNode)//resize SVG element
        .attr('height', hFour + 50)
        .attr('width', wFour)

  this.selectAll('g')//remove axes
      .remove();
  d3.selectAll('.chart4keyText')
      .remove();
  this.selectAll('chart4keyText')
      .remove();  
  d3.select('#chart4Title')
      .remove();

  plotAxes.call(chart, {
    axis: {
      x: xAxis,
      y: yAxis
    }
  })

  plot('2014', chart4data['2014Ascending'])

}

resize4.call(chart);

window.addEventListener('resize', function(){
  resize4.call(chart)
})