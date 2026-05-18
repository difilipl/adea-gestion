import { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Header from "../../components/layout/Header.jsx";

const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};
export function Details() {
    const {missionId} = useParams();
    const navigate = useNavigate();

    const [mission, setMission] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (missionId) {
            axios.get(`http://localhost:8000/api/missions/${missionId}`)
                .then(response => {
                    setMission(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Erreur lors de la récupération de la mission:", err);
                    setLoading(false);
                });
        }
    }, [missionId]);

    const deleteMission = async (missionId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette mission?")) {
            return;
        }

        try{
            await axios.delete(`http://localhost:8000/api/missions/${missionId}`)
            navigate("/missions");

        }catch (err) {
            console.error("Erreur lors de la suppression :", err);
            alert("Impossible de supprimer la mission.");
        }
    }

    if (loading) {
        return <div className="p-6 text-center">Chargement de la mission...</div>;
    }
    return (
        <>
            <Header titre={mission.titre}/>

            <div className="p-6 max-w-4xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-100">
                    <p className="text-lg mb-2"><span className="font-semibold text-gray-700">Statut :</span> {mission.statut}</p>
                    <p className="text-lg"><span className="font-semibold text-gray-700">Client :</span> {mission.client?.nom_entreprise}</p>
                </div>
                <button
                onClick={(e) => { e.stopPropagation(); deleteMission(missionId)}}
                >
                    supprimer la mission
                </button>
                <button
                    onClick={() => navigate(`/missions/${missionId}/update`)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    Modifier
                </button>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Déroulement des étapes</h3>

                <ol className="relative border-l-2 border-gray-200 ml-4">
                    {mission.etapes?.map((etape) => (
                        <li key={etape.id} className="mb-8 ml-6 group">

                            <span className={`absolute flex items-center justify-center w-4 h-4 rounded-full -left-[9px] ring-4 ring-white ${
                                etape.est_terminee ? "bg-green-500" : "bg-blue-500"
                            }`}></span>

                            <Link
                                to={`/missions/${mission.id}/etapes/${etape.id}`}
                                className="block p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
                            >
                                <h4 className="flex items-center mb-1 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {etape.type_etape?.nom}

                                    {etape.est_terminee ? (
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded ml-3 border border-green-200">
                                            Terminée
                                        </span>
                                    ) : (
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded ml-3 border border-blue-200">
                                            À venir / En cours
                                        </span>
                                    )}
                                </h4>

                                <time className="block text-sm font-normal text-gray-500 mb-2">
                                    Du {formatDate(etape.date_debut)} au {formatDate(etape.date_fin_prevue)}
                                </time>

                                <div className="text-sm text-blue-500 font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    Voir les détails du ticket <span className="ml-1">→</span>
                                </div>
                            </Link>

                        </li>
                    ))}
                </ol>

            </div>
        </>
    );
}