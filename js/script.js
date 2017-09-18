const width = 1000,
 			height = 800,
 			img_width = 16,
 			img_height= 11,
 			x_offset = (window.innerWidth - width)/2,
 			y_offset = 80;

var svg = d3.select('#chart')
		.style("left", x_offset + "px")
		.append('svg')
	 	.attr('width', width)		
	 	.attr('height', height);

d3.json('countries.json', function(data){
	
	const nodes_data = data.nodes;
	const links_data = data.links;

	var simulation = d3.forceSimulation().nodes(nodes_data);

	simulation
  	.force("charge_force", d3.forceManyBody().strength(-15).distanceMax(275))
  	.force("center_force", d3.forceCenter(width / 2, height / 2))
  	.force("collide_force", d3.forceCollide(img_width).strength(0.5));

  
  var tooltip= d3.select('body').append('div')
		.style("class", "tooltip")
		.style('position', 'absolute')
		.style('background', 'white')
		.style('opacity', 0);

	
	var node = d3.select('#chart').append('div')
    .attr("class", "nodes")
    .selectAll("img")
    .data(nodes_data)
    .enter().append("img")
    .attr("class", d => "flag flag-" + d.code )
		.attr("src", "../img/blank.gif")
		.on('mouseover', function(d){
				
 			tooltip.transition()
 				.style('opacity', .9);

 			tooltip.html(d.country)
 		   	.style('left',(d3.event.pageX - 30) + 'px')
 		   	.style('top', (d3.event.pageY + 30) + 'px')
 		   	.style('padding', '5px');
 		})
 		.on('mouseout', function(){
 		 	tooltip.text('')
 		 	.style('padding', '0');
 		}); 	

	
  function tickActions() {
    node
    	.style("left", function(d) {
    		d.x = Math.max(img_width, Math.min(width - img_width, d.x));
    		return (d.x - img_width/2) + 'px' })
    	.style("top", function(d) {
    		d.y = Math.max(img_height, Math.min(height - img_height, d.y));
    		return (d.y - img_height) + 'px' });
  
  	link
    	.attr("x1", function(d) { return d.source.x; })
    	.attr("y1", function(d) { return d.source.y; })
    	.attr("x2", function(d) { return d.target.x; })
    	.attr("y2", function(d) { return d.target.y; });
	}
 	
	simulation.on("tick", tickActions );

	var link_force = d3.forceLink(links_data).id(function(d) { return d.index; });

	simulation.force("links",link_force);

	var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links_data)
    .enter().append("line")
    	.attr("stroke", "#fff")
  	  .attr("stroke-width", 1);

  var drag_handler = d3.drag()
		.on("start", drag_start)
		.on("drag", drag_drag)
		.on("end", drag_end);

	function drag_start(d) {
  	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  	d.fx = d.x;
  	d.fy = d.y;
	}

	function drag_drag(d) {
   	d.fx = Math.max(img_width, Math.min(width - img_width, d3.event.x));
  	d.fy = Math.max(img_height, Math.min(height - img_height, d3.event.y));
	}

	function drag_end(d) {
  	if (!d3.event.active) simulation.alphaTarget(0);
  	d.fx = null;
  	d.fy = null;
	}

	drag_handler(node);

});


























//const margin = { top: , right: 100, bottom: 70, left: 50 };
// const height = 600 - margin.top - margin.bottom, 
// 			width = 1000 - margin.left - margin.right,
// 			radius = 5;


// const dopingRed = '#f9294a';
// const noDoping = ' 	#2a3996';


// d3.json('cyclist-data.json', function(data){
// 	const minTime = d3.min(data, d => d.Seconds);
// 	const xyData = data.map(d => {
// 		return {X: (d.Seconds-minTime), Y: +d.Place};
// 	});
	
// 	const xExtents = d3.extent(xyData, d => d.X);
// 	const yExtents = d3.extent(xyData, d => d.Y); 
		
// 	const xScale = d3.scaleLinear()
// 		.domain([d3.min(xyData, d => d.X),
// 						 d3.max(xyData, d => d.X) + 10])
// 		.range([width, 0]);
// 	const yScale = d3.scaleLinear()
// 		.domain([d3.min(xyData, d => d.Y),
// 			       d3.max(xyData, d => d.Y) + 2])
// 		.range([0, height]);

// 	var tooltip= d3.select('body').append('div')
// 	 	.classed('tooltip', true)
// 	 	.style('position', 'absolute')
// 	 	.style('padding', '0 10px')
// 	 	.style('opacity', 0);

