import * as d3 from 'd3'

var margin = { top: 40, left: 50, right: 15, bottom: 30 }

var height = 300 - margin.top - margin.bottom

var width = 200 - margin.left - margin.right

var container = d3.select('#chart-3')

// Create your scales
var xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])
var yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

var line = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.income))

Promise.all([
  d3.csv(require('./middle-class-income.csv')),
  d3.csv(require('./middle-class-income-usa.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready([datapoints, usaDatapoints]) {
  var nested = d3
    .nest()
    .key(d => d.country)
    .entries(datapoints)

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      var svg = d3.select(this)

      svg
        .append('path')
        .datum(usaDatapoints)
        .attr('d', line)
        .attr('stroke', 'grey')
        .attr('fill', 'none')
        .attr('stroke-width', 2)

      svg
        .append('text')
        .text('USA')
        .attr('x', 10)
        .attr('y', 35)
        .attr('fill', 'grey')
        .attr('font-size', 12)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', line)
        .attr('stroke', '#9e4b6c')
        .attr('fill', 'none')
        .attr('stroke-width', 2)

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9e4b6c')
        .attr('y', -15)
        .attr('font-weight', 'bold')
        .attr('font-size', 14)

      var xAxis = d3
        .axisBottom(xPositionScale)
        .ticks(4)
        .tickFormat(d3.format('d'))
        .tickSize(-height)
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .lower()

      var yAxis = d3
        .axisLeft(yPositionScale)
        .tickValues([5000, 10000, 15000, 20000])
        .tickFormat(d3.format('$,d'))
        .tickSize(-width)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
        .lower()

      svg
        .selectAll('.tick line')
        .attr('stroke-dasharray', 2)
        .attr('stroke', 'lightgrey')

      svg.selectAll('.domain').remove()
    })
}

export { height, width, xPositionScale, yPositionScale }
