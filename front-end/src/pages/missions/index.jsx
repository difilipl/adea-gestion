import Header from "../../components/layout/Header.jsx";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import EntityCard from "../../components/ui/molécules/EntityCard.jsx";
import {getNomClient} from "../../utils/client.js";
import api from "../../services/axios.js";

const configMissions = {
    'mission': {
        icone: "📋",
        couleur: "bg-blue-50 text-blue-600",
        hoverBanniere: "hover:border-blue-300",
        hoverTexte: "group-hover:text-blue-600",
    },
    'ancienne mission': {
        icone: "📦",
        couleur: "bg-purple-50 text-purple-600",
        hoverBanniere: "hover:border-purple-300",
        hoverTexte: "group-hover:text-purple-600",
    }
};

export default function Index() {
    const [missions, setMissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('http://localhost:8000/api/missions')
            .then(response => {
                if (response.data && response.data.member) {
                    setMissions(response.data.member);
                }
            })
            .catch(error => {
                console.error("Erreur API:", error);
            });
    }, []);

    useEffect(() => {
        if(location.state && location.state.param){
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSearchTerm(location.state.param.toString());
        }
    }, [location.state]);


    const filteredMissions = missions.filter((mission) => {
        const search = searchTerm.toLowerCase();
        return (
            getNomClient(mission.client)?.toLowerCase().includes(search) ||
            mission.titre?.toLowerCase().includes(search) ||
            mission.statut?.toLowerCase().includes(search) ||
            mission.id.toString().includes(search)
        );
    });


    return (
        <>
            <Header titre="Les missions"/>

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    {/* Barre de recherche */}
                    <div className="relative max-w-md w-full mb-8">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"/>

                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher par nom, ID, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-sm outline-none"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <span
                                className="text-xs font-medium text-gray-300 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                {filteredMissions.length} résultats
                            </span>
                        </div>
                    </div>

                    {/* Bouton de creation */}
                    <div className="mb-4">
                        <button
                            onClick={() => navigate('/missions/create')}
                            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm whitespace-nowrap"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Créer une nouvelle mission
                        </button>
                    </div>
                </div>
                {/* Liste verticale */}
                <ul className="flex flex-col gap-3">
                    {filteredMissions.length > 0 ? (
                        filteredMissions.map((mission) => (
                            <EntityCard
                                key={mission.id}
                                title={mission.titre}
                                subtitle={`ID: ${mission.id} • ${mission['@type']}`}
                                info1={mission.date_debut}
                                info2={mission.date_fin}
                                type={mission['@type']}
                                statusLabel={mission.statut}
                                config={configMissions}
                                onClick={() => navigate(`/missions/${mission.id}`)}
                            />

                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed text-gray-400">
                            Aucune mission trouvée pour "{searchTerm}"
                        </div>
                    )}
                </ul>
            </div>
        </>
    );
}