// 	var myGraph = svg.append('g')
// 		.attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
// 		.selectAll('g.datapoint')
// 		.data(data) 
// 		.enter().append('g')
// 		.attr('class', 'datapoint');
		
// 	myGraph.append('circle')
// 		.attr('cx', d => xScale(d.Seconds-minTime))
// 		.attr('cy', d => yScale(d.Place))
// 		.attr('r', radius)
// 		.attr('fill', d => {return d.Doping? dopingRed: noDoping;})
// 		.on('mouseover', function(d){
				
// 			tooltip.transition()
// 				.style('opacity', .9);

// 			tooltip.html(`<p> ${d.Name}: ${d.Nationality}<br/> 
// 											Place: ${d.Place}, <br />
// 											Time: ${d.Time}, <br/>
// 											Year: ${d.Year}<br/>
// 											<span>${d.Doping? d.Doping:''}</span></p>`)
// 		   	.style('left',(d3.event.pageX - 30) + 'px')
// 		   	.style('top', (d3.event.pageY + 30) + 'px');
// 		})
// 		.on('mouseout', function(){
// 		 	tooltip.text('');
// 		});

// 	myGraph.append('text')
// 		.attr('x', d => { return xScale(d.Seconds - minTime) + 10;})
// 	 	.attr('y', d => {return yScale(d.Place) + 3;})
// 	 	.attr('class', 'data-name' )
// 	 	.text(d => d.Name);

// 	var xAxisScale = d3.scaleTime()
// 	 	.domain([new Date((d3.min(xyData, d => d.X))*1000), 
// 	 					 new Date((d3.max(xyData, d => d.X) + 10)*1000)])
// 	 	.range([width, 0]);
	
// 	var yAxisScale = d3.scaleLinear()
// 	 	.domain([d3.min(xyData, d => d.Y), 
// 	 					(d3.max(xyData, d => d.Y) + 2)])
// 	 	.range([0, height]);
	
// 	var yAxis = d3.axisLeft(yAxisScale);
// 	var xAxis = d3.axisBottom(xAxisScale);

// 	yAxis.ticks(7);
// 	xAxis.ticks(7, "%M:%S");

// 	svg.append('g')
// 	 	.attr('transform', 'translate('+margin.left+','+margin.top+')')
// 	 	.call(yAxis);
// 	svg.append('g')
//  		.attr('transform', 
//  			'translate('+margin.left+', '+(height+margin.top)+')')
//  		.call(xAxis);


//  	var graphTitle =  svg.append('g')
//  		.attr('class', 'graph-title');

//  	graphTitle.append('text')	
// 	  .attr('x', 340)
// 	 	.attr('y', 30)
// 	 	.attr('class', 'chart-name')
// 	 	.text("Doping in Professional Bicycle Racing");
//  	graphTitle.append('text')	
// 	  .attr('x', 380)
// 	 	.attr('y', 60)
// 	 	.attr('class', 'chart-extra')
// 	 	.text("35 Fastest Times up Alpe d'Huez");
// 	graphTitle.append('text')
// 	 	.attr('x', 420)
// 	 	.attr('y', 85)
// 	 	.attr('class', 'span')
// 	 	.text("Normalized to 13.8 km distance");	 

// 	d3.select('svg').append('text')
// 		.attr('x', 70)
// 	 	.attr('y', 150)
// 	 	.attr('class', 'axis-title')
// 	 	.text('Ranking')
// 	 	.attr('transform', 'rotate(270, 70, 150)');

// 	d3.select('svg').append('text')
// 	 	.attr('x', 410)
// 	 	.attr('y', 580)
// 	 	.attr('class', 'axis-title')
// 	 	.text('Minutes Behind Fastest Time');

// 	//legend
// 	var legend = svg.append('g')
// 		.attr('class', 'legend')
		
// 	legend.append('circle')
// 		.attr('cx', (width - 50))
// 		.attr('cy', (height/1.5 +10))
// 		.attr('r', radius)
// 		.attr('fill', dopingRed);
// 	legend.append('circle')
// 		.attr('cx', (width - 50))
// 		.attr('cy', (height/1.5 + 40))
// 		.attr('r', radius)
// 		.attr('fill', noDoping);

// 	legend.append('text')
// 		.attr('x', (width - 40))
// 		.attr('y', (height/1.5 +13))
// 		.attr('class', 'legend-text')
// 		.text('Riders with doping allegations');	

// 	legend.append('text')
// 		.attr('x', (width - 40))
// 		.attr('y', (height/1.5 +43))
// 		.attr('class', 'legend-text')
// 		.text('No doping allegations');	
// });