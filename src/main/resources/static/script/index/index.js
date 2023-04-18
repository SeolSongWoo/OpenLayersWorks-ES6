import {VworldMap} from "../module/VworldMap.js";
import {isValidInput} from "./util.js";

const url = `VWORLD WMTS API KEY`;
const map = new VworldMap(url);
map.setMarkerClickEvent((evt, feature, id) => {
    map.eventListenerManager.disposePopover();
    if (!feature) {
        return;
    }

    if (id === 'drone1') {
        if(Hls.isSupported()) {
            const videoEle = document.getElementById('video');
            const videoDD = document.getElementById('videoDD');
            if(videoEle) {
                videoDD.removeChild(videoEle);
            }
            const video = document.createElement('video');
            video.width = 500;
            video.controls = true; // 비디오 컨트롤 표시
            video.id = 'video';
            videoDD.appendChild(video);
            var hls = new Hls();
            hls.loadSource('http://localhost:3000/segments/stream.m3u8'); // 동영상경로
            hls.attachMedia(video);
            window.hls = hls;
        }
        document.getElementById('popup').style.display = '';
    } else if (id === 'route1') {
        // 두 번째 마커의 작업 수행
        console.log('마커 2 클릭');
    }
});



window.addMarker = () => {
    map.addMarker({
        coordinate:[126.027583, 38.497928],
        id:'drone1',
        name: 'droneObject'
    },1);
    map.setDroneCoordinateByName('droneObject');
}

window.addRoutePath = () => {
    dronePopupClose();
    map.setMarkerOnClick(true);
}

window.completeRoute = async () => {
    if(confirm('지정하신 경로를 시나리오 대기에 입력하시겠습니까?')) {
        let scenarioName = prompt('대기에 등록하실 시나리오이름을 입력해주세요.');
        while(true) {
            if(isValidInput(scenarioName)) {
                break;
            }else {
                scenarioName = prompt('영어,숫자,한글만 입력이 가능합니다. 제대로 입력해주세요.');
            }
        }
        map.setMarkerOnClick(false);
        const markers = map.getMarkersByName('routers');
        const markersCoordinate = map.getMarkersCoordinate(markers);
        map.setPolyline(markersCoordinate);
        //await map.setScenarioSec({scenarioName:scenarioName,markerRoutes:markersCoordinate});
        alert('적용이 완료되었습니다.');
    }
}

window.showMissionInformation= () => {
    const missionPopup = document.getElementById('pop_drag');
    missionPopup.style.display = '';
}

window.addWMSLayerByName = (layerName) => {
    const layer = map.getLayerById(layerName);
    const sourceObject = {
        id: layerName,
        url: 'http://localhost:9090/geoserver/postgis/wms',
        layersName: layerName,
        minZoom: 10,
        maxZoom: 15,
        zIndex: 3,
    }
    if(!layer) {
        map.addWMSLayer(sourceObject);
    } else {
        layer.setVisible(!layer.getVisible());
    }}