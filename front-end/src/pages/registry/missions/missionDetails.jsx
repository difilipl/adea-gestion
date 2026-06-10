import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/layout/Header.jsx";
import api from "../../../services/axios.js";

export default function MissionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [mission, setMission] = useState(null);
    const [typesEtape, setTypesEtape] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingEtape, setEditingEtape] = useState(null);

    const [selectedType, setSelectedType] = useState("");
    const [ordre, setOrdre] = useState(1);
    const [dureeJours, setDureeJours] = useState(1);

    const fetchMissionDetails = async () => {
        try {
            const response = await api.get(`http://localhost:8000/api/modele_missions/${id}`);
            setMission(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération du modèle:", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                await fetchMissionDetails();
                const resTypes = await api.get('http://localhost:8000/api/type_etapes');
                setTypesEtape(resTypes.data.member || resTypes.data["hydra:member"] || []);
            } catch (error) {
                console.error("Erreur API globale:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleOpenCreateModal = () => {
        setEditingEtape(null);
        const nextOrdre = mission?.modeleEtapes ? mission.modeleEtapes.length + 1 : 1;
        setOrdre(nextOrdre);
        setDureeJours(1);
        setSelectedType("");
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (etape) => {
        setEditingEtape(etape);
        setOrdre(etape.ordre);
        setDureeJours(etape.duree_jours);
        setSelectedType(etape.type_etape ? `/api/type_etapes/${etape.type_etape.id}` : "");
        setIsModalOpen(true);
    };

    const handleSaveEtape = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                ordre: parseInt(ordre),
                duree_jours: parseInt(dureeJours),
                type_etape: selectedType
            };

            if (editingEtape) {
                await api.put(`http://localhost:8000/api/modele_etapes/${editingEtape.id}`, payload, {
                    headers: { 'Content-Type': 'application/ld+json' }
                });
            } else {
                payload.modele_mission = `/api/modele_missions/${id}`;
                await api.post('http://localhost:8000/api/modele_etapes', payload, {
                    headers: { 'Content-Type': 'application/ld+json' }
                });
            }

            await fetchMissionDetails();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de l'étape :", error);
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEtape = async (etapeId) => {
        if (!window.confirm("Voulez-vous vraiment retirer cette étape ?")) {
            return;
        }
        try {
            await api.delete(`http://localhost:8000/api/modele_etapes/${etapeId}`);
            setMission({
                ...mission,
                modeleEtapes: mission.modeleEtapes.filter(etape => etape.id !== etapeId)
            });
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            alert("Impossible de supprimer cette étape.");
        }
    };

    if (loading) {
        return (
            <>
                <Header titre="CHARGEMENT..." />
                <div className="p-6 text-center text-gray-500 font-medium">Chargement des détails...</div>
            </>
        );
    }

    if (!mission) {
        return <div className="p-6 text-center text-red-500">Modèle introuvable.</div>;
    }

    const etapesTriees = [...(mission.modeleEtapes || [])].sort((a, b) => a.ordre - b.ordre);

    return (
        <>
            <Header titre={`MODÈLE : ${mission.nom?.toUpperCase()}`} />

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
                    >
                        ← Retour aux modèles
                    </button>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div>
                            <p className="text-xs font-bold text-blue-500 mb-1 tracking-wider uppercase">Paramétrage du modèle</p>
                            <h2 className="text-2xl font-bold text-gray-900">{mission.nom}</h2>
                            <p className="text-sm text-gray-500 mt-1">{etapesTriees.length} étape(s) configurée(s).</p>
                        </div>
                        <button
                            onClick={handleOpenCreateModal}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
                        >
                            <span>+</span> Ajouter une étape
                        </button>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-4">Déroulement des étapes</h3>

                    {etapesTriees.length === 0 ? (
                        <div className="text-center text-gray-500 py-10 bg-white border border-gray-100 rounded-2xl">
                            Aucune étape configurée.
                        </div>
                    ) : (
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                            {etapesTriees.map((etape) => (
                                <div key={etape.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">

                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 bg-blue-100 text-blue-600 font-bold text-sm shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                        {etape.ordre}
                                    </div>

                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-lg mb-1">
                                                {etape.type_etape?.nom || "Étape inconnue"}
                                            </h4>
                                            <div className="flex items-center text-sm text-gray-500 font-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1.5 text-gray-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                                Durée estimée : {etape.duree_jours} jour{etape.duree_jours > 1 ? 's' : ''}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenEditModal(etape)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Modifier l'étape"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => handleDeleteEtape(etape.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Retirer l'étape"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center transition-opacity backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                >
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl mx-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {editingEtape ? "Modifier l'étape" : "Ajouter une étape"}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {editingEtape ? "Ajustez les paramètres de cette étape." : "Paramétrez la nouvelle étape pour ce modèle."}
                        </p>

                        <form onSubmit={handleSaveEtape} className="space-y-5">

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Type d'étape *</label>
                                <select
                                    required
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                >
                                    <option value="" disabled>Sélectionner un type...</option>
                                    {typesEtape.map(type => (
                                        <option key={type.id} value={`/api/type_etapes/${type.id}`}>
                                            {type.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ordre *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={ordre}
                                        onChange={(e) => setOrdre(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Durée (jours) *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={dureeJours}
                                        onChange={(e) => setDureeJours(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !selectedType}
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "Enregistrement..." : editingEtape ? "Enregistrer les modifications" : "Ajouter l'étape"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}