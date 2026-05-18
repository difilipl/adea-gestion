import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/layout/Header.jsx";

export default function Update() {
    const { missionId } = useParams();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState(false);
    const [clients, setClients] = useState([]);
    const [modeles, setModeles] = useState([]);
    const navigate = useNavigate();

    // On adapte le state avec tes nouveaux champs backend
    const [formData, setFormData] = useState({
        titre: "",
        date_debut: "",
        date_fin_prevue: "",
        date_fin_reel: "",
        statut: "en cours",
        client: "",
        modeleMission: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);

        try {
            // Utilisation d'un PUT ou d'un PATCH propre (le ld+json que tu as configuré est conservé)
            await axios.put(`http://localhost:8000/api/missions/${missionId}`, formData, {
                headers: {
                    "Content-Type": "application/ld+json",
                    "Accept": "application/ld+json",
                }
            });
            navigate(`/missions/${missionId}`); // Redirige vers les détails après modification
        } catch (err) {
            setLoadingSubmit(false);
            setError("Impossible de modifier la mission.");
            console.error(err);
        }
    };

    // Chargement des listes
    useEffect(() => {
        Promise.all([
            axios.get('http://localhost:8000/api/clients'),
            axios.get('http://localhost:8000/api/modele_missions')
        ])
            .then(([responseClients, responseModeles]) => {
                setClients(responseClients.data.member || responseClients.data["hydra:member"] || []);
                setModeles(responseModeles.data.member || responseModeles.data["hydra:member"] || []);
            })
            .catch(err => {
                console.error("Erreur de chargement des listes :", err);
                setError("Impossible de charger les clients ou les modèles.");
            });
    }, []);

    // Chargement des données de la mission actuelle
    useEffect(() => {
        axios.get(`http://localhost:8000/api/missions/${missionId}`)
            .then((response) => {
                const data = response.data;
                setFormData({
                    titre: data.titre,
                    date_debut: data.date_debut?.slice(0, 10) || "",
                    date_fin_prevue: data.date_fin_prevue?.slice(0, 10) || "",
                    date_fin_reel: data.date_fin_reel?.slice(0, 10) || "",
                    statut: data.statut,
                    client: data.client?.['@id'] || "",
                    // Correction de l'IRI du modèle pour API Platform :
                    modeleMission: data.modele_mission?.['@id'] || data.modele_mission || ""
                });
            });
    }, [missionId]);

    return (
        <>
            <Header titre="Modifier la mission"/>

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-2xl p-8 border border-gray-100">

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Titre */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Titre de la mission *</label>
                            <input
                                type="text"
                                name="titre"
                                value={formData.titre}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Dates : Début et Prévue */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date de début *</label>
                                <input
                                    type="date"
                                    name="date_debut"
                                    value={formData.date_debut}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin prévue (Planning)</label>
                                <input
                                    type="date"
                                    name="date_fin_prevue"
                                    value={formData.date_fin_prevue}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-600"
                                />
                            </div>
                        </div>

                        {/* Date réelle (Optionnelle, utile pour l'archivage ou la clôture) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin réelle (Clôture)</label>
                            <input
                                type="date"
                                name="date_fin_reel"
                                value={formData.date_fin_reel}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-600"
                            />
                        </div>

                        {/* Clients et Modèles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Client *</label>
                                <select
                                    name="client"
                                    value={formData.client}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
                                >
                                    <option value="">Sélectionner un client...</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client['@id'] || `/api/pros/${client.id}`}>
                                            {client.nom_entreprise || client.nom || `Client #${client.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Modèle de mission *</label>
                                <select
                                    name="modeleMission"
                                    value={formData.modeleMission}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
                                >
                                    <option value="">Sélectionner un modèle...</option>
                                    {modeles.map(modele => (
                                        <option key={modele.id} value={modele['@id'] || `/api/modele_missions/${modele.id}`}>
                                            {modele.nom || modele.titre || `Modèle #${modele.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Statut */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Statut</label>
                            <select
                                name="statut"
                                value={formData.statut}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
                            >
                                <option value="en cours">En cours</option>
                                <option value="à faire">À faire</option>
                                <option value="terminé">Terminé</option>
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/missions')}
                                className="px-6 py-3 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loadingSubmit}
                                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {loadingSubmit ? "Modification..." : "Modifier la mission"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}