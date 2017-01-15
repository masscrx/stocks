'use strict';

module.exports = function() {
  return {
    restrict: 'EA',
    scope: {
      data: '='
    },
    replace: true,
    link: function(scope, element, attrs) {
      console.log('d3 directive link scope: ', scope);

      // Set the dimensions of the chart
      var margin = { top: 20, right: 20, bottom: 35, left: 50 };
      var width = 950 - margin.left - margin.right;
      var height = 300 - margin.top - margin.bottom;

      // Parse the date / time
      var parseDate = d3.time.format('%Y-%m-%d').parse;

      // Set the ranges
      var x = d3.time.scale()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height, 0]);

      // Define the axes
      var xAxis = d3.svg.axis()
          .scale(x)
          .tickFormat(xAxisFormat)
          .orient('bottom');

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left');

      // Define axis format
      var xAxisFormat = d3.time.format.multi([
        ['%b.', function(d) { return d.getMonth(); }],
        ['%Y', function() { return true; }]
      ]);

      yAxis.tickFormat(d3.format('$'));

      // Define the line
      var color = d3.scale.category10();

      var lineGen = d3.svg.line()
          .x(function(d) { return x(parseDate(d.date)); })
          .y(function(d) { return y(d.close); });

      // Adds the svg canvas
      var svg = d3.select(element[0]).append('svg')
          .attr('width', '100%')
          .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // watch the data source for changes to dynamically update the visualization
      scope.$watch('data', function(newData, oldData) {
        console.log('chart directive data changed', newData);
        return newData.length > 0 ? scope.render(newData) : svg.selectAll('*').remove();
        //return scope.render(newData);
      }, true);

      scope.render = function(data) {
        console.log('d3 directive render data: ', data);

        var unsortedData = [];
        data.forEach(function(d) {
          for (var i = 0; i < d.values.length; i++) {
            unsortedData.push(d.values[i]);
          };
        });

        // Define domain
        x.domain(d3.extent(unsortedData, function(d) { return parseDate(d.date); }));
        y.domain(d3.extent(unsortedData.map(function(d) { return d.close; })));

        // if no y axis exists, create one
        if (svg.selectAll('.y.axis')[0].length < 1) {
          svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        // otherwise, update the axis
        } else {
          svg.selectAll('.y.axis').transition().duration(1500).call(yAxis);
        }

        // if no x axis exists, create one
        if (svg.selectAll('.x.axis')[0].length < 1) {
          svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        // otherwise, update the axis
        } else {
          svg.selectAll('.x.axis').transition().duration(1500).call(xAxis);
        }

        // if no zero axis exists, create one
        if (svg.selectAll('.zeroAxis')[0].length < 1) {
          svg.append('line')
            .attr('class', 'zeroAxis');
        // otherwise, update the axis
        } else {
          svg.select('.zeroAxis')
            .transition().duration(1000)
            .attr({
              x1: 0,
              x2: width,
              y1: y(0),
              y2: y(0)
            });
        }

        // Draw the lines
        var lines = svg.selectAll('.line').data(data).attr('class', 'line');

        // transition from previous paths to new paths
        lines.transition().duration(1000)
          .attr('d', function(d) { return lineGen(d.values); })
          .style('stroke', function(d) { return color(d.key); });

        // enter any new lines
        lines.enter().append('path')
            .attr('class', 'line')
            .attr('d', function(d) { return lineGen(d.values); }).style('stroke', 'blue')
            .style('stroke', function(d) { return color(d.key); });

        // exit
        lines.exit().remove();

        // Legend
        var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('height', 100)
        .attr('width', width)
        .attr('transform', 'translate(100,0)');

        legend.selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
        .attr('x', width - 65)
          .attr('y', function(d, i) { return i *  20;})
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d) {
            return color(d.key);
          });

        legend.selectAll('text')
          .data(data)
          .enter()
          .append('text')
        .attr('x', width - 52)
          .attr('y', function(d, i) { return i *  20 + 9;})
        .text(function(d) {
          return d.key;
        });
      };
    }
  };
};
