import { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Header from "../../components/layout/Header.jsx";

const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};

const formatTaille = (octets) => {
    if (!octets) return "";
    if (octets < 1024) return `${octets} o`;
    if (octets < 1024 * 1024) return `${(octets / 1024).toFixed(1)} Ko`;
    return `${(octets / 1024 / 1024).toFixed(1)} Mo`;
};

export function Details() {
    const {missionId} = useParams();
    const navigate = useNavigate();

    const [mission, setMission] = useState(null);
    const [loading, setLoading] = useState(true);

    const [documents, setDocuments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [fichier, setFichier] = useState(null);
    const [nomDoc, setNomDoc] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (missionId) {
            axios.get(`http://localhost:8000/api/missions/${missionId}`)
                .then(response => {
                    setMission(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Erreur lors de la récupération de la mission:", err);
                    setLoading(false);
                });

            axios.get(`http://localhost:8000/api/documents?mission_id=${missionId}`)
                .then(response => {
                    setDocuments(Array.isArray(response.data) ? response.data : response.data.member ?? []);
                })
                .catch(err => {
                    console.error("Erreur documents:", err);
                    setDocuments([]);
                });
        }
    }, [missionId]);

    const deleteMission = async (missionId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette mission?")) return;
        try {
            await axios.delete(`http://localhost:8000/api/missions/${missionId}`)
            navigate("/missions");
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            alert("Impossible de supprimer la mission.");
        }
    }

    const handleUpload = async () => {
        if (!fichier) return;
        setUploading(true);

        const formData = new FormData();
        formData.append("fichier", fichier);
        formData.append("nom", nomDoc || fichier.name);
        formData.append("mission_id", missionId);

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

    if (loading) {
        return <div className="p-6 text-center">Chargement de la mission...</div>;
    }

    return (
        <>
            <Header titre={mission.titre}/>

            <div className="p-6 max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
                >
                    ← Retour au tableau de bord
                </button>

                <div className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-100">
                    <p className="text-lg mb-2">
                        <span className="font-semibold text-gray-700">Statut :</span> {mission.statut}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold text-gray-700">Client :</span>{" "}
                        {mission.client?.nom_entreprise ?? `${mission.client?.prenom} ${mission.client?.nom}`}
                    </p>
                </div>

                <button onClick={(e) => { e.stopPropagation(); deleteMission(missionId)}}>
                    supprimer la mission
                </button>
                <button
                    onClick={() => navigate(`/missions/${missionId}/update`)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    Modifier
                </button>

                {/* Section Documents */}
                <div className="mt-10 mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">Documents</h3>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            + Ajouter un document
                        </button>
                    </div>

                    {documents.length === 0 ? (
                        <p className="text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg p-6 text-center">
                            Aucun document pour cette mission.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {documents.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                                    <div>
                                        <p className="font-medium text-sm text-gray-800">{doc.nom}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {doc.type_mime} · {formatTaille(doc.taille)} · {doc.date_upload}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">

                                       <a href={`http://localhost:8000/${doc.chemin}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
                                        >
                                        Télécharger
                                    </a>
                                    <button
                                        onClick={() => handleDeleteDocument(doc.id)}
                                        className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                                </div>
                                ))}
                        </div>
                        )}
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

                {/* Section Étapes */}
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Déroulement des étapes</h3>
                <ol className="relative border-l-2 border-gray-200 ml-4">
                    {mission.etapes?.map((etape) => (
                        <li key={etape.id} className="mb-8 ml-6 group">
                            <span className={`absolute flex items-center justify-center w-4 h-4 rounded-full -left-[9px] ring-4 ring-white ${
                                etape.est_terminee ? "bg-green-500" : "bg-blue-500"
                            }`}></span>
                            <Link
                                to={`/missions/${mission.id}/etapes/${etape.id}`}
                                className="block p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
                            >
                                <h4 className="flex items-center mb-1 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {etape.type_etape?.nom}
                                    {etape.est_terminee ? (
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded ml-3 border border-green-200">
                                            Terminée
                                        </span>
                                    ) : (
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded ml-3 border border-blue-200">
                                            À venir / En cours
                                        </span>
                                    )}
                                </h4>
                                <time className="block text-sm font-normal text-gray-500 mb-2">
                                    Du {formatDate(etape.date_debut)} au {formatDate(etape.date_fin_prevue)}
                                </time>
                                <div className="text-sm text-blue-500 font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    Voir les détails du ticket <span className="ml-1">→</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ol>
            </div>
        </>
    );
}