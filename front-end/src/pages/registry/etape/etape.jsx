import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/layout/Header.jsx";
import api from "../../../services/axios.js";

export default function IndexTypesEtapes() {
    const [etapes, setEtapes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nomEtape, setNomEtape] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        api.get('http://localhost:8000/api/type_etapes')
            .then(response => {
                const data = response.data.member || response.data["hydra:member"] || [];
                setEtapes(data);
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
            const response = await api.post('http://localhost:8000/api/type_etapes',
                { nom: nomEtape },
                { headers: { 'Content-Type': 'application/ld+json' } }
            );

            setEtapes([...etapes, response.data]);

            setNomEtape("");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erreur lors de la création :", error);
            alert("Erreur lors de la création du type d'étape.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (e, id) => {
        e.stopPropagation();

        if (!window.confirm("Voulez-vous vraiment supprimer ce type d'étape ?")) {
            return;
        }

        try {
            await api.delete(`http://localhost:8000/api/type_etapes/${id}`);
            setEtapes(etapes.filter(etape => etape.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            alert("Impossible de supprimer cette étape. Elle est peut-être déjà utilisée dans une mission.");
        }
    };
    return (
        <>
            <Header titre="TYPES D'ÉTAPES" />

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
                            <h2 className="text-xl font-bold text-gray-800">Liste des types d'étapes</h2>
                            <p className="text-sm text-gray-500">Gérez les différents types disponibles pour vos missions.</p>
                        </div>
                        <button
                            className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <span>+</span> Créer une étape
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center text-gray-500 py-10 font-medium">Chargement des types d'étapes...</div>
                    ) : etapes.length === 0 ? (
                        <div className="text-center text-gray-500 py-10 bg-white border border-gray-100 rounded-2xl">
                            Aucun type d'étape trouvé.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {etapes.map((etape, index) => (
                                <div
                                    key={etape.id || index}
                                    className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex justify-between items-center group cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                            {etape.nom || "Type sans nom"}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, etape.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-50 group-hover:opacity-100"
                                        title="Supprimer l'étape"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl mx-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Nouvelle étape</h3>
                        <p className="text-sm text-gray-500 mb-6">Définissez le nom de ce nouveau type d'étape.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'étape *</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={nomEtape}
                                    onChange={(e) => setNomEtape(e.target.value)}
                                    placeholder="Ex: Analyse des besoins, Développement..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setNomEtape("");
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
                                    {isSubmitting ? "Création..." : "Créer l'étape"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}