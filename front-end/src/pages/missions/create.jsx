import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/layout/Header.jsx";
import {getNomClient} from "../../utils/client.js";

export default function Create() {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        titre: "",
        date_debut: "",
        statut: "en cours",
        client: "",
        modeleMission: ""
    });

    const [clients, setClients] = useState([]);
    const [modeles, setModeles] = useState([]);

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState(null);


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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8000/api/missions', formData, {
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Accept': 'application/ld+json'
                }
            });
            navigate(`/missions/${response.data.id}`);
        } catch (err) {
            console.error("Erreur lors de la création :", err);
            setError("Impossible de créer la mission. Vérifiez les champs obligatoires.");
            setLoadingSubmit(false);
        }
    };
    if (loadingSubmit) {
        return <div className="p-6 text-center">Chargement de la mission...</div>;
    }

    return (
        <>
            <Header titre="Créer une nouvelle mission"/>

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

                        {/* Dates */}
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
                        </div>

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
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loadingSubmit}
                                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {loadingSubmit ? "Création..." : "Créer la mission"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}