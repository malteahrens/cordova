angular.module('starter')
.service('MapServ', function(Settings, Debug, LayerFact, GpsFactory) {
    this.initMap = function() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiLS1tYWx0ZWFocmVucyIsImEiOiJGU21QX2VVIn0.GVZ36UsnwYc_JfiQ61lz7Q';
        map = new mapboxgl.Map({
            container: 'map',
            zoom: 12,
            center: [11.451873779296875, 48.14882451158226],
            style: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles/emerald-v8.json',
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
            addGeojsonLayer({'name':'locationAccuracy'});
            addGeojsonLayer({'name':'locationHeading'});
            addGeojsonLayer({'name':'location'});
            addGeojsonLayer({'name':'gpsTrace'});
            addGeojsonLayer({'name':'gpsStorage'});
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

    var addSource = function(layerName, layerConfig) {
        map.addSource(layerName, layerConfig);
    }
    this.addSource = addSource;

    var addLayer = function(layerName) {
        map.addLayer(layerName);
    }
    this.addLayer = addLayer;

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

    this.setLineData = function(layerId, data) {
        //Debug.trace("Updated data: "+layerId);
        var layer = this.getSource(layerId);
        if(data !== undefined && layer !== undefined) {
            layer.setData(data);
        } else {
            console.log("couldn't draw gpsTrace, data is empty");
        }
    }

    this.setBufferData = function(layerId, data, radius) {
        try {
            var layer = this.getSource(layerId);
            if (layer !== undefined) {
                var point = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": data
                    }
                }

                var buffered = turf.buffer(point, radius, 'kilometers')

                // proj4js only supports simple point coordinates
                //var reprojected = proj4('EPSG:4326','EPSG:3857',buffered);

                layer.setData(buffered);
            } else {
                console.log("Couldn't update data: layer not found");
            }
        } catch(err) {
            Debug.trace("Could not find layer")
        }
    };

    var addGeojsonLayer = function(layer, visibility) {
            if(visibility === undefined){
                visibility = true;
            }
            var symbolTemplate = {}
            var lineTemplate = {
                "type": 'line',
                "layout": {
                    "visibility": visibility
                },
                "paint": {
                    "line-color": "#ff0000",
                    "line-width": 2
                }
            }
            var fillTemplate = {}

            var style = {
                "location": {
                    "type": 'symbol',
                    "layout": {
                        "icon-image": "circle-12"
                    },
                    "paint": {
                        "icon-size": 1,
                        "icon-color": "#669966"
                    }
                },
                "locationAccuracy": {
                    "type": 'fill',
                    "layout": {
                        "visibility": visibility
                    },
                    "paint": {
                        "fill-outline-color": "#ff0000",
                        "fill-color": "#ff0000",
                        "fill-opacity": 0.2
                    }
                },
                "locationHeading": {
                    "type": 'line',
                    "layout": {
                        "visibility": visibility
                    },
                    "paint": {
                        "line-color": "#ff0000",
                        "line-width": 2
                    }
                },
                "gpsTrace": {
                    "type": 'line',
                    "layout": {
                        "visibility": visibility
                    },
                    "paint": {
                        "line-color": "#ff0000",
                        "line-width": 2
                    }
                },
                "gpsStorage": {
                    "type": 'line',
                    "layout": {
                        "visibility": visibility
                    },
                    "paint": {
                        "line-color": "#ffff00",
                        "line-width": 2
                    }
                }
            }
            data = turf.linestring([0, 0]);
            addSource(layer.name, {
                "type": "geojson",
                "data": data
            });

            addLayer({
                "id": layer.name,
                "type": style[layer.name].type,
                "source": layer.name,
                "interactive": true,
                "layout": style[layer.name].layout,
                "paint": style[layer.name].paint
            });

            Debug.trace("layer added: "+layer.name);
            //$scope.$apply();
        }

    });
