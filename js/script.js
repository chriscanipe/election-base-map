/* --------------------------------- */
/* ---- MAP GLOBALS ---------------- */
/* --------------------------------- */

var mapWidth = $(".the-map").width(),
    mapHeight = $(".the-map").height(),
    active = d3.select(null);

var projectionRatio = 1.1;
var mapHeightRatio = 0.52;

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([mapWidth / 2, mapHeight / 2]);

var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    //.scale(mapWidth * projectionRatio)
    .scaleExtent([1, 8]);

var zoomLevel = {
    "state" : .9,
    "district" : .3,
    "county" : .1
}

var path = d3.geo.path()
    .projection(projection);

var mapSvg = d3.select(".the-map").append("svg")
    .attr("class", "mapSvg")
    .attr("width", mapWidth)
    .attr("height", mapHeight);

mapSvg.append("rect")
    .attr("class", "background")
    .attr("width", mapWidth)
    .attr("height", mapHeight);

var mapGroup = mapSvg.append("g");

mapSvg
    .call(zoom) // delete this line to disable free zooming
    .call(zoom.event);

/* --------------------------------- */




$(document).ready(function() {
    theMap.init();
    setNav();
});


var theMap = {

    init: function() {


        queue()
            .defer(d3.json, "js/us.json")
            .defer(d3.json, "js/us-congress-113.json")
            .defer(d3.json, "js/us-counties.json")
            .await(theMap.drawMap);

        zoom.on("zoom", theMap.zoomed);
        mapSvg.on("click", theMap.stopped, true);
        mapSvg.select(".background").on("click", theMap.reset);

    },
    drawMap: function(error, us, congress, counties) {
       
            /* CLIPPING PATH DEFs RESTRICT DISTRICT BOUNDARIES */

            mapGroup.append("defs").append("path")
                .attr("id", "land")
                .datum(topojson.feature(us, us.objects.land))
                .attr("d", path);

            mapGroup.append("clipPath")
                .attr("id", "clip-land")
                .append("use")
                .attr("xlink:href", "#land");

            /* END CLIPPING PATH DEFs */ /* ------------------- */





            /* ------------------- */
            /* STATES */
            /* ------------------- */
            var mapStates =  mapGroup.append("g")
                .attr("class", "group states");

            mapStates.selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .each(function(d) {
                    d["level"] = "state";
                })
                .attr("d", path)
                .attr("class", "state feature ")
                .on("click", theMap.clicked);

            mapStates.append("path")
                .datum(topojson.mesh(us, us.objects.states, function(a, b) {
                    return a !== b;
                }))
                .attr("class", "state-boundaries")
                .attr("d", path);
            
            /* END STATES */ /* ------------------- */
            



            
            /* ------------------- */
            /* DISTRICTS */
            /* ------------------- */
            var mapDistricts = mapGroup.append("g")
                .attr("class", "group districts")
                .attr("clip-path", "url(#clip-land)");

            mapDistricts.selectAll("path")
                .data(topojson.feature(congress, congress.objects.districts).features)
                .enter().append("path")
                .each(function(d) {
                    d["level"] = "district";
                })
                .attr("class", function(d) {
                    return "dist_"+d.id+" district feature";
                })
                .attr("d", path)
                .on("click", theMap.clicked);

             mapDistricts.append("path")
                .attr("class", "district-boundaries")
                .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
                .attr("d", path);
            
            /* END DISTRICTS */ /* ------------------- */




            
            /* ------------------- */
            /* COUNTIES */
            /* ------------------- */
            var mapCounties =  mapGroup.append("g")
                .attr("class", "group counties");

            mapCounties.selectAll("path")
                .data(topojson.feature(counties, counties.objects.counties).features)
                .enter().append("path")
                .each(function(d) {
                    d["level"] = "county";
                })
                .attr("d", path)
                .attr("class", "county feature")
                .on("click", theMap.clicked);

            /* END COUNTIES */ /* ------------------- */
        


    },
    clicked: function(d) {

        /* scaleTo so we son't drill too far down on districts and counties */
        var scaleTo = zoomLevel[d.level];

        if (active.node() === this) return theMap.reset();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        /* Calculate bounds of selected geography */
        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = scaleTo / Math.max(dx / mapWidth, dy / mapHeight),
            translate = [mapWidth / 2 - scale * x, mapHeight / 2 - scale * y];

        mapSvg.transition()
            .duration(750)
            .call(zoom.translate(translate).scale(scale).event);

    },
    reset: function() {
        /* Reset zoom and position */
        active.classed("active", false);
        active = d3.select(null);

        mapSvg.transition()
            .duration(750)
            .call(zoom.translate([0, 0]).scale(1).event);
    },
    zoomed: function() {
        /* Reset stroke width on zoomed in elements */
        mapGroup.selectAll("path.state-boundaries").style("stroke-width", 2 / d3.event.scale + "px");
        mapGroup.selectAll("path.district-boundaries").style("stroke-width", .1 / d3.event.scale + "px");
        mapGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    },
    stopped: function() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
    },
    events: function() {
        /* Calls for map events live in the setNav function */
    },
    resize: function() {

        mapWidth = $(".the-map").width();
        mapHeight = mapWidth * mapHeightRatio;

        $(".the-map").css("height", mapHeight+"px");

        projection
            .scale(mapWidth * projectionRatio)
            .translate([mapWidth / 2, mapHeight / 2]);

        // resize the map container
        d3.select(".mapSvg")
            .attr("width", mapWidth)
            .attr("height", mapHeight);

        mapSvg.select('#land').attr('d', path);
        mapSvg.selectAll('path.state, path.state-boundaries').attr('d', path);

        d3.selectAll("path.district, path.district-boundaries").attr('d', path);

        d3.selectAll("path.county")
            .attr("d", path);

    }

};



function setNav() {

    $(".reset-map").on("click", function() {
        theMap.reset();
    });


    $(".btn.map-state").on("click", function() {
        var val = $(this).attr("val");

        if (val === "states") {
            d3.selectAll(".group.districts, .group.counties").style("visibility", "hidden");
            d3.selectAll(".states").style("visibility", "visible");
        } else if (val === "districts") {
            d3.selectAll(".group.states, .group.counties").style("visibility", "hidden");
            d3.selectAll(".group.districts").style("visibility", "visible");
        } else if (val === "counties") {
            d3.selectAll(".group.states, .group.districts").style("visibility", "hidden");
            d3.selectAll(".group.counties").style("visibility", "visible");
        }

    });

    $(window).resize(_.debounce(function(){
        theMap.reset();
        theMap.resize();
    }, 100));


    /*

    $(".zoom-in").on("mousedown", function() {

        var currZoom= zoom.scale();
        var newZoom = currZoom < 8 ? currZoom + 1 : currZoom;
        var translate = [mapWidth / 2, mapHeight / 2];

        mapSvg.transition()
            .duration(750)
            //.call(zoom.scale(newZoom).event);
            .call(zoom.translate(translate).scale(newZoom).event);

            translate = [mapWidth / 2 - scale * x, mapHeight / 2 - scale * y];
            
    });

*/

};




