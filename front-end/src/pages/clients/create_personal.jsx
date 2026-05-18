import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/layout/Header.jsx";
export default function Create() {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
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
            await axios.post('http://localhost:8000/api/particuliers', formData, {
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
        return <div className="p-6 text-center">Chargement du client...</div>;
    }

    return (
        <>
            <Header titre="Créer un nouveau client"/>

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-2xl p-8 border border-gray-100">

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* nom*/}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">nom *</label>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                                placeholder="nom du client"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        {/* nom*/}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">prénom *</label>
                            <input
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                required
                                placeholder="prenom du client"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        {/* email*/}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">email *</label>
                            <input
                                type="text"
                                name="email_principal"
                                value={formData.email_principal}
                                onChange={handleChange}
                                required
                                placeholder="email du client"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        {/* téléphone*/}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">numéro de téléphone *</label>
                            <input
                                type="text"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                required
                                placeholder="prenom du client"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        {/* info */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">information supplémentaires</label>
                            <input
                                type="text"
                                name="infos_importante"
                                value={formData.infos_importantes}
                                onChange={handleChange}
                                placeholder="..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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