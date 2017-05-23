$( document ).ready(function(){

var tableWidth = window.outerWidth > 1100 ? 1100 : window.outerWidth - 20;

if(tableWidth < 943) tableWidth = 943;//table minimum width

var w = 432;
var h = 250;
var margin = {
  top: 30,
  bottom: 25,
  left: 20,
  right: 20
};
var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

var createTable = function(params){
    var currentRow;

    d3.select("#container2")
        .append("table")
        .style("border-collapse", "collapse")
        .style('width', tableWidth + "px")
        .selectAll("tr")
        .data(params.data)
        .enter()
            .append("tr")
            .classed('softBlue', true)
            .attr('id', function(d,i){
                if(d[0] === 'header') return 'headerRow'
                if(d[0].replace(' ','').length < 3) return ('blank' + i)
                return d[0].split(' ').join('') + 'Row'
            })
            .classed('bookEnd', function(d){
              if(d[0] === 'OVERALL RANKING' || d[0] === 'Health Spending per Capita*') return true  
            })
           
            
     .selectAll("td")
        .data(function(d){
          return d;
        })
        .enter().append("td")
        .style("padding", "10px")
        .style('display', function(d){
            if(d === ' ') return 'none';
        })
        .style('color', function(d){
            if(d === 'header') return 'rgb(4,76,127)';
        })
        .attr('colspan', function(d){
            if(d === '   ') return 13;
        })
        .text(function(d){
          return d;
        })
        .attr('id', function(d){
          if(d.length > 2) currentRow = d; //set current row name 
        })
        .classed('leftAlign', function(d){
          if(d.length > 4) return true;
        })

    d3.selectAll('.leftAlign')
      .append('text')
      .html(function(d){
        if(d !== 'header' && d !=="OVERALL RANKING") return '+'
      })
      .attr('id', function(d){
        if(d !== 'header' && d !=="OVERALL RANKING") return d.split(' ').join('') + "PlusMinus"
      })
      .classed('plusMinus', function(d){
        return (d !== 'header' && d !=="OVERALL RANKING")
      })
        
    $('#container2').find("tr:odd").addClass("odd");
    $('#container2').find("tr:not(.odd)").hide();
    $('#container2').find("tr:first-child").show();
    $('#container2').find("#headerRow").addClass('odd')
    $('#container2').find("#blank0").css('display', 'none')


}

createTable({
    data: tableData
})

var initial = true;
var selectedSubsection, 
activeSubsection,
questionClicked, 
svgTwo, 
chartTwo, 
xTwo, 
yTwo, 
activeQuestion, 
activeRowId, 
currentRow, 
questionSets;
var questionSet = [];


function createChart(dataSet, range, axisLabel){

  if(initial){
    svgTwo = d3.select(".activeRow").append("svg")
          .attr("id", "chartTwo")
          .attr("width", w)
          .attr("height", h);
    chartTwo = svgTwo.append("g")
          .attr('id', 'display')
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svgTwo.insert('text')//Title
        .attr('x', 35)
        .attr('y', h/2)
        .attr('id', 'directions')
        .html("Select a question or measure to see data")
  }

  var x = d3.scale.ordinal()
            .domain(dataSet.map(function(entry){
              return entry.country;
            }))
            .rangeBands([0, width])

  var y = d3.scale.linear()
            .range([height, 0])
  if(range){
      y.domain(range)
  }else{
      y.domain([0, d3.max(dataSet, function(d){
          return d.value
        })
      ])   
  }

  function plot(params){

    d3.select('#yAxisLabel').remove();

    //enter
    this.selectAll('.bar')
          .data(params.data)
          .enter()
            .append('rect')
            .classed('bar', true)
    this.selectAll('.barLabel')
          .data(params.data)
          .enter()
            .append('text')
            .classed('barLabel', true)

    if(!initial){

      d3.select('#display')//Top Label
        .append('text')
        .attr('x', 0)
        .attr('y',-10)
        .attr('id', 'yAxisLabel')
        .html(axisLabel)

      d3.select('#directions').remove();

      this.selectAll('.percentage')
          .data(params.data)
          .enter()
            .append('text')
            .classed('percentage', true)
      this.selectAll('.noData')
          .data(params.data)
          .enter()
            .append('text')
            .classed('noData', true)
    }
    
    //update
      this.selectAll('.bar')
          .transition()
          .duration(500)
          .attr('x', function(d,i){
            return x(d.country)
          })
          .attr('y', function(d,i){
            return y(d.value);
          })
          .attr('height', function(d,i){
            return height - y(d.value)
          })
          .attr('width', function(d,i){
            return x.rangeBand() - 3;
          })
      this.selectAll('.percentage')
          .attr('x', function(d,i){
            if(currentRow === "HealthCareOutcomesRow" && d.value%1 == 0){
              return d.value < 10 ? x(d.country) + 12 : x(d.country) + 10
            }

            if(d.value === 0 ){
              return x(d.country) + 2
            }else if(d.value < 10){
              return x(d.country) + 8;
            }else{
              return  x(d.country) + 4;
            }
          })
          .attr('y', function(d,i){
            if(d.value === 0 || d.value < 0 ){
              return y(0)
            }else if(d.value < 10){
              return y(d.value) - 2;
            }else{
              return (y(d.value) + 15)
            }
          })
          .text(function(d,i){
            if(axisLabel.slice(0, 7) !== 'Percent') return d.value
            return d.value === 0 ? 'Data' : (d.value + '%');
          })
          .attr('fill', function(d,i){
            return d.value < 10 ? 'black' : 'white';
          })
       this.selectAll('.noData')
          .attr('x', function(d,i){
            return x(d.country) + 7;
          })
          .attr('y', function(d,i){
            return y(d.value) - 15;
          })
          .text(function(d,i){
            return d.value === 0 ? 'No' : '';
          })
    
    this.selectAll('.barLabel')
        .attr('x', function(d,i){
              var bump = 1;
              if(d.country.length === 2){
                bump = 10;
              }else if(d.country.length === 3){
                bump = 3;
              }
              return x(d.country) + bump
            })
        .attr('y', height + 15)
        .text(function(d,i){
          return d.country
        })
  }

  plot.call(chartTwo,{
    data: dataSet,
    axes: {
      x: x,
      y: y
    }
  });

    initial = false;

}



function questionClick(d, subsectionId){

  questionClicked = true;

  d3.select('.selectedQuestion').remove()

  var questionId = d.q.split(' ').join('') + 'Id'
  activeQuestion = questionId;

  d3.select(".activeRow")
    .append('text')
    .attr('id', function(){
      return questionId;
    })
    .html(function(){
      return d.q;
    })
    .classed('selectedQuestion', true)
  d3.selectAll('.subsectionBar')
    .style('opacity', function(d,i){
      return (d.questionSet.split(' ').join('') + 'Id') === activeSubsection ? 1 : .3;
    })

  if(!d.yAxisLabel) d.yAxisLabel = 'Percent'

  createChart(d.data, d.range, d.yAxisLabel);
}

function createQuestionSet(){

  var subsectionId = $(this).attr('id')
  var alreadyActive = false;
  var subSectionPassed = false;

  d3.selectAll('.subsectionBar')
    .style('height', '20px')

  if(subsectionId !== activeSubsection){

    questionClicked = false;

    activeSubsection = subsectionId;
    
    d3.selectAll('.subsectionBar')
      .style('display', function(){
        var display = subSectionPassed ? 'none' : 'initial';
        if (d3.select(this).attr('id') === activeSubsection) subSectionPassed = true
        return display;
      });

    $('#' + subsectionId).show();
    
    d3.select(this).style('height', '200px');
    
    d3.select('#' + this.id.slice(0, -2) + 'QuestionSet').selectAll('.subsectionQuestions')
      .data(function(d){
        return d.sectionData
      })
      .enter()
        .append('div')
        .text(function(d){
          return d.q
        })
        .style('height', '50px')
        .classed('question', true)
        .on('click', function(d){
          questionClick.call(this, d, subsectionId)
          if(questionClicked) selectedSubsection = subsectionId;
        })
    
    d3.selectAll('#' + this.id.slice(0, -2) + 'QuestionSet')
      .style('border-top', function(){
        if(d3.select(this).attr('id').slice(0,-11) === activeSubsection.slice(0,-2)) return '3px solid rgb(255,96,0)'
          return ''
      })
  
  }else{
    d3.selectAll('.questionSet')
      .html('')
      .style('border-top', '');
    d3.select(this).style('height', '20px');
    activeSubsection = '';
    $('.subsectionBar').show();
    d3.selectAll('.subsectionBar')
    .style('opacity', function(d,i){
      return (d.questionSet.split(' ').join('') + 'Id') === selectedSubsection ? 1 : .3;
    })
    .classed('notActive', function(){
      return ((d.questionSet.split(' ').join('') + 'Id') !== selectedSubsection)
    })
  }
}

function createSubsections(rowId){

  d3.select('.selectedQuestion').remove();
  questionSets = [];

  d3.select('#chartTwo').remove();
  d3.selectAll('.subsectionBar').remove();
  initial = true;

  var activeSubset = subsectionData[rowId.slice(0, -3) + 'Questions'];

  createChart(subsectionData.emptyChart);

  d3.select('.activeRow').selectAll('.subsectionBar')
    .data(activeSubset)
    .enter()
      .append('text')
      .html(function(d){
        questionSets.push(d.questionSet);
        return d.questionSet;
      })
      .attr('id', function(d){
        return (d.questionSet.split(' ').join('') + 'Id');
      })
      .style('height', '20px')
      .style('width', '50%')
      .style('position', 'relative')
      .classed('subsectionBar', true)
        .classed('subsectionBar', true)
        .append('text')
          .attr('id', function(d){
            return d.questionSet.split(' ').join('') + 'PlusMinus';
          })
          .style('float', 'right')
          .html('&#x25bc;');
  if(rowId = 'EquityRow'){
    d3.select('#EquityMeasuresId')
      .append('div')
      .attr('id', 'equityNote')
      .html('Difference Between Low- and High-Income Individuals')    
  }

  d3.selectAll('.subsectionBar')
    .append('div')
    .style('max-height', '90%')
    .style('overflow', 'auto')
    .classed('questionSet', true)
    .attr('id', function(d, i){
      return d.questionSet.split(' ').join('') + 'QuestionSet';
    });

  
  d3.selectAll('.subsectionBar')
    .on('click', function(){
      createQuestionSet.call(this);
      d3.select(this).style('opacity', 1);
    });



}

function openSubsection(data){
  currentRow = $(this).attr('id');
  var alreadyActive = false;
  var rowId = $(this).attr('id');

  d3.selectAll('.questionSet')
      .remove();

  d3.selectAll('.plusMinus')
    .html('+');

  d3.select('#' + currentRow.slice(0, -3) + 'PlusMinus')
    .html('-');

  if( currentRow === activeRowId) alreadyActive = true;

  activeRowId = rowId;
    
  d3.select('.activeRow').classed('activeRow', false);
  
  $('#' + rowId).next("tr").find('td').addClass('activeRow');
  $('#container2').find("tr:not(.odd)").hide();
  $('#' + rowId).next("tr").toggle();
  
  if(alreadyActive){
    d3.select('#' + currentRow.slice(0, -3) + 'PlusMinus')
      .html('+');

    $('#' + rowId).next('tr').toggle();
    d3.select('.activeRow').classed('activeRow', false);

    activeRowId = 'none';
  }

  createSubsections.call(this, rowId);
}

  var observer = new MutationObserver(function(mutations) {    
    if(mutations.length == 2){
      d3.select('.selectedQuestion').style('z-index', '0').style('color', 'rgb(238,123,59)')
    } else {
      
      d3.select('.selectedQuestion').style('z-index', '-1').style('color', 'white')
    }
  });

  var config = { attributes: true, childList: true, characterData: true };
  
d3.selectAll('.odd')
    .on('click', function(){
      var id = d3.select(this).attr('id');
      if(id !== 'OVERALLRANKINGRow' && id !== 'headerRow'){
      
        openSubsection.call(this)

        d3.selectAll('.subsectionBar')
          .style('opacity', 1)        
        for (var i = 0; i < questionSets.length; i++){
          var target = document.querySelector('#' + questionSets[i].split(' ').join('') + 'QuestionSet')          
          observer.observe(target, config);
        }
      }
    })
})









