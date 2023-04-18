

/**
 * MarkerManager class manages markers on the map.
 * @author SONG-U SEOL
 * @date 2023-04-18
 */
export default class MarkerManager {

    /**
     * Constructor for the MarkerManager class.
     * @param {ol.source.Vector} vectorSource - The vector source for the markers.
     */
    constructor(vectorSource) {
        this.vectorSource = vectorSource;
        this.routeCount = 0;
        this.autoMarker = false;
    }

    /**
     * Sets the drone coordinate based on the given marker name.
     * @param {string} markerName - The name of the marker.
     */
    setDroneCoordinateByName(markerName) {
        const marker = this.vectorSource.getFeatures().filter(feature => feature.get('name') === markerName);
        this.droneCoordinate = marker;
    }


    /**
     * Creates an icon feature for the marker.
     * @param {Object} options - The marker options.
     * @param {number} type - The marker type.
     * @returns {ol.Feature} The created icon feature.
     */
    createIconFeature(options, type) {
        const iconFeature = new ol.Feature({
            geometry: type === 1 ?
                new ol.geom.Point(options.coordinate).transform('EPSG:4326', 'EPSG:3857') :
                new ol.geom.Point(options.coordinate),
            name: options.name,
            population: 4000,
            rainfall: 500,
            id: options.id,
            created_at: type === 0 ? new Date() : undefined,
        });

        const iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: 'images/icons/markers.png',
            }),
        });

        iconFeature.setStyle(iconStyle);
        return iconFeature;
    }

    /**
     * Adds a marker to the map.
     * @param {Object} options - The marker options.
     * @param {number} type - The marker type.
     */
    addMarker(options, type) {
        const iconFeature = this.createIconFeature(options, type);
        iconFeature.setId(options.id);
        this.vectorSource.addFeature(iconFeature);
    }

    /**
     * Enables or disables the marker creation on map click.
     * @param {boolean} autoMarker - True to enable marker creation on click, false otherwise.
     */
    setMarkerOnClick(autoMarker) {
        this.autoMarker = autoMarker;
    }

    /**
     * Returns an array of markers with the specified name.
     * @param {string} markersName - The name of the markers to search for.
     * @returns {Array<ol.Feature>} An array of matching marker features.
     */
    getMarkersByName(markersName) {
        const markerObjects = this.vectorSource.getFeatures().filter(feature => feature.get('name') === markersName);
        markerObjects.sort((a, b) => a.get('created_at') - b.get('created_at'));
        markerObjects.unshift(this.droneCoordinate[0]);
        return markerObjects;
    }

    /**
     * Returns the coordinates of the given markers.
     * @param {Array} markers - The array of markers.
     * @returns {Array} The array of marker coordinates.
     */
    getMarkersCoordinate(markers) {
        return markers.map(marker => marker.getGeometry().getCoordinates());
    }
}