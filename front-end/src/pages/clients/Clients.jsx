import Header from "../../components/layout/Header.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import StatusBadge from "../components/ui/atome/StatusBadge.jsx";
import BadgeCount from "../components/ui/atome/BadgeCount.jsx";
import {useNavigate} from "react-router-dom";
import EntityCard from "../../components/ui/molécules/EntityCard.jsx";


const configClient = {
    'client': {
        icone: "📋",
        couleur: "bg-blue-50 text-blue-600",
        hoverBanniere: "hover:border-blue-300",
        hoverTexte: "group-hover:text-blue-600",
        bouton: "bg-blue-600 hover:bg-blue-700"
    },
    'ancien client': {
        icone: "📦",
        couleur: "bg-purple-50 text-purple-600",
        hoverBanniere: "hover:border-purple-300",
        hoverTexte: "group-hover:text-purple-600",
        bouton: "bg-purple-600 hover:bg-purple-700"
    }
};

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [detailsCli, setDetailsCli] = useState(null);
    const naviguate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:8000/api/clients')
            .then(response => {
                if (response.data && response.data.member) {
                    setClients(response.data.member);
                }
            })
            .catch(error => {
                console.error("Erreur API:", error);
            });
    }, []);


    const filteredClients = clients.filter((client) => {
        const search = searchTerm.toLowerCase();
        return (
            client.nomEntreprise?.toLowerCase().includes(search) ||
            client.statut?.toLowerCase().includes(search) ||
            client.email_principal?.toLowerCase().includes(search) ||
            client.id.toString().includes(search)
        );
    });

    const toggleClient = (id) => {
        if(detailsCli !== id) setDetailsCli(id);
        else setDetailsCli(null);
    }

    return (
        <>
            <Header titre="Les Clients" />

            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Barre de recherche */}
                <div className="relative max-w-md w-full mb-8">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                        <span className="text-xs font-medium text-gray-300 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            {filteredClients.length} résultats
                        </span>
                    </div>
                </div>

                {/* Liste verticale */}
                <ul className="flex flex-col gap-3">
                    {filteredClients.length > 0 ? (
                        filteredClients.map((client) => {

                            const typeClient = configClient[client.statut?.toLowerCase()] || {
                                icone: "❓",
                                couleur: "bg-gray-100",
                                bouton: "bg-gray-600 hover:bg-gray-700"
                            };

                            return (
                                <EntityCard
                                    key={client.id}
                                    title={client.nomEntreprise || "Client Particulier"}
                                    subtitle={`ID: ${client.id} • ${client['@type']}`}
                                    info1={client.email_principal}
                                    info2={client.telephone}
                                    type={client.statut}
                                    config={configClient}
                                    onClick={() => toggleClient(client.id)}
                                    isDetails={detailsCli === client.id}
                                >

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                Informations Légales
                                            </h4>
                                            <div className="space-y-1">
                                                <p><span className="text-gray-500">SIRET :</span> {client.siret || "Non renseigné"}</p>
                                                <p>
                                                    <span className="text-gray-500">Créé le :</span>{" "}
                                                    {client.date_creation ? new Date(client.date_creation).toLocaleDateString("fr-FR") : "Inconnue"}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                Activité du compte
                                            </h4>
                                            <div className="space-y-1">
                                                <p><span className="text-gray-500">Missions :</span> {client.missions?.length || 0}</p>
                                                <p><span className="text-gray-500">Contacts :</span> {client.contacts?.length || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 justify-end mt-4">
                                        <button
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Documents généraux
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                naviguate('/missions', {state: { param : client.nom || client.nomEntreprise }});
                                            }}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${typeClient.bouton}`}
                                        >
                                            Voir les missions
                                        </button>
                                    </div>

                                </EntityCard>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 text-gray-400">Aucun résultat</div>
                    )}
                </ul>
            </div>
        </>
    );
}