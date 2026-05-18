import Header from "../../components/layout/Header.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BadgeCount from "../../components/ui/atomes/BadgeCount.jsx";
import StatusBadge from "../../components/ui/atomes/StatusBadge.jsx";
export default function Etape() {
    const { missionId, etapeId } = useParams();
    const navigate = useNavigate();
    const [etape, setEtape] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/etapes/${etapeId}`)
            .then(response => {
                setEtape(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur API:", error);
                setLoading(false);
            });
    }, [etapeId]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("fr-FR");
    };

    if (loading) return <Header titre="Étape" />;

    const statutConfig = etape.est_terminee
        ? { label: "TERMINÉE", couleur: "bg-green-50 text-green-700 border-green-200" }
        : { label: "EN COURS", couleur: "bg-blue-50 text-blue-700 border-blue-200" };



    return (
        <>
            <Header titre="DÉTAIL DE L'ÉTAPE" />

            <div className="p-8 max-w-3xl">

                <button
                    onClick={() => navigate(`/missions/${missionId}`)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
                >
                    ← Retour à la mission
                </button>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

                    {/* En-tête */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <StatusBadge
                                couleur="bg-gray-100 text-gray-600"
                                icone={<span className="text-lg">📋</span>}
                            />
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Type d'étape</p>
                                <p className="text-base font-semibold text-gray-800">
                                    {etape.type_etape ?? "—"}
                                </p>
                            </div>
                        </div>

                        <BadgeCount
                            label={statutConfig.label}
                            couleur={statutConfig.couleur}
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-px bg-gray-100">
                        <div className="bg-white px-6 py-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Date de début</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {formatDate(etape.date_debut)}
                            </p>
                        </div>
                        <div className="bg-white px-6 py-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Date de fin prévue</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {formatDate(etape.date_fin_prevue)}
                            </p>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="px-6 py-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Documents</p>
                            <BadgeCount
                                label={`${etape.documents?.length ?? 0} fichier(s)`}
                                couleur="bg-gray-100 text-gray-500 border-gray-200"
                            />
                        </div>

                        {etape.documents?.length > 0 ? (
                            <ul className="space-y-2">
                                {etape.documents.map((doc, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                                        📄 {doc}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400 italic">
                                Aucun document associé à cette étape.
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}