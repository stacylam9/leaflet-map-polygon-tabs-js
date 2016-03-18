$(function() {

  var lightNoLabels = new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  });
  var year = "09";
  var map = new L.Map('map', {
    center: new L.LatLng(41.819824,-72.581177),
    zoom: 10,
    scrollWheelZoom: false,
    layers: [lightNoLabels]
  });

  map.attributionControl
  .setPrefix('View <a href="http://github.com/jackdougherty/leaflet-map-polygon-tabs-js">code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>; design by <a href="http://ctmirror.org">CT Mirror</a>');


  function style(feature) {
    return {
     fillColor: getColor(feature.properties["choice" + year]/feature.properties["total" + year]),
     weight: 0.3,
     opacity: 1,
     color: '#444',
     fillOpacity: 0.7
   };

 }


 var geojson;
 makeMap(style);
 function makeMap(theStyle) {
  geojson = L.geoJson(cityData, {
    style: theStyle,
    onEachFeature: onEachFeature
  }).addTo(map);
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 2,
    color: '#000'
  });

  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: highlightFeature
  });
}

function getColor(d) {
  // console.log(d);
  if (d > -1) {
    return d > .05  ? '#7f0000' :
    d > .045  ? '#b30000' :
    d > .04   ? '#d7301f' :
    d > .035   ? '#ef6548' :
    d > .03   ? '#fc8d59' :
    d > .025   ? '#fdbb84' :
    d > .02   ? '#fdd49e' :
    d > .015   ? '#fee8c8' :
    d > .0075   ? '#fef9d8' :
    '#FAF6F0';
  } else {
    return "#ffffff";
  }
}


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
  };

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  var winName =
  this._div.innerHTML = (props ?
    '<div class="townName">' + props.name.toProperCase() + '</div>' : '<div class="townName faded">Hover over towns</div>') + '<div class="labelItem"><div class="rightLabel">Choice Students</div>' +(props ? '' + (checkNull(props["choice" + year])) : '--') + '</div>' + '<div class="labelItem"><div class="rightLabel">Total Students</div>' +(props ? '' + checkNull(props["total" + year]) : '--') + '</div>' + '<div class="labelItem"><div class="rightLabel">Percentage</div>' +(props ? '' + checkThePct( props["choice" + year], props["total" + year]) : '--') + '</div>' ;
};

info.addTo(map);


String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};


$(".toolItem").click(function() {
  $(".toolItem").removeClass("selected");
  $(this).addClass("selected");
  year = $(this).html().split("-")[1];
  geojson.setStyle(style);
});


function checkNull(val) {
  if (val != null || val == "NaN") {
    return comma(val);
  } else {
    return "--";
  }
}

function checkThePct(a,b) {
  if (a != null && b != null) {
    return Math.round(a/b*1000)/10 + "%";
  } else {
    return "--";
  }
}



function comma(val){
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
}

});
