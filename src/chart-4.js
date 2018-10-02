import * as d3 from 'd3'

var margin = { top: 100, left: 10, right: 10, bottom: 30 }
var height = 500 - margin.top - margin.bottom
var width = 400 - margin.left - margin.right

var container = d3.select('#chart-4')

// Create your scales
var xPositionScale = d3
  .scaleLinear()
  .domain([-6, 6])
  .range([0, width])

var yPositionScale = d3.scaleLinear().range([height, 0])

var area = d3
  .area()
  .x(d => xPositionScale(d.key))
  .y1(d => yPositionScale(d.value))
  .y0(height)

d3.tsv(require('./climate-data.tsv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  let maxFreq = d3.max(datapoints, d => d.freq)
  yPositionScale.domain([0, maxFreq])

  let filtered = datapoints.filter(d => {
    return +d.year >= 1951 && +d.year <= 1980
  })

  let nested = d3
    .nest()
    .key(d => d.diff)
    .rollup(values => d3.mean(values, v => v.freq))
    .entries(filtered)

  let svg1951 = container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  let svg1983 = container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  let svg1994 = container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  let svg2005 = container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  function drawTemp(svg, data, minTemp, maxTemp, color) {
    let datapoints = data.filter(d => +d.key <= maxTemp && +d.key >= minTemp)

    svg
      .append('path')
      .datum(datapoints)
      .attr('d', area)
      .attr('fill', color)
      .attr('stroke-width', 0)
      .attr('opacity', 0.75)
  }

  drawTemp(svg1983, nested, -10, 10, '#f1f1f1')
  drawTemp(svg1994, nested, -10, 10, '#f1f1f1')
  drawTemp(svg2005, nested, -10, 10, '#f1f1f1')

  function drawAllAreas(svg, startYear, endYear) {
    let filtered = datapoints.filter(d => {
      return +d.year >= startYear && +d.year <= endYear
    })

    let nested = d3
      .nest()
      .key(d => d.diff)
      .rollup(values => d3.mean(values, v => v.freq))
      .entries(filtered)

    drawTemp(svg, nested, -10, -3, '#236085')
    drawTemp(svg, nested, -3, -0.9, '#96bccf')
    drawTemp(svg, nested, -0.9, 0.9, '#cac7c7')
    drawTemp(svg, nested, 0.9, 3, '#ee9f71')
    drawTemp(svg, nested, 3, 10, '#c9604b')
  }

  drawAllAreas(svg1951, 1951, 1980)
  drawAllAreas(svg1983, 1983, 1993)
  drawAllAreas(svg1994, 1994, 2004)
  drawAllAreas(svg2005, 2005, 2015)

  svg1951
    .append('text')
    .text('1951 to 1980')
    .attr('x', width / 2)
    .attr('y', -20)
    .attr('font-size', 20)
    .attr('text-anchor', 'middle')
    .style('font-weight', 'bold')

  svg1983
    .append('text')
    .text('1983 to 1993')
    .attr('x', width / 2)
    .attr('y', -20)
    .attr('font-size', 20)
    .attr('text-anchor', 'middle')
    .style('font-weight', 'bold')

  svg1994
    .append('text')
    .text('1994 to 2004')
    .attr('x', width / 2)
    .attr('y', -20)
    .attr('font-size', 20)
    .attr('text-anchor', 'middle')
    .style('font-weight', 'bold')

  svg2005
    .append('text')
    .text('2005 to 2015')
    .attr('x', width / 2)
    .attr('y', -20)
    .attr('font-size', 20)
    .attr('text-anchor', 'middle')
    .style('font-weight', 'bold')

  container.selectAll('svg > g').each(function() {
    var svg = d3.select(this)

    svg
      .append('text')
      .text('Hot')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'hanging')
      .attr('dy', 10)
      .attr('x', xPositionScale(1.95))
      .style('font-weight', 'bold')
      .attr('fill', '#ee9f71')
      .attr('y', height)
      .attr('font-size', 14)

    svg
      .append('text')
      .text('Extremely Hot')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'hanging')
      .attr('dy', 10)
      .attr('x', xPositionScale(4.5))
      .style('font-weight', 'bold')
      .attr('fill', '#c9604b')
      .attr('y', height)
      .attr('font-size', 14)

    svg
      .append('text')
      .text('Normal')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'hanging')
      .attr('dy', 10)
      .attr('x', xPositionScale(0))
      .style('font-weight', 'bold')
      .attr('fill', '#cac7c7')
      .attr('y', height)
      .attr('font-size', 14)

    svg
      .append('text')
      .text('Cold')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'hanging')
      .attr('dy', 10)
      .attr('x', xPositionScale(-1.95))
      .style('font-weight', 'bold')
      .attr('fill', '#96bccf')
      .attr('y', height)
      .attr('font-size', 14)

    svg
      .append('text')
      .text('Extremely Cold')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'hanging')
      .attr('dy', 10)
      .attr('x', xPositionScale(-4.5))
      .style('font-weight', 'bold')
      .attr('fill', '#236085')
      .attr('y', height)
      .attr('font-size', 14)

    svg
      .selectAll('.vertical-line')
      .data([-3, -0.9, 0.9, 3])
      .enter()
      .append('line')
      .attr('x1', d => xPositionScale(d))
      .attr('y1', height)
      .attr('x2', d => xPositionScale(d))
      .attr('y2', 0)
      .attr('stroke', 'lightgrey')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2 2')
  })
}
