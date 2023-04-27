import ServerRequest from "../module/ServerRequest.js";
import { map } from "./index.js";
import {localStorageHelper} from "../module/LocalStorageHelper.js";

/**
 * 입력값에 대한 유효성 검증 함수.
 * @param input 문자열
 * @returns {boolean} 유효성을 통과하면 True, 유효성을 통과하지않으면 False 반환.
 */
export const isValidInput = (input) => {
    // 정규 표현식: 한글, 영어, 숫자만 허용 (공백 제외)
    const regex = /^[가-힣A-Za-z0-9]+$/;
    return regex.test(input);
}

/**
 * Bootstrap Class를 이용하여, Element의 가시성을 전환하는 함수.
 * @param elementId 가시성을 전환할 Element의 Id
 * @param action 'add'또는 'remove'로 가시성 설정
 */
export const toggleElementVisibility = (elementId,action) => {
    if(action !== 'add' && action !== 'remove') {
        console.error("Invalid action. Only 'add' or 'remove' is allowed.");
        return;
    }
    const Element = document.getElementById(elementId);
    if(action === 'add') {
        Element.classList.add('show');
        Element.classList.add('active');
    } else{
        Element.classList.remove('show');
        Element.classList.remove('active');
    }
}
/**
 * tr과 data를 받아 row를 생성하는 함수
 * @param row tr DOM객체를 받음.
 * @param item data객체를 받음.
 * @param index
 * @param elementId 스토리지ID 등 고유성을 부여하기위한 id값.
 * @returns {*}
 */
export const createScenarioRow = (row,item,index,elementId) => {
    const isValidDisplayedScenarioId = localStorageHelper.isValid(`displayedScenarioIdBy${elementId}`,item.scenarioNo) ? 'checked' : '';
    row.classList.add('hover-effect');
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.scenarioNm}</td>
        <td>${item.usvNm}</td>
        <td>${(new Date(item.rgDate)).toLocaleString()}</td>
        <td>${item.routeCount}</td>
        <td>${item.usvActive === false ? 'X' : 'O'}</td>
        <td>
            <input style="width: 30px;height: 30px;" type="checkbox" id="routeToggleCheckbox_${item.scenarioNo}" ${isValidDisplayedScenarioId}>
        </td>
    `;
    return row;
}

export const createTable = async (ElementId) => {
    const scenarioBody = ElementId === 'waiting' ? document.getElementById('scenario_info_body') : document.getElementById('scenario_running_body')
    scenarioBody.innerHTML = '';
    const dbAccess = new ServerRequest('/api/scenarios');
    let data = await dbAccess.get(undefined,undefined);
    data = dbDataFilter(data,ElementId);
    let scenarioInfoIndex = 0;
    let scenarioRunningIndex = 0;
    data.forEach((item) => {
        const row = document.createElement('tr');
        createScenarioRow(row,item,item.usvActive ? scenarioRunningIndex : scenarioInfoIndex,ElementId);
        row.setAttribute('onclick', `openScenarioSet(${item.scenarioNo},'${ElementId}')`);
        scenarioInfoIndex++;
        scenarioBody.appendChild(row)
        const checkbox = document.getElementById(`routeToggleCheckbox_${item.scenarioNo}`);
        checkbox.addEventListener('click',(evt)=>{toggleRouteOnMap(evt,item.scenarioRoutes,ElementId);});
    })
}

export const dbDataFilter = (data,ElementId) => {
    const boolean = ElementId === 'running'
    return data.filter(item => item.usvActive === boolean);
}

export const markerScenarioRoutes = (data,markerName,ElementId) => {
    const coordinates = new Array();
    data.forEach((item) => {
        coordinates.push([item.lat, item.lon]);
        const coordinate = [item.lat, item.lon];
        const id = item.scenarioRoutesId;
        map.addMarker({
            coordinate: coordinate,
            id: id,
            name: `scenarioBy_${ElementId}_${markerName}`,
        }, 0)
    });
    map.setPolyline(coordinates,`scenarioBy_${ElementId}_${markerName}`);
}