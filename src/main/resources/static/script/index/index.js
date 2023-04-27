import {VworldMap} from "../module/VworldMap.js";
import {addMarkersByLocalStorageId} from "./MapGlobalConfig.js"
const url = `http://api.vworld.kr/req/wmts/1.0.0/1DACF4FB-1200-30A2-913E-696F78F566AD/Satellite/{z}/{y}/{x}.jpeg`;
const map = new VworldMap(url);
addMarkersByLocalStorageId();
map.setMarkerClickEvent(async (evt, feature, id,name) => {
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
       const monitoringPopup = new bootstrap.Modal(document.getElementById('monitoring-log-modal'));
        monitoringPopup.show();
    } else if (id === 'route1') {
        // 두 번째 마커의 작업 수행
        console.log('마커 2 클릭');
    }
    if(name.includes('scenarioBy_')){
        const scenarioStateAndId = name.replace('scenarioBy_',"");
        const scenarioState = scenarioStateAndId.split('_')[0];
        const scenarioId = scenarioStateAndId.split('_')[1];
        await showScenarioInfo(scenarioState);
        await openScenarioSet(scenarioId,scenarioState)
    }
});




export { map  };