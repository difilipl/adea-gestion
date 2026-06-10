import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/layout/Header.jsx";
import api from "../../services/axios.js";

export default function EditBusiness() {
    const { clientId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nom_entreprise: "",
        siret: "",
        email_principal: "",
        telephone: "",
        infos_importantes: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`http://localhost:8000/api/pros/${clientId}`)
            .then(response => {
                const d = response.data;
                setFormData({
                    nom_entreprise: d.nom_entreprise ?? "",
                    siret: d.siret ?? "",
                    email_principal: d.email_principal ?? "",
                    telephone: d.telephone ?? "",
                    infos_importantes: d.infos_importantes ?? ""
                });
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur chargement client :", err);
                setError("Impossible de charger les données du client.");
                setLoading(false);
            });
    }, [clientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await api.patch(
                `http://localhost:8000/api/pros/${clientId}`,
                formData,
                { headers: { 'Content-Type': 'application/merge-patch+json' } }
            );
            navigate(`/clients`);
        } catch (err) {
            console.error("Erreur mise à jour :", err);
            setError("Impossible de mettre à jour le client. Vérifiez les champs.");
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-center">Chargement...</div>;

    return (
        <>
            <Header titre="Modifier le client professionnel" />

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-2xl p-8 border border-gray-100">

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'entreprise *</label>
                            <input
                                type="text"
                                name="nom_entreprise"
                                value={formData.nom_entreprise}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">SIRET *</label>
                            <input
                                type="text"
                                name="siret"
                                value={formData.siret}
                                onChange={handleChange}
                                required
                                maxLength={14}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                            <input
                                type="email"
                                name="email_principal"
                                value={formData.email_principal}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone *</label>
                            <input
                                type="text"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Informations supplémentaires</label>
                            <textarea
                                name="infos_importantes"
                                value={formData.infos_importantes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Notes, remarques..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            />
                        </div>

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