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
            zIndex: 1
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
            layers: [this.vworldMapLayer],
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
     */
    setPolyline(markersCoordinate) {
        const lineString = new ol.geom.LineString(markersCoordinate);
        const lineFeature = new ol.Feature({
            geometry: lineString
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
     * Sets a scenario for the map by sending an API request.
     * @param {Object} scenario - The scenario object.
     */
    async setScenarioSec(scenario) {
        try {
            const response = await fetch('/api/scenario/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scenario),
            });
            const jsonResponse = await response.json();
        } catch (error) {
            alert(error);
            return;
        }
        alert('정상적으로 등록되었습니다. 자세한 세부설정은 시나리오 설정에서 해주십시오.');
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