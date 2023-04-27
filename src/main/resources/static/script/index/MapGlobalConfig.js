import ServerRequest from "../module/ServerRequest.js";
import {localStorageHelper} from "../module/LocalStorageHelper.js";
import {markerScenarioRoutes} from "./util.js";

export const addMarkersByLocalStorageId = () => {
    const serverRequest = new ServerRequest('/api/scenarios');
    const scenariosIdByWaiting = localStorageHelper.get('displayedScenarioIdBywaiting');
    const scenariosIdByRunning = localStorageHelper.get('displayedScenarioIdByrunning');
    scenariosIdByWaiting.forEach(async (item) => {
        const scenarioRoutes = await serverRequest.get(item, undefined)
        markerScenarioRoutes(scenarioRoutes, item, 'waiting');
    })

    scenariosIdByRunning.forEach(async (item) => {
        const scenarioRoutes = await serverRequest.get(item, undefined)
        markerScenarioRoutes(scenarioRoutes, item, 'running');
    })

}