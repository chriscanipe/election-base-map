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







/* --------------------------------- */
/* ---- D3 GLOBALS ---------------- */
/* --------------------------------- */

d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};

d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

/* ---------------------------- */













var theColors = {
    "DD" : "#0672a0",
    "RR" : "#c2253a",
    "II" : "#61BC60",
    "D" : "#9BC7D9",
    "R" : "#E7A8B0",
    "I" : "#C0E4BF"
}

var theData = {
    senate : {},
    house : {},
    gov : {}
}

var currView = "senate";









$(document).ready(function() {
    loading();
    theData.init();
    setNav();
});


function loading() {

    var lw = $(".loading").width();
    var lh = $(".loading").height();

    $(".loading").css({
        "left" : (mapWidth/2) - (lw/2)+"px",
        "top" : (mapHeight/2) - (lh/2)+"px",
        "display" : "block"
    });
}


var theData = {


    init: function() {
        queue()
            .defer(d3.json, "aptest/top_governorresults.json")
            .defer(d3.json, "aptest/top_houseresults.json")
            .defer(d3.json, "aptest/top_senateresults.json")
            //.defer(d3.json, "aptest/TX_other_county.json")
            .await(theData.setData);
    },
    setData: function(error, gov, house, senate, texas) {

        console.log(gov);
        console.log(house);
        console.log(senate);

        theData.senate = senate;
        theData.house = house;
        theData.gov = gov;

        theMap.init();
    }
}










var theMap = {

    init: function() {


        queue()
            .defer(d3.json, "js/us.json")
            .defer(d3.json, "js/us-congress-113.json")
            .defer(d3.json, "js/us-counties.json")
            .defer(d3.json, "js/cities.json")
            .await(theMap.drawMap);

        zoom.on("zoom", theMap.zoomed);
        mapSvg.on("click", theMap.stopped, true);
        mapSvg.select(".background").on("click", theMap.reset);

    },
    drawMap: function(error, us, congress, counties, cities) {
       
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
                    var fips = d.id.toString().length === 1 ? "0"+d.id.toString() : d.id.toString();
                    d["level"] = "state";
                    d["state"] = fipsToState[fips];
                })
                .attr("d", path)
                .attr("class", "state feature ")
                .on("click", theMap.clicked);

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
                    var distString = d.id.toString().length === 3 ? "0"+d.id.toString() : d.id.toString();
                    d["level"] = "district";
                    d["state"] = fipsToState[distString.substring(0,2)];
                    d["dist"] = distString.substring(2,4);
                })
                .attr("class", function(d) {
                    return "dist_"+d.id+" district feature";
                })
                .attr("d", path)
                .on("click", theMap.clicked);

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





            /* ------------------- */
            /* CITIES */
            /* ------------------- */

            /*
            var mapCities =  mapGroup.append("g")
                .attr("class", "group cities");

            mapCities.selectAll('.cities')
                .data(cities.features).enter().append('path')
                .attr('d', path.pointRadius(4))
                .attr('class', 'cities');


            mapCities.selectAll('.labels')
                .data(cities.features).enter().append('text')
                .attr('transform', function(d) {
                    return 'translate(' + projection(d.geometry.coordinates) + ')';
                })
                .attr('dy', function(d){ // vertical offset
                    var city = d.properties.NAME
                    if (city == 'Washington') {
                    return 8;
                    }
                    else {
                        return -3;
                    }
                }) 
                .attr('dx', 3) // horizontal offset
                .text(function(d) {
                    return d.properties.NAME;
                })
                .attr('class', 'labels');
            */

            /* END CITIES */ /* ------------------- */


        

            $(".loading").hide();
            theMap.updateStates();

    },
    updateStates: function() {

        var sel = d3.selectAll(".state.feature");

         sel.attr("fill", function(d) {
            var race = theData[currView][d.state];
            


            if (race) {
                return theColors[race["00"].status];
            } else {
                return "#eee";
            }

        });

    },
    updateDistricts: function() {
        var sel = d3.selectAll(".district.feature");

        sel.attr("fill", function(d) {
            var state = theData[currView][d.state];

            

            if (state) {

                var race = d.dist === "00" ? state["01"] : state[d.dist];
                
                console.log(race.status);

                return theColors[race.status];
            } else {
                return "#eee";
            }

        });
    },
    clicked: function(d) {

        /* scaleTo so we son't drill too far down on districts and counties */
        var scaleTo = zoomLevel[d.level];

        if (active.node() === this) return theMap.reset();
        active.classed("active", false).moveToBack();
        active = d3.select(this).classed("active", true).moveToFront();

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
        mapGroup.selectAll("path.state").style("stroke-width", 1 / d3.event.scale + "px");
        mapGroup.selectAll("path.district").style("stroke-width", 1 / d3.event.scale + "px");
        mapGroup.selectAll("path.county").style("stroke-width", 1 / d3.event.scale + "px");
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


    $(".btn.view-state").on("click", function() {
        currView = $(this).attr("val");

        $(".btn.view-state").removeClass("active");
        $(this).addClass("active");

        if (currView === "senate" || currView == "gov") {
            theMap.updateStates();
            d3.selectAll(".group.districts, .group.counties").style("visibility", "hidden");
            d3.selectAll(".states").style("visibility", "visible");
        } else if (currView === "house") {
            theMap.updateDistricts();
            d3.selectAll(".group.states, .group.counties").style("visibility", "hidden");
            d3.selectAll(".group.districts").style("visibility", "visible");
        }

    });

    $(window).resize(_.debounce(function(){
        theMap.reset();
        theMap.resize();
    }, 100));



};




