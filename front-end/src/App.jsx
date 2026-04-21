import { Routes, Route } from 'react-router-dom';
import Sidebar from "./components/layout/SideBar.jsx";
import DashBoardIndex from "./pages/dashBoard/index.jsx";
import MissionIndex from "./pages/missions/index.jsx";
import ClientsIndex from "./pages/clients/index.jsx";
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
                    <Route path="/clients"    element={<ClientsIndex />} />
                    <Route path="/demandes"   element={<DemandIndex />} />
                    <Route path="/parametres" element={<SettingsIndex />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;