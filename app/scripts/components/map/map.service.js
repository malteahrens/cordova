angular.module('starter')
.service('MapServ', function(Settings, Debug, LayerFact) {
    this.initMap = function() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiLS1tYWx0ZWFocmVucyIsImEiOiJGU21QX2VVIn0.GVZ36UsnwYc_JfiQ61lz7Q';
        map = new mapboxgl.Map({
            container: 'map',
            zoom: 12,
            center: [11.451873779296875, 48.14882451158226],
            style: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles/dark-v8.json',
            minZoom: 9,
            maxZoom: 20,
            interactive: true
        });
        map.addControl(new mapboxgl.Navigation());
        map.setPitch(Settings.map.bearing);

        map.on('load', function(e) {
            Debug.trace("Map loaded");
            //var mapCanvasContainer = map.getCanvasContainer();
            //console.log(mapCanvasContainer);
            //LayerFact.addGeojsonLayer({'name':'locationAccuracy'});
            //LayerFact.addGeojsonLayer({'name':'locationHeading'});
            //LayerFact.addGeojsonLayer({'name':'location'});
            //LayerFact.addGeojsonLayer({'name':'gpsTrace'});
            //LayerFact.addGeojsonLayer({'name':'gpsStorage'});
        });

        return "init map in #map div successful";
    };

    this.resize = function() {
        map.resize();
    }

    this.render = function() {
        map.render();
    }

    this.getCanvas = function() {
        return map.getCanvas();
    }

    this.setPitch = function() {
        if (Settings.map.bearing) {
            map.setPitch(Settings.map.bearing);
            this.resize();
        }
    }

    this.rotate = function(angle, rotateOptions) {
        if (!Settings.map.rotate) {
            map.rotateTo(angle, rotateOptions);
        }
    }

    this.addSource = function(layerName, layerConfig) {
        map.addSource(layerName, layerConfig);
    }

    this.addLayer = function(layerName) {
        map.addLayer(layerName);
    }

    this.getSource = function(layerName) {
        return map.getSource(layerName);
    }

    this.easeTo = function(options) {
        map.easeTo(options);
    }

    this.zoomTo = function(zoomLevel) {
        map.zoomTo(zoomLevel);
    }

    this.addLayerDataObserver = function() {
        var layerDataChange = {
            notify: function (layerId, data) {
                $scope.setLineData(layerId, data);
                var bbox = GeoOperations.getBounds(data);
                console.log(bbox);
                map.fitBounds(bbox);
            },
            watch: "gpsStorage"
        }
        LayerFact.observer(layerDataChange);
    }
});
