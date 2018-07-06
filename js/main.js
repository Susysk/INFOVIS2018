
// get the data
d3.csv("csv/deaths.csv", function(error, links) {

    var nodes = {};

// Compute the distinct nodes from the links.
    links.forEach(function(link) {
        link.source = nodes[link.source] ||
            (nodes[link.source] = {name: link.source,
                qualcosa: link.death_episode,
                causa:link.execution,
            })
        link.target = nodes[link.target] ||
            (nodes[link.target] = {name: link.target});
        link.value = +link.value;
    });
    var width = window.innerWidth,
        height = window.innerHeight;
    var hovercard = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("width",400);


    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(200)
        .charge(-300)
        .on("tick", tick)
        .start();

    const svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

// build the arrow.
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

// add the links and the arrows
    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
        //    .attr("class", function(d) { return "link " + d.type; })
        .attr("class", "link")
        .attr("marker-end", "url(#end)");
    var color = d3.scale.category20();
    var  colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

// define the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .on("mouseover", function(d) {
            if(d.name==1 || d.name==2|| d.name==3|| d.name==4|| d.name==5|| d.name==6|| d.name==7){
                var tip =
                    "<h2> Season: "+d.name+"</h2>";
            }
            else {
                var tip =
                    "<h2>  " + d.name + "</h2>" +
                    "<h4> " + d.causa + "</h4>";
            }
            hovercard.transition()
                .duration(500)
                .style("opacity", 1);

            hovercard.html(tip)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");



        })
        .on("mouseout", function(d) {

            hovercard.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .call(force.drag)

    var c10 = d3.scale.category10();
// add the nodes
    path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" +
            d.source.x + "," +
            d.source.y + "A" +
            dr + "," + dr + " 0  0,1 " +
            d.target.x + "," +
            d.target.y;
    });
    node.append("circle")
        .attr("r", 8)
        .style("fill", function (d) {
            var fill = d

            return colors[d.qualcosa]
        })

    ;
    svg.selectAll("circle")
        .append("circle");


// add the text
    node.append("text")
        .attr("x", 10)
        .attr("dy", ".35em")

        .text(function(d) { return d.name; })
        .style("font-size", function(d) {return 2.4*d.qualcosa+1})
        .style("fill", function(d) {return colors[d.qualcosa] })
    ;

// add the curvy lines
    function tick() {

        path.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" +
                d.source.x + "," +
                d.source.y + "A" +
                dr + "," + dr + " 0  0,1 " +
                d.target.x + "," +
                d.target.y;
        });

        node
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; })

        path.on("mouseover", function(d) {

            /* var tip =
                 "<h2>" + d.source.name+ "</h2>" +
                 "<h4> " +d.execution +"</h4>";
             hovercard.transition()
                 .duration(500)
                 .style("opacity", 1);

             hovercard.html(tip)
                 .style("left", (d3.event.pageX) + "px")
                 .style("top", (d3.event.pageY) + "px");*/


        })
    }
    path.on("mouseout", function(d) {

        /*hovercard.transition()
            .duration(500)
            .style("opacity", 0);*/
    });

    node
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"; });


});
