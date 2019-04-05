var usgs_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
// console.log(usgs_url)

d3.json(usgs_url, function(data) {
    createFeatures(data.features);
});

function bubbleSize(magnitude) {
    return magnitude * 3
};

function magColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#b10026";
      case magnitude > 4:
        return "#cb812c";
      case magnitude > 3:
        return "#de9c10";
      case magnitude > 2:
        return "#eecc00";
      case magnitude > 1:
        return "#ffffb2";
      default:
        return "#98ee00";
    }
  }

function createFeatures(earthquakeData) {
    var earthquakes = L.geoJson(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return new L.circleMarker(latlng, 
                {radius: bubbleSize(feature.properties.mag),
                fillColor: magColor(feature.properties.mag),
                color: "#000",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.5,
                }
            );
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><br>" + feature.properties.time);
        }
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var baseMaps = {
        'dark map': darkmap
    };

    var overlayMaps = {
        "earthquakes": earthquakes
    };

    var mymap = L.map('map-id', {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [darkmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(mymap);

}
