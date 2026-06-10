import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/layout/Header.jsx";
import api from "../../services/axios.js";

export default function Create() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nom_entreprise: "",
        siret: "",
        email_principal: "",
        telephone: "",
        statut: "",
        infos_importantes: ""
    });

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState(null);

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
            await api.post('http://localhost:8000/api/pros', formData, {
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Accept': 'application/ld+json'
                }
            });
            navigate(`/clients`);
        } catch (err) {
            console.error("Erreur lors de la création :", err);
            setError("Impossible de créer le client. Vérifiez les champs obligatoires.");
            setLoadingSubmit(false);
        }
    };

    if (loadingSubmit) {
        return <div className="p-6 text-center">Création du client...</div>;
    }

    return (
        <>
            <Header titre="Créer un client professionnel" />

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-2xl p-8 border border-gray-100">

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* nom_entreprise */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'entreprise *</label>
                            <input
                                type="text"
                                name="nom_entreprise"
                                value={formData.nom_entreprise}
                                onChange={handleChange}
                                required
                                placeholder="Nom de l'entreprise"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* siret */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">SIRET *</label>
                            <input
                                type="text"
                                name="siret"
                                value={formData.siret}
                                onChange={handleChange}
                                required
                                placeholder="14 chiffres"
                                maxLength={14}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                            <input
                                type="email"
                                name="email_principal"
                                value={formData.email_principal}
                                onChange={handleChange}
                                required
                                placeholder="email@entreprise.fr"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* téléphone */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Numéro de téléphone *</label>
                            <input
                                type="text"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                required
                                placeholder="06 00 00 00 00"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* infos_importantes — name corrigé */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Informations supplémentaires</label>
                            <textarea
                                name="infos_importantes"
                                value={formData.infos_importantes}
                                onChange={handleChange}
                                placeholder="Notes, remarques..."
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/clients')}
                                className="px-6 py-3 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loadingSubmit}
                                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {loadingSubmit ? "Création..." : "Créer le client"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}