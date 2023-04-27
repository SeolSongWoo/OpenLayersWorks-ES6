/**
 * EventListenerManager class manages event listeners for the map.
 * @author SONG-U SEOL
 * @date 2023-04-18
 */
export default class EventListenerManager {
    /**
     * Constructor for the EventListenerManager class.
     * @param {ol.Map} map - The OpenLayers map object.
     * @param {MarkerManager} markerManager - The MarkerManager instance.
     */
    constructor(map, markerManager) {
        this.map = map;
        this.markerManager = markerManager;
        this.clickEventFunction = null;
    }

    /**
     * Adds a click event listener to the map.
     */
    addClickEventListener() {
        this.map.on('click', (evt) => {
            const feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });

            if (this.markerManager.autoMarker) {
                this.markerManager.addMarker({
                    coordinate: [evt.coordinate[0], evt.coordinate[1]],
                    id: `route${this.markerManager.routeCount}`,
                    name: 'routers'
                }, 0);
                this.markerManager.routeCount++;
            }

            if (feature && this.clickEventFunction) {
                this.clickEventFunction(evt, feature, feature.get('id'),feature.get('name'));
            }
        });
    }

    /**
     * Sets a custom click event function for marker clicks.
     * @param {function} clickEventFunction - The click event function.
     */
    setMarkerClickEvent(clickEventFunction) {
        this.clickEventFunction = clickEventFunction;
    }

    /**
     * Adds a pointer move event listener to the map.
     */
    addPointerMoveEventListener() {
        const mapElement = document.getElementById('map');
        this.map.on('pointermove', (e) => {
            const pixel = this.map.getEventPixel(e.originalEvent);
            const hit = this.map.hasFeatureAtPixel(pixel);
            mapElement.style.cursor = hit ? 'pointer' : '';
        });
    }

    /**
     * Adds a map move start event listener to the map.
     */
    addMapMoveStartEventListener() {
        this.map.on('movestart', this.disposePopover.bind(this));
    }

    /**
     * Disposes the popover on the map.
     */
    disposePopover() {
        if (this.popover) {
            this.popover.dispose();
            this.popover = undefined;
        }
    }
}
