import { Routes, Route } from 'react-router-dom';

import PrivateRoute from "./components/ui/PrivateRoute.jsx";
import DashBoardIndex from "./pages/dashBoard/index.jsx";

import MissionIndex from "./pages/missions/index.jsx";
import { Details as MissionDetails } from "./pages/missions/details.jsx";
import MissionCreate from "./pages/missions/create.jsx";
import MissionEtape from "./pages/missions/etape.jsx";
import MissionUpdate from "./pages/missions/update.jsx";

import ClientsIndex from "./pages/clients/index.jsx";
import ClientsCreate from "./pages/clients/create.jsx";
import ClientsCreateBusiness from "./pages/clients/create_business.jsx";
import ClientsCreatePersonal from "./pages/clients/create_personal.jsx";
import ClientsEditBusiness from "./pages/clients/edit_business.jsx";
import ClientsEditPersonal from "./pages/clients/edit_personal.jsx";

import PlanningIndex from "./pages/plannings/index.jsx";

import RegistryIndex from "./pages/registry/index.jsx";
import RegistryEtapeIndex from "./pages/registry/etape/etape.jsx";
import RegistryMissionIndex from "./pages/registry/missions/missions.jsx";
import RegistryMissionDetails from "./pages/registry/missions/missionDetails.jsx";
import RegistryDocumentIndex from "./pages/registry/documents.jsx";

import DemandIndex from "./pages/demands/index.jsx";
import SettingsIndex from "./pages/settings/index.jsx";

import Login from "./pages/login/index.jsx";

function App() {
    return (
        <Routes>
            {/* Route publique, sans sidebar */}
            <Route path="/login" element={<Login />} />

            {/* Routes protégées, avec layout + sidebar */}
            <Route element={<PrivateRoute />}>
                <Route path="/" element={<DashBoardIndex />} />

                <Route path="/missions" element={<MissionIndex />} />
                <Route path="/missions/create" element={<MissionCreate />} />
                <Route path="/missions/:missionId" element={<MissionDetails />} />
                <Route path="/missions/:missionId/update" element={<MissionUpdate />} />
                <Route path="/missions/:missionId/etapes/:etapeId" element={<MissionEtape />} />

                <Route path="/clients" element={<ClientsIndex />} />
                <Route path="/clients/create" element={<ClientsCreate />} />
                <Route path="/clients/create_business" element={<ClientsCreateBusiness />} />
                <Route path="/clients/create_personal" element={<ClientsCreatePersonal />} />
                <Route path="/clients/:clientId/edit_business" element={<ClientsEditBusiness />} />
                <Route path="/clients/:clientId/edit_personal" element={<ClientsEditPersonal />} />

                <Route path="/plannings" element={<PlanningIndex />} />

                <Route path="/registry" element={<RegistryIndex />} />
                <Route path="/registry/etape" element={<RegistryEtapeIndex />} />
                <Route path="/registry/missions" element={<RegistryMissionIndex />} />
                <Route path="/registry/missions/:id" element={<RegistryMissionDetails />} />
                <Route path="/registry/documents" element={<RegistryDocumentIndex />} />

                <Route path="/demandes" element={<DemandIndex />} />
                <Route path="/parametres" element={<SettingsIndex />} />
            </Route>
        </Routes>

);
}

export default App;