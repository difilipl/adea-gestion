import Header from "../../components/layout/Header.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EntityCard from "../../components/ui/molécules/EntityCard.jsx";
import { getNomClient } from "../../utils/client.js";

const configClient = {
    'client': {
        icone: "📋",
        couleur: "bg-blue-50 text-blue-600",
        hoverBanniere: "hover:border-blue-300",
        hoverTexte: "group-hover:text-blue-600",
        bouton: "bg-blue-600 hover:bg-blue-700"
    },
    'ancien client': {
        icone: "📦",
        couleur: "bg-purple-50 text-purple-600",
        hoverBanniere: "hover:border-purple-300",
        hoverTexte: "group-hover:text-purple-600",
        bouton: "bg-purple-600 hover:bg-purple-700"
    }
};

const CONTACT_VIDE = { nom: "", prenom: "", poste: "", telephone_direct: "", email: "" };

export default function Index() {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [detailsCli, setDetailsCli] = useState(null);
    const navigate = useNavigate();

    // Documents
    const [showDocsModal, setShowDocsModal] = useState(false);
    const [clientSelectionne, setClientSelectionne] = useState(null);
    const [documentsClient, setDocumentsClient] = useState([]);
    const [fichierClient, setFichierClient] = useState(null);
    const [nomDocClient, setNomDocClient] = useState("");
    const [uploadingClient, setUploadingClient] = useState(false);

    // Contacts
    const [contactsParClient, setContactsParClient] = useState({});
    const [showFormContact, setShowFormContact] = useState(null); // id du client dont on affiche le form
    const [newContact, setNewContact] = useState(CONTACT_VIDE);
    const [savingContact, setSavingContact] = useState(false);
    const [errorContact, setErrorContact] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/clients')
            .then(response => {
                if (response.data && response.data.member) {
                    setClients(response.data.member);
                }
            })
            .catch(error => {
                console.error("Erreur API:", error);
            });
    }, []);

    const filteredClients = clients.filter((client) => {
        const search = searchTerm.toLowerCase();
        return (
            client.nomEntreprise?.toLowerCase().includes(search) ||
            client.statut?.toLowerCase().includes(search) ||
            client.email_principal?.toLowerCase().includes(search) ||
            client.id.toString().includes(search)
        );
    });

    const toggleClient = (id) => {
        if (detailsCli !== id) {
            setDetailsCli(id);
            // Charger les contacts si c'est un Pro et pas encore chargés
            const client = clients.find(c => c.id === id);
            if (client?.['@type'] === 'Pro' && !contactsParClient[id]) {
                chargerContacts(id);
            }
        } else {
            setDetailsCli(null);
            setShowFormContact(null);
        }
    };

    const chargerContacts = (clientId) => {
        axios.get(`http://localhost:8000/api/contacts?entreprise=/api/pros/${clientId}`)
            .then(response => {
                const data = response.data?.member ?? response.data ?? [];
                setContactsParClient(prev => ({ ...prev, [clientId]: Array.isArray(data) ? data : [] }));
            })
            .catch(() => {
                setContactsParClient(prev => ({ ...prev, [clientId]: [] }));
            });
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setNewContact(prev => ({ ...prev, [name]: value }));
    };

    const handleCreerContact = async (clientId) => {
        setSavingContact(true);
        setErrorContact(null);
        try {
            const payload = {
                ...newContact,
                entreprise: `/api/pros/${clientId}`
            };
            const res = await axios.post('http://localhost:8000/api/contacts', payload, {
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Accept': 'application/ld+json'
                }
            });
            setContactsParClient(prev => ({
                ...prev,
                [clientId]: [...(prev[clientId] || []), res.data]
            }));
            setNewContact(CONTACT_VIDE);
            setShowFormContact(null);
        } catch (err) {
            console.error("Erreur création contact :", err);
            setErrorContact("Impossible de créer le contact. Vérifiez les champs.");
        } finally {
            setSavingContact(false);
        }
    };

    const handleSupprimerContact = async (clientId, contactId) => {
        if (!window.confirm("Supprimer ce contact ?")) return;
        try {
            await axios.delete(`http://localhost:8000/api/contacts/${contactId}`);
            setContactsParClient(prev => ({
                ...prev,
                [clientId]: prev[clientId].filter(c => c.id !== contactId)
            }));
        } catch (err) {
            console.error("Erreur suppression contact :", err);
        }
    };

    const deleteClient = async (clientid) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce client?")) return;
        try {
            await axios.delete(`http://localhost:8000/api/clients/${clientid}`);
            setClients(prev => prev.filter(c => c.id !== clientid));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            alert("Impossible de supprimer le client.");
        }
    };

    const ouvrirDocsClient = (e, client) => {
        e.stopPropagation();
        setClientSelectionne(client);
        axios.get(`http://localhost:8000/api/documents?client_id=${client.id}`)
            .then(response => {
                setDocumentsClient(Array.isArray(response.data) ? response.data : []);
            })
            .catch(() => setDocumentsClient([]));
        setShowDocsModal(true);
    };

    const handleUploadClient = async () => {
        if (!fichierClient) return;
        setUploadingClient(true);
        const formData = new FormData();
        formData.append("fichier", fichierClient);
        formData.append("nom", nomDocClient || fichierClient.name);
        formData.append("client_id", clientSelectionne.id);
        try {
            const res = await axios.post("http://localhost:8000/api/documents/upload", formData);
            setDocumentsClient(prev => [...prev, res.data]);
            setFichierClient(null);
            setNomDocClient("");
        } catch (e) {
            alert("Erreur lors de l'upload.", e);
        } finally {
            setUploadingClient(false);
        }
    };

    const handleDeleteDocClient = async (docId) => {
        if (!window.confirm("Supprimer ce document ?")) return;
        try {
            await axios.delete(`http://localhost:8000/api/documents/${docId}`);
            setDocumentsClient(prev => prev.filter(d => d.id !== docId));
        } catch (err) {
            console.error("Erreur suppression:", err);
        }
    };

    return (
        <>
            <Header titre="Les clients" />

            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Barre de recherche */}
                <div className="relative max-w-md w-full mb-8">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher par nom, ID, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-sm outline-none"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <span className="text-xs font-medium text-gray-300 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            {filteredClients.length} résultats
                        </span>
                    </div>
                </div>

                {/* Bouton de création */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate('/clients/create')}
                        className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm whitespace-nowrap"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Créer un nouveau client
                    </button>
                </div>

                {/* Liste verticale */}
                <ul className="flex flex-col gap-3">
                    {filteredClients.length > 0 ? (
                        filteredClients.map((client) => {
                            const typeClient = configClient[client['@type']?.toLowerCase()] || {
                                icone: "❓",
                                couleur: "bg-gray-100",
                                bouton: "bg-gray-600 hover:bg-gray-700"
                            };
                            const isPro = client['@type'] === 'Pro';
                            const contacts = contactsParClient[client.id] || [];

                            return (
                                <EntityCard
                                    key={client.id}
                                    title={getNomClient(client)}
                                    subtitle={`ID: ${client.id} • ${client['@type']}`}
                                    info1={client.email_principal}
                                    info2={client.telephone}
                                    type={client.statut}
                                    config={configClient}
                                    onClick={() => toggleClient(client.id)}
                                    isDetails={detailsCli === client.id}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                Informations Légales
                                            </h4>
                                            <div className="space-y-1">
                                                <p><span className="text-gray-500">SIRET :</span> {client.siret || "Non renseigné"}</p>
                                                <p>
                                                    <span className="text-gray-500">Créé le :</span>{" "}
                                                    {client.date_creation ? new Date(client.date_creation).toLocaleDateString("fr-FR") : "Inconnue"}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                Activité du compte
                                            </h4>
                                            <div className="space-y-1">
                                                <p><span className="text-gray-500">Missions :</span> {client.missions?.length || 0}</p>
                                                <p><span className="text-gray-500">Contacts :</span> {contacts.length}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section contacts — uniquement pour les Pro */}
                                    {isPro && (
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    Contacts de l'entreprise
                                                </h4>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowFormContact(showFormContact === client.id ? null : client.id);
                                                        setNewContact(CONTACT_VIDE);
                                                        setErrorContact(null);
                                                    }}
                                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Ajouter un contact
                                                </button>
                                            </div>

                                            {/* Liste des contacts */}
                                            {contacts.length === 0 ? (
                                                <p className="text-sm text-gray-400 italic">Aucun contact renseigné.</p>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    {contacts.map(contact => (
                                                        <div
                                                            key={contact.id}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl"
                                                        >
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-800">
                                                                    {contact.prenom} {contact.nom}
                                                                    {contact.poste && <span className="ml-2 text-xs text-gray-400 font-normal">— {contact.poste}</span>}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-0.5">
                                                                    {contact.email}{contact.telephone_direct && ` · ${contact.telephone_direct}`}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleSupprimerContact(client.id, contact.id); }}
                                                                className="text-xs text-red-400 hover:text-red-600 transition-colors ml-4"
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Formulaire nouveau contact */}
                                            {showFormContact === client.id && (
                                                <div
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="mt-4 p-4 border border-blue-100 bg-blue-50 rounded-xl"
                                                >
                                                    <p className="text-sm font-semibold text-gray-700 mb-3">Nouveau contact</p>

                                                    {errorContact && (
                                                        <p className="text-xs text-red-500 mb-3">{errorContact}</p>
                                                    )}

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <input
                                                            type="text"
                                                            name="prenom"
                                                            placeholder="Prénom *"
                                                            value={newContact.prenom}
                                                            onChange={handleContactChange}
                                                            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="nom"
                                                            placeholder="Nom *"
                                                            value={newContact.nom}
                                                            onChange={handleContactChange}
                                                            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="poste"
                                                            placeholder="Poste"
                                                            value={newContact.poste}
                                                            onChange={handleContactChange}
                                                            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="telephone_direct"
                                                            placeholder="Téléphone direct"
                                                            value={newContact.telephone_direct}
                                                            onChange={handleContactChange}
                                                            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                                                        />
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            placeholder="Email *"
                                                            value={newContact.email}
                                                            onChange={handleContactChange}
                                                            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 sm:col-span-2"
                                                        />
                                                    </div>

                                                    <div className="flex justify-end gap-2 mt-3">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setShowFormContact(null); setNewContact(CONTACT_VIDE); }}
                                                            className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                                        >
                                                            Annuler
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleCreerContact(client.id); }}
                                                            disabled={savingContact || !newContact.nom || !newContact.prenom || !newContact.email}
                                                            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                                        >
                                                            {savingContact ? "Enregistrement..." : "Créer le contact"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-3 justify-end mt-4">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteClient(client.id); }}
                                            className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            Supprimer le client
                                        </button>
                                        <button
                                            onClick={(e) => ouvrirDocsClient(e, client)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Documents généraux
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(
                                                    client['@type'] === 'Pro'
                                                        ? `/clients/${client.id}/edit_business`
                                                        : `/clients/${client.id}/edit_personal`
                                                );
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Modifier le client
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate('/missions', { state: { param: client.nom || client.nom_entreprise } });
                                            }}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${typeClient.bouton}`}
                                        >
                                            Voir les missions
                                        </button>
                                    </div>

                                </EntityCard>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 text-gray-400">Aucun résultat</div>
                    )}
                </ul>

                {/* Modal documents */}
                {showDocsModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg">
                                    Documents — {getNomClient(clientSelectionne)}
                                </h3>
                                <button onClick={() => setShowDocsModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                            </div>
                            {documentsClient.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center border border-dashed border-gray-200 rounded-lg p-6 mb-4">
                                    Aucun document pour ce client.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-2 mb-4">
                                    {documentsClient.map(doc => (
                                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                            <div>
                                                <p className="font-medium text-sm text-gray-800">{doc.nom}</p>
                                                <p className="text-xs text-gray-400">{doc.type_mime} · {doc.date_upload}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <a href={`http://localhost:8000/${doc.chemin}`} target="_blank" rel="noreferrer"
                                                   className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-white">
                                                    Télécharger
                                                </a>
                                                <button onClick={() => handleDeleteDocClient(doc.id)}
                                                        className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50">
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">Ajouter un document</p>
                                <input type="text" placeholder="Nom du document (optionnel)" value={nomDocClient}
                                       onChange={e => setNomDocClient(e.target.value)}
                                       className="w-full border border-gray-200 rounded-lg p-2 mb-3 text-sm" />
                                <input type="file" onChange={e => setFichierClient(e.target.files[0])} className="w-full mb-3 text-sm" />
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setShowDocsModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg">Fermer</button>
                                    <button onClick={handleUploadClient} disabled={!fichierClient || uploadingClient}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                        {uploadingClient ? "Upload en cours..." : "Uploader"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}