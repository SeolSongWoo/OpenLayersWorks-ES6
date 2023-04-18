/**
 * LayerManager class manages layers on the map.
 * @author SONG-U SEOL
 * @date 2023-04-18
 */
export default class LayerManager {

    /**
     * Constructor for the LayerManager class.
     * @param {ol.Map} map - The OpenLayers map object.
     * @param {ol.source.Vector} vectorSource - The vector source for the layers.
     */
    constructor(map, vectorSource) {
        this.map = map;
        this.vectorSource = vectorSource;
    }

    /**
     * Adds a vector layer to the map.
     */
    addVectorLayer() {
        this.vectorLayer = new ol.layer.Vector({
            source: this.vectorSource,
            zIndex: 2
        });
        this.map.addLayer(this.vectorLayer);
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
        const wmsLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: sourceObject.url, // WMS 서버 URL
                params: {
                    'LAYERS': sourceObject.id, // WMS 레이어 이름
                    'TILED': true, // 타일 모드 사용 여부
                    'VERSION': '1.1.1', // WMS 버전
                },
                serverType: 'geoserver', // WMS 서버 타입 (예: 'geoserver')
                crossOrigin: 'anonymous', // CORS 설정 (필요한 경우)
                minZoom: sourceObject.minZoom,
                maxZoom: sourceObject.maxZoom,
            }),
            zIndex: sourceObject.zIndex,
            id: sourceObject.id,
        });
        this.map.addLayer(wmsLayer);
    }

    /**
     * Returns a layer by its ID.
     * @param {string} layerId - The ID of the layer.
     * @returns {ol.layer.Layer} The matching layer, or null if not found.
     */
    getLayerById(layerId) {
        let targetLayer;
        this.map.getLayers().forEach(function (layer) {
            if (layer.get('id') === layerId) {
                targetLayer = layer;
            }
        });
        return targetLayer;
    }
}