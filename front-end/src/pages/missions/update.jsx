import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/layout/Header.jsx";
import { getNomClient } from "../../utils/client.js";

export default function Update() {
    const { missionId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titre: "",
        date_debut: "",
        statut: "en cours",
        client: ""
    });

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([
            axios.get(`http://localhost:8000/api/missions/${missionId}`),
            axios.get('http://localhost:8000/api/clients')
        ])
            .then(([responseMission, responseClients]) => {
                const m = responseMission.data;
                setFormData({
                    titre: m.titre ?? "",
                    date_debut: m.date_debut ? m.date_debut.substring(0, 10) : "",
                    statut: m.statut ?? "en cours",
                    client: m.client?.['@id'] ?? ""
                });
                setClients(responseClients.data.member || responseClients.data["hydra:member"] || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur de chargement :", err);
                setError("Impossible de charger la mission.");
                setLoading(false);
            });
    }, [missionId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await axios.patch(
                `http://localhost:8000/api/missions/${missionId}`,
                formData,
                { headers: { 'Content-Type': 'application/merge-patch+json' } }
            );
            navigate(`/missions/${missionId}`);
        } catch (err) {
            console.error("Erreur lors de la mise à jour :", err);
            setError("Impossible de modifier la mission. Vérifiez les champs.");
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-center">Chargement de la mission...</div>;

    return (
        <>
            <Header titre="Modifier la mission" />

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
                                placeholder="Nom de la mission"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Date de début */}
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

                        {/* Client */}
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
                                    <option key={client.id} value={client['@id'] || `/api/clients/${client.id}`}>
                                        {getNomClient(client)}
                                    </option>
                                ))}
                            </select>
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
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}