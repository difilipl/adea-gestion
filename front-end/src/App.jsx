import { Routes, Route } from 'react-router-dom';
import Sidebar from "./components/layout/SideBar.jsx";
import Dashboard from "./pages/dashBoard/DashBoard.jsx";
import Missions from "./pages/missions/Missions.jsx";
import Clients from "./pages/clients/Clients.jsx";
import Demandes from "./pages/demands/Demandes.jsx";
import Parametres from "./pages/settings/Parametres.jsx";
function App() {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1">
                <Routes>
                    <Route path="/"           element={<Dashboard />} />
                    <Route path="/missions"   element={<Missions />} />
                    <Route path="/clients"    element={<Clients />} />
                    <Route path="/demandes"   element={<Demandes />} />
                    <Route path="/parametres" element={<Parametres />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;