import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/layout/Header.jsx";
import api from "../../../services/axios.js";

export default function Missions() {
    const [modeles, setModeles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nomModele, setNomModele] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        api.get('http://localhost:8000/api/modele_missions')
            .then(response => {
                const data = response.data.member || response.data["hydra:member"] || [];
                setModeles(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur API:", error);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await api.post('http://localhost:8000/api/modele_missions',
                { nom: nomModele },
                { headers: { 'Content-Type': 'application/ld+json' } }
            );

            const newModele = { ...response.data, modeleEtapes: [] };
            setModeles([...modeles, newModele]);

            setNomModele("");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erreur lors de la création :", error);
            alert("Erreur lors de la création du modèle de mission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();

        if (!window.confirm("Voulez-vous vraiment supprimer ce modèle de mission ?")) {
            return;
        }

        try {
            await api.delete(`http://localhost:8000/api/modele_missions/${id}`);
            setModeles(modeles.filter(modele => modele.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            alert("Impossible de supprimer ce modèle. Il est peut-être déjà utilisé.");
        }
    };

    return (
        <>
            <Header titre="MODÈLES DE MISSIONS" />

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
                    >
                        ← Retour
                    </button>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Liste des modèles</h2>
                            <p className="text-sm text-gray-500">Gérez vos modèles de missions et leurs étapes associées.</p>
                        </div>
                        <button
                            className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <span>+</span> Créer un modèle
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center text-gray-500 py-10 font-medium">Chargement des modèles...</div>
                    ) : modeles.length === 0 ? (
                        <div className="text-center text-gray-500 py-10 bg-white border border-gray-100 rounded-2xl">
                            Aucun modèle de mission trouvé.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {modeles.map((modele, index) => (
                                <div
                                    key={modele.id || index}
                                    onClick={() => navigate(`/registry/missions/${modele.id}`)}
                                    className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex justify-between items-center group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                            </svg>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                {modele.nom || "Modèle sans nom"}
                                            </h3>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {modele.modeleEtapes ? modele.modeleEtapes.length : 0} étape(s) configurée(s)
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => handleDelete(e, modele.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-50 group-hover:opacity-100"
                                        title="Supprimer le modèle"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
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
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Nouveau modèle</h3>
                        <p className="text-sm text-gray-500 mb-6">Donnez un nom à votre modèle de mission.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du modèle *</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={nomModele}
                                    onChange={(e) => setNomModele(e.target.value)}
                                    placeholder="Ex: Création Site Vitrine, Audit SEO..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setNomModele("");
                                    }}
                                    className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "Création..." : "Créer le modèle"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}