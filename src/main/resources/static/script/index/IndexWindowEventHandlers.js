import {isValidInput, toggleElementVisibility, createTable, markerScenarioRoutes} from "./util.js";
import ServerRequest from "../module/ServerRequest.js";
import { map } from "./index.js";
import {localStorageHelper} from "../module/LocalStorageHelper.js";

window.addMarker = () => {
    map.addMarker({
        coordinate:[126.027583, 38.497928],
        id:'drone1',
        name: 'droneObject'
    },1);
    map.setDroneCoordinateByName('droneObject');
}

window.addRoutePath = () => {
    const monitorModalInstance = bootstrap.Modal.getInstance(document.getElementById("monitoring-log-modal"));
    monitorModalInstance.hide();
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
        const postArray = new Array();
        for(let i=0; i<markersCoordinate.length;i++) {
            const object = {
                routeOrder : i,
                lat : markersCoordinate[i][0],
                lon : markersCoordinate[i][1],
            };
            postArray.push(object);
        }

        await (new ServerRequest('/api/scenarios')).post(undefined, {
            scenarioNm:scenarioName,
            usvNm:'TEST1',
            rgDate: new Date(),
            scenarioRoutes:postArray,
        });
        alert('정상적으로 등록되었습니다. 자세한 세부설정은 시나리오 설정에서 해주십시오.');
    }
}

window.showMissionInformation = async () => {

    const missionPopup = document.getElementById('pop_drag');
    const dbAccess = new ServerRequest('/api/scenarios');
    const data = await dbAccess.get(undefined,undefined);
    console.log(data);
    const tableScenarioBody = document.querySelector('#scenarioWaitBody');
    tableScenarioBody.innerHTML = '';
    data.forEach((item,index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${index+1}</td>
        <td>${item.scenarioNm}</td>
        <td>${item.usvNm}</td>
        <td>${(new Date(item.rgDate)).toLocaleString()}</td>
        <td>${item.routeCount}</td>
        `
        tableScenarioBody.appendChild(row);
    })
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
    }
}

window.showScenarioInfo = async (state = 'waiting') => {
    const monitorModalInstance = new bootstrap.Modal(document.getElementById("scenario-modal"));
    await createTable(state);
    monitorModalInstance.show();
}

window.openScenarioSet = async (scenarioNo,ElementId) => {
    toggleElementVisibility(ElementId,'remove');
    toggleElementVisibility(`${ElementId}-detail`,'add');
    const dbAccess = new ServerRequest('/api/scenarios');
    const data = await dbAccess.get(scenarioNo,undefined);
    const scenarioBody = document.getElementById(`scenario_routes_${ElementId}_body`);
    scenarioBody.innerHTML = '';
    for(let i=0; i< data.length; i++) {
        const bodyTr = document.createElement('tr');
        const hidden = document.createElement('input');
        hidden.setAttribute('type','hidden');
        hidden.setAttribute('name','scenarioRoutesId');
        hidden.setAttribute('value',data[i].scenarioRoutesId);
        bodyTr.appendChild(hidden);
        for(let j=2; j< Object.keys(data[i]).length; j++) {
            const keyName = Object.keys(data[i])[j];
            const values = Object.values(data[i])[j];
            const bodyTd = document.createElement('td');
            if((keyName === 'whichOpStatus' || keyName === 'tmpSensStatus') && ElementId === 'waiting') {
                const tdSelect = document.createElement(`select`);
                const tdOption = document.createElement('option');
                tdSelect.className = 'form-select';
                tdSelect.setAttribute('name',keyName);
                tdOption.setAttribute('selected','true');
                tdOption.textContent = Boolean(values);
                tdSelect.appendChild(tdOption);
                const tdOption2 = document.createElement('option');
                tdOption2.textContent = !Boolean(values);
                tdSelect.appendChild(tdOption2);
                bodyTd.appendChild(tdSelect);
            } else if(keyName === 'speedKms' && ElementId === 'waiting'){
                const inputGroupDiv = document.createElement('div');
                inputGroupDiv.className = 'input-group';
                inputGroupDiv.innerHTML = `                                        
                                        <input type="number" name="${keyName}" value="${values}" class="form-control" placeholder="속도" min="0" step="0.01" oninput="validity.valid||(value='');" aria-describedby="speed-addon">
                                        <span class="input-group-text" id="speed-addon">m/s</span>`;
                bodyTd.appendChild(inputGroupDiv);
            } else {
                bodyTd.textContent = Object.values(data[i])[j];
            }
            bodyTr.appendChild(bodyTd);
        }
        scenarioBody.appendChild(bodyTr);
    }
}

window.scenarioPrev = () => {
    toggleElementVisibility('waiting-detail','remove');
    // 기존의 탭 내용을 다시 표시
    toggleElementVisibility('waiting','add');
}
window.scenarioRunningPrev = () => {
    toggleElementVisibility('running-detail','remove');
    // 기존의 탭 내용을 다시 표시
    toggleElementVisibility('running','add');
}

window.scenarioSend = async () => {
    if(!confirm('정말 송신하시겠습니까?')) return;
    const form = document.getElementById("scenario_routes_form");
    const rows = form.querySelectorAll("tbody tr");
    const scenarioRoutesList = Array.from(rows).map((row) => {
        const scenarioRoutesId = row.querySelector("input[name='scenarioRoutesId']").value;
        const whichOpStatus = row.querySelector("select[name='whichOpStatus']").value === "true";
        const speedKms = row.querySelector("input[name='speedKms']").value;
        const tmpSensStatus = row.querySelector("select[name='tmpSensStatus']").value === "true";

        return {
            scenarioRoutesId,
            whichOpStatus,
            speedKms,
            tmpSensStatus,
        };
    });

    const databaseAccess = new ServerRequest('/api/scenarios');
    await databaseAccess.patch(undefined,scenarioRoutesList);

    document.getElementById('running-tab').click();
}

window.updateScenarioWaitingUI =  async () => {
    await createTable('waiting');
}

window.updateScenarioRunningUI = async () => {
    await createTable('running');
}

window.toggleRouteOnMap = (evt,data,ElementId) => {
    evt.stopPropagation()
    const checked = evt.target.checked;
    const markerName = data[0].scenarioNo;
    if(checked) {
        markerScenarioRoutes(data,markerName,ElementId)
        localStorageHelper.save(`displayedScenarioIdBy${ElementId}`,markerName);
    } else {
        map.removeMarkerByName(`scenarioBy_${ElementId}_${markerName}`);
        localStorageHelper.remove(`displayedScenarioIdBy${ElementId}`,markerName);
    }
}