import { Routes, Route } from 'react-router-dom';
import Sidebar from "./components/layout/SideBar.jsx";
import DashBoardIndex from "./pages/dashBoard/index.jsx";
import MissionIndex from "./pages/missions/index.jsx";
import {Details as MissionDetails} from "./pages/missions/details.jsx";
import MissionCreate from "./pages/missions/create.jsx";
import MissionEtape from "./pages/missions/etape.jsx";
import MissionUpdate from "./pages/missions/update.jsx";
import ClientsIndex from "./pages/clients/index.jsx";
import ClientsCreate from "./pages/clients/create.jsx";
import ClientsCreateBusiness from "./pages/clients/create_business.jsx";
import ClientsCreatePersonal from "./pages/clients/create_personal.jsx";
import PlanningIndex from "./pages/plannings/index.jsx";
import DemandIndex from "./pages/demands/index.jsx";
import SettingsIndex from "./pages/settings/index.jsx";
function App() {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1">
                <Routes>
                    <Route path="/"           element={<DashBoardIndex />} />

                    <Route path="/missions"   element={<MissionIndex />} />
                    <Route path="/missions/create" element={<MissionCreate />} />
                    <Route path="/missions/:missionId" element={<MissionDetails />} />
                    <Route path="/missions/:missionId/update" element={<MissionUpdate />} />
                    <Route path="/missions/:missionId/etapes/:etapeId" element={<MissionEtape />} />



                    <Route path="/clients"    element={<ClientsIndex />} />
                    <Route path="/clients/create"    element={<ClientsCreate />} />
                    <Route path="/clients/create_business"    element={<ClientsCreateBusiness />} />
                    <Route path="/clients/create_personal"    element={<ClientsCreatePersonal />} />

                    <Route path="/plannings"    element={<PlanningIndex />} />

                    <Route path="/demandes"   element={<DemandIndex />} />
                    <Route path="/parametres" element={<SettingsIndex />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;