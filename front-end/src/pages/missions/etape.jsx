import Header from "../../components/layout/Header.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BadgeCount from "../../components/ui/atomes/BadgeCount.jsx";
import StatusBadge from "../../components/ui/atomes/StatusBadge.jsx";

const formatTaille = (octets) => {
    if (!octets) return "";
    if (octets < 1024) return `${octets} o`;
    if (octets < 1024 * 1024) return `${(octets / 1024).toFixed(1)} Ko`;
    return `${(octets / 1024 / 1024).toFixed(1)} Mo`;
};

export default function Etape() {
    const { missionId, etapeId } = useParams();
    const navigate = useNavigate();
    const [etape, setEtape] = useState(null);
    const [loading, setLoading] = useState(true);

    const [documents, setDocuments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [fichier, setFichier] = useState(null);
    const [nomDoc, setNomDoc] = useState("");
    const [uploading, setUploading] = useState(false);

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
        console.log("etapeId:", etapeId);
        axios.get(`http://localhost:8000/api/documents?etape_id=${etapeId}`)
            .then(response => {
                setDocuments(Array.isArray(response.data) ? response.data : response.data.member ?? []);
            })
            .catch(err => {
                console.error("Erreur documents:", err);
                setDocuments([]);
            });
    }, [etapeId]);

    const handleUpload = async () => {
        if (!fichier) return;
        setUploading(true);

        const formData = new FormData();
        formData.append("fichier", fichier);
        formData.append("nom", nomDoc || fichier.name);
        formData.append("etape_id", etapeId);

        try {
            const res = await axios.post("http://localhost:8000/api/documents/upload", formData);
            setDocuments(prev => [...prev, res.data]);
            setShowModal(false);
            setFichier(null);
            setNomDoc("");
        } catch (err) {
            console.error("Erreur upload:", err);
            alert("Erreur lors de l'upload.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteDocument = async (docId) => {
        if (!window.confirm("Supprimer ce document ?")) return;
        try {
            await axios.delete(`http://localhost:8000/api/documents/${docId}`);
            setDocuments(prev => prev.filter(d => d.id !== docId));
        } catch (err) {
            console.error("Erreur suppression document:", err);
        }
    };

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
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
                >
                    ← Retour au tableau de bord
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
                            <p className="text-lg font-semibold text-gray-800">{formatDate(etape.date_debut)}</p>
                        </div>
                        <div className="bg-white px-6 py-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Date de fin prévue</p>
                            <p className="text-lg font-semibold text-gray-800">{formatDate(etape.date_fin_prevue)}</p>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="px-6 py-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Documents</p>
                            <div className="flex items-center gap-2">
                                <BadgeCount
                                    label={`${documents.length} fichier(s)`}
                                    couleur="bg-gray-100 text-gray-500 border-gray-200"
                                />
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    + Ajouter
                                </button>
                            </div>
                        </div>

                        {documents.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">
                                Aucun document associé à cette étape.
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {documents.map(doc => (
                                    <li key={doc.id} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                                        <div>
                                            <p className="font-medium text-gray-800">{doc.nom}</p>
                                            <p className="text-xs text-gray-400">
                                                {doc.type_mime} · {formatTaille(doc.taille)} · {doc.date_upload}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                        <a
                                            href={`http://localhost:8000/${doc.chemin}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-2 py-1 text-xs border border-gray-200 rounded-lg hover:bg-white"
                                            >
                                            Télécharger
                                        </a>
                                        <button
                                            onClick={() => handleDeleteDocument(doc.id)}
                                            className="px-2 py-1 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                    </li>
                                    ))}
                            </ul>
                            )}
                    </div>
                </div>
            </div>

            {/* Modale upload */}
            {showModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
                    <h3 className="font-semibold text-lg mb-4">Ajouter un document</h3>

                    <label className="block text-sm text-gray-600 mb-1">Nom du document</label>
                    <input
                        type="text"
                        placeholder="Laissez vide pour utiliser le nom du fichier"
                        value={nomDoc}
                        onChange={e => setNomDoc(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2 mb-4 text-sm"
                    />

                    <label className="block text-sm text-gray-600 mb-1">Fichier</label>
                    <input
                        type="file"
                        onChange={e => setFichier(e.target.files[0])}
                        className="w-full mb-6 text-sm"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => { setShowModal(false); setFichier(null); setNomDoc(""); }}
                            className="px-4 py-2 text-sm border border-gray-200 rounded-lg"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!fichier || uploading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {uploading ? "Upload en cours..." : "Uploader"}
                        </button>
                    </div>
                </div>
            </div>
            )}
        </>
    );
}