import LayerManager from "./LayerManager.js";
import MarkerManager from "./MarkerManager.js";
import EventListenerManager from "./EventListenerManager.js";

/**
 * VworldMap class represents a map using Vworld map tiles.
 * It initializes the map and provides methods for managing layers, markers, and events.
 * @author SONG-U SEOL
 * @date 2023-04-18
 */
class VworldMap {

    /**
     * Constructor for the VworldMap class and Initializes the map with layers and event listeners.
     * @param {string} url - The URL for the Vworld map tile source.
     */
    constructor(url) {
        this.vworldMapLayer = new ol.layer.Tile({
            title: 'Vworld Map',
            visible: true,
            source: new ol.source.XYZ({
                url: url
            }),
            zIndex: 0
        });

        this.vworldHybridLayer = new ol.layer.Tile({
            title: 'Vworld Map',
            visible: true,
            source: new ol.source.XYZ({
                url: `http://api.vworld.kr/req/wmts/1.0.0/1DACF4FB-1200-30A2-913E-696F78F566AD/Hybrid/{z}/{y}/{x}.png`
            }),
            zIndex: 1
        });

        this.vworldGroupLayer = new ol.layer.Group({
            title : 'Vworld Group Map',
            layers: [this.vworldMapLayer,this.vworldHybridLayer],
        });

        this.view = new ol.View({
            center: ol.proj.fromLonLat([127.5, 36.0]),
            zoom: 8,
            minZoom: 8,
            constrainOnlyCenter: true,
            extent: [13635326.402442671, 3518549.7251000917, 14628806.4846093, 5927213.013577871],
        });

        this.map = new ol.Map({
            target: 'map',
            layers: [this.vworldGroupLayer],
        });

        this.map.setView(this.view);

        this.vectorSource = new ol.source.Vector({});
        this.layerManager = new LayerManager(this.map, this.vectorSource);
        this.layerManager.addVectorLayer();

        this.markerManager = new MarkerManager(this.vectorSource);
        this.eventListenerManager = new EventListenerManager(this.map, this.markerManager);
        this.eventListenerManager.addClickEventListener();
        this.eventListenerManager.addPointerMoveEventListener();
        this.eventListenerManager.addMapMoveStartEventListener();
    }

    /**
     * Sets a custom event handler for marker clicks.
     * @param {function} ev - The event handler function.
     */
    setMarkerClickEvent(ev) {
        this.eventListenerManager.setMarkerClickEvent(ev);
    }

    /**
     * Sets the drone coordinate based on the given marker name.
     * @param {string} markerName - The name of the marker.
     */
    setDroneCoordinateByName(markerName) {
        this.markerManager.setDroneCoordinateByName(markerName);
    }

    /**
     * Adds a marker to the map.
     * @param {Object} options - The marker options.
     * @param {number} type - The marker type.
     */
    addMarker(options, type) {
        this.markerManager.addMarker(options, type);
    }

    removeMarkerByName(markerName) {
        this.markerManager.removeMarkerByName(markerName);
    }

    /**
     * Enables or disables the marker creation on map click.
     * @param {boolean} boolean - True to enable marker creation on click, false otherwise.
     */
    setMarkerOnClick(boolean) {
        this.markerManager.setMarkerOnClick(boolean);
    }

    /**
     * Returns markers by their name.
     * @param {string} markersName - The name of the markers.
     * @returns {Array} The array of matching markers.
     */
    getMarkersByName(markersName) {
        return this.markerManager.getMarkersByName(markersName);
    }

    /**
     * Returns the coordinates of the given markers.
     * @param {Array} markers - The array of markers.
     * @returns {Array} The array of marker coordinates.
     */
    getMarkersCoordinate(markers) {
        return this.markerManager.getMarkersCoordinate(markers);
    }

    /**
     * Adds a polyline to the map based on the given coordinates.
     * @param {Array} markersCoordinate - The array of coordinates for the polyline.
     * @param {string} name - The string of Polyline Object name.
     */
    setPolyline(markersCoordinate,name) {
        const lineString = new ol.geom.LineString(markersCoordinate);
        const lineFeature = new ol.Feature({
            geometry: lineString,
            name:name
        });

        const lineStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 6,
                color: [237, 212, 0, 0.8],
            })
        });

        lineFeature.setStyle(lineStyle);
        this.vectorSource.addFeature(lineFeature);
    }

    /**
     * Adds a WMS layer to the map using the provided sourceObject.
     * @param {Object} sourceObject - An object containing the options for the WMS layer and its source.
     * @property {string} sourceObject.url - The URL of the TileWMS service.
     * @property {string} sourceObject.LayerName - The name of the WMS layer to add (used for the 'LAYERS' parameter in the TileWMS source).
     * @property {number} sourceObject.minZoom - The minimum zoom level for the layer.
     * @property {number} sourceObject.maxZoom - The maximum zoom level for the layer.
     * @property {number} sourceObject.zIndex - The zIndex value for the layer, determining the rendering order of layers.
     * @property {string} sourceObject.id - The unique identifier for the layer.
     */
    addWMSLayer(sourceObject) {
        this.layerManager.addWMSLayer(sourceObject);
    }

    /**
     * Returns a layer by its ID.
     * @param {string} layerId - The ID of the layer.
     * @returns {ol.layer.Layer} The matching layer, or null if not found.
     */
    getLayerById(layerId) {
        return this.layerManager.getLayerById(layerId);
    }



}

export { VworldMap };